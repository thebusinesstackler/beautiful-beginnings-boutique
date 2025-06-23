import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "I ordered a photo necklace for my mom's birthday and she absolutely loved it! The quality is amazing and it arrived beautifully packaged. Will definitely order again!",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=100",
      product: "Photo Memory Necklace"
    },
    {
      name: "Michael Chen",
      rating: 5,
      text: "The personalized ornament we got for our first Christmas together is perfect. It's become our most treasured decoration. The craftsmanship is incredible!",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100",
      product: "Custom Photo Ornament"
    },
    {
      name: "Emily Rodriguez",
      rating: 5,
      text: "I've ordered several slate keepsakes as gifts and everyone has been blown away by the quality. The photos come out so clear and beautiful!",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=100",
      product: "Slate Photo Keepsake"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-accent/10 rounded-full text-accent font-semibold mb-6">
            <Star className="h-4 w-4 mr-2 fill-current" />
            5-Star Reviews from Happy Customers
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of satisfied customers who have turned their memories into treasured keepsakes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-primary/5 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="h-8 w-8 text-accent/30 absolute top-4 right-4" />
              
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-accent fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed italic">
                "{testimonial.text}"
              </p>
              
              <div className="text-sm text-primary font-medium">
                Purchased: {testimonial.product}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8">
          <h3 className="text-2xl font-playfair font-bold text-foreground mb-4">
            Join 500+ Happy Customers
          </h3>
          <div className="flex items-center justify-center space-x-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-accent fill-current" />
            ))}
            <span className="ml-2 text-xl font-bold text-foreground">4.9/5</span>
          </div>
          <p className="text-muted-foreground">
            Average rating from verified customers
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
