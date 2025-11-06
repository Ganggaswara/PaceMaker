import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Receipt,
  UserCheck,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  const menus = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Products", path: "/admin/products", icon: Package },
    { name: "Transactions", path: "/admin/transactions", icon: Receipt },
    { name: "Members", path: "/admin/members", icon: UserCheck },
  ];

  return (
    <aside
      className={`fixed z-40 h-screen w-64 flex flex-col transition-all duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-blue-700 to-indigo-800 shadow-2xl"></div>

      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              PaceMaker
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          {menus.map((menu) => {
            const active = location.pathname === menu.path;
            const Icon = menu.icon;

            return (
              <Link
                key={menu.name}
                to={menu.path}
                className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  active
                    ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {/* Active indicator */}
                <div
                  className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full transition-all duration-200 ${
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                  }`}
                />

                {/* Icon */}
                <div
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-white/20 text-white"
                      : "text-white/70 group-hover:text-white group-hover:bg-white/10"
                  }`}
                >
                  <Icon size={18} />
                </div>

                {/* Text */}
                <span className="font-semibold tracking-wide">{menu.name}</span>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-linear-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-white/20">
          <div className="flex items-center gap-3 px-4 py-3 text-white/60">
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
              <Users size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Admin User</p>
              <p className="text-xs text-white/50">admin@pacemaker.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
