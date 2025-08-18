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
  return;
};
export default DebugSquareSecrets;