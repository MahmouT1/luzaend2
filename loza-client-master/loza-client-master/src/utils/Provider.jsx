"use client";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { LoadUsers } from "../hooks/LoadUser";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <LoadUsers>{children}</LoadUsers>
      </SessionProvider>
    </Provider>
  );
}
