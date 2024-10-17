import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createTaskSchema } from "../schemas";
import { getMember } from "../../members/utils";
import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { Task, TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";
import { Project } from "../../projects/types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({
      workspaceId: z.string(),
      projectId: z.string().nullish(),
      assigneId: z.string().nullish(),
      status: z.nativeEnum(TaskStatus).nullish(),
      search: z.string().nullish(),
      dueDate: z.string().nullish(),
    })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const {
        workspaceId,
        projectId,
        assigneId,
        status,
        search,
        dueDate,
      } = c.req.valid("query");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      })

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt")
      ]

      if (projectId) {
        query.push(Query.equal("projectId", projectId))
      }

      if (status) {
        query.push(Query.equal("status", status))
      }

      if (assigneId) {
        query.push(Query.equal("assigneId", assigneId))
      }

      if (dueDate) {
        query.push(Query.equal("dueDate", dueDate))
      }

      if (search) {
        query.push(Query.search("name", search))
      }

      const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
      )

      const projectIds = tasks.documents.map((task) => task.projectId)
      const userIds = tasks.documents.map((task) => task.assigneId)

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      )

      const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        userIds.length > 0 ? [Query.contains("$id", userIds)] : []
      )

      const assignes = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId)

          return {
            ...member,
            name: user.name,
            email: user.email,
          }
        })
      )

      const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find((project) => project.$id === task.projectId)
        const assigne = assignes.find((member) => member.$id === task.assigneId)
        return {
          ...task,
          project,
          assigne,
        }
      })

      return c.json({
        data: {
          ...tasks,
          documents: populatedTasks,
        }
      });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const {
        name,
        status,
        workspaceId,
        projectId,
        dueDate,
        assigneId,
      } = c.req.valid("json");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      })

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const highestPositionTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.equal("status", status),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      )

      const newPosition = highestPositionTask.documents.length > 0
        ? highestPositionTask.documents[0].position + 1000
        : 1000

      const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
          name,
          status,
          workspaceId,
          projectId,
          dueDate,
          assigneId,
          position: newPosition,
        }
      )

      return c.json({ data: task });
    }
  )

export default app;
