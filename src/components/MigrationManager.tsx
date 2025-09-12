import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { migrationService } from '@/lib/migrationService';
import { CheckCircle, Database } from 'lucide-react';

const MigrationManager = () => {
  const [verification, setVerification] = useState<any>(null);
  const { toast } = useToast();

  const handleVerification = async () => {
    try {
      const verify = await migrationService.verifyMigration();
      setVerification(verify);
      
      toast({
        title: "Verification Complete",
        description: `Local: ${verify.localCount}, Supabase: ${verify.supabaseCount}`,
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Could not verify migration",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Migration Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">✅ Migration Complete!</h4>
          <p className="text-sm text-green-700 mb-3">
            Your data has been successfully migrated to Supabase. Your website now uses Supabase as the primary database.
          </p>
          <ul className="text-sm text-green-700 space-y-1">
            <li>✅ All trips are stored in Supabase</li>
            <li>✅ Create/Edit/Delete operations use Supabase</li>
            <li>✅ No more local storage dependency</li>
            <li>✅ Data is persistent and backed up</li>
          </ul>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={handleVerification} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Verify Data Count
          </Button>
        </div>

        {verification && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Data Count:</h4>
            <p className="text-sm text-blue-700">
              Local Storage: {verification.localCount} trips
            </p>
            <p className="text-sm text-blue-700">
              Supabase: {verification.supabaseCount} trips
            </p>
            <p className="text-sm font-medium">
              {verification.matches ? '✅ Data synced!' : '❌ Data mismatch'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MigrationManager;
