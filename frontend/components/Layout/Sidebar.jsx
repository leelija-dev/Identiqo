// components/Layout/sidebar.jsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiCreditCard, FiUsers, FiSettings, FiHelpCircle,
  FiChevronLeft, FiBarChart2, FiLayers, FiMail, FiShield
} from 'react-icons/fi';

const navItems = [
  { icon: FiHome, label: 'Home', href: '/' },
  { icon: FiBarChart2, label: 'Dashboard', href: '/dashboard' },
  { icon: FiShield, label: 'Admin', href: '/admindashboard' },
  { icon: FiCreditCard, label: 'Cards', href: '/templates' },
  { icon: FiUsers, label: 'Employees', href: '/employees' },
  { icon: FiLayers, label: 'Projects', href: '/projects' },
  { icon: FiMail, label: 'Messages', href: '/messages' },
  { icon: FiSettings, label: 'Settings', href: '/settings' },
  { icon: FiHelpCircle, label: 'Help', href: '/help' },
];

export default function Sidebar({ collapsed, onToggle, isMobileOpen, onMobileClose }) {
  const pathname = usePathname();

  // Desktop version – sticky sidebar with collapse toggle
  const DesktopSidebar = (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="hidden lg:flex flex-col h-screen bg-white border-r border-slate-200 shadow-sm relative z-40"
    >
      <button
        onClick={onToggle}
        className="absolute -right-3 top-8 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all"
      >
        <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <FiChevronLeft size={14} />
        </motion.div>
      </button>

      <div className="flex items-center gap-3 px-4 py-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
          I
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-bold text-lg text-slate-800 whitespace-nowrap overflow-hidden"
            >
              Identiqo
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 px-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link key={index} href={item.href}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-3 py-2.5 my-1 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                <Icon size={20} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm"
              >
                <p className="font-medium text-slate-700">Ashmita</p>
                <p className="text-xs text-slate-400">Admin</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );

  // Mobile overlay sidebar
  const MobileSidebar = (
    <AnimatePresence>
      {isMobileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onMobileClose}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="fixed top-0 left-0 h-full w-[280px] bg-white border-r border-slate-200 flex flex-col shadow-2xl z-50 lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">I</div>
                <span className="font-bold text-lg text-slate-800">Identiqo</span>
              </div>
              <button onClick={onMobileClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                <FiChevronLeft size={18} />
              </button>
            </div>

            <nav className="flex-1 px-2">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link key={index} href={item.href} onClick={onMobileClose}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 px-3 py-2.5 my-1 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600 font-medium'
                          : 'text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="text-sm">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-slate-200 p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400" />
                <div className="text-sm">
                  <p className="font-medium text-slate-700">Ashmita</p>
                  <p className="text-xs text-slate-400">Admin</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {DesktopSidebar}
      {MobileSidebar}
    </>
  );
}