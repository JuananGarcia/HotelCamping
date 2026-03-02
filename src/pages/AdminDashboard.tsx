import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Search, TrendingUp, CalendarDays, Euro, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface Unit {
  id: string;
  name: string;
  type: string;
  base_price: number;
  capacity: number;
  status?: 'Disponible' | 'Ocupada' | 'Sucia'; // Simulated status
}

export const AdminDashboard = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const { data, error } = await supabase
          .from('units')
          .select('*')
          .order('name');

        if (error) throw error;

        // Simulate statuses for the demo since we don't have a status column yet
        const unitsWithStatus = (data || []).map((unit, index) => {
          let status: 'Disponible' | 'Ocupada' | 'Sucia' = 'Disponible';
          if (index % 7 === 0) status = 'Sucia';
          else if (index % 3 === 0) status = 'Ocupada';
          
          return { ...unit, status };
        });

        setUnits(unitsWithStatus);
      } catch (error) {
        console.error('Error fetching units:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUnits();
  }, []);

  const filteredUnits = units.filter(unit => 
    unit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Mock KPIs
  const kpis = {
    occupancy: '78%',
    monthlyBookings: 142,
    pendingRevenue: '12.450€'
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Disponible':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Disponible
          </span>
        );
      case 'Ocupada':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <XCircle className="w-3.5 h-3.5" />
            Ocupada
          </span>
        );
      case 'Sucia':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3.5 h-3.5" />
            Sucia
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Ocupación Hoy</p>
            <p className="text-2xl font-bold text-zinc-900">{kpis.occupancy}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Reservas del Mes</p>
            <p className="text-2xl font-bold text-zinc-900">{kpis.monthlyBookings}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
            <Euro className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-500">Ingresos Pendientes</p>
            <p className="text-2xl font-bold text-zinc-900">{kpis.pendingRevenue}</p>
          </div>
        </div>
      </div>

      {/* Management Table Section */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
        {/* Header & Filter */}
        <div className="p-6 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-zinc-900">Gestión de Unidades</h2>
          
          <div className="relative max-w-md w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar unidad (ej: P-22)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-zinc-200 rounded-xl leading-5 bg-zinc-50 placeholder-zinc-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200">
            <thead className="bg-zinc-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Unidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Capacidad
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Precio Base
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-zinc-200">
              {loading ? (
                // Loading Skeleton
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-zinc-200 rounded w-24"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-zinc-200 rounded w-16"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-zinc-200 rounded w-12"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-4 bg-zinc-200 rounded w-16"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="h-6 bg-zinc-200 rounded-full w-24"></div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right"><div className="h-4 bg-zinc-200 rounded w-12 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredUnits.length > 0 ? (
                filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-zinc-900">{unit.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-500 capitalize">{unit.type === 'cabin' ? 'Cabaña' : 'Parcela'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-500">{unit.capacity} pax</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-zinc-500">{unit.base_price}€</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(unit.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900">Editar</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                    No se encontraron unidades que coincidan con "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
