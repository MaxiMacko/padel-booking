"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validators/register";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.error || "Registration failed");
      return;
    }

    alert("Registration successful");
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-black">Register</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <div className="text-black">Email:</div>
          <input
            {...register("email")}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="text-black">Password:</div>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full border p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="text-black">Confirm password:</div>
          <input
            type="password"
            {...register("confirmPassword")}
            placeholder="Confirm password"
            className="w-full border p-2 rounded"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Role */}
        <div>
          <div className="text-black">Role:</div>
          <select
            {...register("role")}
            className="w-full border p-2 rounded"
          >
            <option value="">Select role</option>
            <option value="CLIENT">Client</option>
            <option value="TRAINER">Trainer</option>
          </select>
          {errors.role && (
            <p className="text-red-500 text-sm">Role is required</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <div className="text-black">Phone (optional):</div>
          <input
            {...register("phone")}
            placeholder="Phone (optional)"
            className="w-full border p-2 rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          className="w-full bg-black text-white p-2 rounded disabled:opacity-50"
        >
          {isSubmitting ? "Creating account..." : "Register"}
        </button>
      </form>
    </div>
  );
}
