"use client";

import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="border border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white rounded-md px-4 py-1.5 transition"
    >
      Sign Out
    </button>
  );
}
