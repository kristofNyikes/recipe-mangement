"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  className: string;
}

const LogoutButton = ({ className }: LogoutButtonProps) => {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <button type="button" className={className} onClick={handleLogout}>
      Log out
    </button>
  );
};

export default LogoutButton;
