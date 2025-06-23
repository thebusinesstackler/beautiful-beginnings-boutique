
import { Heart, Star, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Holiday Sparkle Ornaments",
      price: 22.50,
      originalPrice: 25.00,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600",
      description: "A shimmering memory you can hang with love. These glossy, vibrant photo ornaments are perfect for Christmas trees, mantle displays, or gift tags.",
      href: "/products/ornaments",
      rating: 5,
      reviews: 24,
      customerQuote: "A picture is worth a thousand words—ours are worth a lifetime!"
    },
    {
      id: 2,
      name: "Heartfelt Wearables",
      price: 15.00,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600",
      description: "Keep love close with beautiful charm bracelets, lockets, and keychains. Each piece is sublimated with your chosen photo and finished with a polished, durable gloss.",
      href: "/products/necklaces",
      rating: 5,
      reviews: 18,
      customerQuote: "Keepsakes that feel like hugs from home."
    },
    {
      id: 3,
      name: "Whimsy Wood Decor",
      price: 12.00,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600",
      description: "Bring a little merry to every corner with playful countdowns, rustic wreaths, and timeless accents made to charm.",
      href: "/products/wood-sublimation",
      rating: 5,
      reviews: 32,
      customerQuote: "We don't just make gifts—we make stories that stay."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: '#F6DADA', color: '#7A7047' }}>
            <Heart className="h-4 w-4 mr-2" />
            Handmade with Heart
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight" style={{ color: '#5B4C37' }}>
            Handmade with Heart.
            <br />
            <span className="bg-gradient-to-r from-[#E28F84] to-[#F4A79B] bg-clip-text text-transparent">Crafted to Last.</span>
          </h2>
          <p className="text-xl max-w-4xl mx-auto leading-relaxed mb-8" style={{ color: '#A89B84' }}>
            Beautiful Beginnings is a small business built on love, creativity, and the joy of preserving memories. 
            Every item is designed and sublimated by hand—ensuring that what you give (or keep!) is truly one of a kind.
          </p>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: '#A89B84' }}>
            Our specialty? Gorgeous, glossy photo keepsakes that shine with color, warmth, and emotion. 
            Whether you're celebrating the cozy glow of the holidays or just looking for that perfect anytime gift, our pieces are made to be treasured.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Sparkles, title: "Sublimated Keepsakes", desc: "Ornaments, jewelry, and keepsakes" },
            { icon: Heart, title: "Holiday & Fall Décor", desc: "Seasonal themed decorations" },
            { icon: Star, title: "Insulated Drinkware", desc: "Glass tumblers and personalized cups" },
            { icon: Heart, title: "Home Décor", desc: "Wreaths and decorative pieces" },
            { icon: Sparkles, title: "Personalized Gifts", desc: "For every season and occasion" },
            { icon: Star, title: "Glossy Finish", desc: "Guaranteed to be cherished" }
          ].map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-2xl bg-white shadow-lg border" style={{ borderColor: '#F6DADA' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F6DADA' }}>
                <feature.icon className="h-8 w-8" style={{ color: '#E28F84' }} />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: '#5B4C37' }}>{feature.title}</h3>
              <p style={{ color: '#A89B84' }}>{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Zigzag Product Layout */}
        <div className="space-y-24">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`grid lg:grid-cols-2 gap-16 items-center animate-fade-in ${
                index % 2 === 1 ? 'lg:grid-flow-dense' : ''
              }`}
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Product Image */}
              <div className={`relative ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[500px] object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  
                  {/* Sale Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-6 left-6 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg" style={{ backgroundColor: '#E28F84' }}>
                      SAVE ${(product.originalPrice - product.price).toFixed(2)}
                    </div>
                  )}
                  
                  {/* Rating Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" style={{ color: '#E28F84' }} />
                          ))}
                          <span className="ml-2 text-sm font-semibold">({product.reviews} reviews)</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: '#E28F84' }}>${product.price}</div>
                          {product.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">${product.originalPrice}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full blur-xl" style={{ backgroundColor: '#F6DADA' }}></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-xl" style={{ backgroundColor: '#F4A79B' }}></div>
              </div>

              {/* Product Content */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: '#F6DADA', color: '#E28F84' }}>
                  <Sparkles className="h-3 w-3 mr-2" />
                  Best Seller
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: '#5B4C37' }}>
                  {product.name}
                </h3>
                
                <p className="text-lg mb-6 leading-relaxed" style={{ color: '#A89B84' }}>
                  {product.description}
                </p>

                {/* Customer Quote */}
                <div className="rounded-2xl p-6 border-l-4 mb-8" style={{ backgroundColor: '#F6DADA', borderColor: '#E28F84' }}>
                  <p className="text-lg italic mb-2" style={{ color: '#5B4C37' }}>
                    "{product.customerQuote}"
                  </p>
                  <p className="text-sm font-medium" style={{ color: '#E28F84' }}>— Verified Customer</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={product.href} className="flex-1">
                    <Button className="w-full text-lg px-8 py-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-white font-semibold" style={{ backgroundColor: '#E28F84' }}>
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Order Now - ${product.price}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-lg px-8 py-4 border-2 hover:scale-105 transition-all duration-300"
                    style={{ borderColor: '#7A7047', color: '#7A7047' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F6DADA';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Personalize Today
                  </Button>
                </div>

                {/* Trust Elements */}
                <div className="flex items-center justify-center space-x-6 mt-6 text-sm" style={{ color: '#A89B84' }}>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Free Shipping
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#E28F84' }}></div>
                    Handcrafted
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#7A7047' }}></div>
                    30-Day Guarantee
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 rounded-3xl p-12" style={{ background: 'linear-gradient(135deg, #F6DADA 0%, #F4A79B 100%)' }}>
          <h3 className="text-3xl font-bold mb-4" style={{ color: '#5B4C37' }}>
            Your Memories Deserve to Shine
          </h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto" style={{ color: '#7A7047' }}>
            Join thousands of happy customers who've turned their favorite memories into treasured keepsakes that feel like hugs from home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button className="text-lg px-10 py-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-white font-semibold" style={{ backgroundColor: '#E28F84' }}>
              <Sparkles className="h-5 w-5 mr-2" />
              Start Personalizing
            </Button>
            <Button variant="outline" className="text-lg px-10 py-4 border-2 hover:scale-105 transition-all duration-300" style={{ borderColor: '#7A7047', color: '#7A7047' }}>
              View All Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
