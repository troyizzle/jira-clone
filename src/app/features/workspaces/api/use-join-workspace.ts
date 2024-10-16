"use client";

import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"], 200>
type RequestType = InferRequestType<typeof client.api.workspaces[":workspaceId"]["join"]["$post"]>

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    ResponseType,
    Error,
    RequestType
  >({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["join"].$post({ json, param });
      if (!response.ok) {
        throw new Error("Failed to join workspace");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace joined");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError: () => {
      toast.error("Failed to joined workspace");
    }
  });

  return mutation;
}
