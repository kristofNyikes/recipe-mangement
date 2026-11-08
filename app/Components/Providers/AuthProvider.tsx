"use client";

import { SessionProvider } from "next-auth/react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider basePath="/api/v1/auth">{children}</SessionProvider>;
};

export default AuthProvider;
