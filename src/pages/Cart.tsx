
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, X, Plus, Minus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import PhotoUpload from '@/components/PhotoUpload';
import { toast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, removeFromCart, getCartTotal, updatePhoto, addToCart } = useCart();
  const navigate = useNavigate();

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
    }
    // Note: We would need to add decrease quantity functionality to CartContext for full implementation
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-charcoal/60 hover:text-charcoal mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold text-charcoal font-playfair flex items-center">
            <ShoppingCart className="h-8 w-8 mr-3 text-sage" />
            Your Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-sage/40" />
            </div>
            <h2 className="text-2xl font-semibold text-charcoal mb-3 font-playfair">Your cart is empty</h2>
            <p className="text-charcoal/60 mb-8 max-w-md mx-auto">
              Discover our beautiful collection of personalized keepsakes and add some memories to your cart.
            </p>
            <Link to="/products/ornaments">
              <Button className="bg-sage hover:bg-forest text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-pearl rounded-lg shadow-sm border border-sage/10 p-6">
                <h2 className="text-xl font-semibold text-charcoal font-playfair mb-4">
                  Cart Items ({items.length})
                </h2>
                
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-stone/20 p-4">
                      <div className="flex items-start space-x-4">
                        {/* Product Image */}
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border border-stone/20"
                        />
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-medium text-charcoal font-playfair">
                                {item.name}
                              </h3>
                              <p className="text-xl font-bold text-sage">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-sm text-charcoal/60">
                                ${item.price.toFixed(2)} each
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3 mb-4">
                            <span className="text-sm font-medium text-charcoal">Quantity:</span>
                            <div className="flex items-center space-x-2 bg-stone/10 rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item, -1)}
                                disabled={item.quantity <= 1}
                                className="h-8 w-8 p-0 hover:bg-stone/20"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-medium w-8 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleQuantityChange(item, 1)}
                                className="h-8 w-8 p-0 hover:bg-stone/20"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Photo Upload Section */}
                          <div className="p-4 bg-cream/50 rounded-lg border border-sage/10">
                            <h4 className="text-sm font-medium text-charcoal mb-3 flex items-center">
                              📸 Upload Your Custom Photo
                            </h4>
                            <PhotoUpload
                              onUpload={(file) => handlePhotoUpload(item.id, file)}
                              maxSizeMB={10}
                              className="text-sm"
                            />
                            {item.uploadedPhoto && (
                              <div className="mt-3 p-3 bg-sage/10 border border-sage/20 rounded-md">
                                <p className="text-sm text-sage font-medium">
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
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-pearl rounded-lg shadow-sm border border-sage/10 p-6 sticky top-8">
                <h3 className="text-xl font-semibold text-charcoal font-playfair mb-6">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">
                      Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)
                    </span>
                    <span className="font-medium text-charcoal">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Shipping</span>
                    <span className="font-medium text-sage">FREE</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Tax</span>
                    <span className="font-medium text-charcoal/70">Calculated at checkout</span>
                  </div>
                  
                  <div className="border-t border-stone/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-charcoal">Total</span>
                      <span className="text-xl font-bold text-sage">
                        ${getCartTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-sage hover:bg-forest text-white text-lg font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </Button>

                <div className="mt-6 text-center space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-xs text-charcoal/60">
                    <span>🔒</span>
                    <span>Secure checkout</span>
                  </div>
                  <p className="text-xs text-charcoal/60">
                    Your payment information is protected
                  </p>
                </div>

                <Link to="/products/ornaments" className="block mt-4">
                  <Button
                    variant="outline"
                    className="w-full border-sage/30 text-sage hover:bg-sage/5 hover:border-sage/50 transition-colors"
                  >
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Cart;
