// app/dashboard/page.jsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiUsers, FiDollarSign, FiTrendingUp, FiActivity,
  FiBell, FiSearch, FiMenu, FiX
} from 'react-icons/fi';
import Sidebar from '@/components/Layout/Sidebar';
import Button from '@/components/Common/Button';

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
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="text-white" size={20} />
        </div>
        <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <h3 className="mt-4 text-2xl font-bold text-slate-800">{value}</h3>
      <p className="text-sm text-slate-500 mt-1">{label}</p>
    </motion.div>
  );
}

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
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Mobile Menu Button & Top Bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3 lg:py-4">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden !p-2 rounded-lg"
                ariaLabel="Open menu"
              >
                <FiMenu className="w-5 h-5" />
              </Button>
              
              {/* Page Title */}
              <h1 className="text-xl lg:text-2xl font-bold text-slate-800">Dashboard</h1>
            </div>

            <div className="flex items-center gap-2 lg:gap-3">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="sm"
                className="!p-2 rounded-lg"
                ariaLabel="Search"
              >
                <FiSearch className="w-5 h-5" />
              </Button>
              
              {/* Notifications Button */}
              <Button
                variant="ghost"
                size="sm"
                className="!p-2 rounded-lg relative"
                ariaLabel="Notifications"
              >
                <FiBell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
              </Button>

              {/* User Avatar */}
              <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                A
              </div>
            </div>
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
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Card Status</h2>
                <Button variant="ghost" size="xs" className="text-indigo-600">
                  View Details
                </Button>
              </div>
              <div className="flex items-center justify-center">
                <AnimatedPieChart data={pieData} size={200} strokeWidth={35} />
                <div className="ml-6 flex flex-col gap-2">
                  {pieData.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#6366f1','#ec4899','#06b6d4'][idx] }} />
                      <span className="text-sm text-slate-600">{item.name} ({item.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.7 }} 
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Weekly Activity</h2>
                <Button variant="ghost" size="xs" className="text-indigo-600">
                  Export
                </Button>
              </div>
              <div className="h-48 w-full">
                <WavyChart data={chartData} color="#6366f1" />
              </div>
              <div className="flex justify-between mt-2 text-xs text-slate-500">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.9 }} 
            className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-800">Recent ID Scans</h2>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                View All
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="pb-3 font-medium">Employee</th>
                    <th className="pb-3 font-medium">Card ID</th>
                    <th className="pb-3 font-medium">Time</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
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
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 font-medium text-slate-700">{row.name}</td>
                      <td className="py-3 text-slate-500">{row.id}</td>
                      <td className="py-3 text-slate-500">{row.time}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          row.status === 'Success' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-rose-50 text-rose-700'
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
  );
}