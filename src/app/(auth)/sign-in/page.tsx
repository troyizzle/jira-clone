import { getCurrent } from "@/app/features/auth/actions";
import { SignInCard } from "@/app/features/auth/components/sign-in-card";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const user = await getCurrent();

  if (user) redirect("/");

  return (
    <SignInCard />
  )
}

export default SignInPage;
