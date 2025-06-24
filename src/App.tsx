
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Ornaments from './pages/Ornaments';
import OrnamentDetail from './pages/OrnamentDetail';
import Necklaces from './pages/Necklaces';
import SnowGlobes from './pages/SnowGlobes';
import ProductDetail from './pages/ProductDetail';
import WoodSublimation from './pages/WoodSublimation';
import Slate from './pages/Slate';
import HeartPhotoPendant from './pages/HeartPhotoPendant';
import PhotoMemoryNecklace from './pages/PhotoMemoryNecklace';
import WinterBotanicalSnowGlobe from './pages/WinterBotanicalSnowGlobe';
import CustomPhotoSnowGlobe from './pages/CustomPhotoSnowGlobe';
import ShippingReturns from './pages/ShippingReturns';
import NotFound from './pages/NotFound';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from '@/components/ui/toaster';
import SocialProofNotifications from './components/SocialProofNotifications';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/products/ornaments" element={<Ornaments />} />
            <Route path="/products/ornaments/:id" element={<OrnamentDetail />} />
            <Route path="/products/necklaces" element={<Necklaces />} />
            <Route path="/products/snow-globes" element={<SnowGlobes />} />
            <Route path="/products/snow-globes/:id" element={<ProductDetail />} />
            <Route path="/products/:category/:id" element={<ProductDetail />} />
            <Route path="/products/wood-sublimation" element={<WoodSublimation />} />
            <Route path="/products/slate" element={<Slate />} />
            <Route path="/products/necklaces/heart-photo-pendant" element={<HeartPhotoPendant />} />
            <Route path="/products/necklaces/photo-memory-necklace" element={<PhotoMemoryNecklace />} />
            <Route path="/products/snow-globes/winter-botanical" element={<WinterBotanicalSnowGlobe />} />
            <Route path="/products/snow-globes/custom-photo" element={<CustomPhotoSnowGlobe />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
          <SocialProofNotifications />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
