"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      window.location.href = "/dashboard";
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-80 space-y-4">
          <input
            className="w-full border p-2"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border p-2"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="w-full bg-indigo-600 text-white p-2"
          // onClick={login}
          >
            Login
          </button>
        </div>
      </div>
    </form>
  );
}


// "use client";

// import { useState } from "react";

// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();

//     const res = await fetch("/api/auth/login", {
//       method: "POST",
//       body: JSON.stringify({ email, password }),
//     });

//     if (res.ok) {
//       window.location.href = "/dashboard";
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="email"
//         placeholder="Email"
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button>Login</button>
//     </form>
//   );
// }
