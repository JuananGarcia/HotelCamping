/**
 * iCal Sync Logic for Booking.com / Expedia
 * 
 * This function processes an iCal feed and blocks dates in the database
 * to prevent overbooking.
 */

// Mock Supabase client type
type SupabaseClient = any;

interface ICalEvent {
  uid: string;
  start: Date;
  end: Date;
  summary: string;
}

export async function syncICalFeed(
  supabase: SupabaseClient,
  unitId: string,
  icalUrl: string,
  otaSource: 'booking' | 'expedia'
): Promise<{ success: boolean; eventsProcessed: number; error?: string }> {
  try {
    // 1. Fetch iCal feed
    const response = await fetch(icalUrl);
    if (!response.ok) throw new Error('Failed to fetch iCal feed');
    const icalData = await response.text();

    // 2. Parse iCal data (using a hypothetical parser or regex for simplicity)
    const events = parseICal(icalData);

    // 3. Begin transaction/batch insert to block dates
    let processed = 0;
    for (const event of events) {
      // Check if this external booking already exists (using UID as reference)
      const { data: existing } = await supabase
        .from('bookings')
        .select('id')
        .eq('external_uid', event.uid)
        .single();

      if (!existing) {
        // Insert new booking block
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert({
            unit_id: unitId,
            guest_name: event.summary || `External ${otaSource} Booking`,
            check_in: event.start.toISOString().split('T')[0],
            check_out: event.end.toISOString().split('T')[0],
            total_price: 0, // Usually not provided in iCal
            payment_status: 'paid', // Assume paid via OTA
            ota_source: otaSource,
            external_uid: event.uid,
          })
          .select()
          .single();

        if (bookingError) throw bookingError;

        // Update availability calendar
        const dates = getDatesBetween(event.start, event.end);
        const availabilityUpdates = dates.map(date => ({
          date: date.toISOString().split('T')[0],
          unit_id: unitId,
          status: 'booked',
          booking_id: booking.id,
        }));

        const { error: availError } = await supabase
          .from('availability_calendar')
          .upsert(availabilityUpdates, { onConflict: 'date, unit_id' });

        if (availError) throw availError;
        processed++;
      }
    }

    return { success: true, eventsProcessed: processed };
  } catch (error: any) {
    console.error('iCal Sync Error:', error);
    return { success: false, eventsProcessed: 0, error: error.message };
  }
}

// Helper functions
function parseICal(data: string): ICalEvent[] {
  // Simplified parser for demonstration
  const events: ICalEvent[] = [];
  const lines = data.split('\\n');
  let currentEvent: Partial<ICalEvent> | null = null;

  for (const line of lines) {
    if (line.startsWith('BEGIN:VEVENT')) currentEvent = {};
    else if (line.startsWith('END:VEVENT') && currentEvent) {
      if (currentEvent.start && currentEvent.end && currentEvent.uid) {
        events.push(currentEvent as ICalEvent);
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith('UID:')) currentEvent.uid = line.substring(4).trim();
      else if (line.startsWith('DTSTART;VALUE=DATE:')) {
        const dateStr = line.substring(19).trim();
        currentEvent.start = new Date(`${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}`);
      } else if (line.startsWith('DTEND;VALUE=DATE:')) {
        const dateStr = line.substring(17).trim();
        currentEvent.end = new Date(`${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}`);
      } else if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.substring(8).trim();
      }
    }
  }
  return events;
}

function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  // Do not include checkout date as a blocked night
  while (currentDate < endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
