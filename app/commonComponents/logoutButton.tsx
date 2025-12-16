"use client";

import { supabase } from "@/lib/supabase";

export function LogoutButton() {

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      // onClick={async () => {
      //   await supabase.auth.signOut();
      //   window.location.href = "/login";
      // }}
      onClick={onLogout}
      className="text-sm text-red-500 cursor-pointer"
    >
      Logout
    </button>
  );
}