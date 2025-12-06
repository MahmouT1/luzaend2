"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to login page immediately
    router.replace("/login");
  }, [router]);
  
  return null;
}

