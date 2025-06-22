
import Navigation from '@/components/Navigation';
import Hero from '@/components/Hero';
import About from '@/components/About';
import HowItWorks from '@/components/HowItWorks';
import GiftingSection from '@/components/GiftingSection';
import Categories from '@/components/Categories';
import FeaturedProducts from '@/components/FeaturedProducts';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <About />
      <HowItWorks />
      <GiftingSection />
      <Categories />
      <FeaturedProducts />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default Index;
