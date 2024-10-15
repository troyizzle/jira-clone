"use client"

import { useRouter } from "next/navigation";
import { useCurrent } from "./features/auth/api/use-current";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLogout } from "./features/auth/api/use-logout";

export default function Home() {
  const router = useRouter();

  const { data, isLoading } = useCurrent();
  const { mutate } = useLogout();


  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }

  }, [data])
  return (
    <div className="">
      Only visisble to authorized users

      <Button onClick={() => mutate()}>
        Logout
      </Button>
    </div>
  );
}
