
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Mail, Phone, Clock, CheckCircle, Star, Heart, Palette, Camera } from 'lucide-react';

const CustomOrders = () => {
  const customizationOptions = [
    {
      icon: Camera,
      title: "Photo Personalization",
      description: "Upload your favorite photos to create unique keepsakes",
      features: ["High-quality printing", "Multiple photo layouts", "Custom cropping options"]
    },
    {
      icon: Palette,
      title: "Color Customization",
      description: "Choose from our wide range of colors and finishes",
      features: ["Premium color options", "Metallic finishes", "Matte and glossy choices"]
    },
    {
      icon: Heart,
      title: "Text Engraving",
      description: "Add names, dates, or special messages",
      features: ["Multiple font styles", "Custom sizing", "Symbol additions"]
    }
  ];

  const customProducts = [
    {
      name: "Custom Photo Ornaments",
      description: "Personalized ornaments with your cherished memories",
      startingPrice: 29.99,
      image: "https://images.unsplash.com/photo-1608797725744-c05b2c62c5c6?w=300&h=300&fit=crop"
    },
    {
      name: "Memory Jewelry",
      description: "Necklaces and pendants featuring your special photos",
      startingPrice: 39.99,
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=300&fit=crop"
    },
    {
      name: "Wood Photo Prints",
      description: "Beautiful wood grain backgrounds with your photos",
      startingPrice: 34.99,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop"
    },
    {
      name: "Slate Keepsakes",
      description: "Elegant slate pieces with personalized engravings",
      startingPrice: 24.99,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Submit Your Request",
      description: "Fill out our custom order form with your vision"
    },
    {
      step: 2,
      title: "Design Consultation",
      description: "We'll work with you to perfect your design"
    },
    {
      step: 3,
      title: "Approval & Production",
      description: "Once approved, we'll handcraft your piece"
    },
    {
      step: 4,
      title: "Quality Check & Shipping",
      description: "Final inspection and careful packaging for delivery"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: '#faf6ee' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6" style={{ color: '#5B4C37' }}>
            Custom Orders
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed mb-8" style={{ color: '#A89B84' }}>
            Bring your unique vision to life with our personalized keepsakes, handcrafted just for you
          </p>
          <div className="flex items-center justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-current" style={{ color: '#E28F84' }} />
            ))}
            <span className="ml-2 text-lg font-medium" style={{ color: '#5B4C37' }}>
              Trusted by 2,000+ customers
            </span>
          </div>
        </div>
      </section>

      {/* Customization Options */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4" style={{ color: '#5B4C37' }}>
              Endless Customization Options
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#A89B84' }}>
              Every piece is crafted to your exact specifications with attention to detail
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {customizationOptions.map((option, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm text-center" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: '#F6DADA' }}>
                  <option.icon className="h-8 w-8" style={{ color: '#5B4C37' }} />
                </div>
                <h3 className="text-xl font-semibold mb-4" style={{ color: '#5B4C37' }}>
                  {option.title}
                </h3>
                <p className="mb-6" style={{ color: '#A89B84' }}>
                  {option.description}
                </p>
                <ul className="space-y-2">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center justify-center text-sm">
                      <CheckCircle className="h-4 w-4 mr-2" style={{ color: '#7A7047' }} />
                      <span style={{ color: '#A89B84' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Products */}
      <section className="py-16" style={{ backgroundColor: '#faf6ee' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4" style={{ color: '#5B4C37' }}>
              Popular Custom Products
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#A89B84' }}>
              Start with these popular options or create something entirely unique
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {customProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#5B4C37' }}>
                    {product.name}
                  </h3>
                  <p className="text-sm mb-4" style={{ color: '#A89B84' }}>
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold" style={{ color: '#E28F84' }}>
                      Starting at ${product.startingPrice}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-playfair font-bold mb-4" style={{ color: '#5B4C37' }}>
              How It Works
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: '#A89B84' }}>
              Our simple process ensures your custom piece exceeds expectations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-xl font-bold" style={{ backgroundColor: '#E28F84' }}>
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-3" style={{ color: '#5B4C37' }}>
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: '#A89B84' }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16" style={{ backgroundColor: '#faf6ee' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-6" style={{ color: '#5B4C37' }}>
            Ready to Create Something Special?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#A89B84' }}>
            Get in touch to discuss your custom order and bring your vision to life
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#E28F84' }}>
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#5B4C37' }}>Email Us</h3>
              <p className="text-sm" style={{ color: '#A89B84' }}>custom@beautifulbeginnings.com</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#E28F84' }}>
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#5B4C37' }}>Call Us</h3>
              <p className="text-sm" style={{ color: '#A89B84' }}>1-800-BEAUTIFUL</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#E28F84' }}>
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#5B4C37' }}>Response Time</h3>
              <p className="text-sm" style={{ color: '#A89B84' }}>Within 24 hours</p>
            </div>
          </div>

          <a
            href="/contact"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#E28F84' }}
          >
            Start Your Custom Order
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomOrders;
