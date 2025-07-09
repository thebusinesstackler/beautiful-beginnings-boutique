
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import SquareCheckout from '@/components/SquareCheckout';
import { useShippingSettings } from '@/hooks/useShippingSettings';

const Checkout = () => {
  const {
    items,
    getCartTotal
  } = useCart();
  const {
    calculateShipping
  } = useShippingSettings();

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
  const handleSquareSuccess = () => {
    toast({
      title: "Payment Successful!",
      description: "Your order has been processed successfully."
    });
  };
  const handleSquareError = (error: any) => {
    console.error('Square payment error:', error);
    toast({
      title: "Payment Error",
      description: "There was an issue processing your payment. Please try again.",
      variant: "destructive"
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-cream via-pearl to-blush/20">
      <Navigation />
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link to="/cart" className="inline-flex items-center text-sm font-medium text-charcoal/60 hover:text-charcoal mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Link>
          <h1 className="text-5xl font-bold text-charcoal font-playfair">
            Checkout
          </h1>
          <p className="text-stone mt-2">
            Complete your order details below
          </p>
        </div>

        {items.length === 0 ? <div className="text-center py-20">
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
          </div> : <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
            {/* Checkout Form - Made wider (3/5 instead of 2/3) */}
            <div className="xl:col-span-3 space-y-6">
              {/* Customer Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 p-6">
                <h2 className="text-xl font-semibold text-charcoal font-playfair mb-4">
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-charcoal font-medium text-sm">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="firstName" value={customerInfo.firstName} onChange={e => setCustomerInfo({
                  ...customerInfo,
                  firstName: e.target.value
                })} className="mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-charcoal font-medium text-sm">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input id="lastName" value={customerInfo.lastName} onChange={e => setCustomerInfo({
                  ...customerInfo,
                  lastName: e.target.value
                })} className="mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-charcoal font-medium text-sm">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input id="email" type="email" value={customerInfo.email} onChange={e => setCustomerInfo({
                  ...customerInfo,
                  email: e.target.value
                })} className="mt-1" required />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-charcoal font-medium text-sm">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input id="phone" type="tel" value={customerInfo.phone} onChange={e => setCustomerInfo({
                  ...customerInfo,
                  phone: e.target.value
                })} className="mt-1" required />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 p-6">
                <h2 className="text-xl font-semibold text-charcoal font-playfair mb-4">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shippingAddress" className="text-charcoal font-medium text-sm">
                      Street Address <span className="text-red-500">*</span>
                    </Label>
                    <Input id="shippingAddress" value={shippingAddress.address} onChange={e => setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value
                })} className="mt-1" required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="shippingCity" className="text-charcoal font-medium text-sm">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input id="shippingCity" value={shippingAddress.city} onChange={e => setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value
                  })} className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="shippingState" className="text-charcoal font-medium text-sm">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Input id="shippingState" value={shippingAddress.state} onChange={e => setShippingAddress({
                    ...shippingAddress,
                    state: e.target.value
                  })} className="mt-1" required />
                    </div>
                    <div>
                      <Label htmlFor="shippingZip" className="text-charcoal font-medium text-sm">
                        ZIP Code <span className="text-red-500">*</span>
                      </Label>
                      <Input id="shippingZip" value={shippingAddress.zipCode} onChange={e => setShippingAddress({
                    ...shippingAddress,
                    zipCode: e.target.value
                  })} className="mt-1" required />
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 p-6">
                <h2 className="text-xl font-semibold text-charcoal font-playfair mb-4">
                  Billing Address
                </h2>
                <div className="mb-4">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={sameAsShipping} onChange={e => setSameAsShipping(e.target.checked)} className="rounded border-sage/30 text-sage focus:ring-sage" />
                    <span className="text-sm text-charcoal">Same as shipping address</span>
                  </label>
                </div>
                
                {!sameAsShipping && <div className="space-y-4">
                    <div>
                      <Label htmlFor="billingAddress" className="text-sm">Street Address</Label>
                      <Input id="billingAddress" value={billingAddress.address} onChange={e => setBillingAddress({
                  ...billingAddress,
                  address: e.target.value
                })} className="mt-1" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="billingCity" className="text-sm">City</Label>
                        <Input id="billingCity" value={billingAddress.city} onChange={e => setBillingAddress({
                    ...billingAddress,
                    city: e.target.value
                  })} className="mt-1" required />
                      </div>
                      <div>
                        <Label htmlFor="billingState" className="text-sm">State</Label>
                        <Input id="billingState" value={billingAddress.state} onChange={e => setBillingAddress({
                    ...billingAddress,
                    state: e.target.value
                  })} className="mt-1" required />
                      </div>
                      <div>
                        <Label htmlFor="billingZip" className="text-sm">ZIP Code</Label>
                        <Input id="billingZip" value={billingAddress.zipCode} onChange={e => setBillingAddress({
                    ...billingAddress,
                    zipCode: e.target.value
                  })} className="mt-1" required />
                      </div>
                    </div>
                  </div>}
              </div>

              {/* Order Summary - Show items with photos if uploaded */}
              
            </div>

            {/* Order Summary - Made narrower (2/5 instead of 1/3) */}
            <div className="xl:col-span-2">
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

                {/* Square Checkout */}
                <SquareCheckout customerInfo={customerInfo} shippingAddress={shippingAddress} billingAddress={billingAddress} sameAsShipping={sameAsShipping} total={total} subtotal={subtotal} shippingCost={shippingCost} tax={tax} onSuccess={handleSquareSuccess} onError={handleSquareError} />

                <div className="mt-6 text-center text-xs text-charcoal/60">
                  <p>🔒 Secure checkout powered by Square</p>
                  <p className="mt-1">Your payment information is protected</p>
                </div>
              </div>
            </div>
          </div>}
      </div>

      <Footer />
    </div>;
};
export default Checkout;
