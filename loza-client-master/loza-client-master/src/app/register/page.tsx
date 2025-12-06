"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to home page - login is handled by modal only
    router.replace("/");
  }, [router]);
  
  return null;
}

