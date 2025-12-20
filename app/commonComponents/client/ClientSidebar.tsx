"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/dashboard/client/calendar", label: "📅 Calendar" },
  { href: "/dashboard/client/bookings", label: "📖 My bookings" },
  { href: "/dashboard/client/profile", label: "👤 Profile" },
];

export default function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r p-4">
      <h1 className="text-xl font-bold mb-6">🎾 Padel</h1>

      <nav className="space-y-2">
        {nav.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-4 py-2 rounded-lg
                ${isActive
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
