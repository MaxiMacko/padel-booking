"use client";

import { supabase } from "@/lib/supabase";

export function LogoutButton() {

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <div className="pl-4">
      <button
        onClick={onLogout}
        className="text-sm text-red-500 cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}