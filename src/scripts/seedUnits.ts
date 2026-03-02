import { supabase } from '../lib/supabase';

interface UnitInsert {
  name: string;
  type: string;
  status: string;
  base_price: number;
}

/**
 * Script para insertar 100 unidades de prueba en la base de datos.
 * Genera 40 cabañas y 60 parcelas/caravanas con precios base realistas.
 */
export async function seedUnits() {
  try {
    // 1. Verificar si ya existen unidades para no duplicar
    const { count, error: countError } = await supabase
      .from('units')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    if (count && count > 0) {
      console.log(`Ya existen ${count} unidades en la base de datos. Saltando el seed.`);
      return { success: false, message: 'La base de datos ya contiene unidades.' };
    }

    const unitsToInsert: UnitInsert[] = [];

    // 2. Generar 40 Cabañas (Cabins)
    for (let i = 1; i <= 40; i++) {
      unitsToInsert.push({
        name: `Cabaña ${i}`,
        type: 'cabin',
        status: 'available',
        base_price: 120.00 // Precio base de ejemplo para cabañas
      });
    }

    // 3. Generar 60 Parcelas/Caravanas (Caravans)
    for (let i = 1; i <= 60; i++) {
      unitsToInsert.push({
        name: `Parcela ${i}`,
        type: 'caravan',
        status: 'available',
        base_price: 45.00 // Precio base de ejemplo para parcelas
      });
    }

    console.log(`Insertando ${unitsToInsert.length} unidades...`);

    // 4. Insertar en Supabase
    const { data, error } = await supabase
      .from('units')
      .insert(unitsToInsert)
      .select();

    if (error) throw error;

    console.log('¡Unidades insertadas con éxito!');
    return { success: true, data, message: '100 unidades creadas exitosamente.' };

  } catch (error: any) {
    console.error('Error al insertar unidades:', error);
    return { success: false, error: error.message, message: 'Error al insertar unidades.' };
  }
}
