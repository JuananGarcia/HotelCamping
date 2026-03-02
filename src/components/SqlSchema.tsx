'use client';

import React, { useState } from 'react';
import { seedUnits } from '../scripts/seedUnits';

export const SqlSchema = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedMessage('Insertando unidades...');
    const result = await seedUnits();
    setSeedMessage(result.message || '');
    setIsSeeding(false);
  };

  const sql = `-- 1. UNITS TABLE
CREATE TABLE units (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) CHECK (type IN ('cabin', 'caravan')),
  status VARCHAR(50) CHECK (status IN ('available', 'dirty', 'maintenance')),
  base_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BOOKINGS TABLE
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  payment_status VARCHAR(50) CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  ota_source VARCHAR(50) CHECK (ota_source IN ('web', 'booking', 'expedia', 'airbnb')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_dates CHECK (check_out > check_in)
);

-- 3. AVAILABILITY CALENDAR (Fast Query Index)
-- This table acts as a materialized view or fast lookup table for the timeline
CREATE TABLE availability_calendar (
  date DATE NOT NULL,
  unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
  status VARCHAR(50) CHECK (status IN ('available', 'booked', 'blocked')),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  price DECIMAL(10, 2),
  PRIMARY KEY (date, unit_id)
);

-- INDICES FOR PERFORMANCE
CREATE INDEX idx_availability_date_status ON availability_calendar(date, status);
CREATE INDEX idx_bookings_dates ON bookings(check_in, check_out);
CREATE INDEX idx_units_type ON units(type);`;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-200 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-zinc-900">Database Schema (Supabase PostgreSQL)</h2>
        <div className="flex items-center gap-3">
          {seedMessage && (
            <span className="text-sm text-zinc-500">{seedMessage}</span>
          )}
          <button 
            onClick={handleSeed}
            disabled={isSeeding}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            {isSeeding ? 'Generando...' : 'Insertar 100 Unidades'}
          </button>
        </div>
      </div>
      <pre className="bg-zinc-50 p-4 rounded-xl text-sm font-mono text-zinc-700 overflow-auto flex-1 border border-zinc-100">
        <code>{sql}</code>
      </pre>
    </div>
  );
};

