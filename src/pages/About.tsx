
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Heart, Star, Sparkles, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold mb-6 border" style={{ backgroundColor: '#F6DADA', color: '#7A7047', borderColor: '#E28F84' }}>
            <Sparkles className="h-4 w-4 mr-2" />
            Handcrafted with Love Since 2020
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-playfair mb-6">
            Where Memories Begin and
            <span className="bg-gradient-to-r from-[#E28F84] to-[#F4A79B] bg-clip-text text-transparent"> Beauty Lasts</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every family has those magical moments that deserve to be treasured forever. 
            At Beautiful Beginnings, we transform your most precious memories into stunning, 
            personalized keepsakes that capture the heart of what matters most.
          </p>
        </div>

        {/* Main Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 font-playfair">
              A Journey Born from Love
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Beautiful Beginnings started with a simple moment—watching precious family photos 
              fade and realizing how quickly our most treasured memories can slip away. We believed 
              there had to be a better way to hold onto those irreplaceable moments.
            </p>
            <p className="text-gray-600 leading-relaxed">
              What began as a heartfelt mission to preserve our own family memories has blossomed 
              into something beautiful: helping hundreds of families create tangible keepsakes 
              that tell their unique stories with elegance and lasting brilliance.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From shimmering ornaments that catch the light just right to delicate jewelry 
              that keeps loved ones close to your heart, every piece we create is infused 
              with the same care and attention we'd give to our own family treasures.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Heart & Soul</h3>
              <p className="text-gray-600 leading-relaxed">
                Every keepsake we create carries a piece of our heart. We understand that you're 
                not just buying a product—you're preserving a moment, celebrating a milestone, 
                or creating a legacy that will be cherished for generations.
              </p>
            </div>
          </div>
        </div>

        {/* What Makes Us Special */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-playfair text-center mb-12">
            The Beautiful Beginnings Difference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Glossy & Glowing</h3>
              <p className="text-gray-600 leading-relaxed">
                Our signature brilliant finish doesn't just look beautiful—it captures and reflects 
                light in a way that makes your memories literally shine. Each piece is carefully 
                crafted to maintain that stunning luster for years to come.
              </p>
            </div>
            <div className="text-center bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-green-300 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Handmade with Heart</h3>
              <p className="text-gray-600 leading-relaxed">
                Every single piece is lovingly handcrafted by artisans who understand that they're 
                not just creating a product—they're helping preserve someone's most precious moment. 
                That personal touch makes all the difference.
              </p>
            </div>
            <div className="text-center bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Lasting Memories</h3>
              <p className="text-gray-600 leading-relaxed">
                We use only the finest materials and time-tested techniques to ensure your keepsakes 
                will be treasured not just today, but by future generations. Quality isn't just 
                what we do—it's who we are.
              </p>
            </div>
          </div>
        </div>

        {/* Our Promise */}
        <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-8 md:p-12 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-6">
              Our Promise to Your Family
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              When you choose Beautiful Beginnings, you're not just getting a keepsake—you're 
              getting a piece of our commitment to excellence, our passion for preserving memories, 
              and our promise that your most precious moments will be honored with the care and 
              beauty they deserve.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Quality Guaranteed</h4>
                  <p className="text-gray-600 text-sm">Every piece meets our highest standards before it reaches your hands</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Personal Touch</h4>
                  <p className="text-gray-600 text-sm">Each keepsake is customized to tell your unique story</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Lasting Beauty</h4>
                  <p className="text-gray-600 text-sm">Designed to remain beautiful for generations to come</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center mt-1">
                  <span className="text-white text-sm">✓</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Customer Care</h4>
                  <p className="text-gray-600 text-sm">We're here to help make your vision come to life</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-6">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Let us help you transform your most cherished memories into keepsakes that will 
            be treasured for a lifetime. Every moment matters, and every memory deserves 
            to shine.
          </p>
          <div className="space-x-4">
            <Button
              asChild
              className="text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200"
              style={{ backgroundColor: '#E28F84' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F4A79B'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#E28F84'}
            >
              <Link to="/shop">
                Start Creating
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200"
              style={{ 
                borderColor: '#E28F84', 
                color: '#7A7047',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F6DADA';
                e.currentTarget.style.borderColor = '#E28F84';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.borderColor = '#E28F84';
              }}
            >
              <Link to="/our-story">
                Learn Our Story
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
