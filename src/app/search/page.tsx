'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { getAvailableUnits } from '../../services/bookingService';
import { supabase } from '../../lib/supabase';
import { CalendarX2, Wifi, Wind, Waves, Coffee, Check } from 'lucide-react';
import Link from 'next/link';
import { UnitCard } from '../../components/UnitCard';

// --- Shadcn UI Mock Components ---
const Card = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm overflow-hidden flex flex-col ${className || ''}`} {...props}>
    {children}
  </div>
);

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse rounded-md bg-zinc-100 ${className || ''}`} />
);

function SearchContent() {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros de estado local
  const [priceRange, setPriceRange] = useState(200);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const checkIn = searchParams?.get('checkIn');
  const checkOut = searchParams?.get('checkOut');
  const type = searchParams?.get('type');

  useEffect(() => {
    const fetchUnits = async () => {
      if (!checkIn || !checkOut) {
        setLoading(false);
        return; // No buscamos si no hay fechas
      }

      setLoading(true);
      try {
        let available = await getAvailableUnits(checkIn, checkOut);
        
        // Filtrar por tipo si viene en la URL
        if (type) {
          available = available.filter(u => u.type === type);
        }
        
        setUnits(available);
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, [checkIn, checkOut, type]);

  const getImageUrl = (unitType: string, id: string) => {
    const seed = id.substring(0, 5);
    if (unitType === 'cabin') {
      return `https://images.unsplash.com/photo-1587061949409-02df41d5e562?q=80&w=800&auto=format&fit=crop&seed=${seed}`;
    }
    return `https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=800&auto=format&fit=crop&seed=${seed}`;
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  // Si no hay fechas, mostramos un estado vacío elegante
  if (!checkIn || !checkOut) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarX2 className="w-10 h-10 text-zinc-400" />
          </div>
          <h2 className="text-3xl font-light text-zinc-900 mb-4 tracking-tight">
            ¿Cuándo quieres venir?
          </h2>
          <p className="text-zinc-500 mb-8 leading-relaxed">
            Por favor, selecciona las fechas de tu estancia en la página principal para poder mostrarte los alojamientos disponibles.
          </p>
          <Link 
            href="/"
            className="px-8 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full font-medium transition-colors inline-flex items-center gap-2"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  // Filtrado local (simulado para la UI)
  const filteredUnits = units.filter(unit => unit.base_price <= priceRange);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">
          Resultados de búsqueda
        </h1>
        <p className="text-zinc-500">
          Mostrando disponibilidad del {new Date(checkIn).toLocaleDateString('es-ES')} al {new Date(checkOut).toLocaleDateString('es-ES')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Columna Izquierda: Filtros (30%) */}
        <aside className="w-full lg:w-[300px] shrink-0 space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Precio máximo por noche</h3>
            <div className="space-y-4">
              <input 
                type="range" 
                min="30" 
                max="300" 
                step="10"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-zinc-900"
              />
              <div className="flex justify-between text-sm text-zinc-500 font-medium">
                <span>30€</span>
                <span className="text-zinc-900">{priceRange}€</span>
              </div>
            </div>
          </div>

          <hr className="border-zinc-200" />

          <div>
            <h3 className="text-lg font-semibold text-zinc-900 mb-4">Servicios</h3>
            <div className="space-y-3">
              {[
                { id: 'wifi', label: 'Wi-Fi Gratis', icon: Wifi },
                { id: 'ac', label: 'Aire Acondicionado', icon: Wind },
                { id: 'pool', label: 'Piscina', icon: Waves },
                { id: 'breakfast', label: 'Desayuno Incluido', icon: Coffee },
              ].map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity.id);
                return (
                  <label key={amenity.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-zinc-900 border-zinc-900' : 'border-zinc-300 group-hover:border-zinc-400'}`}>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <amenity.icon className="w-4 h-4 text-zinc-500" />
                    <span className="text-sm text-zinc-700">{amenity.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Columna Derecha: Grid de Resultados (70%) */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="h-[420px]">
                  <Skeleton className="h-56 w-full rounded-none" />
                  <div className="p-6 space-y-4 flex-1 flex flex-col">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-4 w-1/3" />
                    <div className="mt-auto flex justify-between items-center pt-4">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-10 w-32 rounded-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredUnits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUnits.map((unit) => (
                <UnitCard 
                  key={unit.id}
                  id={unit.id}
                  name={unit.name}
                  type={unit.type}
                  price={unit.base_price}
                  image={getImageUrl(unit.type, unit.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-zinc-50 rounded-3xl border border-zinc-100 border-dashed">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                <CalendarX2 className="w-8 h-8 text-zinc-400" />
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 mb-2">
                No hay resultados
              </h2>
              <p className="text-zinc-500 max-w-md mx-auto mb-6">
                No hemos encontrado alojamientos disponibles para estas fechas o con estos filtros.
              </p>
              <button 
                onClick={() => {
                  setPriceRange(300);
                  setSelectedAmenities([]);
                }}
                className="text-zinc-900 font-medium hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 pb-20 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div></div>}>
      <SearchContent />
    </Suspense>
  );
}
