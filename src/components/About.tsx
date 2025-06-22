
const About = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-playfair font-bold text-foreground mb-6">
              Handmade with Heart.
              <span className="block text-primary">Crafted to Last.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6">
              Beautiful Beginnings is a small business built on love, creativity, and the joy of preserving memories. Every item is designed and sublimated by hand—ensuring that what you give (or keep!) is truly one of a kind.
            </p>
            
            <p className="text-lg text-muted-foreground mb-8">
              Our specialty? Gorgeous, glossy photo keepsakes that shine with color, warmth, and emotion. Whether you're celebrating the cozy glow of the holidays or just looking for that perfect anytime gift, our pieces are made to be treasured.
            </p>

            {/* Features List */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-golden-brown"></div>
                <span className="text-muted-foreground">Sublimated ornaments, jewelry, and keepsakes</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-golden-brown"></div>
                <span className="text-muted-foreground">Holiday & fall-themed décor</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-golden-brown"></div>
                <span className="text-muted-foreground">Insulated drinkware and glass tumblers</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-golden-brown"></div>
                <span className="text-muted-foreground">Home décor and wreaths</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-golden-brown"></div>
                <span className="text-muted-foreground">Personalized gifts for every season</span>
              </div>
            </div>

            {/* Taglines */}
            <div className="bg-soft-pink rounded-xl p-6">
              <p className="text-sm text-muted-foreground italic text-center">
                "Your memories deserve to shine. We make sure they do."
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="relative animate-fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=600"
                alt="Handcrafted ornaments being made with care"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              
              {/* Craft Show Announcement */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-lg p-4">
                <h3 className="font-playfair font-semibold text-foreground mb-2">
                  Catch Us at the Craft Show!
                </h3>
                <p className="text-sm text-muted-foreground">
                  During the fall and holiday season, Beautiful Beginnings comes to life in person! Look for our booth at local markets.
                </p>
                <p className="text-xs text-primary font-medium mt-2">
                  Handmade. Heartfelt. Holiday-ready.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
