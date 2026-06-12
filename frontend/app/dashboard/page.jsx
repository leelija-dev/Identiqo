// app/dashboard/page.jsx
'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers, FiDollarSign, FiTrendingUp, FiActivity,
  FiBell, FiSearch, FiMenu, FiSun, FiMoon,
  FiChevronLeft,  FiHome, FiPieChart, FiUser, FiSettings, FiHelpCircle
} from 'react-icons/fi';

// ---------- Theme Context ----------
const ThemeContext = createContext();  

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ---------- Sidebar Component (Integrated) ----------
function Sidebar({ collapsed, onToggle, isMobileOpen, onMobileClose }) {
  const { theme } = useTheme();
  const menuItems = [
    { icon: FiHome, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: FiPieChart, label: 'Analytics', href: '/analytics' },
    { icon: FiUser, label: 'Employees', href: '/employees' },
    { icon: FiSettings, label: 'Settings', href: '/settings' },
    { icon: FiHelpCircle, label: 'Help', href: '/help' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 280,
          transition: { duration: 0.3, ease: "easeInOut" }
        }}
        className={`fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50
          ${isMobileOpen ? 'block' : 'hidden lg:block'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
              >
                IDScanner
              </motion.span>
            )}
            <button
              onClick={onToggle}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FiChevronLeft className={`w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item, idx) => (
              <motion.a
                key={idx}
                href={item.href}
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all
                  ${item.active 
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                <item.icon size={20} />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </motion.a>
            ))}
          </nav>
        </div>
      </motion.aside>
    </>
  );
}

// ---------- Animated Pie Chart ----------
function AnimatedPieChart({ data, size = 180, strokeWidth = 30 }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  const colors = ['#6366f1', '#ec4899', '#06b6d4', '#f59e0b'];

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {data.map((slice, index) => {
        const percentage = total === 0 ? 0 : slice.value / total;
        const dashLength = percentage * circumference;
        const currentOffset = offset;
        offset -= dashLength;
        return (
          <motion.circle
            key={index}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors[index % colors.length]}
            strokeWidth={strokeWidth}
            strokeDasharray={`${dashLength} ${circumference - dashLength}`}
            strokeDashoffset={currentOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            initial={{ strokeDashoffset: currentOffset }}
            animate={{ strokeDashoffset: currentOffset }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
}

// ---------- Wavy Chart ----------
function WavyChart({ data, width = 400, height = 180, color = "#6366f1" }) {
  const maxVal = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - (d.value / maxVal) * height
  }));
  const areaPathD = `M ${points[0].x},${points[0].y} ${points.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')} L ${width},${height} L 0,${height} Z`;
  const linePathD = `M ${points[0].x},${points[0].y} ${points.slice(1).map(p => `L ${p.x},${p.y}`).join(' ')}`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={areaPathD} fill={`url(#grad-${color})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }} />
      <motion.path d={linePathD} fill="none" stroke={color} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
      {points.map((p, i) => (
        <motion.circle key={i} cx={p.x} cy={p.y} r="4" fill={color} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.15 }} />
      ))}
    </svg>
  );
}

// ---------- Stat Card ----------
function StatCard({ icon: Icon, label, value, trend, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="text-white" size={20} />
        </div>
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
          {trend}
        </span>
      </div>
      <h3 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">{value}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </motion.div>
  );
}

// ---------- Mobile Menu Button ----------
function MobileMenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="lg:hidden p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
    >
      <FiMenu className="w-5 h-5 text-slate-600 dark:text-slate-300" />
    </button>
  );
}

// ---------- Theme Toggle Button ----------
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === 'light' ? (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiMoon className="w-5 h-5 text-slate-600" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiSun className="w-5 h-5 text-amber-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button> 
  );
}

// ---------- Search Bar ----------
function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="relative">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-0"
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-72 pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              autoFocus
              onBlur={() => setIsExpanded(false)}
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </motion.div>
        ) : (
          <button
            onClick={() => setIsExpanded(true)}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
          >
            <FiSearch className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Notification Bell ----------
function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const notifications = [
    { id: 1, title: 'New scan detected', time: '5 min ago', read: false },
    { id: 2, title: 'Card EMP-045 expired', time: '1 hour ago', read: false },
    { id: 3, title: 'Weekly report ready', time: '3 hours ago', read: true },
  ];
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700"
      >
        <FiBell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-[10px] text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-slate-100">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                      !notif.read ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''
                    }`}
                  >
                    <p className="text-sm text-slate-700 dark:text-slate-300">{notif.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Main Dashboard Component ----------
export default function DashboardPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const pieData = [
    { name: 'Active', value: 65 },
    { name: 'Expired', value: 20 },
    { name: 'Draft', value: 15 },
  ];
  
  const chartData = [
    { value: 30 }, { value: 45 }, { value: 28 }, { value: 80 },
    { value: 55 }, { value: 60 }, { value: 70 }, { value: 40 }
  ];

  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30 transition-colors duration-300">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ marginLeft: sidebarCollapsed ? 80 : 280 }}>
          {/* Header with actions */}
          <header className="flex items-center justify-between px-4 lg:px-6 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-700/60">
            <div className="flex items-center gap-3">
              <MobileMenuButton onClick={() => setMobileSidebarOpen(true)} />
              <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <SearchBar />
              <NotificationBell />
              <ThemeToggleButton />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <StatCard icon={FiUsers} label="Total Employees" value="1,248" trend="+12%" color="bg-indigo-500" delay={0.1} />
              <StatCard icon={FiDollarSign} label="Active Cards" value="876" trend="+5%" color="bg-emerald-500" delay={0.2} />
              <StatCard icon={FiTrendingUp} label="Revenue" value="$48,250" trend="+18%" color="bg-amber-500" delay={0.3} />
              <StatCard icon={FiActivity} label="Scans Today" value="345" trend="+22%" color="bg-purple-500" delay={0.4} />
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60"
              >
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Card Status</h2>
                <div className="flex items-center justify-center flex-wrap gap-6">
                  <AnimatedPieChart data={pieData} size={200} strokeWidth={35} />
                  <div className="flex flex-col gap-2">
                    {pieData.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#6366f1','#ec4899','#06b6d4'][idx] }} />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{item.name} ({item.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60"
              >
                <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Weekly Activity</h2>
                <div className="h-48 w-full">
                  <WavyChart data={chartData} color="#6366f1" />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60"
            >
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Recent ID Scans</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="pb-3 font-medium">Employee</th>
                      <th className="pb-3 font-medium">Card ID</th>
                      <th className="pb-3 font-medium">Time</th>
                      <th className="pb-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {[
                      { name: 'Alice Johnson', id: 'EMP-001', time: '2 min ago', status: 'Success' },
                      { name: 'Bob Smith', id: 'EMP-045', time: '15 min ago', status: 'Success' },
                      { name: 'Carol White', id: 'EMP-023', time: '1 hour ago', status: 'Failed' },
                      { name: 'Dave Lee', id: 'EMP-112', time: '3 hours ago', status: 'Success' },
                    ].map((row, i) => (
                      <motion.tr
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="py-3 font-medium text-slate-700 dark:text-slate-300">{row.name}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">{row.id}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">{row.time}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row.status === 'Success'
                              ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}