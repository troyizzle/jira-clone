import { getCurrent } from "@/app/features/auth/queries";
import { EditProjectForm } from "@/app/features/projects/components/edit-project-form";
import { getProject } from "@/app/features/projects/queries";
import { redirect } from "next/navigation";

interface ProjectIdSettingsPageProps {
  params: {
    projectId: string;
  };
}

export default async function ProjectIdSettingsPage({
  params
}: ProjectIdSettingsPageProps) {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const initialValues = await getProject({
    projectId: params.projectId
  })

  if (!initialValues) {
    throw new Error("No project found");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValues={initialValues} />
    </div>
  )
}
