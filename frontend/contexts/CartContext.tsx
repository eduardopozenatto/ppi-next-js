"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  availableQuantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  totalCount: number;
  totalDistinct: number;
  addItem: (item: { id: string; name: string; category: string; availableQuantity: number; image?: string }, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = "labcontrol-cart";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch {
      // Ignore localStorage errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore localStorage errors
    }
  }, [items, isLoaded]);

  function addItem(
    item: { id: string; name: string; category: string; availableQuantity: number; image?: string },
    quantityToAdd = 1
  ) {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) => String(i.id) === String(item.id));
      if (existingIndex >= 0) {
        const updated = [...prev];
        const existing = updated[existingIndex];
        const newQty = Math.min(existing.availableQuantity, existing.quantity + quantityToAdd);
        updated[existingIndex] = { ...existing, quantity: newQty };
        return updated;
      }

      const initialQty = Math.min(item.availableQuantity, Math.max(1, quantityToAdd));
      return [
        ...prev,
        {
          id: String(item.id),
          name: item.name,
          category: item.category,
          quantity: initialQty,
          availableQuantity: item.availableQuantity,
          image: item.image,
        },
      ];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((i) => String(i.id) !== String(id)));
  }

  function updateQuantity(id: string, newQuantity: number) {
    setItems((prev) =>
      prev.map((i) => {
        if (String(i.id) !== String(id)) return i;
        const validQty = Math.max(1, Math.min(i.availableQuantity, newQuantity));
        return { ...i, quantity: validQty };
      })
    );
  }

  function clearCart() {
    setItems([]);
  }

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const totalDistinct = items.length;

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalDistinct,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
