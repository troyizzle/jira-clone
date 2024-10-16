import { getCurrent } from "@/app/features/auth/queries";
import { SignUpCard } from "@/app/features/auth/components/sign-up-card";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const user = await getCurrent();

  if (user) redirect("/");

  return (
    <SignUpCard />
  )
}

export default SignUpPage;
