
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const OurStory = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-playfair mb-6">
            Our Story
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Every cherished memory deserves to be beautifully preserved. At Beautiful Beginnings, 
            we transform your most precious moments into stunning keepsakes that will last a lifetime.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 font-playfair">
              Where It All Began
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Beautiful Beginnings was born from a simple belief: that every special moment 
              deserves to be celebrated and remembered. Our founder started this journey 
              after realizing how quickly precious memories can fade without something 
              tangible to hold onto.
            </p>
            <p className="text-gray-600 leading-relaxed">
              What began as a personal quest to preserve family memories has grown into 
              a passion for helping others create beautiful, personalized keepsakes that 
              tell their unique stories.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To create beautiful, personalized products that help families celebrate 
                and preserve their most treasured memories for generations to come.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-playfair text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl">✨</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Quality Craftsmanship</h3>
              <p className="text-gray-600">
                Every product is carefully crafted with attention to detail, using only 
                the finest materials to ensure your memories are preserved beautifully.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-300 to-green-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Touch</h3>
              <p className="text-gray-600">
                We understand that every story is unique. That's why we offer personalized 
                customization to make each piece truly special and meaningful.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-purple-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Customer Care</h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're here to help you every step of 
                the way, from selection to delivery and beyond.
              </p>
            </div>
          </div>
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 font-playfair text-center mb-8">
            How We Bring Your Memories to Life
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg font-bold text-rose-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Choose Your Product</h4>
              <p className="text-sm text-gray-600">
                Browse our collection of beautiful keepsakes and select the perfect one for you.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg font-bold text-rose-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Upload Your Photo</h4>
              <p className="text-sm text-gray-600">
                Share your precious memories by uploading your favorite photos.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg font-bold text-rose-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">We Create Magic</h4>
              <p className="text-sm text-gray-600">
                Our skilled artisans carefully craft your personalized keepsake with love.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-rose-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-lg font-bold text-rose-600">4</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Delivered to You</h4>
              <p className="text-sm text-gray-600">
                Receive your beautiful, one-of-a-kind keepsake ready to treasure forever.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-playfair mb-6">
            Ready to Create Your Own Memory?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of families who have trusted us to preserve their most cherished moments.
          </p>
          <div className="space-x-4">
            <a
              href="/shop"
              className="inline-block bg-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-600 transition-colors"
            >
              Start Shopping
            </a>
            <a
              href="mailto:hello@beautifulbeginnings.com"
              className="inline-block border-2 border-rose-500 text-rose-500 px-8 py-3 rounded-lg font-semibold hover:bg-rose-50 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OurStory;
