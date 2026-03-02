import React from 'react';
import { BookingSearch } from '../components/BookingSearch';

export const HomePage = () => {
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center overflow-hidden bg-zinc-900">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=2070&auto=format&fit=crop"
          alt="Modern cabin in the woods"
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 md:px-12 lg:px-24 mt-[-10vh]">
        <div className="text-center max-w-4xl mx-auto mb-12">
          {/* Subheadline */}
          <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold tracking-widest uppercase mb-6">
            Experiencia Glamping Premium
          </span>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
            Desconecta en la Naturaleza, <br className="hidden md:block" />
            <span className="text-zinc-200 font-light italic">con la Comodidad del Mañana</span>
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-zinc-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
            Descubre nuestras cabañas de diseño y parcelas exclusivas. 
            Un refugio donde el lujo minimalista se encuentra con lo salvaje.
          </p>
        </div>

        {/* Floating Search Bar */}
        <div className="w-full max-w-5xl mx-auto animate-fade-in-up">
          <BookingSearch />
        </div>
      </div>

      {/* Scroll Indicator (Optional detail for premium feel) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-70 animate-bounce">
        <span className="text-white text-xs tracking-widest uppercase font-medium">Explorar</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </div>
    </div>
  );
};
