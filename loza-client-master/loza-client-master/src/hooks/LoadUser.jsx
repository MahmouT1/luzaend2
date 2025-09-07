"use client";
import { useLoadUserQuery } from "../redux/features/api/apiSlice";

export const LoadUsers = ({ children }) => {
  const { isLoading, error } = useLoadUserQuery(undefined, {
    // Only retry once and don't show errors
    retry: 1,
    retryDelay: 1000,
  });

  // If there's an error, just render children (don't block the app)
  if (error) {
    console.log("🔐 LoadUser error - continuing without user data");
    return <>{children}</>;
  }

  // Only show loading state briefly
  if (isLoading) {
    return <>{children}</>;
  }

  return <>{children}</>;
};
