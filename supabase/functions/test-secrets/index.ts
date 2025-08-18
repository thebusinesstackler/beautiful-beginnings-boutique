// Simple secret testing function to isolate the SQUARE_LOCATION_ID issue
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  console.log('🔍 Testing all Square secrets...')
  
  // Get all environment variables
  const allEnv = Deno.env.toObject()
  const allKeys = Object.keys(allEnv)
  const squareKeys = allKeys.filter(key => key.includes('SQUARE'))
  
  console.log('📋 All environment keys count:', allKeys.length)
  console.log('📋 Square-related keys found:', squareKeys)
  
  // Test each Square secret individually
  const secrets = {
    SQUARE_APPLICATION_ID: Deno.env.get('SQUARE_APPLICATION_ID'),
    SQUARE_ACCESS_TOKEN: Deno.env.get('SQUARE_ACCESS_TOKEN'),
    SQUARE_LOCATION_ID: Deno.env.get('SQUARE_LOCATION_ID'),
    SQUARE_ENVIRONMENT: Deno.env.get('SQUARE_ENVIRONMENT'),
  }
  
  const results: any = {}
  
  for (const [key, value] of Object.entries(secrets)) {
    console.log(`\n🔍 Testing ${key}:`)
    console.log(`  Raw type: ${typeof value}`)
    console.log(`  Is undefined: ${value === undefined}`)
    console.log(`  Is null: ${value === null}`)
    console.log(`  Is empty string: ${value === ''}`)
    console.log(`  Length: ${value?.length || 0}`)
    console.log(`  Trimmed length: ${value?.trim?.()?.length || 0}`)
    console.log(`  First 8 chars: ${value?.substring(0, 8) || 'N/A'}`)
    
    results[key] = {
      exists: value !== undefined && value !== null,
      isEmpty: !value || value.trim().length === 0,
      length: value?.length || 0,
      trimmedLength: value?.trim?.()?.length || 0,
      type: typeof value,
      sample: value?.substring(0, 8) || 'N/A'
    }
  }
  
  console.log('📊 Final results:', results)
  
  return new Response(JSON.stringify({
    success: true,
    timestamp: new Date().toISOString(),
    allEnvironmentKeyCount: allKeys.length,
    squareKeysFound: squareKeys,
    secretResults: results,
    recommendation: results.SQUARE_LOCATION_ID.isEmpty ? 
      'SQUARE_LOCATION_ID is missing or empty - check Supabase Edge Functions secrets dashboard' :
      'All Square secrets appear to be present'
  }, null, 2), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})