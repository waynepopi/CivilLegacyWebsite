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
    // Initialize Supabase client with Service Role Key for bypass RLS
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { orderId, paymentId, status } = await req.json()

    if (!orderId || !paymentId) {
      throw new Error('orderId and paymentId are required')
    }

    if (status === "PAID") {
      // 1. Update Payment
      const { error: payError } = await supabaseClient
        .from('payments')
        .update({ 
          status: 'PAID', 
          paid_at: new Date().toISOString() 
        })
        .eq('id', paymentId)

      if (payError) throw payError

      // 2. Update Order
      const { error: orderError } = await supabaseClient
        .from('orders')
        .update({ status: 'PAID' })
        .eq('id', orderId)

      if (orderError) throw orderError

      // 3. Check for existing receipt to prevent duplicates
      const { data: existingReceipt } = await supabaseClient
        .from("receipts")
        .select("id")
        .eq("payment_id", paymentId)
        .maybeSingle()

      if (existingReceipt) {
        return new Response(
          JSON.stringify({ orderId, paymentId, receiptId: existingReceipt.id, status: "PAID" }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // 4. Create Receipt
      const randomPart = Math.floor(100000 + Math.random() * 900000)
      const receiptNumber = `CLC-REC-${randomPart}`

      const { data: receiptData, error: receiptError } = await supabaseClient
        .from('receipts')
        .insert({
          order_id: orderId,
          payment_id: paymentId,
          receipt_number: receiptNumber,
          is_test: true,
        })
        .select('id')
        .single()

      if (receiptError) throw receiptError

      return new Response(
        JSON.stringify({ 
          orderId, 
          paymentId, 
          receiptId: receiptData.id, 
          status: "PAID" 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } else {
      // status === "FAILED" or "EXPIRED"
      const targetStatus = status === "EXPIRED" ? "EXPIRED" : "FAILED"

      // 1. Update Payment
      const { error: payError } = await supabaseClient
        .from('payments')
        .update({ status: targetStatus })
        .eq('id', paymentId)

      if (payError) throw payError

      // 2. Update Order
      const { error: orderError } = await supabaseClient
        .from('orders')
        .update({ status: targetStatus })
        .eq('id', orderId)

      if (orderError) throw orderError

      return new Response(
        JSON.stringify({ orderId, paymentId, status: targetStatus }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Error processing mock payment:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
