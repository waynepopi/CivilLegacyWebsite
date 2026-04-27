import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { CheckoutInfo } from '@/lib/receiptUtils';

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
  checkoutInfo: CheckoutInfo | null;
  setCheckoutInfo: (info: CheckoutInfo) => void;
  clearOrder: () => void;
}

const STORAGE_KEY_CART = 'clc_cart';
const STORAGE_KEY_CHECKOUT = 'clc_checkout';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();

  // Hydrate cart from sessionStorage (survives redirect to payment gateway)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Hydrate checkout info from sessionStorage
  const [checkoutInfo, setCheckoutInfoState] = useState<CheckoutInfo | null>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY_CHECKOUT);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Persist cart to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart));
  }, [cart]);

  // Persist checkout info to sessionStorage
  useEffect(() => {
    if (checkoutInfo) {
      sessionStorage.setItem(STORAGE_KEY_CHECKOUT, JSON.stringify(checkoutInfo));
    }
  }, [checkoutInfo]);

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

  const setCheckoutInfo = (info: CheckoutInfo) => {
    setCheckoutInfoState(info);
  };

  /**
   * Clear the entire order (cart + checkout info).
   * Called after the receipt has been captured on the success page.
   */
  const clearOrder = () => {
    setCart([]);
    setCheckoutInfoState(null);
    sessionStorage.removeItem(STORAGE_KEY_CART);
    sessionStorage.removeItem(STORAGE_KEY_CHECKOUT);
  };

  const cartCount = cart.length;
  const total = cart.reduce((acc, curr) => acc + (curr.price || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        cartCount,
        total,
        checkoutInfo,
        setCheckoutInfo,
        clearOrder,
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
