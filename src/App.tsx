
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SnowGlobes from "./pages/SnowGlobes";
import Necklaces from "./pages/Necklaces";
import Ornaments from "./pages/Ornaments";
import Slate from "./pages/Slate";
import WoodSublimation from "./pages/WoodSublimation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products/snow-globes" element={<SnowGlobes />} />
            <Route path="/products/necklaces" element={<Necklaces />} />
            <Route path="/products/ornaments" element={<Ornaments />} />
            <Route path="/products/slate" element={<Slate />} />
            <Route path="/products/wood-sublimation" element={<WoodSublimation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
