import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  uploadedPhoto?: File;
  uploadedPhotoUrl?: string;
  willUploadLater?: boolean;
}

interface CartContextProps {
  items: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, newQuantity: number) => void;
  updatePhoto: (itemId: number, file: File) => Promise<void>;
  updateItemProperty: (itemId: number, property: string, value: any) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { uploadPhoto } = usePhotoUpload();

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setItems(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any, quantity: number = 1) => {
    const newItem: CartItem = {
      id: Date.now(),
      name: product.name,
      price: product.price,
      quantity,
      image: product.image_url || product.image,
    };

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.name === newItem.name);
      if (existingItem) {
        return prevItems.map(item =>
          item.name === newItem.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, newItem];
    });

    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (itemId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const updatePhoto = async (itemId: number, file: File) => {
    console.log('Updating photo for item:', itemId, 'File:', file.name);
    
    try {
      // Upload the photo and get the URL
      const photoUrl = await uploadPhoto(file);
      
      if (photoUrl) {
        setItems(prevItems =>
          prevItems.map(item =>
            item.id === itemId
              ? { 
                  ...item, 
                  uploadedPhoto: file, 
                  uploadedPhotoUrl: photoUrl 
                }
              : item
          )
        );
        
        console.log('Photo updated successfully for item:', itemId, 'URL:', photoUrl);
        
        toast({
          title: "Photo uploaded!",
          description: "Your custom photo has been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Error updating photo:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateItemProperty = (itemId: number, property: string, value: any) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, [property]: value } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        updatePhoto,
        updateItemProperty,
        clearCart,
        getCartTotal,
        getCartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
