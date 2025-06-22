
import { Upload, Palette, Package, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload Your Photo",
      description: "Choose your favorite memory and upload it securely to our platform"
    },
    {
      icon: Palette,
      title: "Personalize Your Item",
      description: "Add custom text, choose colors, and make it uniquely yours"
    },
    {
      icon: Package,
      title: "We Craft With Love",
      description: "Our artisans handcraft your personalized keepsake with attention to detail"
    },
    {
      icon: Sparkles,
      title: "Receive & Treasure",
      description: "Get your beautiful memory piece delivered safely to your door"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Creating your personalized keepsake is simple and magical
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border-2 border-primary/20">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-playfair font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button className="btn-primary text-lg px-10 py-4">
            <Sparkles className="h-5 w-5 mr-2" />
            Start Personalizing Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
