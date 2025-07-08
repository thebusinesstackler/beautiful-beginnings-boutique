import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, X, Plus, Minus, Truck, Shield, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import CompactPhotoUpload from '@/components/CompactPhotoUpload';
import PeopleAlsoBought from '@/components/PeopleAlsoBought';
import { useShippingSettings } from '@/hooks/useShippingSettings';
import { toast } from '@/hooks/use-toast';

const Cart = () => {
  const { items, removeFromCart, getCartTotal, updatePhoto, addToCart, updateQuantity } = useCart();
  const { calculateShipping, getEstimatedDelivery, settings } = useShippingSettings();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shippingCost = calculateShipping(subtotal);
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shippingCost + tax;
  const estimatedDelivery = getEstimatedDelivery();

  const handlePhotoUpload = (itemId: number, file: File) => {
    updatePhoto(itemId, file);
    toast({
      title: "Photo uploaded!",
      description: "Your custom photo has been added to this item.",
    });
  };

  const handleQuantityIncrease = (item: any) => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleQuantityDecrease = (item: any) => {
    updateQuantity(item.id, item.quantity - 1);
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-pearl to-blush/20">
      <Navigation />
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-charcoal/60 hover:text-charcoal mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-charcoal font-playfair flex items-center">
                <ShoppingCart className="h-10 w-10 mr-4 text-sage" />
                Your Cart
              </h1>
              <p className="text-stone mt-2">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            {/* Progress to Free Shipping */}
            {subtotal < settings.freeShippingThreshold && (
              <div className="bg-sage/10 border border-sage/20 rounded-lg p-4 max-w-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="h-4 w-4 text-sage" />
                  <span className="text-sm font-medium text-sage">
                    Add ${(settings.freeShippingThreshold - subtotal).toFixed(2)} for FREE shipping!
                  </span>
                </div>
                <div className="w-full bg-sage/20 rounded-full h-2">
                  <div 
                    className="bg-sage h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((subtotal / settings.freeShippingThreshold) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="h-16 w-16 text-sage/40" />
            </div>
            <h2 className="text-3xl font-semibold text-charcoal mb-4 font-playfair">Your cart is empty</h2>
            <p className="text-stone mb-12 max-w-md mx-auto text-lg">
              Discover our beautiful collection of personalized keepsakes and create lasting memories.
            </p>
            <Link to="/products/ornaments">
              <Button className="bg-sage hover:bg-forest text-white px-12 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="xl:col-span-2 space-y-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-xl border border-stone/20 p-6 shadow-sm">
                  <div className="flex items-start space-x-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-xl border border-stone/20 shadow-sm"
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-medium text-charcoal font-playfair">
                            {item.name}
                          </h3>
                          <div className="flex items-center space-x-4 mt-2">
                            <p className="text-2xl font-bold text-sage">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-charcoal/60">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-4 mb-6">
                        <span className="text-sm font-medium text-charcoal">Quantity:</span>
                        <div className="flex items-center space-x-3 bg-stone/10 rounded-xl p-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityDecrease(item)}
                            className="h-10 w-10 p-0 hover:bg-stone/20 rounded-lg"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-lg font-semibold w-12 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleQuantityIncrease(item)}
                            className="h-10 w-10 p-0 hover:bg-stone/20 rounded-lg"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Compact Photo Upload Section */}
                      <div className="p-4 bg-cream/50 rounded-xl border border-sage/10">
                        <h4 className="text-sm font-medium text-charcoal mb-3 flex items-center">
                          📸 Upload Your Custom Photo
                        </h4>
                        <CompactPhotoUpload
                          onUpload={(file) => handlePhotoUpload(item.id, file)}
                          maxSizeMB={10}
                        />
                        {item.uploadedPhoto && (
                          <div className="mt-3 p-3 bg-sage/10 border border-sage/20 rounded-lg">
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

            {/* Cart Summary */}
            <div className="xl:col-span-1">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 p-8 sticky top-8">
                <h3 className="text-2xl font-semibold text-charcoal font-playfair mb-8">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-base">
                    <span className="text-charcoal/70">Subtotal</span>
                    <span className="font-semibold text-charcoal">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-charcoal/70">Shipping</span>
                    <span className={`font-semibold ${shippingCost === 0 ? 'text-sage' : 'text-charcoal'}`}>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-charcoal/70">Tax</span>
                    <span className="font-medium text-charcoal">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-stone/20 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-charcoal">Total</span>
                      <span className="text-2xl font-bold text-sage">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Proceed to Checkout Button */}
                <div className="space-y-4">
                  <Link to="/checkout">
                    <Button 
                      className="w-full text-white text-xl font-bold py-6 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      style={{
                        backgroundColor: 'hsl(140 30% 45%)',
                        color: 'white',
                        minHeight: '60px',
                        fontSize: '20px',
                        fontWeight: '700'
                      }}
                    >
                      <div className="flex items-center justify-center gap-3">
                        <span>Proceed to Checkout</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Button>
                  </Link>
                  
                  <div className="text-center text-xs text-charcoal/60 space-y-1">
                    <p>🔒 Secure checkout with Square</p>
                    <p>Free shipping on orders over $75</p>
                  </div>
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

export default Cart;
