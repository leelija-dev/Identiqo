"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiFileText,
} from "react-icons/fi";

const menuItems = [
  { id: 1, label: "Dashboard", href: "/admin/dashboard", icon: FiHome },
  { id: 2, label: "Employee", href: "/admin/employee", icon: FiUsers },
  { id: 3, label: "Templates", href: "/admin/templates", icon: FiFileText },
  { id: 4, label: "Settings", href: "#", icon: FiSettings },
 
];

export default function Sidebar() {
  const pathname = usePathname();

  // Function to check if the current path matches the menu item
  const isActive = (href) => {
    // For dashboard home, match exactly
    if (href === '/admin/dashboard') {
      return pathname === href;
    }
    // For other routes, check if pathname starts with the href
    return pathname?.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-700 text-white shadow-lg">
      <div className="p-6 text-2xl font-bold border-b border-slate-700">
        Identiqo
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`
                flex items-center gap-3 px-6 py-3 transition
                ${active 
                  ? 'bg-blue-600 text-white hover:bg-blue-600' 
                  : 'hover:bg-slate-100 text-slate-100 hover:text-indigo-600 hover:bg-indigo-50/30'
                }
              `}
            >
              <Icon size={20} className={active ? 'text-white' : 'text-slate-400'} />
              <span>{item.label}</span>
              {active && (
                <span className="ml-auto w-1.5 h-8 bg-white rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}