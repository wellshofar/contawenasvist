
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )
    
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      throw new Error('Error getting user' + (userError ? ': ' + userError.message : ''))
    }
    
    // Create a Supabase client with service role key for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Check if avatar_url column exists
    const { data: columnCheck, error: columnCheckError } = await supabaseAdmin.rpc(
      'column_exists',
      { table_name: 'profiles', column_name: 'avatar_url' }
    )
    
    if (columnCheckError) {
      // Try to create the column_exists function if it doesn't exist
      await supabaseAdmin.rpc('create_column_exists_function')
    }
    
    // Check again after creating the function
    const { data: columnExists } = await supabaseAdmin.rpc(
      'column_exists',
      { table_name: 'profiles', column_name: 'avatar_url' }
    )
    
    if (!columnExists) {
      // Create avatar_url column if it doesn't exist
      const { error: alterTableError } = await supabaseAdmin.rpc(
        'add_avatar_url_column'
      )
      
      if (alterTableError) {
        throw new Error('Error adding avatar_url column: ' + alterTableError.message)
      }
      
      // Create helper functions for safely getting and updating avatar_url
      await supabaseAdmin.rpc('create_avatar_url_helper_functions')
    }
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    )
  }
})
