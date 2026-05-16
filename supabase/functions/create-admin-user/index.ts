import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Get the admin client (using Service Role Key)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Server misconfiguration: Missing Supabase URL or Service Role Key')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 2. Get the auth header to verify the caller
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    // 3. Verify the caller is an authenticated user
    const supabaseClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: userData, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !userData?.user) {
      throw new Error('Unauthorized')
    }

    // Check if the caller is a super admin.
    const { data: adminCheck, error: adminError } = await supabaseAdmin
      .from('admin_users')
      .select('id, is_super_admin')
      .eq('id', userData.user.id)
      .single()

    if (adminError || !adminCheck) {
      throw new Error('Forbidden: Only admins can create new admins')
    }

    if (!adminCheck.is_super_admin) {
      throw new Error('Forbidden: Only super admins can create new admins')
    }

    // 4. Extract new user info
    const { email, password } = await req.json()
    const normalizedEmail = email?.toString().trim().toLowerCase()
    const normalizedPassword = password?.toString()

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error('Email and password are required')
    }

    if (normalizedPassword.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // 5. Create user in Supabase Auth
    const { data: authData, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
      email: normalizedEmail,
      password: normalizedPassword,
      email_confirm: true,
    })

    if (createAuthError) {
      throw createAuthError
    }

    const newUserId = authData.user.id

    // 6. Insert into admin_users table
    const { error: insertError } = await supabaseAdmin
      .from('admin_users')
      .insert({
        id: newUserId,
        email: normalizedEmail,
      })

    if (insertError) {
      // Rollback auth user creation if inserting into admin_users fails
      await supabaseAdmin.auth.admin.deleteUser(newUserId)
      throw new Error(`Failed to insert into admin_users: ${insertError.message}`)
    }

    return new Response(JSON.stringify({ success: true, user: authData.user }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error: any) {
    console.error('Error creating admin user:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
