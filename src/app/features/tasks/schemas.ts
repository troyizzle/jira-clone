import { z } from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
  name: z.string().min(1, "Required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string(),
  projectId: z.string(),
  dueDate: z.coerce.date(),
  assigneId: z.string().trim().min(1, "Required"),
  description: z.string().optional(),
})
