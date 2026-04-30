import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client with Service Role Key for bypassing RLS securely on the server
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { customer, cartItems, totalAmount } = await req.json()

    if (!customer || !cartItems || cartItems.length === 0) {
      throw new Error('Customer info and cart items are required')
    }

    // 1. Verify Prices Server-Side
    // We fetch the authoritative prices from the database to ensure the frontend payload
    // hasn't been manipulated by a malicious user.
    const serviceIds = cartItems.map((item: any) => item.id).filter(Boolean);

    const { data: dbServices, error: fetchError } = await supabaseClient
      .from('services')
      .select('id, price, is_quote_only')
      .in('id', serviceIds);

    if (fetchError) {
      throw new Error(`Failed to verify service prices: ${fetchError.message}`);
    }

    // Calculate total and prepare order items
    let finalTotal = 0;
    const validatedItems = cartItems.map((item: any) => {
      const dbService = dbServices?.find(s => s.id === item.id);
      
      if (dbService?.is_quote_only) {
        throw new Error(`Service "${item.title}" is quote-only and cannot be purchased directly.`);
      }
      
      // If the service is found in the DB, use its authoritative price.
      // If the price is null (e.g. Project Management), or not found, it defaults to 0.
      const unitPrice = dbService?.price ? Number(dbService.price) : 0;
      const qty = item.qty ?? 1;
      const lineTotal = unitPrice * qty;
      
      finalTotal += lineTotal;

      return {
        service_id: item.id ?? null,
        description: item.title,
        qty: qty,
        unit_price: unitPrice,
        line_total: lineTotal,
      };
    });

    const orderNumber = `CLC-ORD-${Date.now()}`

    // 2. Create the Order
    const orderPayload = {
      order_number: orderNumber,
      customer_name: customer.full_name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      whatsapp_number: customer.whatsapp_number,
      status: "PENDING_PAYMENT",
      total_amount: finalTotal,
      currency: "USD",
      is_test: true
    };

    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert(orderPayload)
      .select('id')
      .single()

    if (orderError) throw new Error(`Failed to create order: ${orderError.message}`)
    const orderId = orderData.id

    // 3. Create Order Items
    const itemsToInsert = validatedItems.map(item => ({
      ...item,
      order_id: orderId
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(itemsToInsert)

    if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`)

    // 4. Create Pending Payment
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        order_id: orderId,
        status: 'PENDING',
        gateway: 'Mock Paynow',
        gateway_reference: `MOCK-${Date.now()}`,
        amount: finalTotal,
        currency: "USD",
        is_test: true
      })
      .select('id')
      .single()

    if (paymentError) throw new Error(`Failed to create payment: ${paymentError.message}`)
    const paymentId = paymentData.id

    // 5. Generate Simulation URLs (or REAL Paynow URLs)
    // IMPORTANT: If this were the real Paynow API, you would make an HTTP request to Paynow here
    // e.g., paynow.sendMobile() and use the returned browserurl and pollurl.
    const pollUrl = `/mock-paynow/poll/${paymentId}`;
    const browserUrl = `/mock-payment/${orderId}/${paymentId}`;

    const { error: updateError } = await supabaseClient
      .from('payments')
      .update({
        paynow_poll_url: pollUrl,
        paynow_browser_url: browserUrl
      })
      .eq('id', paymentId)

    if (updateError) throw new Error(`Failed to update payment URLs: ${updateError.message}`)

    return new Response(
      JSON.stringify({ 
        orderId, 
        paymentId, 
        orderNumber,
        browserUrl,
        pollUrl
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error creating checkout:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
