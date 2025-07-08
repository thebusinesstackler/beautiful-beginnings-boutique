
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, X, Plus, Minus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import PhotoUpload from '@/components/PhotoUpload';
import { toast } from '@/hooks/use-toast';
import SquareCheckout from '@/components/SquareCheckout';

const Checkout = () => {
  const { items, removeFromCart, getCartTotal, updatePhoto, addToCart } = useCart();

  const handlePhotoUpload = (itemId: number, file: File) => {
    updatePhoto(itemId, file);
    toast({
      title: "Photo uploaded!",
      description: "Your custom photo has been added to this item.",
    });
  };

  const handleQuantityChange = (item: any, change: number) => {
    if (change > 0) {
      addToCart(item);
    } else if (item.quantity > 1) {
      // For decreasing quantity, we'd need to add this functionality to CartContext
      // For now, we'll just show the current quantity
    }
  };

  const handleSquareSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your order has been processed successfully.",
    });
  };

  const handleSquareError = (error: any) => {
    console.error('Square payment error:', error);
    toast({
      title: "Payment Error",
      description: "There was an issue processing your payment. Please try again.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3" />
            Your Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Add some beautiful products to get started!</p>
            <Link to="/shop">
              <Button className="btn-primary">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 font-playfair">
                            {item.name}
                          </h3>
                          <p className="text-2xl font-bold text-gray-900 mt-1">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center space-x-3 mt-4">
                        <span className="text-sm font-medium text-gray-700">Quantity:</span>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item, -1)}
                            disabled={item.quantity <= 1}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Photo Upload Section */}
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                          📸 Upload Your Custom Photo
                        </h4>
                        <PhotoUpload
                          onUpload={(file) => handlePhotoUpload(item.id, file)}
                          maxSizeMB={10}
                          className="text-sm"
                        />
                        {item.uploadedPhoto && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm text-green-800 font-medium">
                              ✓ Photo uploaded: {item.uploadedPhoto.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span className="font-medium">${getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Square Checkout Button */}
                <SquareCheckout
                  onSuccess={handleSquareSuccess}
                  onError={handleSquareError}
                />

                <div className="mt-4 text-center text-xs text-gray-500">
                  <p>Secure checkout powered by Square</p>
                  <p className="mt-1">🔒 Your payment information is protected</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
