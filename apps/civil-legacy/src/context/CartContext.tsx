import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  title: string;
  pillar: string;
  price: number;
  Icon: any;
  summary: string;
  details: string[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (service: CartItem) => void;
  removeFromCart: (index: number) => void;
  cartCount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = (service: CartItem) => {
    setCart((prev) => [...prev, service]);
    toast({
      title: "Service Added",
      description: `${service.title} has been added to your cart.`,
    });
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const cartCount = cart.length;
  const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, cartCount, total }}>
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
