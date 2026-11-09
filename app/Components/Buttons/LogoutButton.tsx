"use client";

import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  className: string;
}

const LogoutButton = ({ className }: LogoutButtonProps) => {
  return (
    <button
      type="button"
      className={className}
      onClick={() => signOut({ redirectTo: "/auth/login" })}
    >
      Log out
    </button>
  );
};

export default LogoutButton;
