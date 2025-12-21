"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
};

export default function ClientProfileForm({
  initialProfile,
  userId,
}: {
  initialProfile: Profile;
  userId: string;
}) {
  const [name, setName] = useState(initialProfile.name);
  const [phone, setPhone] = useState(initialProfile.phone || "");
  const [updating, setUpdating] = useState(false);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUpdating(true);

    // console.log('name', name);/
    // console.log('phone', phone);

    // console.log('userId', userId);

    const { data: row } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    console.log("Profile before update:", row);

    const { data, error } = await supabase
      .from("profiles")
      .update({ name, phone })
      .eq("id", userId).select();

    console.log('update data', data);

    if (error) {
      alert("❌ Помилка оновлення: " + error.message);
    } else {
      alert("✅ Профіль оновлено");
    }

    setUpdating(false);
  }

  return (
    <div className="bg-white p-6 rounded-xl max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">👤 Мій профіль</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email (не змінюється)</label>
          <input
            type="email"
            value={initialProfile.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="w-full bg-indigo-600 text-white p-2 rounded"
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
