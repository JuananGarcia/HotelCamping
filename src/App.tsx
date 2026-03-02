import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TimelineCalendar } from './components/TimelineCalendar';
import { SqlSchema } from './components/SqlSchema';
import { HomePage } from './pages/HomePage';
import { Navbar } from './components/Navbar';

export default function App() {
  const [activeTab, setActiveTab] = useState('storefront');

  // If storefront is active, show the full-screen page without sidebar
  if (activeTab === 'storefront') {
    return (
      <div className="relative w-full min-h-screen bg-zinc-50">
        {/* Navbar fijo en la parte superior */}
        <Navbar />

        {/* Floating button to go back to admin */}
        <button 
          onClick={() => setActiveTab('calendar')}
          className="fixed bottom-6 right-6 z-[60] bg-black/80 hover:bg-black text-white backdrop-blur-md px-5 py-3 rounded-full text-xs font-bold tracking-wider uppercase transition-all hover:scale-105 border border-white/20 shadow-xl"
        >
          ← Admin Panel
        </button>

        {/* 
          Simulación del app/layout.tsx de Next.js
          El pt-20 (padding-top: 5rem) asegura que el contenido no quede oculto bajo el Navbar
        */}
        <main className="pt-20">
          <HomePage />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-semibold text-zinc-800 capitalize tracking-tight">
            {activeTab}
          </h1>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
              + New Booking
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-[1600px] mx-auto h-full flex flex-col gap-8">
            {activeTab === 'calendar' && (
              <div className="flex-1 min-h-[600px]">
                <TimelineCalendar />
              </div>
            )}
            
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200">
                  <h2 className="text-lg font-medium text-zinc-900 mb-4">Quick Stats</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <p className="text-sm text-zinc-500 font-medium">Occupancy Rate</p>
                      <p className="text-3xl font-semibold text-zinc-900 mt-1">84%</p>
                    </div>
                    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100">
                      <p className="text-sm text-zinc-500 font-medium">Available Units</p>
                      <p className="text-3xl font-semibold text-zinc-900 mt-1">16</p>
                    </div>
                  </div>
                </div>
                <SqlSchema />
              </div>
            )}

            {activeTab !== 'calendar' && activeTab !== 'dashboard' && (
              <div className="flex-1 flex items-center justify-center bg-white rounded-2xl border border-zinc-200 border-dashed">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-zinc-900">Coming Soon</h3>
                  <p className="text-zinc-500 mt-1">This module is under development.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
