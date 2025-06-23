
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SnowGlobes from "./pages/SnowGlobes";
import WinterBotanicalSnowGlobe from "./pages/WinterBotanicalSnowGlobe";
import CustomPhotoSnowGlobe from "./pages/CustomPhotoSnowGlobe";
import Necklaces from "./pages/Necklaces";
import PhotoMemoryNecklace from "./pages/PhotoMemoryNecklace";
import HeartPhotoPendant from "./pages/HeartPhotoPendant";
import Ornaments from "./pages/Ornaments";
import OrnamentDetail from "./pages/OrnamentDetail";
import Slate from "./pages/Slate";
import WoodSublimation from "./pages/WoodSublimation";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/products/snow-globes" element={<SnowGlobes />} />
              <Route path="/products/snow-globes/winter-botanical" element={<WinterBotanicalSnowGlobe />} />
              <Route path="/products/snow-globes/custom-photo" element={<CustomPhotoSnowGlobe />} />
              <Route path="/products/necklaces" element={<Necklaces />} />
              <Route path="/products/necklaces/photo-memory" element={<PhotoMemoryNecklace />} />
              <Route path="/products/necklaces/heart-photo" element={<HeartPhotoPendant />} />
              <Route path="/products/ornaments" element={<Ornaments />} />
              <Route path="/products/ornaments/:id" element={<OrnamentDetail />} />
              <Route path="/products/slate" element={<Slate />} />
              <Route path="/products/wood-sublimation" element={<WoodSublimation />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
