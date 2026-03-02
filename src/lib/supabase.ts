import { createClient } from '@supabase/supabase-js';

// En Next.js, las variables expuestas al cliente deben empezar con NEXT_PUBLIC_
// Como este entorno de preview usa Vite (donde process.env no existe en el navegador),
// usamos directamente los valores por defecto que proporcionaste para evitar errores de compilación.
// En tu proyecto Next.js, puedes usar process.env.NEXT_PUBLIC_SUPABASE_URL

const supabaseUrl = 'https://hhimdjpfbgvxdzfeetsj.supabase.co';
const supabaseKey = 'sb_publishable_MUynkxszZRFy4nRCIY2Eeg_WB58oWWP';

/**
 * Cliente de Supabase estándar.
 * 
 * NOTA PARA NEXT.JS 14 (App Router):
 * Si necesitas manejar autenticación (cookies) de forma segura dentro de 
 * Server Components o Server Actions, es recomendable usar el paquete `@supabase/ssr`
 * en lugar de un único cliente global, ya que los Server Components requieren
 * leer y escribir cookies dinámicamente.
 * 
 * Sin embargo, para consultas públicas o llamadas desde el cliente/API Routes,
 * este cliente funciona perfectamente.
 */
export const supabase = createClient(supabaseUrl, supabaseKey);
