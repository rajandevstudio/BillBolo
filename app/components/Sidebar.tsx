"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/products", icon: Package },
];

export default function Sidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = ({ mobile = false }) => (
    <>
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-1 border-b">
        <span className="text-lg font-semibold text-gray-900">BillBolo</span>

        {!mobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="pl-1 rounded-xl hover:bg-gray-100 text-gray-600"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        )}

        {mobile && (
          <button 
          className="text-gray-700"
          onClick={() => setMobileOpen(false)}>
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium
                ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <Icon size={18} />
              {(!collapsed || mobile) && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t text-xs text-gray-400">
        BillBolo v1.0
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden h-14 border-b flex items-center px-4 bg-white">
        <button 
        onClick={() => setMobileOpen(true)}
        className="text-gray-700"
            >
          <Menu />
        </button>
        <span className="ml-3 font-semibold text-gray-900">BillBolo</span>
      </div>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 90 : 256 }}
        className="hidden md:flex bg-white border-r min-h-screen flex-col shadow-sm"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "tween" }}
              className="fixed top-0 left-0 w-64 h-full bg-white z-50 shadow-lg md:hidden flex flex-col"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
