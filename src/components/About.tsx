
import { Heart, Award, Users, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600"
                alt="Handcrafted ornaments being made with care"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent"></div>
              
              {/* Stats overlay */}
              <div className="absolute bottom-8 left-8 right-8">
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">5+</p>
                      <p className="text-xs text-muted-foreground">Years Crafting</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">500+</p>
                      <p className="text-xs text-muted-foreground">Happy Customers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-primary">1000+</p>
                      <p className="text-xs text-muted-foreground">Pieces Created</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-20 h-20 bg-secondary/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
          </div>

          {/* Content */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-6">
              <Heart className="h-4 w-4 mr-2" />
              Our Story
            </div>
            
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-8 leading-tight">
              Crafting Memories,
              <br />
              <span className="text-gradient">One Piece at a Time</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Beautiful Beginnings was born from a passion for preserving life's most precious moments. Every ornament, piece of jewelry, and keepsake we create tells a story—your story.
            </p>
            
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Using traditional sublimation techniques combined with modern craftsmanship, we transform your favorite photos and memories into stunning, durable pieces that will be treasured for generations.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Premium Materials</h3>
                  <p className="text-sm text-muted-foreground">Only the finest materials ensure lasting beauty and durability.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Personal Touch</h3>
                  <p className="text-sm text-muted-foreground">Each piece is individually crafted with attention to detail.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Lasting Quality</h3>
                  <p className="text-sm text-muted-foreground">Fade-resistant and built to preserve memories forever.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Made with Love</h3>
                  <p className="text-sm text-muted-foreground">Every creation carries our passion and dedication.</p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-8 border-l-4 border-primary">
              <p className="text-lg italic text-foreground mb-4 font-playfair">
                "Every memory deserves to be treasured. We're here to make sure yours shine forever."
              </p>
              <p className="text-sm font-medium text-primary">— The Beautiful Beginnings Team</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
