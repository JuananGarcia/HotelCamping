/**
 * Stripe Checkout Session Flow
 * 
 * Generates a checkout session and handles the success redirect
 * to insert the booking into the database.
 */

import Stripe from 'stripe';

// Initialize Stripe (Server-side only)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-02-25.clover', // Latest API version
});

interface BookingRequest {
  unitId: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}

export async function createCheckoutSession(booking: BookingRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: booking.guestEmail,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Stay at Unit ${booking.unitId}`,
              description: `Check-in: ${booking.checkIn} | Check-out: ${booking.checkOut}`,
            },
            unit_amount: Math.round(booking.totalPrice * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.APP_URL}/booking/success?session_id={CHECKOUT_SESSION_ID}&unit_id=${booking.unitId}&check_in=${booking.checkIn}&check_out=${booking.checkOut}`,
      cancel_url: `${process.env.APP_URL}/booking/cancel`,
      metadata: {
        unitId: booking.unitId,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guestName: booking.guestName,
      },
    });

    return { url: session.url };
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    throw new Error('Could not create checkout session');
  }
}

/**
 * Webhook Handler (Server-side)
 * Listens for 'checkout.session.completed' to confirm payment and update DB.
 */
export async function handleStripeWebhook(event: Stripe.Event, supabase: any) {
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // 1. Extract metadata
    const { unitId, checkIn, checkOut, guestName } = session.metadata!;
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

    // 2. Insert booking into Supabase
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        unit_id: unitId,
        guest_name: guestName || session.customer_details?.name || 'Guest',
        check_in: checkIn,
        check_out: checkOut,
        total_price: amountTotal,
        payment_status: 'paid',
        ota_source: 'web',
      })
      .select()
      .single();

    if (bookingError) throw bookingError;

    // 3. Update unit status to 'booked' in availability calendar
    const dates = getDatesBetween(new Date(checkIn), new Date(checkOut));
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

    return { success: true, bookingId: booking.id };
  }

  return { success: false, message: 'Unhandled event type' };
}

function getDatesBetween(startDate: Date, endDate: Date): Date[] {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate < endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
