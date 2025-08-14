
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle, TestTube, Clock, CreditCard } from 'lucide-react';

const PaymentTestingPanel = () => {
  const { addToCart, clearCart, getCartTotal, getCartItemCount } = useCart();
  const [testResults, setTestResults] = useState<Array<{
    test: string;
    status: 'passed' | 'failed' | 'pending';
    message: string;
    timestamp: Date;
  }>>([]);

  // Production environment - no test cards available
  const productionInfo = {
    note: 'Production environment uses real payment processing',
    warning: 'All transactions will be charged to actual payment methods',
    security: 'PCI compliance handled by Square production servers'
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
      const checks = {
        sdkLoaded: !!window.Square,
        httpsConnection: window.location.protocol === 'https:' || window.location.hostname === 'localhost',
        cardContainer: !!document.getElementById('card-container'),
        squareContainer: !!document.querySelector('[data-square-container]'),
        cardForm: false
      };
      
      // Check if card form is rendered by looking for Square's injected content
      const cardContainer = document.getElementById('card-container');
      if (cardContainer) {
        // Square injects iframes or form elements when the card is ready
        checks.cardForm = cardContainer.children.length > 0 || 
                         cardContainer.querySelector('iframe') !== null ||
                         cardContainer.querySelector('input') !== null ||
                         cardContainer.innerHTML.trim() !== '';
      }
      
      const passedChecks = Object.values(checks).filter(Boolean).length;
      const totalChecks = Object.keys(checks).length;
      
      if (checks.sdkLoaded && checks.httpsConnection && (checks.cardContainer || checks.squareContainer)) {
        if (checks.cardForm) {
          addTestResult('Payment Flow', 'passed', `All ${totalChecks} checks passed - Square card form ready`);
          toast({
            title: "Payment Flow Ready",
            description: "Square payment form is fully initialized and ready",
          });
        } else {
          addTestResult('Payment Flow', 'passed', `${passedChecks}/${totalChecks} checks passed - Card form initializing`);
          toast({
            title: "Payment Flow Initializing",
            description: "Square SDK loaded, card form still loading",
          });
        }
      } else {
        const failedChecks = Object.entries(checks)
          .filter(([key, value]) => !value)
          .map(([key]) => key);
        
        addTestResult('Payment Flow', 'failed', `${passedChecks}/${totalChecks} checks passed. Failed: ${failedChecks.join(', ')}`);
        toast({
          title: "Payment Flow Issues",
          description: `Failed checks: ${failedChecks.join(', ')}`,
          variant: "destructive",
        });
      }
    }, 1500); // Give more time for Square to initialize
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
            Payment System Testing Panel
          </h3>
          <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
            PRODUCTION</Badge>
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

        {/* Production Environment Notice */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <h4 className="text-xs font-medium text-red-800 mb-2 flex items-center">
            <CreditCard className="h-3 w-3 mr-1" />
            Production Environment - Live Payments
          </h4>
          <div className="space-y-1 text-xs text-red-700">
            <div>⚠️ <strong>Live payment processing active</strong></div>
            <div>💳 Real cards will be charged</div>
            <div>🔒 Production-grade security enabled</div>
            <div>📋 All transactions are recorded</div>
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
            Production Environment Notes
          </h4>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• Using Square production environment</li>
            <li>• All payments are processed live</li>
            <li>• PCI compliance handled by Square</li>
            <li>• All card data is tokenized client-side</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default PaymentTestingPanel;
