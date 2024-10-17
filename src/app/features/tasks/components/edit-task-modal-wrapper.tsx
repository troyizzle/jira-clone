import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "../../members/api/use-get-members";
import { useGetProjects } from "../../projects/api/use-get-projects"
import { useWorkspaceId } from "../../workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { useGetTask } from "../api/use-get-task";
import { EditTaskForm } from "./edit-task-form";

interface EditTaskModalWrapperProps {
  onCancel: () => void
  id: string
}

export const EditTaskModalWrapper = ({
  onCancel,
  id
}: EditTaskModalWrapperProps) => {
  const workspaceId = useWorkspaceId();

  const { data: initialValues, isLoading: isLoadingInitialValues } = useGetTask({ taskId: id });

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const projectOptions = projects?.documents.map(project => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl
  }));

  const memberOptions = members?.documents.map(member => ({
    id: member.$id,
    name: member.name,
  }))

  const isLoading = isLoadingProjects || isLoadingMembers || isLoadingInitialValues;

  if (isLoading) {
    return (
      <Card className="w-full h-[714px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          < Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent >
      </Card >
    )
  }

  if (!initialValues) {
    return null;
  }

  return (
    <EditTaskForm
      initialValues={initialValues}
      onCancel={onCancel}
      projectOptions={projectOptions ?? []}
      memberOptions={memberOptions ?? []} />
  )
}
