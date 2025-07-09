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
  const { items, removeFromCart, getCartTotal, updatePhoto, updateItemProperty } = useCart();
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
    // Remove "will upload later" flag when photo is uploaded
    updateItemProperty(itemId, 'willUploadLater', false);
    toast({
      title: "Photo updated!",
      description: "Your custom photo has been updated.",
    });
  };

  const handleUploadLaterToggle = (itemId: number, checked: boolean) => {
    updateItemProperty(itemId, 'willUploadLater', checked);
    if (checked) {
      toast({
        title: "Upload Later Selected",
        description: "You can upload your photo after placing the order.",
      });
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
    <div className="min-h-screen bg-gradient-to-br from-cream via-pearl to-blush/20">
      <Navigation />
      
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link
            to="/cart"
            className="inline-flex items-center text-sm font-medium text-charcoal/60 hover:text-charcoal mb-6 transition-colors"
          >
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
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Checkout Form */}
            <div className="xl:col-span-2 space-y-8">
              {/* Customer Information */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 p-8">
                <h2 className="text-2xl font-semibold text-charcoal font-playfair mb-6">
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-charcoal font-medium">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => setCustomerInfo({...customerInfo, firstName: e.target.value})}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-charcoal font-medium">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-charcoal font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-charcoal font-medium">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="mt-2"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 p-8">
                <h2 className="text-2xl font-semibold text-charcoal font-playfair mb-6">
                  Shipping Address
                </h2>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="shippingAddress" className="text-charcoal font-medium">
                      Street Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="shippingAddress"
                      value={shippingAddress.address}
                      onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})}
                      className="mt-2"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label htmlFor="shippingCity" className="text-charcoal font-medium">
                        City <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="shippingCity"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingState" className="text-charcoal font-medium">
                        State <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="shippingState"
                        value={shippingAddress.state}
                        onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shippingZip" className="text-charcoal font-medium">
                        ZIP Code <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="shippingZip"
                        value={shippingAddress.zipCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 p-8">
                <h2 className="text-2xl font-semibold text-charcoal font-playfair mb-6">
                  Billing Address
                </h2>
                <div className="mb-6">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                      className="rounded border-sage/30 text-sage focus:ring-sage"
                    />
                    <span className="text-sm text-charcoal">Same as shipping address</span>
                  </label>
                </div>
                
                {!sameAsShipping && (
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="billingAddress">Street Address</Label>
                      <Input
                        id="billingAddress"
                        value={billingAddress.address}
                        onChange={(e) => setBillingAddress({...billingAddress, address: e.target.value})}
                        className="mt-2"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="billingCity">City</Label>
                        <Input
                          id="billingCity"
                          value={billingAddress.city}
                          onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                          className="mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingState">State</Label>
                        <Input
                          id="billingState"
                          value={billingAddress.state}
                          onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                          className="mt-2"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="billingZip">ZIP Code</Label>
                        <Input
                          id="billingZip"
                          value={billingAddress.zipCode}
                          onChange={(e) => setBillingAddress({...billingAddress, zipCode: e.target.value})}
                          className="mt-2"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items with Photo Upload */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 p-8">
                <h2 className="text-2xl font-semibold text-charcoal font-playfair mb-6">
                  Your Items & Photo Upload
                </h2>
                <div className="space-y-6">
                  {items.map((item) => (
                    <div key={item.id} className="border border-stone/20 rounded-xl p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-charcoal">{item.name}</h3>
                          <p className="text-sage font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          <p className="text-sm text-charcoal/60">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      
                      {/* Photo Upload Section */}
                      <div className="mt-4 p-4 bg-stone-50 rounded-lg">
                        <h4 className="font-medium text-charcoal mb-3">Custom Photo Required</h4>
                        
                        {item.uploadedPhoto ? (
                          <div className="mb-4 p-3 bg-sage/10 rounded-lg">
                            <p className="text-sm text-sage font-medium mb-2">
                              ✓ Photo uploaded: {item.uploadedPhoto.name}
                            </p>
                            <Button
                              variant="outline"
                              size="sm"
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
                              className="text-xs"
                            >
                              Change Photo
                            </Button>
                          </div>
                        ) : (
                          <div className="mb-4">
                            <Button
                              variant="outline"
                              size="sm"
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
                              className="text-xs mb-3"
                            >
                              Upload Photo Now
                            </Button>
                          </div>
                        )}
                        
                        {/* Upload Later Option */}
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`upload-later-${item.id}`}
                            checked={item.willUploadLater || false}
                            onChange={(e) => handleUploadLaterToggle(item.id, e.target.checked)}
                            className="w-4 h-4 text-sage bg-white border-stone-300 rounded focus:ring-sage focus:ring-2"
                          />
                          <label 
                            htmlFor={`upload-later-${item.id}`}
                            className="text-sm text-charcoal cursor-pointer"
                          >
                            I'll upload my photo later (after placing the order)
                          </label>
                        </div>
                        
                        {(!item.uploadedPhoto && !item.willUploadLater) && (
                          <p className="text-sm text-amber-700 mt-2 bg-amber-50 p-2 rounded">
                            ⚠️ Please upload a photo or select "Upload Later" to continue
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
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

                <div className="mt-6 text-center text-xs text-charcoal/60">
                  <p>🔒 Secure checkout powered by Square</p>
                  <p className="mt-1">Your payment information is protected</p>
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
