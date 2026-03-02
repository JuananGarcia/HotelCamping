'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Home, 
  Sparkles, 
  BarChart3, 
  Search, 
  Bell, 
  UserCircle 
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Calendario', href: '/admin/calendar', icon: CalendarDays },
    { name: 'Unidades', href: '/admin/units', icon: Home },
    { name: 'Limpieza', href: '/admin/cleaning', icon: Sparkles },
    { name: 'Informes', href: '/admin/reports', icon: BarChart3 },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex h-screen bg-zinc-50 overflow-hidden">
      {/* Sidebar Izquierdo */}
      <aside className="w-64 bg-zinc-950 text-zinc-300 flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
          <span className="text-white font-bold text-lg tracking-tight">Nordic Admin</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-zinc-800 text-white font-medium' 
                    : 'hover:bg-zinc-800/50 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <Link 
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-zinc-800/50 hover:text-white transition-colors"
          >
            <Home className="w-5 h-5 shrink-0" />
            Volver a la web
          </Link>
        </div>
      </aside>

      {/* Área Principal */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Barra Superior */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar huéspedes, reservas..."
                className="block w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-lg leading-5 bg-zinc-50 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-zinc-900 focus:border-zinc-900 sm:text-sm transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-4">
            <button className="relative p-2 text-zinc-400 hover:text-zinc-600 transition-colors rounded-full hover:bg-zinc-100">
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-8 w-px bg-zinc-200"></div>
            <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white">
                <UserCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-zinc-700 hidden sm:block">Admin</span>
            </button>
          </div>
        </header>

        {/* Contenedor de Páginas */}
        <main className="flex-1 overflow-y-auto bg-zinc-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
