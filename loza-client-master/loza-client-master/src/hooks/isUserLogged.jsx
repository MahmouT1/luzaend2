"use client";
import { redirect } from "next/navigation";
import { useSelector } from "react-redux";

const IsUserLogged = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  console.log(user);
  if (user) {
    const isUser = user.role === "user";
    return isUser ? children : redirect("/");
  } else {
    redirect("/");
  }
};

export default IsUserLogged;
