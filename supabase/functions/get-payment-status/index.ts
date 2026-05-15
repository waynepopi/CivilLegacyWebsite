import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// ---------------------------------------------------------------------------
// get-payment-status
// ---------------------------------------------------------------------------
// Replaces direct frontend queries to the orders and payments tables.
// Returns only the minimum information needed to render the Payment Status
// page — no customer PII (name, email, phone) is included in the response.
//
// The caller provides an orderId (from the URL / sessionStorage).
// verify_jwt = false so unauthenticated users can check their own order status.
// ---------------------------------------------------------------------------

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Accept orderId from query string or request body
    let orderId: string | null = null
    const url = new URL(req.url)
    orderId = url.searchParams.get('orderId')

    if (!orderId && req.method === 'POST') {
      const body = await req.json().catch(() => ({}))
      orderId = body.orderId ?? null
    }

    if (!orderId) {
      return new Response(
        JSON.stringify({ error: 'orderId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // ------------------------------------------------------------------
    // Fetch order + latest payment (no PII fields selected)
    // ------------------------------------------------------------------
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('id, order_number, status, total_amount, currency, created_at')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return new Response(
        JSON.stringify({ error: 'Order not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    const { data: payments } = await supabaseClient
      .from('payments')
      .select('id, status, amount, currency, gateway, is_test, created_at, paid_at')
      .eq('order_id', orderId)
      .order('created_at', { ascending: false })

    const latestPayment = payments?.[0] ?? null

    // ------------------------------------------------------------------
    // If PAID, also fetch receipt via the safe view (no PII)
    // ------------------------------------------------------------------
    let receipt = null
    if (latestPayment?.status === 'PAID') {
      const { data: receiptData } = await supabaseClient
        .from('public_receipt_verification')
        .select('verification_code, receipt_number, created_at, verification_status, job_status, order_id, amount, payment_status, payment_gateway')
        .eq('order_id', orderId)
        .maybeSingle()

      receipt = receiptData ?? null
    }

    // ------------------------------------------------------------------
    // Also fetch order items (descriptions, no PII)
    // ------------------------------------------------------------------
    const { data: orderItems } = await supabaseClient
      .from('order_items')
      .select('id, description, qty, unit_price, line_total')
      .eq('order_id', orderId)

    return new Response(
      JSON.stringify({
        order: {
          id: order.id,
          orderNumber: order.order_number,
          status: order.status,
          totalAmount: order.total_amount,
          currency: order.currency,
          createdAt: order.created_at,
          items: orderItems ?? [],
        },
        payment: latestPayment,
        receipt,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error fetching payment status:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
