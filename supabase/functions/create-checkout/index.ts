import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MAX_CART_ITEMS = 50
const CHECKOUT_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const MAX_CHECKOUTS_PER_EMAIL_WINDOW = 5

// ---------------------------------------------------------------------------
// PaymentProvider interface
// ---------------------------------------------------------------------------
// To switch to real Paynow later:
//   1. Implement RealPaynowProvider below (or import from a shared file)
//   2. Set env var PAYMENT_PROVIDER=paynow
//   3. Done – zero other changes needed.
// ---------------------------------------------------------------------------

interface CreatePaymentInput {
  orderId: string
  amount: number
  currency: string
  customerEmail: string
  customerName: string
}

interface CreatePaymentResult {
  gateway: string
  gatewayReference: string
  browserUrl: string
  pollUrl: string
  simulationToken: string | null
}

// ---------------------------------------------------------------------------
// MockPaynowProvider  (current implementation)
// ---------------------------------------------------------------------------
class MockPaynowProvider {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const simulationToken = crypto.randomUUID()
    const gatewayReference = `MOCK-${Date.now()}`
    const browserUrl = `/mock-payment/${input.orderId}/PAYMENT_ID_PLACEHOLDER`
    const pollUrl = `/mock-paynow/poll/PAYMENT_ID_PLACEHOLDER`

    return {
      gateway: 'Mock Paynow',
      gatewayReference,
      browserUrl,
      pollUrl,
      simulationToken,
    }
  }
}

// ---------------------------------------------------------------------------
// RealPaynowProvider  (swap in when ready – see notes in comments)
// ---------------------------------------------------------------------------
// class RealPaynowProvider {
//   async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
//     // POST to https://www.paynow.co.zw/interface/initiatetransaction
//     // with your integration ID/key, amount, reference, returnurl, resulturl
//     // Parse the response for browserurl, pollurl, status
//     // Return { gateway: 'Paynow', gatewayReference, browserUrl, pollUrl, simulationToken: null }
//   }
// }

// ---------------------------------------------------------------------------
// Factory: picks provider from env var (default: mock)
// ---------------------------------------------------------------------------
function getProvider() {
  const providerEnv = Deno.env.get('PAYMENT_PROVIDER') ?? 'mock'
  if (providerEnv === 'paynow') {
    // return new RealPaynowProvider()
    throw new Error('RealPaynowProvider not yet implemented. Set PAYMENT_PROVIDER=mock.')
  }
  return new MockPaynowProvider()
}

// ---------------------------------------------------------------------------
// Edge Function handler
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

    const { customer, cartItems } = await req.json()

    // ------------------------------------------------------------------
    // 1. Strict customer schema validation
    // ------------------------------------------------------------------
    const requiredCustomerFields: Array<keyof typeof customer> = ['full_name', 'email', 'phone']
    for (const field of requiredCustomerFields) {
      if (!customer?.[field]?.toString().trim()) {
        throw new Error(`Missing required customer field: ${field}`)
      }
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      throw new Error('Cart is empty')
    }

    if (cartItems.length > MAX_CART_ITEMS) {
      throw new Error(`Cart cannot contain more than ${MAX_CART_ITEMS} items`)
    }

    const normalizedCustomer = {
      full_name: customer.full_name.trim(),
      email: customer.email.trim().toLowerCase(),
      phone: customer.phone.trim(),
      whatsapp_number: customer.whatsapp_number?.trim() ?? null,
    }

    const rateLimitSince = new Date(Date.now() - CHECKOUT_RATE_LIMIT_WINDOW_MS).toISOString()
    const { count: recentCheckoutCount, error: rateLimitError } = await supabaseClient
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('customer_email', normalizedCustomer.email)
      .gte('created_at', rateLimitSince)

    if (rateLimitError) {
      throw new Error(`Failed to verify checkout rate limit: ${rateLimitError.message}`)
    }

    if ((recentCheckoutCount ?? 0) >= MAX_CHECKOUTS_PER_EMAIL_WINDOW) {
      return new Response(
        JSON.stringify({ error: 'Too many checkout attempts. Please wait a few minutes and try again.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 429 }
      )
    }

    // ------------------------------------------------------------------
    // 2. Server-side price and quantity validation
    // ------------------------------------------------------------------
    const serviceIds = cartItems
      .map((item: any) => item.id)
      .filter(Boolean)

    const { data: dbServices, error: fetchError } = await supabaseClient
      .from('services')
      .select('id, price, is_quote_only, title')
      .in('id', serviceIds)

    if (fetchError) {
      throw new Error(`Failed to verify service prices: ${fetchError.message}`)
    }

    let finalTotal = 0
    const validatedItems = cartItems.map((item: any) => {
      const dbService = dbServices?.find((s) => s.id === item.id)

      // Unknown service ID = hard error (no $0 fallback)
      if (!dbService) {
        throw new Error(
          `Service "${item.id}" not found. Cannot process unknown services.`
        )
      }

      if (dbService.is_quote_only) {
        throw new Error(
          `Service "${dbService.title}" is quote-only and cannot be purchased directly.`
        )
      }

      // Qty validation: must be a positive integer
      const qty = Number(item.qty ?? 1)
      if (!Number.isInteger(qty) || qty < 1) {
        throw new Error(
          `Invalid quantity for "${dbService.title}": must be a positive integer (got ${item.qty})`
        )
      }

      // Use DB-authoritative price
      const unitPrice = dbService.price ? Number(dbService.price) : 0
      const lineTotal = unitPrice * qty
      finalTotal += lineTotal

      return {
        service_id: item.id,
        description: dbService.title ?? item.title,
        qty,
        unit_price: unitPrice,
        line_total: lineTotal,
      }
    })

    // ------------------------------------------------------------------
    // 3. Create Order
    // ------------------------------------------------------------------
    const orderNumber = `CLC-ORD-${Date.now()}`

    const { data: orderData, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: normalizedCustomer.full_name,
        customer_email: normalizedCustomer.email,
        customer_phone: normalizedCustomer.phone,
        whatsapp_number: normalizedCustomer.whatsapp_number,
        status: 'PENDING_PAYMENT',
        total_amount: finalTotal,
        currency: 'USD',
        is_test: true,
      })
      .select('id')
      .single()

    if (orderError) throw new Error(`Failed to create order: ${orderError.message}`)
    const orderId = orderData.id

    // ------------------------------------------------------------------
    // 4. Create Order Items
    // ------------------------------------------------------------------
    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(validatedItems.map((item) => ({ ...item, order_id: orderId })))

    if (itemsError) throw new Error(`Failed to create order items: ${itemsError.message}`)

    // ------------------------------------------------------------------
    // 5. Pick provider and create payment
    // ------------------------------------------------------------------
    const provider = getProvider()
    const providerResult = await provider.createPayment({
      orderId,
      amount: finalTotal,
      currency: 'USD',
      customerEmail: normalizedCustomer.email,
      customerName: normalizedCustomer.full_name,
    })

    // ------------------------------------------------------------------
    // 6. Persist Payment record
    // ------------------------------------------------------------------
    const { data: paymentData, error: paymentError } = await supabaseClient
      .from('payments')
      .insert({
        order_id: orderId,
        status: 'PENDING',
        gateway: providerResult.gateway,
        gateway_reference: providerResult.gatewayReference,
        amount: finalTotal,
        currency: 'USD',
        is_test: true,
        payment_provider: Deno.env.get('PAYMENT_PROVIDER') ?? 'mock',
        environment: 'test',
        simulation_token: providerResult.simulationToken,
        paynow_poll_url: providerResult.pollUrl,
        paynow_browser_url: providerResult.browserUrl,
      })
      .select('id')
      .single()

    if (paymentError) throw new Error(`Failed to create payment: ${paymentError.message}`)
    const paymentId = paymentData.id

    // Resolve placeholder URLs now that we have the real paymentId
    const browserUrl = providerResult.browserUrl.replace('PAYMENT_ID_PLACEHOLDER', paymentId)
    const pollUrl = providerResult.pollUrl.replace('PAYMENT_ID_PLACEHOLDER', paymentId)

    await supabaseClient
      .from('payments')
      .update({ paynow_poll_url: pollUrl, paynow_browser_url: browserUrl })
      .eq('id', paymentId)

    // ------------------------------------------------------------------
    // 7. Return result to client
    // ------------------------------------------------------------------
    return new Response(
      JSON.stringify({
        orderId,
        paymentId,
        orderNumber,
        browserUrl,
        pollUrl,
        // simulationToken is returned ONLY for the mock provider.
        // For real Paynow, this will be null.
        simulationToken: providerResult.simulationToken,
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
