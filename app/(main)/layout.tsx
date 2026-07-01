import React from "react";
import Navbar from "../Components/Navbar/AfterAuthNavbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default MainLayout;
