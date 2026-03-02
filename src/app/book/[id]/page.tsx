'use client';

import React, { useEffect, useState, use } from 'react';
import { supabase } from '../../../lib/supabase';
import { ChevronLeft, Users, ShieldCheck, CreditCard, Info } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Unit {
  id: string;
  name: string;
  type: string;
  base_price: number;
  capacity: number;
  description?: string;
}

export default function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: unitId } = use(params);
  const [unit, setUnit] = useState<Unit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licensePlate: '',
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  
  const checkIn = searchParams?.get('checkIn');
  const checkOut = searchParams?.get('checkOut');
  const guests = searchParams?.get('guests') || '2';

  useEffect(() => {
    const fetchUnit = async () => {
      if (!unitId) {
        setError('No se ha especificado ninguna unidad.');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('units')
          .select('*')
          .eq('id', unitId)
          .single();

        if (error) throw error;
        setUnit(data);
      } catch (err: any) {
        console.error('Error fetching unit:', err);
        setError('No se pudo cargar la información de la unidad.');
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [unitId]);

  // Calculate nights
  const getDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = checkIn && checkOut ? getDays(checkIn, checkOut) : 0;
  const basePrice = unit?.base_price || 0;
  const subtotal = nights * basePrice;
  const vat = subtotal * 0.10; // 10% IVA para alojamientos
  const total = subtotal + vat;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la integración con Stripe o pasarela de pago
    console.log('Procediendo al pago con:', { unit, checkIn, checkOut, guests, formData, total });
    alert('Redirigiendo a la pasarela de pago seguro...');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  if (error || !unit) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center px-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl max-w-md text-center">
          <p>{error || 'Unidad no encontrada'}</p>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-6 py-2 bg-white text-red-600 rounded-full text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  // Generate a consistent image based on unit type and ID
  const imageUrl = unit.type === 'cabin'
    ? `https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=1200&sig=${unit.id}`
    : `https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=1200&sig=${unit.id}`;

  return (
    <div className="min-h-screen bg-zinc-50 pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center text-zinc-500 hover:text-zinc-900 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver a resultados
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Unit Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="rounded-3xl overflow-hidden shadow-sm">
              <img 
                src={imageUrl} 
                alt={unit.name} 
                className="w-full h-[400px] object-cover"
              />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-wider rounded-full">
                  {unit.type === 'cabin' ? 'Cabaña' : 'Parcela'}
                </span>
                <span className="flex items-center text-sm text-zinc-500">
                  <Users className="w-4 h-4 mr-1" />
                  Hasta {unit.capacity} personas
                </span>
              </div>
              <h1 className="text-4xl font-light text-zinc-900 mb-4">{unit.name}</h1>
              <p className="text-zinc-600 leading-relaxed text-lg">
                {unit.description || 'Disfruta de una estancia inolvidable en plena naturaleza. Este alojamiento cuenta con todas las comodidades necesarias para que te relajes y desconectes de la rutina diaria.'}
              </p>
            </div>

            <hr className="border-zinc-200" />

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-light text-zinc-900 mb-6">Tus datos</h2>
              <form id="booking-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Nombre</label>
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                      placeholder="Ej. Juan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Apellidos</label>
                    <input 
                      type="text" 
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                      placeholder="Ej. Pérez"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Correo electrónico</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Teléfono</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                      placeholder="+34 600 000 000"
                    />
                  </div>
                </div>

                {unit.type === 'parcela' && (
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">Matrícula del vehículo / caravana</label>
                    <input 
                      type="text" 
                      name="licensePlate"
                      required
                      value={formData.licensePlate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:border-transparent outline-none transition-all"
                      placeholder="Ej. 1234 ABC"
                    />
                    <p className="text-xs text-zinc-500 mt-1 flex items-center">
                      <Info className="w-3 h-3 mr-1" />
                      Necesario para el control de acceso al recinto.
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Column: Sticky Summary & Payment */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-zinc-100">
              <h3 className="text-xl font-medium text-zinc-900 mb-6">Resumen de la reserva</h3>
              
              {/* Dates */}
              <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-2xl mb-6">
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Llegada</span>
                  <span className="text-sm font-medium text-zinc-900">{checkIn ? new Date(checkIn).toLocaleDateString('es-ES') : '-'}</span>
                </div>
                <div className="h-8 w-px bg-zinc-200"></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Salida</span>
                  <span className="text-sm font-medium text-zinc-900">{checkOut ? new Date(checkOut).toLocaleDateString('es-ES') : '-'}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-zinc-600">
                  <span>{basePrice}€ x {nights} {nights === 1 ? 'noche' : 'noches'}</span>
                  <span>{subtotal.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span className="underline decoration-dotted cursor-help" title="Impuesto sobre el Valor Añadido (10%)">IVA (10%)</span>
                  <span>{vat.toFixed(2)}€</span>
                </div>
                <hr className="border-zinc-200" />
                <div className="flex justify-between items-end">
                  <span className="text-lg font-medium text-zinc-900">Total</span>
                  <span className="text-3xl font-light text-zinc-900">{total.toFixed(2)}€</span>
                </div>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                form="booking-form"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 group"
              >
                <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Proceder al Pago Seguro
              </button>

              <div className="mt-6 flex items-start gap-3 text-xs text-zinc-500 bg-zinc-50 p-4 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <p>
                  Tus datos están protegidos. El pago se procesará de forma segura a través de nuestra pasarela encriptada. No se te cobrará nada hasta el siguiente paso.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
