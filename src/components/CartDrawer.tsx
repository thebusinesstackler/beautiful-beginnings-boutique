
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { ShoppingCart, X, Eye, ImageIcon } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import PhotoUpload from '@/components/PhotoUpload';
import { toast } from '@/hooks/use-toast';

interface CartDrawerProps {
  children: React.ReactNode;
}

const CartDrawer = ({ children }: CartDrawerProps) => {
  const { items, removeFromCart, getCartTotal, updatePhoto } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handlePhotoUpload = (itemId: string, file: File) => {
    updatePhoto(itemId, file);
    toast({
      title: "Photo uploaded!",
      description: "Your custom photo has been added to this item.",
    });
  };

  const handleViewCart = () => {
    setIsOpen(false);
    navigate('/cart');
  };

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className="max-w-2xl mx-auto">
        <DrawerHeader>
          <DrawerTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Shopping Cart</span>
          </DrawerTitle>
          <DrawerDescription>
            Customize your products by uploading photos
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 max-h-96 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="border border-muted rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-playfair font-semibold text-sm">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2 text-foreground">
                      Upload Your Photo
                    </h4>
                    
                    {/* Show uploaded photo if it exists */}
                    {item.uploadedPhotoUrl ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                          <ImageIcon className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700 font-medium">
                            ✓ Photo uploaded successfully
                          </span>
                        </div>
                        <div className="relative">
                          <img
                            src={item.uploadedPhotoUrl}
                            alt="Uploaded photo"
                            className="w-20 h-20 object-cover rounded-md border"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Allow user to replace photo
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) {
                                handlePhotoUpload(item.id, file);
                              }
                            };
                            input.click();
                          }}
                          className="text-xs"
                        >
                          Replace Photo
                        </Button>
                      </div>
                    ) : (
                      <PhotoUpload
                        onUpload={(file) => handlePhotoUpload(item.id, file)}
                        maxSizeMB={10}
                        className="text-xs"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DrawerFooter>
          {items.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-4 px-2">
                <span className="font-semibold">Total:</span>
                <span className="font-bold text-lg">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
              <div className="space-y-2">
                <Button onClick={handleViewCart} variant="outline" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  View Full Cart
                </Button>
                <Button onClick={handleCheckout} className="w-full btn-primary">
                  Proceed to Checkout
                </Button>
              </div>
            </>
          )}
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
