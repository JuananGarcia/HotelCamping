import React from 'react';
import { Calendar, LayoutDashboard, Settings, Users, CreditCard, Menu } from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Timeline', icon: Calendar },
    { id: 'bookings', label: 'Bookings', icon: Users },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-zinc-950 text-zinc-400 flex flex-col h-screen border-r border-zinc-800 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
          <Menu className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-semibold text-white tracking-tight">Nordic PMS</span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-indigo-500/10 text-indigo-400" 
                  : "hover:bg-zinc-900 hover:text-zinc-200"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-indigo-400" : "text-zinc-500")} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-800 border-2 border-zinc-700 overflow-hidden">
            <img src="https://picsum.photos/seed/admin/100/100" alt="Admin" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Admin User</span>
            <span className="text-xs text-zinc-500">admin@nordicpms.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
