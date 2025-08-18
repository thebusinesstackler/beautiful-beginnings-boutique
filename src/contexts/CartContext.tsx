
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from '@/hooks/use-toast';
import { usePhotoUpload } from '@/hooks/usePhotoUpload';

interface CartItem {
  id: string; // Changed to string to store product UUID
  product_id: string; // Actual product UUID from database
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
  addToCart: (product: any, quantity?: number, photo?: File) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  updatePhoto: (itemId: string, file: File) => Promise<void>;
  updateItemProperty: (itemId: string, property: string, value: any) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  couponCode: string | null;
  couponDiscount: number;
  getDiscountedTotal: () => number;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const { uploadPhoto } = usePhotoUpload();

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      try {
        const parsedItems = JSON.parse(storedCart);
        // Ensure all items have the correct structure and clean data
        const validatedItems = parsedItems.map((item: any) => ({
          id: item.id,
          product_id: item.product_id || item.id, // Fallback for old cart items
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          uploadedPhoto: undefined, // Don't restore file objects
          uploadedPhotoUrl: item.uploadedPhotoUrl || null,
          willUploadLater: item.willUploadLater || false
        }));
        setItems(validatedItems);
      } catch (error) {
        console.error('Error parsing stored cart:', error);
        localStorage.removeItem('cartItems');
      }
    }
  }, []);

  useEffect(() => {
    // Store cart items but exclude file objects and clean up undefined values
    const itemsToStore = items.map(item => ({
      id: item.id,
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      uploadedPhotoUrl: item.uploadedPhotoUrl || null,
      willUploadLater: item.willUploadLater || false
      // Don't store uploadedPhoto file objects
    }));
    localStorage.setItem('cartItems', JSON.stringify(itemsToStore));
  }, [items]);

  const addToCart = useCallback(async (product: any, quantity: number = 1, photo?: File) => {
    const itemId = `${product.id || product.uuid || Date.now()}-${Date.now()}`;
    const newItem: CartItem = {
      id: itemId,
      product_id: product.id || product.uuid, // Store the actual product UUID
      name: product.name,
      price: product.price,
      quantity,
      image: product.image_url || product.image,
      uploadedPhotoUrl: product.uploadedPhotoUrl || null,
      willUploadLater: false
    };

    // If a photo is provided, upload it immediately
    if (photo) {
      try {
        const photoUrl = await uploadPhoto(photo);
        
        if (photoUrl) {
          newItem.uploadedPhoto = photo;
          newItem.uploadedPhotoUrl = photoUrl;
          newItem.willUploadLater = false;
        } else {
          toast({
            title: "Photo Upload Failed",
            description: "Failed to upload your photo. The item was added to cart without the photo.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error uploading photo during add to cart:', error);
        toast({
          title: "Photo Upload Failed",
          description: "Failed to upload your photo. The item was added to cart without the photo.",
          variant: "destructive",
        });
      }
    }

    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.name === newItem.name);
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        return prevItems.map((item, index) =>
          index === existingItemIndex
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
  }, [uploadPhoto]);

  const removeFromCart = useCallback((itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
    });
  }, []);

  const updateQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, [removeFromCart]);

  const updatePhoto = useCallback(async (itemId: string, file: File) => {
    
    try {
      // Upload the photo and get the URL
      const photoUrl = await uploadPhoto(file);
      
      if (photoUrl) {
        setItems(prevItems => prevItems.map(item =>
          item.id === itemId
            ? { 
                ...item, 
                uploadedPhoto: file, 
                uploadedPhotoUrl: photoUrl,
                willUploadLater: false
              }
            : item
        ));
        
        toast({
          title: "Photo uploaded!",
          description: "Your custom photo has been saved successfully.",
        });
      } else {
        throw new Error('Failed to get photo URL after upload');
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    }
  }, [uploadPhoto]);

  const updateItemProperty = useCallback((itemId: string, property: string, value: any) => {
    setItems(prevItems => prevItems.map(item =>
      item.id === itemId ? { ...item, [property]: value } : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.removeItem('cartItems');
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [items]);

  const getCartItemCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const applyCoupon = useCallback((code: string): boolean => {
    if (code === '99OFF') {
      setCouponCode(code);
      setCouponDiscount(0.99);
      toast({
        title: "Coupon applied!",
        description: "99% discount has been applied to your order.",
      });
      return true;
    }
    return false;
  }, []);

  const removeCoupon = useCallback(() => {
    setCouponCode(null);
    setCouponDiscount(0);
    toast({
      title: "Coupon removed",
      description: "The coupon has been removed from your order.",
    });
  }, []);

  const getDiscountedTotal = useCallback(() => {
    const subtotal = getCartTotal();
    return subtotal * (1 - couponDiscount);
  }, [getCartTotal, couponDiscount]);

  const contextValue = useMemo(() => ({
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    updatePhoto,
    updateItemProperty,
    clearCart,
    getCartTotal,
    getCartItemCount,
    applyCoupon,
    removeCoupon,
    couponCode,
    couponDiscount,
    getDiscountedTotal,
  }), [items, addToCart, removeFromCart, updateQuantity, updatePhoto, updateItemProperty, clearCart, getCartTotal, getCartItemCount, applyCoupon, removeCoupon, couponCode, couponDiscount, getDiscountedTotal]);

  return (
    <CartContext.Provider value={contextValue}>
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
