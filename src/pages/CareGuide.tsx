
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Droplets, Sun, Thermometer, Shield, Heart, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

const CareGuide = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: '#faf6ee' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6" style={{ color: '#5B4C37' }}>
            Care Guide
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#A89B84' }}>
            Keep your Beautiful Beginnings treasures looking their best with our comprehensive care instructions
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Jewelry Care */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <Sparkles className="h-8 w-8 mr-4" style={{ color: '#E28F84' }} />
            <h2 className="text-3xl font-playfair font-bold" style={{ color: '#5B4C37' }}>
              Jewelry Care
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
              <div className="flex items-center mb-4">
                <Droplets className="h-6 w-6 mr-3" style={{ color: '#E28F84' }} />
                <h3 className="text-xl font-semibold" style={{ color: '#5B4C37' }}>Daily Care</h3>
              </div>
              <ul className="space-y-3" style={{ color: '#A89B84' }}>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0" style={{ color: '#7A7047' }} />
                  <span>Clean with a soft, lint-free cloth after each wear</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0" style={{ color: '#7A7047' }} />
                  <span>Store separately to prevent scratching</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 mt-1 flex-shrink-0" style={{ color: '#7A7047' }} />
                  <span>Remove before swimming, showering, or exercising</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
              <div className="flex items-center mb-4">
                <Shield className="h-6 w-6 mr-3" style={{ color: '#E28F84' }} />
                <h3 className="text-xl font-semibold" style={{ color: '#5B4C37' }}>Protection</h3>
              </div>
              <ul className="space-y-3" style={{ color: '#A89B84' }}>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-1 flex-shrink-0" style={{ color: '#E28F84' }} />
                  <span>Avoid contact with lotions, perfumes, and chemicals</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-1 flex-shrink-0" style={{ color: '#E28F84' }} />
                  <span>Keep away from extreme temperatures</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="h-4 w-4 mr-2 mt-1 flex-shrink-0" style={{ color: '#E28F84' }} />
                  <span>Handle photo pendants with extra care</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Ornament Care */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <Heart className="h-8 w-8 mr-4" style={{ color: '#E28F84' }} />
            <h2 className="text-3xl font-playfair font-bold" style={{ color: '#5B4C37' }}>
              Ornament Care
            </h2>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm mb-8" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F6DADA' }}>
                  <Thermometer className="h-8 w-8" style={{ color: '#5B4C37' }} />
                </div>
                <h4 className="font-semibold mb-2" style={{ color: '#5B4C37' }}>Storage</h4>
                <p className="text-sm" style={{ color: '#A89B84' }}>
                  Store in original box with tissue paper in a cool, dry place
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F6DADA' }}>
                  <Droplets className="h-8 w-8" style={{ color: '#5B4C37' }} />
                </div>
                <h4 className="font-semibold mb-2" style={{ color: '#5B4C37' }}>Cleaning</h4>
                <p className="text-sm" style={{ color: '#A89B84' }}>
                  Dust gently with a soft brush or microfiber cloth
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F6DADA' }}>
                  <Sun className="h-8 w-8" style={{ color: '#5B4C37' }} />
                </div>
                <h4 className="font-semibold mb-2" style={{ color: '#5B4C37' }}>Display</h4>
                <p className="text-sm" style={{ color: '#A89B84' }}>
                  Keep away from direct sunlight to prevent fading
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Wood & Slate Care */}
        <section className="mb-16">
          <div className="flex items-center mb-8">
            <Shield className="h-8 w-8 mr-4" style={{ color: '#E28F84' }} />
            <h2 className="text-3xl font-playfair font-bold" style={{ color: '#5B4C37' }}>
              Wood & Slate Care
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#5B4C37' }}>Wood Products</h3>
              <ul className="space-y-3" style={{ color: '#A89B84' }}>
                <li>• Wipe with a dry cloth to remove dust</li>
                <li>• Use wood polish sparingly if needed</li>
                <li>• Avoid soaking in water</li>
                <li>• Keep away from heat sources</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#5B4C37' }}>Slate Products</h3>
              <ul className="space-y-3" style={{ color: '#A89B84' }}>
                <li>• Clean with damp cloth and mild soap</li>
                <li>• Dry thoroughly after cleaning</li>
                <li>• Handle with care to prevent chipping</li>
                <li>• Store upright when possible</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="text-center p-8 rounded-2xl" style={{ backgroundColor: '#faf6ee' }}>
          <h2 className="text-2xl font-playfair font-bold mb-4" style={{ color: '#5B4C37' }}>
            Need More Help?
          </h2>
          <p className="mb-6" style={{ color: '#A89B84' }}>
            Have questions about caring for your specific item? We're here to help!
          </p>
          <div className="space-y-2">
            <p style={{ color: '#5B4C37' }}>
              <strong>Email:</strong> <a href="mailto:care@beautifulbeginnings.com" className="hover:underline" style={{ color: '#E28F84' }}>care@beautifulbeginnings.com</a>
            </p>
            <p style={{ color: '#5B4C37' }}>
              <strong>Phone:</strong> <a href="tel:1-800-BEAUTIFUL" className="hover:underline" style={{ color: '#E28F84' }}>1-800-BEAUTIFUL</a>
            </p>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default CareGuide;
