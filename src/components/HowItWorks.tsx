
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
    <section className="py-20 relative overflow-hidden" style={{ backgroundColor: '#faf6ee' }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #a48f4b 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #E28F84 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ backgroundColor: '#F6DADA', color: '#5B4C37' }}>
            <Sparkles className="h-4 w-4 mr-2" />
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6" style={{ color: '#2d3436' }}>
            How It Works
          </h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed" style={{ color: '#5B4C37' }}>
            Creating your personalized keepsake is simple and magical
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center mb-16">
          <div className="h-px flex-1 max-w-xs" style={{ backgroundColor: '#F6DADA' }}></div>
          <div className="mx-4 w-2 h-2 rounded-full" style={{ backgroundColor: '#E28F84' }}></div>
          <div className="h-px flex-1 max-w-xs" style={{ backgroundColor: '#F6DADA' }}></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group relative">
              {/* Connection line for desktop */}
              {index < 3 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 -translate-x-1/2" style={{ backgroundColor: '#F6DADA', zIndex: 0 }}></div>
              )}
              
              <div className="relative z-10 bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2" style={{ borderColor: '#F6DADA', borderWidth: '1px' }}>
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border-2" style={{ backgroundColor: '#F6DADA', borderColor: '#E28F84' }}>
                    <step.icon className="h-10 w-10" style={{ color: '#a48f4b' }} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#E28F84' }}>
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-playfair font-bold mb-3" style={{ color: '#2d3436' }}>
                  {step.title}
                </h3>
                <p className="leading-relaxed" style={{ color: '#5B4C37' }}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button className="text-lg px-10 py-4 font-semibold rounded-lg transition-all duration-200 hover:scale-105 text-white" style={{ backgroundColor: '#E28F84' }}>
            <Sparkles className="h-5 w-5 mr-2" />
            Start Personalizing Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
