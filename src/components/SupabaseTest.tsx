import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SupabaseTest = () => {
  const [status, setStatus] = useState<'testing' | 'success' | 'error'>('testing');
  const [message, setMessage] = useState('Testing connection...');
  const [columns, setColumns] = useState<string[]>([]);

  const getTableSchema = async () => {
    try {
      // Query the information schema to get column names
      const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'trips' });
      
      if (error) {
        // Fallback: try a simple query to see what happens
        console.log('RPC failed, trying direct query...');
        const { data: testData, error: testError } = await supabase
          .from('trips')
          .select('*')
          .limit(0); // Get no rows, just schema
        
        if (testError) {
          setMessage(`❌ Schema error: ${testError.message}`);
          return;
        }
      }
      
      setMessage('✅ Connected! Checking table structure...');
      setStatus('success');
    } catch (err) {
      setMessage(`❌ Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const addMinimalTrip = async () => {
    try {
      // Try with just title and category (most basic columns)
      const { data, error } = await supabase
        .from('trips')
        .insert([
          {
            title: 'Test Trip',
            category: 'Adventure'
          }
        ])
        .select();
      
      if (error) {
        setMessage(`❌ Insert error: ${error.message}`);
      } else {
        setMessage(`✅ Added test trip! Found columns: ${Object.keys(data[0]).join(', ')}`);
        setColumns(Object.keys(data[0]));
      }
    } catch (err) {
      setMessage(`❌ Insert failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    getTableSchema();
  }, []);

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Supabase Table Schema Check</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className={`p-3 rounded ${
            status === 'testing' ? 'bg-blue-50 text-blue-700' :
            status === 'success' ? 'bg-green-50 text-green-700' :
            'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
          
          {columns.length > 0 && (
            <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
              <strong>Available columns:</strong> {columns.join(', ')}
            </div>
          )}
          
          <Button onClick={addMinimalTrip} className="w-full" variant="outline">
            Add Test Trip (Minimal Columns)
          </Button>
          
          <Button onClick={getTableSchema} className="w-full">
            Refresh Test
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseTest;
