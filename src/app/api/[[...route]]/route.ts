import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath("/api")

import auth from "@/app/features/auth/server/route"
import members from "@/app/features/members/server/route"
import projects from "@/app/features/projects/server/route"
import tasks from "@/app/features/tasks/server/route"
import workspaces from "@/app/features/workspaces/server/route"

const routes = app
  .route("/auth", auth)
  .route("/members", members)
  .route("/projects", projects)
  .route("/tasks", tasks)
  .route("/workspaces", workspaces)


export const GET = handle(app)
export const POST = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;
