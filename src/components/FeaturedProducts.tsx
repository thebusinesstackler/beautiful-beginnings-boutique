
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const FeaturedProducts = () => {
  const [likedProducts, setLikedProducts] = useState<Set<number>>(new Set());

  const products = [
    {
      id: 1,
      name: "Personalized Snow Globe",
      price: 22.50,
      originalPrice: 25.00,
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400",
      category: "Snow Globes",
      description: "Beautiful snow globe with your favorite photo, perfect for holiday displays",
      href: "/products/snow-globes",
      rating: 5,
      reviews: 24
    },
    {
      id: 2,
      name: "Photo Memory Necklace",
      price: 15.00,
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400",
      category: "Necklaces",
      description: "Keep your loved ones close with this personalized photo necklace",
      href: "/products/necklaces",
      rating: 5,
      reviews: 18
    },
    {
      id: 3,
      name: "Custom Photo Ornament",
      price: 12.00,
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400",
      category: "Ornaments",
      description: "Transform your favorite memory into a beautiful keepsake ornament",
      href: "/products/ornaments",
      rating: 5,
      reviews: 32
    },
    {
      id: 4,
      name: "Slate Photo Keepsake",
      price: 32.50,
      originalPrice: 40.00,
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400",
      category: "Slate Products",
      description: "Elegant slate piece with your photo, perfect for home décor",
      href: "/products/slate",
      rating: 5,
      reviews: 15
    }
  ];

  const toggleLike = (productId: number) => {
    const newLiked = new Set(likedProducts);
    if (newLiked.has(productId)) {
      newLiked.delete(productId);
    } else {
      newLiked.add(productId);
    }
    setLikedProducts(newLiked);
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
            <Star className="h-4 w-4 mr-2" />
            Customer Favorites
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
            Featured Collections
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our most beloved pieces, each one carefully crafted to turn your memories into lasting treasures
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 group animate-fade-in border border-secondary/20"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <Link to={product.href}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </Link>
                
                {/* Sale Badge */}
                {product.originalPrice && (
                  <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                    SALE
                  </div>
                )}
                
                {/* Like Button */}
                <button
                  onClick={() => toggleLike(product.id)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-200 hover:scale-110"
                >
                  <Heart
                    className={`h-5 w-5 transition-colors duration-200 ${
                      likedProducts.has(product.id)
                        ? 'text-red-500 fill-current'
                        : 'text-gray-600'
                    }`}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-primary font-bold uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
                    {product.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < product.rating
                            ? 'text-accent fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({product.reviews})
                    </span>
                  </div>
                </div>
                
                <Link to={product.href}>
                  <h3 className="font-playfair font-bold text-xl text-foreground mb-3 line-clamp-2 hover:text-primary transition-colors leading-tight">
                    {product.name}
                  </h3>
                </Link>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="btn-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-105"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <Button className="btn-secondary px-10 py-4 text-lg group">
            View All Products
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
