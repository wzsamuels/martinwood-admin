"use client";

import { SessionProvider } from "next-auth/react";

export interface AuthContextProps {
  children: React.ReactNode;
}

let authContext = function AuthContext({ children }: AuthContextProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
};
export default authContext