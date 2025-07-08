import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import { RefreshCw, TestTube, CheckCircle, XCircle } from 'lucide-react';

const CartTestingPanel = () => {
  const { items, addToCart, clearCart, getCartTotal, getCartCount } = useCart();
  const [testResults, setTestResults] = useState<Array<{test: string, passed: boolean, message: string}>>([]);
  const [isTestingCart, setIsTestingCart] = useState(false);
  const [testStartValues, setTestStartValues] = useState<{count: number, total: number} | null>(null);

  // Use useEffect to wait for cart state changes during testing
  useEffect(() => {
    if (isTestingCart && testStartValues) {
      const currentCount = getCartCount();
      const currentTotal = getCartTotal();
      
      // Check if the state has actually changed from our starting values
      if (currentCount !== testStartValues.count || currentTotal !== testStartValues.total) {
        // State has changed, now we can measure the results
        const results = [];
        
        // Test 2: Add item to cart
        results.push({
          test: 'Add to Cart',
          passed: currentCount > testStartValues.count,
          message: `Cart count: ${testStartValues.count} → ${currentCount}`
        });
        
        // Test 3: Cart total calculation
        const expectedIncrease = 10.99; // Test product price
        const actualIncrease = currentTotal - testStartValues.total;
        
        results.push({
          test: 'Cart Total Calculation',
          passed: Math.abs(actualIncrease - expectedIncrease) < 0.01,
          message: `Total increased by $${actualIncrease.toFixed(2)} (expected $${expectedIncrease.toFixed(2)})`
        });
        
        // Test 4: LocalStorage persistence
        try {
          const stored = localStorage.getItem('shopping_cart');
          const parsed = stored ? JSON.parse(stored) : [];
          const hasTestProduct = parsed.some((item: any) => item.id === 999999);
          
          results.push({
            test: 'LocalStorage Persistence',
            passed: hasTestProduct,
            message: hasTestProduct ? 'Test product found in localStorage' : 'Test product not found in localStorage'
          });
        } catch (error) {
          results.push({
            test: 'LocalStorage Persistence',
            passed: false,
            message: 'Error accessing localStorage'
          });
        }
        
        setTestResults(results);
        setIsTestingCart(false);
        setTestStartValues(null);
        
        // Show summary toast
        const passedTests = results.filter(r => r.passed).length;
        toast({
          title: "Test Results",
          description: `${passedTests}/${results.length} tests passed`,
          variant: passedTests === results.length ? "default" : "destructive",
        });
      }
    }
  }, [items, isTestingCart, testStartValues, getCartCount, getCartTotal]);

  const runTests = () => {
    const results = [];
    
    // Test 1: Cart persistence
    const beforeCount = getCartCount();
    const beforeTotal = getCartTotal();
    
    // Store starting values for useEffect to compare against
    setTestStartValues({ count: beforeCount, total: beforeTotal });
    setIsTestingCart(true);
    
    // Test 2: Add item to cart
    const testProduct = {
      id: 999999,
      name: 'Test Product',
      price: 10.99,
      image: 'https://via.placeholder.com/150'
    };
    
    addToCart(testProduct);
    // Note: The actual testing will happen in useEffect when state updates
  };

  const testCartPersistence = () => {
    toast({
      title: "Cart Persistence Test",
      description: "Please refresh the page to test cart persistence. Your cart items should remain.",
    });
  };

  const clearTestData = () => {
    // Remove test products
    const testIds = [999999];
    testIds.forEach(id => {
      const existingItems = JSON.parse(localStorage.getItem('shopping_cart') || '[]');
      const filteredItems = existingItems.filter((item: any) => !testIds.includes(item.id));
      localStorage.setItem('shopping_cart', JSON.stringify(filteredItems));
    });
    
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-sm flex items-center">
          <TestTube className="h-4 w-4 mr-2" />
          Cart Testing
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTestResults([])}
          className="h-6 w-6 p-0"
        >
          ×
        </Button>
      </div>
      
      <div className="space-y-2 mb-3">
        <Button
          onClick={runTests}
          size="sm"
          className="w-full"
          disabled={isTestingCart}
        >
          <TestTube className="h-3 w-3 mr-2" />
          {isTestingCart ? 'Testing...' : 'Run Tests'}
        </Button>
        
        <Button
          onClick={testCartPersistence}
          size="sm"
          variant="outline"
          className="w-full"
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Test Persistence
        </Button>
        
        <Button
          onClick={clearTestData}
          size="sm"
          variant="outline"
          className="w-full"
        >
          Clear Test Data
        </Button>
      </div>
      
      {/* Show testing state */}
      {isTestingCart && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
          Waiting for cart state to update...
        </div>
      )}
      
      {testResults.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-xs font-medium text-gray-600">Results:</h4>
          {testResults.map((result, index) => (
            <div key={index} className="flex items-start space-x-2 text-xs">
              {result.passed ? (
                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <XCircle className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
              )}
              <div>
                <div className="font-medium">{result.test}</div>
                <div className="text-gray-500">{result.message}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-3 pt-2 border-t border-gray-100 text-xs text-gray-500">
        Cart: {getCartCount()} items | ${getCartTotal().toFixed(2)}
      </div>
    </div>
  );
};

export default CartTestingPanel;
