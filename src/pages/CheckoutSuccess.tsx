
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { toast } from '@/hooks/use-toast';

const CheckoutSuccess = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear cart after successful payment
    clearCart();
    
    // Show success toast
    toast({
      title: "Payment Successful!",
      description: "Your order has been processed and you'll receive a confirmation email shortly.",
    });
  }, [clearCart]);

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="h-12 w-12 text-sage" />
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-charcoal font-playfair mb-4">
            Thank You for Your Order!
          </h1>
          <p className="text-xl text-charcoal/70 mb-8 max-w-2xl mx-auto">
            We received your order! We're excited to create your personalized keepsake!
          </p>

          {/* Order Details Card */}
          <div className="bg-pearl rounded-lg shadow-sm border border-sage/10 p-8 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Package className="h-8 w-8 text-sage mr-3" />
              <h2 className="text-2xl font-semibold text-charcoal font-playfair">
                What's Next?
              </h2>
            </div>
            
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-sage rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Order Confirmation</h3>
                  <p className="text-charcoal/70">You'll receive an email confirmation with your order details within the next few minutes.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-sage rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Photo Processing</h3>
                  <p className="text-charcoal/70">We'll carefully process your uploaded photos and begin crafting your personalized items.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-sage rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal">Shipping Updates</h3>
                  <p className="text-charcoal/70">You'll receive tracking information once your order ships (typically within 3-5 business days).</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/products/ornaments">
              <Button className="bg-sage hover:bg-forest text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg">
                Continue Shopping
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            
            <Link to="/contact">
              <Button 
                variant="outline" 
                className="border-sage/30 text-sage hover:bg-sage/5 hover:border-sage/50 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-8 p-4 bg-sage/5 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-charcoal/70">
              <strong>Need help?</strong> If you have any questions about your order, please don't hesitate to contact us. 
              We're here to ensure your personalized keepsakes are perfect!
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CheckoutSuccess;
