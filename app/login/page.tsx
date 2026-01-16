"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validators/login";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { USER_TYPE } from "@/lib/types/types";
import { Input } from "../commonComponents/ui/Input/Input";
import { Button } from "../commonComponents/ui/Button/Button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "Login failed");
      return;
    }

    // редірект по ролі
    if (json.user.role === USER_TYPE.CLIENT) {
      router.push("/dashboard/client");
    } else {
      router.push("/dashboard/trainer");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            label="Email"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
        <div>
          <Input
            label="Password"
            type="password"
            error={errors.password?.message}
            {...register("password")}
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <Button type="submit" variant="primary" className="w-full">Login</Button>
      </form>
    </div>
  );
}
