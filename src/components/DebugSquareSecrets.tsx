// Debug component to test Square secrets directly
import React, { useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

export const DebugSquareSecrets = () => {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testSecrets = async () => {
    setLoading(true)
    try {
      console.log('🔍 Testing Square secrets...')
      const { data, error } = await supabase.functions.invoke('test-secrets')
      
      console.log('Secret test result:', { data, error })
      setResult({ data, error })
    } catch (err) {
      console.error('Error testing secrets:', err)
      setResult({ error: err })
    } finally {
      setLoading(false)
    }
  }

  const testSquareConnection = async () => {
    setLoading(true)
    try {
      console.log('🔍 Testing Square connection...')
      const { data, error } = await supabase.functions.invoke('square-payments', {
        body: { action: 'test_connection' }
      })
      
      console.log('Square connection test result:', { data, error })
      setResult({ connectionTest: { data, error } })
    } catch (err) {
      console.error('Error testing Square connection:', err)
      setResult({ connectionTest: { error: err } })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 mb-4">
      <h3 className="text-lg font-semibold mb-3">Square Secrets Debug</h3>
      
      <div className="space-x-2 mb-4">
        <button
          onClick={testSecrets}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test All Secrets'}
        </button>
        
        <button
          onClick={testSquareConnection}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Square Connection'}
        </button>
      </div>

      {result && (
        <div className="bg-white p-3 rounded border">
          <pre className="text-xs overflow-auto max-h-96">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export default DebugSquareSecrets