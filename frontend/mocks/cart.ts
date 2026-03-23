// TODO: substituir por estado/API de carrinho quando backend estiver pronto

export interface CartLine {
  id: string;
  inventoryItemId: string;
  name: string;
  category: string;
  quantity: number;
  availableQuantity: number;
}

export const MOCK_CART_LINES: CartLine[] = [
  {
    id: "cart-1",
    inventoryItemId: "inv-1",
    name: "Arduino Uno R3",
    category: "Microcontroladores",
    quantity: 2,
    availableQuantity: 5,
  },
  {
    id: "cart-2",
    inventoryItemId: "inv-2",
    name: "Multímetro digital",
    category: "Instrumentação",
    quantity: 1,
    availableQuantity: 3,
  },
];
