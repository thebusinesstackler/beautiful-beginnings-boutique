import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ShoppingCart, Camera, X, Upload, Plus } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';
import SquareCheckout from '@/components/SquareCheckout';
import { useShippingSettings } from '@/hooks/useShippingSettings';
import { useSettings } from '@/hooks/useSettings';
const Checkout = () => {
  const {
    items,
    getCartTotal,
    getDiscountedTotal,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon,
    updatePhoto,
    updateItemProperty
  } = useCart();
  const {
    settings
  } = useSettings();
  const {
    calculateShipping
  } = useShippingSettings();

  // Photo upload states for each item
  const [uploadingStates, setUploadingStates] = useState<{
    [key: number]: boolean;
  }>({});
  const [showUploadInterface, setShowUploadInterface] = useState<{
    [key: number]: boolean;
  }>({});

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

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
  const discountedSubtotal = getDiscountedTotal();
  const shippingCost = calculateShipping(discountedSubtotal);
  const tax = discountedSubtotal * 0.08;
  const total = discountedSubtotal + shippingCost + tax;
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
  const handlePhotoUpload = async (itemId: number, file: File) => {
    setUploadingStates(prev => ({
      ...prev,
      [itemId]: true
    }));
    try {
      await updatePhoto(itemId, file);
      setShowUploadInterface(prev => ({
        ...prev,
        [itemId]: false
      }));
      toast({
        title: "Photo uploaded!",
        description: "Your custom photo has been added successfully."
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Upload failed",
        description: "Please try uploading your photo again.",
        variant: "destructive"
      });
    } finally {
      setUploadingStates(prev => ({
        ...prev,
        [itemId]: false
      }));
    }
  };
  const handleRemovePhoto = (itemId: number) => {
    updateItemProperty(itemId, 'uploadedPhotoUrl', null);
    updateItemProperty(itemId, 'uploadedPhoto', undefined);
    updateItemProperty(itemId, 'willUploadLater', false);
    setShowUploadInterface(prev => ({
      ...prev,
      [itemId]: false
    }));
  };
  const handleWillUploadLater = (itemId: number, willUpload: boolean) => {
    updateItemProperty(itemId, 'willUploadLater', willUpload);
    setShowUploadInterface(prev => ({
      ...prev,
      [itemId]: false
    }));
    if (willUpload) {
      // Clear any existing photo when selecting "will upload later"
      updateItemProperty(itemId, 'uploadedPhotoUrl', null);
      updateItemProperty(itemId, 'uploadedPhoto', undefined);
    }
  };
  const toggleUploadInterface = (itemId: number) => {
    setShowUploadInterface(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
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
                <h2 className="text-xl font-semibold text-charcoal font-playfair mb-4">Billing Address</h2>
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

              {/* Order Items Review */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 p-6">
                <h2 className="text-xl font-semibold text-charcoal font-playfair mb-4">
                  Order Items
                </h2>
                <div className="space-y-4">
                  {items.map(item => <div key={item.id} className="border border-stone/20 rounded-lg bg-white/50 overflow-hidden">
                      {/* Main Item Info */}
                      <div className="flex items-start gap-4 p-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone/10 flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        
                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-charcoal text-sm truncate">{item.name}</h3>
                          <p className="text-charcoal/60 text-sm">Quantity: {item.quantity}</p>
                          <p className="font-semibold text-sage text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>

                      {/* Photo Section */}
                      <div className="px-4 pb-4">
                        <div className="border-t border-stone/20 pt-4">
                          <h4 className="text-xs font-medium text-charcoal/80 mb-3">Custom Photo</h4>
                          
                          {/* Has Photo - Show current photo with options */}
                          {item.uploadedPhotoUrl ? <div className="space-y-3">
                              <div className="relative inline-block">
                                <img src={item.uploadedPhotoUrl} alt="Custom uploaded photo" className="w-20 h-20 object-cover rounded-lg border border-sage/30" />
                                <button onClick={() => handleRemovePhoto(item.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                              
                              {/* Upload New Photo Button */}
                              {!showUploadInterface[item.id] ? <Button type="button" variant="outline" size="sm" className="text-xs" onClick={() => toggleUploadInterface(item.id)}>
                                  <Camera className="w-3 h-3 mr-1" />
                                  Upload New Photo
                                </Button> : <div className="space-y-2 p-3 bg-stone/5 rounded-lg border border-stone/20">
                                  <p className="text-xs text-charcoal/70">Choose a new photo to replace the current one:</p>
                                  <div className="flex gap-2">
                                    <label className="flex-1">
                                      <input type="file" accept="image/*" onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(item.id, file);
                            }} className="hidden" id={`photo-upload-${item.id}`} />
                                      <Button type="button" size="sm" className="w-full text-xs" disabled={uploadingStates[item.id]} onClick={() => document.getElementById(`photo-upload-${item.id}`)?.click()}>
                                        <Upload className="w-3 h-3 mr-1" />
                                        {uploadingStates[item.id] ? 'Uploading...' : 'Choose File'}
                                      </Button>
                                    </label>
                                    <Button type="button" variant="ghost" size="sm" className="text-xs" onClick={() => toggleUploadInterface(item.id)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>}
                            </div> : item.willUploadLater ? (/* Will Upload Later State */
                    <div className="space-y-3">
                              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                                <span className="text-amber-600">📷</span>
                                <span className="text-xs text-amber-700">Will upload photo later</span>
                              </div>
                              
                              {!showUploadInterface[item.id] ? <div className="flex gap-2">
                                  <Button type="button" variant="outline" size="sm" className="flex-1 text-xs" onClick={() => toggleUploadInterface(item.id)}>
                                    <Upload className="w-3 h-3 mr-1" />
                                    Upload Now Instead
                                  </Button>
                                  <Button type="button" variant="ghost" size="sm" className="text-xs" onClick={() => handleWillUploadLater(item.id, false)}>
                                    Cancel
                                  </Button>
                                </div> : <div className="space-y-2 p-3 bg-stone/5 rounded-lg border border-stone/20">
                                  <p className="text-xs text-charcoal/70">Upload your photo now:</p>
                                  <div className="flex gap-2">
                                    <label className="flex-1">
                                      <input type="file" accept="image/*" onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleWillUploadLater(item.id, false);
                                handlePhotoUpload(item.id, file);
                              }
                            }} className="hidden" id={`photo-upload-later-${item.id}`} />
                                      <Button type="button" size="sm" className="w-full text-xs" disabled={uploadingStates[item.id]} onClick={() => document.getElementById(`photo-upload-later-${item.id}`)?.click()}>
                                        <Upload className="w-3 h-3 mr-1" />
                                        {uploadingStates[item.id] ? 'Uploading...' : 'Choose File'}
                                      </Button>
                                    </label>
                                    <Button type="button" variant="ghost" size="sm" className="text-xs" onClick={() => toggleUploadInterface(item.id)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>}
                            </div>) : (/* No Photo State */
                    <div className="space-y-3">
                              <div className="w-20 h-20 border-2 border-dashed border-stone/30 rounded-lg flex items-center justify-center bg-stone/10">
                                <Camera className="w-6 h-6 text-stone/40" />
                              </div>
                              
                              {!showUploadInterface[item.id] ? <div className="flex gap-2">
                                  <Button type="button" variant="outline" size="sm" className="flex-1 text-xs" onClick={() => toggleUploadInterface(item.id)}>
                                    <Plus className="w-3 h-3 mr-1" />
                                    Add Photo
                                  </Button>
                                  <Button type="button" variant="ghost" size="sm" className="text-xs" onClick={() => handleWillUploadLater(item.id, true)}>
                                    Later
                                  </Button>
                                </div> : <div className="space-y-2 p-3 bg-stone/5 rounded-lg border border-stone/20">
                                  <p className="text-xs text-charcoal/70">Upload your custom photo:</p>
                                  <div className="flex gap-2">
                                    <label className="flex-1">
                                      <input type="file" accept="image/*" onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(item.id, file);
                            }} className="hidden" id={`photo-upload-new-${item.id}`} />
                                      <Button type="button" size="sm" className="w-full text-xs" disabled={uploadingStates[item.id]} onClick={() => document.getElementById(`photo-upload-new-${item.id}`)?.click()}>
                                        <Upload className="w-3 h-3 mr-1" />
                                        {uploadingStates[item.id] ? 'Uploading...' : 'Choose File'}
                                      </Button>
                                    </label>
                                    <Button type="button" variant="ghost" size="sm" className="text-xs" onClick={() => toggleUploadInterface(item.id)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>}
                            </div>)}
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>

            {/* Order Summary - Made narrower (2/5 instead of 1/3) */}
            <div className="xl:col-span-2">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-sage/10 p-8 sticky top-8">
                <h3 className="text-2xl font-semibold text-charcoal font-playfair mb-8">Order Summary</h3>
                
                <div className="space-y-4 mb-8">
                  {couponCode ? <>
                      <div className="flex justify-between text-base">
                        <span className="text-charcoal/70">Original Subtotal</span>
                        <span className="font-semibold text-charcoal line-through">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-charcoal/70">Coupon ({couponCode})</span>
                        <span className="font-semibold text-sage">-${(subtotal * couponDiscount).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-base">
                        <span className="text-charcoal/70">Discounted Subtotal</span>
                        <span className="font-semibold text-sage">${discountedSubtotal.toFixed(2)}</span>
                      </div>
                    </> : <div className="flex justify-between text-base">
                      <span className="text-charcoal/70">Subtotal</span>
                      <span className="font-semibold text-charcoal">${subtotal.toFixed(2)}</span>
                    </div>}
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

                {/* Coupon Code Section */}
                <div className="border-t border-stone/20 pt-6 mb-8">
                  <h4 className="text-lg font-semibold text-charcoal mb-4">Have a Coupon?</h4>
                  
                  {couponCode ? <div className="bg-sage/5 border border-sage/20 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-sage">Applied: {couponCode}</span>
                          <p className="text-xs text-charcoal/60 mt-1">
                            Save ${(subtotal * couponDiscount).toFixed(2)} ({(couponDiscount * 100).toFixed(0)}% off)
                          </p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => {
                    removeCoupon();
                    setCouponInput('');
                  }} className="text-charcoal/70 hover:text-charcoal">
                          Remove
                        </Button>
                      </div>
                    </div> : <div className="space-y-3">
                      <div className="flex gap-3">
                        <Input placeholder="Enter coupon code" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())} className="flex-1" />
                        <Button onClick={async () => {
                    if (!couponInput.trim()) {
                      toast({
                        title: "Error",
                        description: "Please enter a coupon code",
                        variant: "destructive"
                      });
                      return;
                    }
                    setIsApplyingCoupon(true);
                    const success = await applyCoupon(couponInput.trim());
                    setIsApplyingCoupon(false);
                    if (success) {
                      setCouponInput('');
                    }
                  }} disabled={isApplyingCoupon} className="bg-sage text-white hover:bg-sage/90">
                          {isApplyingCoupon ? 'Applying...' : 'Apply'}
                        </Button>
                      </div>
                    </div>}
                </div>

                {/* Square Checkout */}
                <SquareCheckout customerInfo={customerInfo} shippingAddress={shippingAddress} billingAddress={billingAddress} sameAsShipping={sameAsShipping} total={total} subtotal={discountedSubtotal} shippingCost={shippingCost} tax={tax} onSuccess={handleSquareSuccess} onError={handleSquareError} />

                <div className="mt-6 text-center text-xs text-charcoal/60">
                  <p>
                    {settings.square_environment === 'production' ? '🔒 Live payment processing by Square' : '🔒 Secure checkout powered by Square'}
                  </p>
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