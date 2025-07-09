
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingCart, X, Plus, Minus, Truck, Shield, Clock, ImageIcon } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import CompactPhotoUpload from '@/components/CompactPhotoUpload';
import PeopleAlsoBought from '@/components/PeopleAlsoBought';
import { useShippingSettings } from '@/hooks/useShippingSettings';
import { toast } from '@/hooks/use-toast';

const Cart = () => {
  const {
    items,
    removeFromCart,
    getCartTotal,
    updatePhoto,
    addToCart,
    updateQuantity
  } = useCart();
  const {
    calculateShipping,
    getEstimatedDelivery,
    settings
  } = useShippingSettings();
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
      description: "Your custom photo has been added to this item."
    });
  };

  const handlePhotoReplace = (itemId: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handlePhotoUpload(itemId, file);
      }
    };
    input.click();
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
      
      <div className="max-w-screen-xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-12">
        {/* Header */}
        <div className="mb-6 md:mb-12">
          <Link to="/" className="inline-flex items-center text-xs sm:text-sm font-medium text-charcoal/60 hover:text-charcoal mb-4 md:mb-6 transition-colors">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Continue Shopping
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal font-playfair flex items-center">
                <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 mr-2 sm:mr-3 md:mr-4 text-sage" />
                Your Cart
              </h1>
              <p className="text-stone mt-1 sm:mt-2 text-sm sm:text-base">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            {/* Progress to Free Shipping */}
            {subtotal < settings.freeShippingThreshold && (
              <div className="bg-sage/10 border border-sage/20 rounded-lg p-3 sm:p-4 w-full sm:max-w-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="h-3 w-3 sm:h-4 sm:w-4 text-sage flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium text-sage">
                    Add ${(settings.freeShippingThreshold - subtotal).toFixed(2)} for FREE shipping!
                  </span>
                </div>
                <div className="w-full bg-sage/20 rounded-full h-2">
                  <div 
                    className="bg-sage h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${Math.min(subtotal / settings.freeShippingThreshold * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
              <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-sage/40" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-charcoal mb-3 md:mb-4 font-playfair">Your cart is empty</h2>
            <p className="text-stone mb-8 md:mb-12 max-w-md mx-auto text-sm sm:text-base md:text-lg">
              Discover our beautiful collection of personalized keepsakes and create lasting memories.
            </p>
            <Link to="/products/ornaments">
              <Button className="bg-sage hover:bg-forest text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg transition-colors shadow-lg hover:shadow-xl">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-xl border border-stone/20 p-4 md:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0 mx-auto sm:mx-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 object-cover rounded-xl border border-stone/20 shadow-sm" 
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 md:mb-4 gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg sm:text-xl font-medium text-charcoal font-playfair line-clamp-2">
                            {item.name}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 gap-1 sm:gap-0">
                            <p className="text-xl sm:text-2xl font-bold text-sage">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-xs sm:text-sm text-charcoal/60">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 self-start"
                        >
                          <X className="h-4 w-4 sm:h-5 sm:w-5" />
                        </Button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4 md:mb-6 gap-2 sm:gap-0">
                        <span className="text-sm font-medium text-charcoal">Quantity:</span>
                        <div className="flex items-center space-x-3 bg-stone/10 rounded-xl p-2 w-fit">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleQuantityDecrease(item)} 
                            className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-stone/20 rounded-lg"
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          <span className="text-base sm:text-lg font-semibold w-8 sm:w-12 text-center">
                            {item.quantity}
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleQuantityIncrease(item)} 
                            className="h-8 w-8 sm:h-10 sm:w-10 p-0 hover:bg-stone/20 rounded-lg"
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Photo Upload Section */}
                      <div className="p-3 md:p-4 bg-cream/50 rounded-xl border border-sage/10">
                        <h4 className="text-sm font-medium text-charcoal mb-3 flex items-center">
                          📸 Upload Your Custom Photo
                        </h4>
                        
                        {/* Show uploaded photo if it exists */}
                        {item.uploadedPhotoUrl ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                              <ImageIcon className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-700 font-medium">
                                ✓ Photo uploaded successfully
                              </span>
                            </div>
                            <div className="flex items-start space-x-3">
                              <img
                                src={item.uploadedPhotoUrl}
                                alt="Your uploaded photo"
                                className="w-16 h-16 object-cover rounded-lg border border-stone/20"
                              />
                              <div className="flex-1">
                                <p className="text-xs text-charcoal/70 mb-2">
                                  This photo will be used for your custom product
                                </p>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePhotoReplace(item.id)}
                                  className="text-xs h-7 px-3"
                                >
                                  Replace Photo
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <CompactPhotoUpload 
                            onUpload={file => handlePhotoUpload(item.id, file)} 
                            maxSizeMB={10} 
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary - Full width on mobile, sidebar on desktop */}
            <div className="lg:col-span-1 order-first lg:order-last">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 p-6 md:p-8 lg:sticky lg:top-8">
                <h3 className="text-xl sm:text-2xl font-semibold text-charcoal font-playfair mb-6 md:mb-8">Order Summary</h3>
                
                <div className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-charcoal/70">Subtotal</span>
                    <span className="font-semibold text-charcoal">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-charcoal/70">Shipping</span>
                    <span className={`font-semibold ${shippingCost === 0 ? 'text-sage' : 'text-charcoal'}`}>
                      {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base">
                    <span className="text-charcoal/70">Tax</span>
                    <span className="font-medium text-charcoal">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-stone/20 pt-3 md:pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg sm:text-xl font-bold text-charcoal">Total</span>
                      <span className="text-xl sm:text-2xl font-bold text-sage">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Proceed to Checkout Button */}
                <div className="space-y-3 md:space-y-4">
                  <Link to="/checkout">
                    <Button 
                      style={{
                        backgroundColor: 'hsl(140 30% 45%)',
                        color: 'white',
                        minHeight: '50px',
                        fontSize: '18px',
                        fontWeight: '700'
                      }} 
                      className="w-full text-lg sm:text-xl font-bold py-4 sm:py-6 px-6 sm:px-8 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] bg-green-500 hover:bg-green-400 text-emerald-900 rounded-none"
                    >
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        <span>Proceed to Checkout</span>
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
