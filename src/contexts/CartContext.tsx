
import React, { createContext, useContext, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  updatePhoto: (id: number, file: File) => Promise<void>;
  updateItemProperty: (id: number, property: keyof CartItem, value: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const updatePhoto = async (id: number, file: File) => {
    try {
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `customer-uploads/${fileName}`;

      console.log('Uploading file to Supabase storage:', filePath);

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      console.log('File uploaded successfully, public URL:', publicUrl);

      // Update the cart item with both the file and the URL
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { 
            ...item, 
            uploadedPhoto: file,
            uploadedPhotoUrl: publicUrl,
            willUploadLater: false
          } : item
        )
      );

      toast({
        title: "Photo uploaded successfully!",
        description: "Your custom photo has been saved.",
      });

    } catch (error) {
      console.error('Error in updatePhoto:', error);
      toast({
        title: "Upload Error",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateItemProperty = (id: number, property: keyof CartItem, value: any) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, [property]: value } : item
      )
    );
  };

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    updatePhoto,
    updateItemProperty
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
