'use client';

import React, { useState } from 'react';
import { Calendar, Users, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const BookingSearch = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  return (
    <form 
      onSubmit={handleSearch}
      className="w-full max-w-4xl mx-auto bg-white rounded-3xl md:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-2 md:p-3 flex flex-col md:flex-row items-center gap-2 md:gap-0"
    >
      {/* Check-in */}
      <div className="w-full md:w-1/3 flex items-center px-6 py-3 md:py-2 hover:bg-zinc-50 rounded-full transition-colors cursor-pointer border-b md:border-b-0 md:border-r border-zinc-200">
        <div className="flex flex-col w-full">
          <label className="text-xs font-bold tracking-wider text-zinc-800 uppercase mb-1">Llegada</label>
          <div className="flex items-center gap-2 text-zinc-500">
            <Calendar className="w-4 h-4" />
            <input 
              type="date" 
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-zinc-900 w-full cursor-pointer"
              required
            />
          </div>
        </div>
      </div>

      {/* Check-out */}
      <div className="w-full md:w-1/3 flex items-center px-6 py-3 md:py-2 hover:bg-zinc-50 rounded-full transition-colors cursor-pointer border-b md:border-b-0 md:border-r border-zinc-200">
        <div className="flex flex-col w-full">
          <label className="text-xs font-bold tracking-wider text-zinc-800 uppercase mb-1">Salida</label>
          <div className="flex items-center gap-2 text-zinc-500">
            <Calendar className="w-4 h-4" />
            <input 
              type="date" 
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-zinc-900 w-full cursor-pointer"
              required
            />
          </div>
        </div>
      </div>

      {/* Guests */}
      <div className="w-full md:w-1/3 flex items-center justify-between px-6 py-3 md:py-2 hover:bg-zinc-50 rounded-full transition-colors cursor-pointer">
        <div className="flex flex-col w-full">
          <label className="text-xs font-bold tracking-wider text-zinc-800 uppercase mb-1">Huéspedes</label>
          <div className="flex items-center gap-2 text-zinc-500">
            <Users className="w-4 h-4" />
            <select 
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-zinc-900 w-full cursor-pointer appearance-none"
            >
              <option value="1">1 Huésped</option>
              <option value="2">2 Huéspedes</option>
              <option value="3">3 Huéspedes</option>
              <option value="4">4 Huéspedes</option>
              <option value="5">5+ Huéspedes</option>
            </select>
          </div>
        </div>
        
        {/* Search Button */}
        <button 
          type="submit"
          className="ml-4 bg-zinc-900 hover:bg-zinc-800 text-white p-4 rounded-full transition-transform hover:scale-105 flex items-center justify-center shrink-0"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};
