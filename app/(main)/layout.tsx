import React from "react";
import Navbar from "../Components/Navbar/AfterAuthNavbar";
import NextTopLoader from "nextjs-toploader";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <NextTopLoader height={5} color="#9fe88d" showSpinner={false} />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default MainLayout;
