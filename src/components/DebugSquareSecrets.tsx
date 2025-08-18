// Debug component to test Square secrets directly
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
export const DebugSquareSecrets = () => {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const testSecrets = async () => {
    setLoading(true);
    try {
      console.log('🔍 Testing Square secrets...');
      const {
        data,
        error
      } = await supabase.functions.invoke('test-secrets');
      console.log('Secret test result:', {
        data,
        error
      });
      setResult({
        data,
        error
      });
    } catch (err) {
      console.error('Error testing secrets:', err);
      setResult({
        error: err
      });
    } finally {
      setLoading(false);
    }
  };
  const testSquareConnection = async () => {
    setLoading(true);
    try {
      console.log('🔍 Testing Square connection...');
      const {
        data,
        error
      } = await supabase.functions.invoke('square-payments', {
        body: {
          action: 'test_connection'
        }
      });
      console.log('Square connection test result:', {
        data,
        error
      });
      setResult({
        connectionTest: {
          data,
          error
        }
      });
    } catch (err) {
      console.error('Error testing Square connection:', err);
      setResult({
        connectionTest: {
          error: err
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Square Debug Tools</h3>
      
      <div className="flex gap-2">
        <button 
          onClick={testSecrets}
          disabled={loading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Secrets'}
        </button>
        
        <button 
          onClick={testSquareConnection}
          disabled={loading}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>
      </div>

      {result && (
        <div className="mt-4 p-3 bg-muted rounded">
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
export default DebugSquareSecrets;