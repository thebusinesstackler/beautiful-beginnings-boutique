import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { createTestOrder, verifyOrderItems } from '@/utils/testOrderCreation';
import { TestTube, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface TestOrderButtonProps {
  onOrderCreated?: (orderId: string) => void;
}

export const TestOrderButton: React.FC<TestOrderButtonProps> = ({ onOrderCreated }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  const handleCreateTestOrder = async () => {
    setIsCreating(true);
    try {
      const result = await createTestOrder();
      
      if (result.success && result.orderId) {
        setLastOrderId(result.orderId);
        
        // Verify the order items were created
        const verification = await verifyOrderItems(result.orderId);
        
        toast({
          title: "Test Order Created!",
          description: `Order ${result.orderId} created with ${verification.itemCount} items`,
        });

        // Call the callback if provided
        onOrderCreated?.(result.orderId);
        
      } else {
        toast({
          title: "Test Order Failed",
          description: result.message || "Failed to create test order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating test order:', error);
      toast({
        title: "Test Order Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleVerifyLastOrder = async () => {
    if (!lastOrderId) return;
    
    try {
      const verification = await verifyOrderItems(lastOrderId);
      
      if (verification.success) {
        toast({
          title: "Order Verification",
          description: `Order ${lastOrderId} has ${verification.itemCount} items`,
        });
      } else {
        toast({
          title: "Verification Failed",
          description: verification.error || "Failed to verify order",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <Button
        onClick={handleCreateTestOrder}
        disabled={isCreating}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        {isCreating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <TestTube className="h-4 w-4" />
        )}
        {isCreating ? 'Creating...' : 'Create Test Order'}
      </Button>
      
      {lastOrderId && (
        <Button
          onClick={handleVerifyLastOrder}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground"
        >
          <CheckCircle className="h-4 w-4" />
          Verify Last Order
        </Button>
      )}
    </div>
  );
};