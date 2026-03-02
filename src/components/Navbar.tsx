import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-zinc-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold tracking-tighter text-zinc-900 cursor-pointer">
          NORDIC<span className="font-light">STAYS</span>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Inicio</a>
          <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Alojamientos</a>
          <a href="#" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">Experiencias</a>
          <button className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800 transition-transform hover:scale-105">
            Reservar
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white border-b border-zinc-200 px-6 py-6 flex flex-col gap-6 shadow-lg animate-fade-in-up">
          <a href="#" className="text-base font-medium text-zinc-600 hover:text-zinc-900">Inicio</a>
          <a href="#" className="text-base font-medium text-zinc-600 hover:text-zinc-900">Alojamientos</a>
          <a href="#" className="text-base font-medium text-zinc-600 hover:text-zinc-900">Experiencias</a>
          <button className="w-full py-3 mt-2 bg-zinc-900 text-white text-sm font-medium rounded-full hover:bg-zinc-800">
            Reservar Ahora
          </button>
        </div>
      )}
    </nav>
  );
};
