"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validators/register";
import { useState } from "react";
import { Input } from "../commonComponents/ui/Input/Input";
import { Select } from "../commonComponents/ui/Select/Select";
import { Button } from "../commonComponents/ui/Button/Button";
import { redirect } from "next/navigation";

const roles = [
  { value: "CLIENT", label: "Client" },
  { value: "TRAINER", label: "Trainer" },
];


export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        alert("✅ User created successfully!");
        setSuccess(true)
        // redirect або очищення форми
      } else {
        alert("❌ Error: " + JSON.stringify(result.error));
        setServerError(result.error);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Unexpected error");
    }
  };


  if (success) {
    redirect('/dashboard');
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Register</h1>

      {serverError && <p className="text-red-600 mb-4">{serverError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          type="password"
          {...register("password")}
          error={errors.password?.message}
        />

        <Input
          label="Confirm password"
          type="password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <Select
          label="Role"
          {...register("role")}
          options={roles}
          error={errors.role?.message}
        />

        <Button type="submit" className="w-full" variant="primary">
          Register
        </Button>
      </form>
    </div>
  );
}
