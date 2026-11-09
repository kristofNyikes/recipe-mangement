import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import Navbar from "../Components/Navbar/BeforeAuthNavbar";

const PublicLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (session?.user) {
    redirect("/main");
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <NextTopLoader height={5} color="#9fe88d" showSpinner={false} />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default PublicLayout;
