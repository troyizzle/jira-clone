import { getCurrent } from "@/app/features/auth/queries";
import { redirect } from "next/navigation";

const WorkspaceIdPage = async () => {
  const user = await getCurrent();

  if (!user) redirect("/sign-in");

  return (
    <div>Hey</div>
  )
}

export default WorkspaceIdPage
