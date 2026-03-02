'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Home, Tent } from 'lucide-react';

interface UnitCardProps {
  id: string;
  name: string;
  type: string;
  price: number;
  image: string;
}

export const UnitCard: React.FC<UnitCardProps> = ({ id, name, type, price, image }) => {
  const searchParams = useSearchParams();
  const checkIn = searchParams?.get('checkIn') || '';
  const checkOut = searchParams?.get('checkOut') || '';

  // Construir la URL manteniendo las fechas si existen
  const queryParams = new URLSearchParams();
  if (checkIn) queryParams.append('checkIn', checkIn);
  if (checkOut) queryParams.append('checkOut', checkOut);
  
  const queryString = queryParams.toString();
  const href = `/book/${id}${queryString ? `?${queryString}` : ''}`;

  return (
    <Link href={href} className="group flex flex-col cursor-pointer">
      {/* Contenedor de la imagen con esquinas redondeadas y overflow hidden para el zoom */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl mb-4 bg-zinc-100">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Etiqueta flotante opcional (estilo Airbnb) */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase text-zinc-900 shadow-sm">
          {type === 'cabin' ? 'Cabaña' : 'Parcela'}
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-zinc-900 text-base leading-tight">{name}</h3>
          <div className="flex items-center text-zinc-500 text-sm mt-1 gap-1.5">
            {type === 'cabin' ? <Home className="w-3.5 h-3.5" /> : <Tent className="w-3.5 h-3.5" />}
            <span className="capitalize">{type === 'cabin' ? 'Cabaña' : 'Parcela para Caravana'}</span>
          </div>
        </div>
      </div>
      
      {/* Precio destacado */}
      <div className="mt-2">
        <span className="font-bold text-zinc-900">{price}€</span>
        <span className="text-zinc-500 text-sm"> noche</span>
      </div>
    </Link>
  );
};
