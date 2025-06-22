
import { Heart, Star, ShoppingCart, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Personalized Snow Globe",
      price: 22.50,
      originalPrice: 25.00,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600",
      description: "Turn your favorite memory into a magical snow globe that captures hearts and creates smiles every time they shake it.",
      href: "/products/snow-globes",
      rating: 5,
      reviews: 24,
      customerQuote: "My mom cries happy tears every time she looks at it!"
    },
    {
      id: 2,
      name: "Photo Memory Necklace",
      price: 15.00,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600",
      description: "Keep your loved ones close to your heart with this beautiful personalized necklace that tells your unique love story.",
      href: "/products/necklaces",
      rating: 5,
      reviews: 18,
      customerQuote: "I never take it off - it's like having my family with me always."
    },
    {
      id: 3,
      name: "Custom Photo Ornament",
      price: 12.00,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=600",
      description: "Create a holiday tradition that will be treasured for generations with your most precious family moments.",
      href: "/products/ornaments",
      rating: 5,
      reviews: 32,
      customerQuote: "Our Christmas tree has never looked more meaningful!"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
            <Heart className="h-4 w-4 mr-2" />
            Customer Favorites
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6 leading-tight">
            Your Memories, 
            <br />
            <span className="text-gradient">Their Perfect Gift</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See why thousands of customers choose us to create meaningful gifts that bring tears of joy and create lasting memories
          </p>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
                  
                  {/* Sale Badge */}
                  {product.originalPrice && (
                    <div className="absolute top-6 left-6 bg-accent text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      SAVE ${(product.originalPrice - product.price).toFixed(2)}
                    </div>
                  )}
                  
                  {/* Rating Overlay */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-accent fill-current" />
                          ))}
                          <span className="ml-2 text-sm font-semibold">({product.reviews} reviews)</span>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">${product.price}</div>
                          {product.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">${product.originalPrice}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-6 -left-6 w-20 h-20 bg-secondary/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
              </div>

              {/* Product Content */}
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <div className="inline-flex items-center px-3 py-1 bg-accent/10 rounded-full text-sm font-medium text-accent mb-4">
                  <Sparkles className="h-3 w-3 mr-2" />
                  Best Seller
                </div>
                
                <h3 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6 leading-tight">
                  {product.name}
                </h3>
                
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Customer Quote */}
                <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border-l-4 border-primary mb-8">
                  <p className="text-lg italic text-foreground font-playfair mb-2">
                    "{product.customerQuote}"
                  </p>
                  <p className="text-sm font-medium text-primary">— Verified Customer</p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={product.href} className="flex-1">
                    <Button className="w-full btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Order Now - ${product.price}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-lg px-8 py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white hover:scale-105 transition-all duration-300"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Personalize Today
                  </Button>
                </div>

                {/* Trust Elements */}
                <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Free Shipping
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Handcrafted
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    30-Day Guarantee
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20 bg-gradient-to-r from-primary/10 to-accent/10 rounded-3xl p-12">
          <h3 className="text-3xl font-playfair font-bold text-foreground mb-4">
            Ready to Create Something Beautiful?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who've turned their favorite memories into treasured keepsakes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button className="btn-primary text-lg px-10 py-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <Sparkles className="h-5 w-5 mr-2" />
              Start Personalizing
            </Button>
            <Button variant="outline" className="text-lg px-10 py-4 border-2 border-accent text-accent hover:bg-accent hover:text-white hover:scale-105 transition-all duration-300">
              View All Products
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
