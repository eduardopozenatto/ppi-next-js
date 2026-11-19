"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";

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

function subscribeToStoredCart(onChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY || event.key === null) onChange();
  }

  window.addEventListener("storage", handleStorage);
  return () => window.removeEventListener("storage", handleStorage);
}

function getStoredCart() {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getServerCart() {
  return null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const storedCart = useSyncExternalStore(subscribeToStoredCart, getStoredCart, getServerCart);
  const storedItems = useMemo<CartItem[]>(() => {
    try {
      const parsed = storedCart ? JSON.parse(storedCart) : null;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [storedCart]);
  const [localItems, setLocalItems] = useState<CartItem[] | null>(null);
  const items = localItems ?? storedItems;

  useEffect(() => {
    if (localItems === null) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localItems));
    } catch {
      // Ignore localStorage errors
    }
  }, [localItems]);

  function setItems(update: (previous: CartItem[]) => CartItem[]) {
    setLocalItems((previous) => update(previous ?? storedItems));
  }

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
    setLocalItems([]);
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
