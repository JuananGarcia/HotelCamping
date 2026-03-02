import { supabase } from '../lib/supabase';

/**
 * Obtiene todas las unidades que están disponibles (no ocupadas) 
 * en un rango de fechas específico.
 * 
 * @param startDate Fecha de check-in (YYYY-MM-DD)
 * @param endDate Fecha de check-out (YYYY-MM-DD)
 * @returns Lista de unidades disponibles
 */
export async function getAvailableUnits(startDate: string, endDate: string) {
  try {
    // 1. Consultar reservas que se solapan con el rango de fechas solicitado.
    // Condición de solapamiento: (check_in < endDate) AND (check_out > startDate)
    const { data: occupiedBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('unit_id')
      .lt('check_in', endDate)
      .gt('check_out', startDate);

    // Si la tabla bookings no existe (error 42P01) o hay otro error, 
    // asumimos que no hay reservas y continuamos.
    if (bookingsError) {
      console.warn('Aviso: No se pudo consultar la tabla bookings (¿quizás no existe aún?). Mostrando todas las unidades.', bookingsError);
    }

    // Extraer los IDs únicos de las unidades ocupadas
    const occupiedUnitIds = [...new Set(occupiedBookings?.map(b => b.unit_id) || [])];

    // 2. Consultar las unidades que NO están en la lista de ocupadas
    let query = supabase.from('units').select('*');

    if (occupiedUnitIds.length > 0) {
      // Si hay unidades ocupadas, las filtramos usando .not('id', 'in', (...))
      query = query.not('id', 'in', `(${occupiedUnitIds.join(',')})`);
    }

    const { data: availableUnits, error: unitsError } = await query;

    if (unitsError) {
      throw unitsError;
    }

    return availableUnits || [];
    
  } catch (error: any) {
    console.error('Error al obtener unidades disponibles:', error);
    throw new Error(error.message || 'Error al verificar disponibilidad');
  }
}
