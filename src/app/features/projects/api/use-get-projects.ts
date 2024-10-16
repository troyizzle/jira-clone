import { client } from "@/lib/rpc"
import { useQuery } from "@tanstack/react-query"

interface UseGetProjectsProps {
  workspaceId: string
}

export const useGetProjects = ({
  workspaceId
}: UseGetProjectsProps) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      const response = await client.api.projects.$get({
        query: { workspaceId }
      });

      if (!response.ok) {
        throw new Error("Failed to get projects");
      }

      const { data } = await response.json();

      return data;
    },
  })

  return query;
}
