
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Package, RefreshCw, Clock, Shield, Truck, MapPin } from 'lucide-react';

const ShippingReturns = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: '#faf6ee' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6" style={{ color: '#5B4C37' }}>
            Shipping & Returns
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#A89B84' }}>
            Everything you need to know about our shipping policies and return process
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Shipping Information */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <Truck className="h-8 w-8 mr-4" style={{ color: '#E28F84' }} />
            <h2 className="text-3xl font-playfair font-bold" style={{ color: '#5B4C37' }}>
              Shipping Information
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 mr-3" style={{ color: '#E28F84' }} />
                <h3 className="text-xl font-semibold" style={{ color: '#5B4C37' }}>Processing Time</h3>
              </div>
              <p className="mb-4" style={{ color: '#A89B84' }}>
                All orders are processed within 1-3 business days. Custom and personalized items may require additional processing time of 3-5 business days.
              </p>
              <p className="text-sm" style={{ color: '#7A7047' }}>
                Orders placed on weekends will be processed the following Monday.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 mr-3" style={{ color: '#E28F84' }} />
                <h3 className="text-xl font-semibold" style={{ color: '#5B4C37' }}>Delivery Times</h3>
              </div>
              <ul className="space-y-2" style={{ color: '#A89B84' }}>
                <li><strong>Standard Shipping:</strong> 5-7 business days</li>
                <li><strong>Express Shipping:</strong> 2-3 business days</li>
                <li><strong>Overnight:</strong> 1 business day</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
            <h3 className="text-2xl font-semibold mb-6" style={{ color: '#5B4C37' }}>Shipping Rates</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#faf6ee' }}>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#5B4C37' }}>Order Value</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#5B4C37' }}>Standard</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#5B4C37' }}>Express</th>
                    <th className="text-left py-3 px-4 font-semibold" style={{ color: '#5B4C37' }}>Overnight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-3 px-4" style={{ color: '#A89B84' }}>Under $50</td>
                    <td className="py-3 px-4" style={{ color: '#A89B84' }}>$7.99</td>
                    <td className="py-3 px-4" style={{ color: '#A89B84' }}>$12.99</td>
                    <td className="py-3 px-4" style={{ color: '#A89B84' }}>$24.99</td>
                  </tr>
                  <tr style={{ backgroundColor: '#faf6ee' }}>
                    <td className="py-3 px-4" style={{ color: '#A89B84' }}>$50 - $99</td>
                    <td className="py-3 px-4" style={{ color: '#A89B84' }}>$5.99</td>
                    <td className="py-3 px-4" style={{ color: '#A89B84' }}>$9.99</td>
                    <td className="py-3 px-4" style={{ color: '#A89B84' }}>$19.99</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4" style={{ color: '#A89B84' }}>$100+</td>
                    <td className="py-3 px-4 font-semibold" style={{ color: '#E28F84' }}>FREE</td>
                    <td className="py-3 px-4" style={{ color: '#A89B84' }}>$7.99</td>
                    <td className="py-3 px-4" style={{ color: '#A89B84' }}>$14.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Returns Policy */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <RefreshCw className="h-8 w-8 mr-4" style={{ color: '#E28F84' }} />
            <h2 className="text-3xl font-playfair font-bold" style={{ color: '#5B4C37' }}>
              Returns & Exchanges
            </h2>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm mb-8" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
            <h3 className="text-2xl font-semibold mb-6" style={{ color: '#5B4C37' }}>30-Day Return Policy</h3>
            <p className="mb-6 text-lg" style={{ color: '#A89B84' }}>
              We want you to love your Beautiful Beginnings purchase! If you're not completely satisfied, 
              you can return most items within 30 days of delivery for a full refund.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#5B4C37' }}>Returnable Items:</h4>
                <ul className="space-y-2" style={{ color: '#A89B84' }}>
                  <li>• Non-personalized ornaments</li>
                  <li>• Standard jewelry pieces</li>
                  <li>• Unused drinkware</li>
                  <li>• Home décor items</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#5B4C37' }}>Non-Returnable Items:</h4>
                <ul className="space-y-2" style={{ color: '#A89B84' }}>
                  <li>• Personalized/custom items</li>
                  <li>• Photo products</li>
                  <li>• Engraved pieces</li>
                  <li>• Final sale items</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
            <h3 className="text-2xl font-semibold mb-6" style={{ color: '#5B4C37' }}>How to Return</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F6DADA' }}>
                  <span className="text-2xl font-bold" style={{ color: '#5B4C37' }}>1</span>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: '#5B4C37' }}>Contact Us</h4>
                <p className="text-sm" style={{ color: '#A89B84' }}>
                  Email us with your order number and reason for return
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F6DADA' }}>
                  <span className="text-2xl font-bold" style={{ color: '#5B4C37' }}>2</span>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: '#5B4C37' }}>Get Label</h4>
                <p className="text-sm" style={{ color: '#A89B84' }}>
                  We'll send you a prepaid return shipping label
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F6DADA' }}>
                  <span className="text-2xl font-bold" style={{ color: '#5B4C37' }}>3</span>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: '#5B4C37' }}>Ship Back</h4>
                <p className="text-sm" style={{ color: '#A89B84' }}>
                  Package securely and drop off at any carrier location
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Damaged/Defective Items */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <Shield className="h-8 w-8 mr-4" style={{ color: '#E28F84' }} />
            <h2 className="text-3xl font-playfair font-bold" style={{ color: '#5B4C37' }}>
              Damaged or Defective Items
            </h2>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
            <p className="mb-6 text-lg" style={{ color: '#A89B84' }}>
              If your item arrives damaged or defective, we'll make it right immediately! Contact us within 7 days 
              of delivery with photos of the issue, and we'll send a replacement or provide a full refund.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#5B4C37' }}>What We Need:</h4>
                <ul className="space-y-2" style={{ color: '#A89B84' }}>
                  <li>• Order number</li>
                  <li>• Photos of damage/defect</li>
                  <li>• Description of the issue</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3" style={{ color: '#5B4C37' }}>What We'll Do:</h4>
                <ul className="space-y-2" style={{ color: '#A89B84' }}>
                  <li>• Send replacement (fastest option)</li>
                  <li>• Full refund if preferred</li>
                  <li>• No need to return damaged item</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="text-center p-8 rounded-2xl" style={{ backgroundColor: '#faf6ee' }}>
          <h2 className="text-2xl font-playfair font-bold mb-4" style={{ color: '#5B4C37' }}>
            Need Help?
          </h2>
          <p className="mb-6" style={{ color: '#A89B84' }}>
            Our customer service team is here to help with any shipping or return questions.
          </p>
          <div className="space-y-2">
            <p style={{ color: '#5B4C37' }}>
              <strong>Email:</strong> <a href="mailto:support@beautifulbeginnings.com" className="hover:underline" style={{ color: '#E28F84' }}>support@beautifulbeginnings.com</a>
            </p>
            <p style={{ color: '#5B4C37' }}>
              <strong>Phone:</strong> <a href="tel:1-800-BEAUTIFUL" className="hover:underline" style={{ color: '#E28F84' }}>1-800-BEAUTIFUL</a>
            </p>
            <p className="text-sm" style={{ color: '#A89B84' }}>
              Monday - Friday: 9AM - 6PM EST
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default ShippingReturns;
