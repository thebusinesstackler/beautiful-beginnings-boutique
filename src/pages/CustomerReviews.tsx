
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Star, Quote, Filter, Search, ThumbsUp, Calendar } from 'lucide-react';
import { useState } from 'react';

const CustomerReviews = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      date: '2024-01-15',
      category: 'Necklaces',
      product: 'Photo Memory Necklace',
      text: 'I ordered a photo necklace for my mom\'s birthday and she absolutely loved it! The quality is amazing and it arrived beautifully packaged. The photo came out so clear and vibrant. Will definitely order again!',
      image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100',
      helpful: 24,
      verified: true
    },
    {
      id: 2,
      name: 'Michael Chen',
      rating: 5,
      date: '2024-01-10',
      category: 'Ornaments',
      product: 'Custom Photo Ornament',
      text: 'The personalized ornament we got for our first Christmas together is perfect. It\'s become our most treasured decoration. The craftsmanship is incredible and the photo quality exceeded our expectations!',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100',
      helpful: 18,
      verified: true
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      rating: 5,
      date: '2024-01-05',
      category: 'Slate',
      product: 'Slate Photo Keepsake',
      text: 'I\'ve ordered several slate keepsakes as gifts and everyone has been blown away by the quality. The photos come out so clear and beautiful! The customer service is also exceptional.',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100',
      helpful: 31,
      verified: true
    },
    {
      id: 4,
      name: 'David Thompson',
      rating: 5,
      date: '2023-12-28',
      category: 'Snow Globes',
      product: 'Custom Photo Snow Globe',
      text: 'Absolutely stunning! The snow globe with our family photo is magical. My kids are obsessed with it and it brings such joy to our home. Perfect quality and fast shipping.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      helpful: 15,
      verified: true
    },
    {
      id: 5,
      name: 'Lisa Martinez',
      rating: 5,
      date: '2023-12-20',
      category: 'Wood',
      product: 'Wood Photo Print',
      text: 'The wood photo print exceeded all my expectations! The colors are vibrant and the wood grain adds such a beautiful texture. It\'s now the centerpiece of our living room.',
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100',
      helpful: 22,
      verified: true
    },
    {
      id: 6,
      name: 'James Wilson',
      rating: 4,
      date: '2023-12-15',
      category: 'Necklaces',
      product: 'Heart Photo Pendant',
      text: 'Beautiful necklace with great attention to detail. The only reason I\'m giving 4 stars instead of 5 is that shipping took a bit longer than expected, but the quality made up for it!',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      helpful: 12,
      verified: true
    }
  ];

  const categories = ['All', 'Necklaces', 'Ornaments', 'Slate', 'Snow Globes', 'Wood'];

  const filteredReviews = reviews.filter(review => {
    const matchesCategory = selectedCategory === 'All' || review.category === selectedCategory;
    const matchesSearch = review.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-current' : ''}`}
        style={{ color: '#E28F84' }}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20" style={{ backgroundColor: '#faf6ee' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-6" style={{ color: '#5B4C37' }}>
            Customer Reviews
          </h1>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#A89B84' }}>
            See what our customers are saying about their Beautiful Beginnings treasures
          </p>
          <div className="flex items-center justify-center mt-8 space-x-2">
            <div className="flex">
              {renderStars(5)}
            </div>
            <span className="text-2xl font-bold" style={{ color: '#5B4C37' }}>4.9</span>
            <span style={{ color: '#A89B84' }}>from 2,847 reviews</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b" style={{ borderColor: '#F6DADA' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5" style={{ color: '#A89B84' }} />
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: selectedCategory === category ? '#E28F84' : 'transparent',
                      borderColor: '#F6DADA',
                      borderWidth: '1px'
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: '#A89B84' }} />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 w-full md:w-64"
                style={{ borderColor: '#F6DADA', '--tw-ring-color': '#E28F84' } as any}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8">
            {filteredReviews.map(review => (
              <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
                <div className="flex items-start space-x-4">
                  <img
                    src={review.image}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold" style={{ color: '#5B4C37' }}>
                          {review.name}
                          {review.verified && (
                            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                              Verified Purchase
                            </span>
                          )}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm" style={{ color: '#A89B84' }}>
                            {review.product}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm" style={{ color: '#A89B84' }}>
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(review.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Quote className="h-5 w-5 mb-2" style={{ color: '#E28F84' }} />
                      <p className="text-gray-700 leading-relaxed">{review.text}</p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <button className="flex items-center space-x-2 text-sm hover:text-blue-600 transition-colors" style={{ color: '#A89B84' }}>
                        <ThumbsUp className="h-4 w-4" />
                        <span>Helpful ({review.helpful})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl" style={{ color: '#A89B84' }}>
                No reviews found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16" style={{ backgroundColor: '#faf6ee' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-playfair font-bold mb-6" style={{ color: '#5B4C37' }}>
            Share Your Experience
          </h2>
          <p className="text-lg mb-8" style={{ color: '#A89B84' }}>
            Purchased from Beautiful Beginnings? We'd love to hear about your experience!
          </p>
          <a
            href="/contact"
            className="inline-block px-8 py-3 rounded-lg font-semibold text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#E28F84' }}
          >
            Write a Review
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomerReviews;
