import { client } from "@/lib/rpc"
import { useQuery } from "@tanstack/react-query"
import { TaskStatus } from "../types"

interface UseGetTasksProps {
  workspaceId: string
  projectId?: string | null
  status?: TaskStatus | null
  assigneId?: string | null
  dueDate?: string | null
  search?: string | null
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  assigneId,
  dueDate,
  search
}: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: ["tasks",
      workspaceId,
      projectId,
      status,
      assigneId,
      dueDate,
      search
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId || undefined,
          status: status || undefined,
          assigneId: assigneId || undefined,
          dueDate: dueDate || undefined,
          search: search || undefined
        }
      });

      if (!response.ok) {
        throw new Error("Failed to get tasks");
      }

      const { data } = await response.json();

      return data;
    },
  })

  return query;
}
