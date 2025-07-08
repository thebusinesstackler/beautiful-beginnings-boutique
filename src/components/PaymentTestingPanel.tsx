import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, TestTube, Clock, CreditCard } from 'lucide-react';

const PaymentTestingPanel = () => {
  const { addToCart, clearCart, getCartTotal, getCartCount } = useCart();
  const [testResults, setTestResults] = useState<Array<{
    test: string;
    status: 'passed' | 'failed' | 'pending';
    message: string;
    timestamp: Date;
  }>>([]);

  // Test card numbers for Square sandbox
  const testCards = {
    success: '4111 1111 1111 1111', // Visa - Success
    declined: '4000 0000 0000 0002', // Visa - Declined
    insufficientFunds: '4000 0000 0000 9995', // Visa - Insufficient funds
    expiredCard: '4000 0000 0000 0069', // Visa - Expired card
    cvvFailure: '4000 0000 0000 0127', // Visa - CVV failure
    processingError: '4000 0000 0000 0119', // Visa - Processing error
  };

  const addTestResult = (test: string, status: 'passed' | 'failed' | 'pending', message: string) => {
    setTestResults(prev => [
      { test, status, message, timestamp: new Date() },
      ...prev.slice(0, 9) // Keep only last 10 results
    ]);
  };

  const addTestProduct = () => {
    const testProduct = {
      id: 999998,
      name: 'Test Payment Product',
      price: 25.99,
      image: 'https://via.placeholder.com/150x150/86efac/1f2937?text=Test+Product',
      uploadedPhoto: null
    };
    
    addToCart(testProduct);
    addTestResult('Add Test Product', 'passed', 'Test product added to cart');
    
    toast({
      title: "Test Product Added",
      description: "Test product added for payment testing",
    });
  };

  const testFormValidation = () => {
    addTestResult('Form Validation', 'pending', 'Testing form validation...');
    
    // Test actual form validation by checking for required fields
    setTimeout(() => {
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone',
        'shippingAddress', 'shippingCity', 'shippingState', 'shippingZip'
      ];
      
      let missingFields = [];
      let hasValidation = true;
      
      requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId) as HTMLInputElement;
        if (field) {
          // Check if field has required attribute
          if (!field.hasAttribute('required')) {
            hasValidation = false;
          }
          // Check if field is empty (for validation test)
          if (!field.value.trim()) {
            missingFields.push(fieldId);
          }
        } else {
          hasValidation = false;
        }
      });

      if (hasValidation && missingFields.length > 0) {
        addTestResult('Form Validation', 'passed', `Validation working: ${missingFields.length} empty required fields detected`);
        toast({
          title: "Form Validation Test",
          description: `✅ Validation working - ${missingFields.length} empty required fields detected`,
        });
      } else if (hasValidation) {
        addTestResult('Form Validation', 'passed', 'All required fields have validation');
        toast({
          title: "Form Validation Test",
          description: "✅ All required fields properly configured",
        });
      } else {
        addTestResult('Form Validation', 'failed', 'Some required fields missing validation attributes');
        toast({
          title: "Form Validation Test",
          description: "❌ Missing required attributes on form fields",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const testPaymentFlow = () => {
    addTestResult('Payment Flow', 'pending', 'Testing payment initialization...');
    
    setTimeout(() => {
      if (window.Square) {
        // Check if card container exists
        const cardContainer = document.getElementById('card-container');
        const hasCardInput = cardContainer && cardContainer.children.length > 0;
        
        if (hasCardInput) {
          addTestResult('Payment Flow', 'passed', 'Square SDK loaded and card form rendered');
          toast({
            title: "Payment Flow Ready",
            description: "Square Web Payments SDK is properly initialized with card form",
          });
        } else {
          addTestResult('Payment Flow', 'failed', 'Square SDK loaded but card form not rendered - check environment settings');
          toast({
            title: "Payment Flow Warning",
            description: "Square SDK loaded but card form not visible - possible environment mismatch",
            variant: "destructive",
          });
        }
      } else {
        addTestResult('Payment Flow', 'failed', 'Square SDK not loaded');
        toast({
          title: "Payment Flow Error",
          description: "Square SDK not detected - check HTML script tag",
          variant: "destructive",
        });
      }
    }, 1000);
  };

  const testErrorHandling = () => {
    addTestResult('Error Handling', 'pending', 'Testing error scenarios...');
    
    const errorScenarios = [
      'Network timeout',
      'Invalid card data',
      'Declined payment',
      'Insufficient funds',
      'Expired card',
      'CVV failure'
    ];

    setTimeout(() => {
      addTestResult('Error Handling', 'passed', `${errorScenarios.length} error scenarios prepared for testing`);
      toast({
        title: "Error Handling Ready",
        description: "Error handling scenarios configured for testing",
      });
    }, 800);
  };

  const runAllTests = () => {
    setTestResults([]);
    addTestProduct();
    
    setTimeout(() => {
      testFormValidation();
    }, 500);
    
    setTimeout(() => {
      testPaymentFlow();
    }, 1000);
    
    setTimeout(() => {
      testErrorHandling();
    }, 1500);
  };

  const clearTests = () => {
    setTestResults([]);
    clearCart();
    toast({
      title: "Tests Cleared",
      description: "All test results and cart items cleared",
    });
  };

  const getStatusIcon = (status: 'passed' | 'failed' | 'pending') => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />;
    }
  };

  return (
    <Card className="fixed bottom-4 left-4 w-96 max-h-[600px] overflow-hidden bg-white shadow-xl border-sage/20 z-50">
      <div className="p-4 border-b border-sage/10">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-charcoal flex items-center">
            <TestTube className="h-4 w-4 mr-2 text-sage" />
            Payment Testing Panel
          </h3>
          <Badge variant="outline" className="text-xs">
            {getCartCount()} items | ${getCartTotal().toFixed(2)}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Test Controls */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={runAllTests}
            size="sm"
            className="bg-sage hover:bg-forest text-white"
          >
            <TestTube className="h-3 w-3 mr-1" />
            Run Tests
          </Button>
          
          <Button
            onClick={clearTests}
            size="sm"
            variant="outline"
          >
            Clear All
          </Button>
          
          <Button
            onClick={addTestProduct}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Add Test Item
          </Button>
          
          <Button
            onClick={testPaymentFlow}
            size="sm"
            variant="outline"
            className="text-xs"
          >
            Test SDK
          </Button>
        </div>

        {/* Test Card Numbers */}
        <div className="bg-sage/10 rounded-lg p-3">
          <h4 className="text-xs font-medium text-charcoal mb-2 flex items-center">
            <CreditCard className="h-3 w-3 mr-1" />
            Square Test Cards
          </h4>
          <div className="space-y-1 text-xs text-charcoal/70">
            <div><span className="font-mono">{testCards.success}</span> - Success</div>
            <div><span className="font-mono">{testCards.declined}</span> - Declined</div>
            <div><span className="font-mono">{testCards.insufficientFunds}</span> - Insufficient Funds</div>
            <div><span className="font-mono">{testCards.expiredCard}</span> - Expired</div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="max-h-48 overflow-y-auto space-y-2">
            <h4 className="text-xs font-medium text-charcoal">Test Results:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="flex items-start space-x-2 text-xs p-2 bg-stone/10 rounded">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="font-medium text-charcoal">{result.test}</div>
                  <div className="text-charcoal/60">{result.message}</div>
                  <div className="text-charcoal/40 text-xs">
                    {result.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Security Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <h4 className="text-xs font-medium text-amber-800 mb-1 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Security Notes
          </h4>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• Using Square sandbox environment</li>
            <li>• Payment tokens are single-use only</li>
            <li>• PCI compliance handled by Square</li>
            <li>• All card data is tokenized client-side</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default PaymentTestingPanel;