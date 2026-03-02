/**
 * Availability Service
 * 
 * Functions to check unit availability using the optimized availability_calendar
 * and bookings tables in Supabase.
 */

// Mock Supabase client type for TypeScript
type SupabaseClient = any;

interface AvailabilityResult {
  isAvailable: boolean;
  conflictDates?: string[];
  error?: string;
}

/**
 * Checks if a specific unit is available for a given date range.
 * Uses the availability_calendar for fast indexed lookups.
 * 
 * @param supabase - The Supabase client instance
 * @param unitId - The UUID of the cabin or caravan
 * @param checkIn - Check-in date (YYYY-MM-DD)
 * @param checkOut - Check-out date (YYYY-MM-DD)
 */
export async function checkUnitAvailability(
  supabase: SupabaseClient,
  unitId: string,
  checkIn: string,
  checkOut: string
): Promise<AvailabilityResult> {
  try {
    // We check the availability_calendar for any 'booked' or 'blocked' status
    // between the check-in date (inclusive) and check-out date (exclusive).
    // The check-out day is not considered occupied for the incoming night.
    const { data: conflicts, error } = await supabase
      .from('availability_calendar')
      .select('date, status')
      .eq('unit_id', unitId)
      .gte('date', checkIn)
      .lt('date', checkOut)
      .in('status', ['booked', 'blocked']);

    if (error) throw error;

    if (conflicts && conflicts.length > 0) {
      return {
        isAvailable: false,
        conflictDates: conflicts.map((c: any) => c.date),
      };
    }

    // Double-check against the bookings table to ensure absolute consistency
    // Overlap condition: Existing Check-In < Requested Check-Out AND Existing Check-Out > Requested Check-In
    const { data: overlappingBookings, error: bookingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('unit_id', unitId)
      .lt('check_in', checkOut)
      .gt('check_out', checkIn)
      .limit(1);

    if (bookingError) throw bookingError;

    if (overlappingBookings && overlappingBookings.length > 0) {
      return {
        isAvailable: false,
        error: 'Conflict found in bookings table.',
      };
    }

    return { isAvailable: true };
  } catch (error: any) {
    console.error('Error checking unit availability:', error);
    return { isAvailable: false, error: error.message };
  }
}

/**
 * Finds all available units of a specific type for a given date range.
 * 
 * @param supabase - The Supabase client instance
 * @param type - 'cabin' or 'caravan'
 * @param checkIn - Check-in date (YYYY-MM-DD)
 * @param checkOut - Check-out date (YYYY-MM-DD)
 */
export async function findAvailableUnits(
  supabase: SupabaseClient,
  type: 'cabin' | 'caravan',
  checkIn: string,
  checkOut: string
) {
  try {
    // 1. Get all units of the requested type
    const { data: units, error: unitsError } = await supabase
      .from('units')
      .select('id, name, base_price')
      .eq('type', type)
      .in('status', ['available', 'dirty']); // 'dirty' units can be booked for future dates

    if (unitsError) throw unitsError;
    if (!units || units.length === 0) return [];

    const unitIds = units.map((u: any) => u.id);

    // 2. Find which of these units have conflicts in the requested date range
    const { data: conflicts, error: conflictsError } = await supabase
      .from('availability_calendar')
      .select('unit_id')
      .in('unit_id', unitIds)
      .gte('date', checkIn)
      .lt('date', checkOut)
      .in('status', ['booked', 'blocked']);

    if (conflictsError) throw conflictsError;

    // 3. Filter out units with conflicts
    const conflictedUnitIds = new Set(conflicts?.map((c: any) => c.unit_id) || []);
    const availableUnits = units.filter((u: any) => !conflictedUnitIds.has(u.id));

    return availableUnits;
  } catch (error: any) {
    console.error('Error finding available units:', error);
    throw error;
  }
}
