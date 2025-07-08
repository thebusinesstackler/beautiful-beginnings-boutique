
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShoppingCart, X, Check, Shield, Lock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import SquareCheckout from '@/components/SquareCheckout';
import { useShippingSettings } from '@/hooks/useShippingSettings';

const Checkout = () => {
  const { items, removeFromCart, getCartTotal, updatePhoto } = useCart();
  const { calculateShipping } = useShippingSettings();
  
  // Customer Information
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Shipping Address
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  // Billing Address
  const [billingAddress, setBillingAddress] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const subtotal = getCartTotal();
  const shippingCost = calculateShipping(subtotal);
  const tax = subtotal * 0.08;
  const total = subtotal + shippingCost + tax;

  const handlePhotoChange = (itemId: number, file: File) => {
    updatePhoto(itemId, file);
    toast({
      title: "Photo updated!",
      description: "Your custom photo has been updated.",
    });
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
    <div className="min-h-screen bg-gradient-to-br from-cream via-pearl to-blush/20">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center text-sm font-medium text-charcoal/60 hover:text-charcoal mb-4 transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-charcoal font-playfair">
                Secure Checkout
              </h1>
              <p className="text-stone mt-2 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-sage" />
                Complete your order securely
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-sm text-charcoal/60">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">1</div>
                <span>Cart</span>
              </div>
              <div className="w-8 h-px bg-sage/30"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">2</div>
                <span className="font-medium text-sage">Checkout</span>
              </div>
              <div className="w-8 h-px bg-sage/30"></div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-sage/20 rounded-full flex items-center justify-center text-sage text-xs font-bold mr-2">3</div>
                <span>Complete</span>
              </div>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingCart className="h-16 w-16 text-sage/40" />
            </div>
            <h2 className="text-3xl font-semibold text-charcoal mb-4 font-playfair">Your cart is empty</h2>
            <p className="text-stone mb-12 max-w-md mx-auto text-lg">
              Add some items to your cart before checking out.
            </p>
            <Link to="/products/ornaments">
              <Button className="bg-sage hover:bg-forest text-white px-12 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 overflow-hidden">
                <div className="bg-gradient-to-r from-sage/10 to-forest/10 px-6 py-4 border-b border-sage/10">
                  <h2 className="text-xl font-semibold text-charcoal font-playfair flex items-center">
                    <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">1</div>
                    Contact Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-charcoal font-medium flex items-center">
                        First Name <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={customerInfo.firstName}
                        onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                        className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-charcoal font-medium flex items-center">
                        Last Name <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={customerInfo.lastName}
                        onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                        className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-charcoal font-medium flex items-center">
                        Email Address <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-charcoal font-medium flex items-center">
                        Phone Number <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                        placeholder="(555) 123-4567"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 overflow-hidden">
                <div className="bg-gradient-to-r from-sage/10 to-forest/10 px-6 py-4 border-b border-sage/10">
                  <h2 className="text-xl font-semibold text-charcoal font-playfair flex items-center">
                    <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">2</div>
                    Shipping Address
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="shippingAddress" className="text-charcoal font-medium flex items-center">
                        Street Address <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="shippingAddress"
                        value={shippingAddress.address}
                        onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                        className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                        placeholder="123 Main Street"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="shippingCity" className="text-charcoal font-medium flex items-center">
                          City <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="shippingCity"
                          value={shippingAddress.city}
                          onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                          className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                          placeholder="Your City"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingState" className="text-charcoal font-medium flex items-center">
                          State <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="shippingState"
                          value={shippingAddress.state}
                          onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                          className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                          placeholder="FL"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="shippingZip" className="text-charcoal font-medium flex items-center">
                          ZIP Code <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Input
                          id="shippingZip"
                          value={shippingAddress.zipCode}
                          onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                          className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                          placeholder="12345"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 overflow-hidden">
                <div className="bg-gradient-to-r from-sage/10 to-forest/10 px-6 py-4 border-b border-sage/10">
                  <h2 className="text-xl font-semibold text-charcoal font-playfair flex items-center">
                    <div className="w-8 h-8 bg-sage rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">3</div>
                    Billing Address
                  </h2>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <label className="flex items-center space-x-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={sameAsShipping}
                          onChange={(e) => setSameAsShipping(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          sameAsShipping 
                            ? 'bg-sage border-sage text-white' 
                            : 'border-sage/30 group-hover:border-sage/50'
                        }`}>
                          {sameAsShipping && <Check className="h-3 w-3" />}
                        </div>
                      </div>
                      <span className="text-charcoal font-medium">Same as shipping address</span>
                    </label>
                  </div>
                  
                  {!sameAsShipping && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="billingAddress" className="text-charcoal font-medium">Street Address</Label>
                        <Input
                          id="billingAddress"
                          value={billingAddress.address}
                          onChange={(e) => setBillingAddress({...billingAddress, address: e.target.value})}
                          className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                          placeholder="123 Billing Street"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="billingCity" className="text-charcoal font-medium">City</Label>
                          <Input
                            id="billingCity"
                            value={billingAddress.city}
                            onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                            className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                            placeholder="Billing City"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingState" className="text-charcoal font-medium">State</Label>
                          <Input
                            id="billingState"
                            value={billingAddress.state}
                            onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                            className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                            placeholder="FL"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="billingZip" className="text-charcoal font-medium">ZIP Code</Label>
                          <Input
                            id="billingZip"
                            value={billingAddress.zipCode}
                            onChange={(e) => setBillingAddress({...billingAddress, zipCode: e.target.value})}
                            className="mt-2 border-sage/20 focus:border-sage focus:ring-sage/20"
                            placeholder="12345"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Order Items */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-sage/10 to-forest/10 px-6 py-4 border-b border-sage/10">
                    <h3 className="text-lg font-semibold text-charcoal font-playfair">Your Order</h3>
                    <p className="text-sm text-charcoal/60">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
                  </div>
                  <div className="p-6 max-h-80 overflow-y-auto">
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-start space-x-3 p-3 bg-sage/5 rounded-xl">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-charcoal text-sm truncate">{item.name}</h4>
                            <p className="text-sage font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-xs text-charcoal/60">Qty: {item.quantity}</p>
                            
                            {item.uploadedPhoto ? (
                              <div className="mt-2 flex items-center text-xs text-sage bg-sage/10 px-2 py-1 rounded">
                                <Check className="h-3 w-3 mr-1" />
                                Custom photo added
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.accept = 'image/*';
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) handlePhotoChange(item.id, file);
                                  };
                                  input.click();
                                }}
                                className="mt-2 text-xs text-sage hover:text-forest font-medium underline"
                              >
                                Add photo
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 overflow-hidden">
                  <div className="bg-gradient-to-r from-sage/10 to-forest/10 px-6 py-4 border-b border-sage/10">
                    <h3 className="text-lg font-semibold text-charcoal font-playfair">Order Summary</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal/70">Subtotal</span>
                        <span className="font-medium text-charcoal">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal/70">Shipping</span>
                        <span className={`font-medium ${shippingCost === 0 ? 'text-sage' : 'text-charcoal'}`}>
                          {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal/70">Tax</span>
                        <span className="font-medium text-charcoal">${tax.toFixed(2)}</span>
                      </div>
                      <div className="border-t border-sage/20 pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-charcoal">Total</span>
                          <span className="text-2xl font-bold text-sage">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Square Checkout */}
                    <SquareCheckout
                      customerInfo={customerInfo}
                      shippingAddress={shippingAddress}
                      billingAddress={billingAddress}
                      sameAsShipping={sameAsShipping}
                      total={total}
                      subtotal={subtotal}
                      shippingCost={shippingCost}
                      tax={tax}
                      onSuccess={handleSquareSuccess}
                      onError={handleSquareError}
                    />

                    <div className="mt-6 text-center space-y-3">
                      <div className="flex items-center justify-center gap-4 text-xs text-charcoal/60">
                        <div className="flex items-center">
                          <Lock className="h-3 w-3 mr-1 text-sage" />
                          <span>SSL Secured</span>
                        </div>
                        <div className="flex items-center">
                          <Shield className="h-3 w-3 mr-1 text-sage" />
                          <span>PCI Compliant</span>
                        </div>
                      </div>
                      <p className="text-xs text-charcoal/50 leading-relaxed">
                        🔒 Your payment information is protected with industry-standard encryption
                      </p>
                    </div>
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

export default Checkout;
