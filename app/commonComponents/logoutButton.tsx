"use client";
import { useState } from "react";
import { Button } from "./ui/Button/Button";
import { ConfirmDialog } from "./ui/ConfirmDialog/ConfirmDialog";

export function LogoutButton() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirmationModal(true)
  }

  const onLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }



  return (
    <div className="pl-4">
      {
        showConfirmationModal && (
          <ConfirmDialog
            open={showConfirmationModal}
            title="Logout"
            description="Are you sure you wnat to logout?"
            onCancel={() => { setShowConfirmationModal(false) }}
            onConfirm={onLogout}
          />
        )
      }
      <Button
        onClick={handleLogoutClick}
        variant="danger"
        className="text-sm text-red-500 cursor-pointer"
      >
        Logout
      </Button>
    </div>
  );
}