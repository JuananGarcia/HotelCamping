import React, { useState, useMemo, useEffect } from 'react';
import { 
  format, 
  addDays, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameDay, 
  isWithinInterval,
  parseISO,
  differenceInDays
} from 'date-fns';
import { cn } from '../utils/cn';
import { ChevronLeft, ChevronRight, Home, Tent } from 'lucide-react';

// --- MOCK DATA GENERATION ---
type UnitType = 'cabin' | 'caravan';
type UnitStatus = 'available' | 'dirty' | 'maintenance';

interface Unit {
  id: string;
  name: string;
  type: UnitType;
  status: UnitStatus;
}

interface Booking {
  id: string;
  unitId: string;
  guestName: string;
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'pending';
  source: 'web' | 'booking' | 'expedia';
}

const generateMockData = () => {
  const units: Unit[] = Array.from({ length: 100 }).map((_, i) => ({
    id: `u-${i + 1}`,
    name: i < 40 ? `Cabin ${i + 1}` : `Caravan ${i - 39}`,
    type: i < 40 ? 'cabin' : 'caravan',
    status: Math.random() > 0.9 ? 'dirty' : Math.random() > 0.95 ? 'maintenance' : 'available',
  }));

  const today = new Date();
  const start = startOfMonth(today);
  
  const bookings: Booking[] = [];
  units.forEach(unit => {
    // Generate 1-3 random bookings per unit for the month
    const numBookings = Math.floor(Math.random() * 3) + 1;
    let currentStart = new Date(start);
    
    for (let i = 0; i < numBookings; i++) {
      const offset = Math.floor(Math.random() * 10);
      const duration = Math.floor(Math.random() * 7) + 1; // 1 to 7 days
      
      const checkIn = addDays(currentStart, offset);
      const checkOut = addDays(checkIn, duration);
      
      bookings.push({
        id: `b-${unit.id}-${i}`,
        unitId: unit.id,
        guestName: `Guest ${Math.floor(Math.random() * 1000)}`,
        checkIn,
        checkOut,
        status: Math.random() > 0.2 ? 'confirmed' : 'pending',
        source: ['web', 'booking', 'expedia'][Math.floor(Math.random() * 3)] as any,
      });
      
      currentStart = addDays(checkOut, 2); // Gap between bookings
    }
  });

  return { units, bookings };
};

const { units: initialUnits, bookings: initialBookings } = generateMockData();

// --- COMPONENT ---

export const TimelineCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [units] = useState<Unit[]>(initialUnits);
  const [bookings] = useState<Booking[]>(initialBookings);

  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(addDays(startOfMonth(currentDate), -1));
  const handleNextMonth = () => setCurrentDate(addDays(endOfMonth(currentDate), 1));

  // Helper to find booking for a specific unit and date
  const getBookingForDate = (unitId: string, date: Date) => {
    return bookings.find(b => 
      b.unitId === unitId && 
      (isSameDay(date, b.checkIn) || (date > b.checkIn && date < b.checkOut))
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-zinc-50/50">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-zinc-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center gap-1 bg-white border border-zinc-200 rounded-lg p-1 shadow-sm">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-zinc-100 rounded-md transition-colors">
              <ChevronLeft className="w-4 h-4 text-zinc-600" />
            </button>
            <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-100 rounded-md transition-colors">
              Today
            </button>
            <button onClick={handleNextMonth} className="p-1 hover:bg-zinc-100 rounded-md transition-colors">
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
            <span className="text-zinc-600">Web</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-zinc-600">Booking.com</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span className="text-zinc-600">Expedia</span>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 overflow-auto relative">
        <div className="inline-block min-w-full">
          {/* Days Header Row */}
          <div className="flex sticky top-0 z-20 bg-white border-b border-zinc-200 shadow-sm">
            <div className="w-48 shrink-0 p-3 font-medium text-sm text-zinc-500 border-r border-zinc-200 bg-zinc-50 sticky left-0 z-30">
              Unit
            </div>
            <div className="flex">
              {daysInMonth.map((day, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "w-12 shrink-0 flex flex-col items-center justify-center py-2 border-r border-zinc-100 text-xs",
                    isSameDay(day, new Date()) ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-zinc-500"
                  )}
                >
                  <span>{format(day, 'EEE')}</span>
                  <span className={cn(
                    "text-sm mt-0.5",
                    isSameDay(day, new Date()) ? "text-indigo-700" : "text-zinc-900"
                  )}>
                    {format(day, 'd')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Units Rows */}
          <div className="relative">
            {units.map((unit) => (
              <div key={unit.id} className="flex group hover:bg-zinc-50/50 transition-colors border-b border-zinc-100">
                {/* Unit Info Sticky Column */}
                <div className="w-48 shrink-0 p-3 flex items-center gap-3 border-r border-zinc-200 bg-white group-hover:bg-zinc-50/50 sticky left-0 z-10">
                  <div className={cn(
                    "p-1.5 rounded-md",
                    unit.type === 'cabin' ? "bg-orange-100 text-orange-700" : "bg-teal-100 text-teal-700"
                  )}>
                    {unit.type === 'cabin' ? <Home className="w-4 h-4" /> : <Tent className="w-4 h-4" />}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-medium text-zinc-900 truncate">{unit.name}</span>
                    <span className="text-xs text-zinc-500 capitalize">{unit.type}</span>
                  </div>
                </div>

                {/* Days Cells */}
                <div className="flex relative">
                  {daysInMonth.map((day, i) => {
                    const booking = getBookingForDate(unit.id, day);
                    const isStart = booking && isSameDay(day, booking.checkIn);
                    const isEnd = booking && isSameDay(day, booking.checkOut);
                    const isMiddle = booking && !isStart && !isEnd;

                    return (
                      <div 
                        key={i} 
                        className={cn(
                          "w-12 shrink-0 border-r border-zinc-100 relative h-14",
                          isSameDay(day, new Date()) && "bg-indigo-50/30"
                        )}
                      >
                        {/* Render Booking Block */}
                        {booking && (isStart || isMiddle) && (
                          <div 
                            className={cn(
                              "absolute top-2 bottom-2 left-0 right-0 z-10 flex items-center px-2 overflow-hidden shadow-sm",
                              isStart && "rounded-l-md ml-1",
                              isEnd && "rounded-r-md mr-1",
                              !isStart && !isEnd && "border-y",
                              booking.source === 'web' ? "bg-emerald-500 border-emerald-600 text-white" :
                              booking.source === 'booking' ? "bg-blue-500 border-blue-600 text-white" :
                              "bg-amber-500 border-amber-600 text-white"
                            )}
                            title={`${booking.guestName} (${format(booking.checkIn, 'MMM d')} - ${format(booking.checkOut, 'MMM d')})`}
                          >
                            {isStart && (
                              <span className="text-xs font-medium truncate">
                                {booking.guestName}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
