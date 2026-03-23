import type { LabInventoryList } from "@/types/lab-inventory";

// TODO: substituir por chamada real quando backend estiver pronto

export const MOCK_INVENTORY_ITEMS: LabInventoryList = {
  "inv-1": {
    id: "inv-1",
    name: "Multímetro digital",
    isActive: true,
    quantity: 12,
    availableQuantity: 8,
    loanedQuantity: 4,
    image: "buttonIcons/box.svg",
    category: "Instrumentação",
    description: "Multímetro True RMS, medição de tensão, corrente e resistência.",
  },
  "inv-2": {
    id: "inv-2",
    name: "Kit sensores",
    isActive: true,
    quantity: 25,
    availableQuantity: 18,
    loanedQuantity: 7,
    image: "buttonIcons/box.svg",
    category: "Sensores",
    description: "Conjunto com sensor de temperatura, luminosidade e proximidade.",
  },
  "inv-3": {
    id: "inv-3",
    name: "Fonte regulada",
    isActive: true,
    quantity: 6,
    availableQuantity: 5,
    loanedQuantity: 1,
    image: "buttonIcons/box.svg",
    category: "Alimentação",
    description: "Fonte DC 0–30 V, 5 A, com proteção contra curto-circuito.",
  },
  "inv-4": {
    id: "inv-4",
    name: "Osciloscópio portátil",
    isActive: true,
    quantity: 4,
    availableQuantity: 2,
    loanedQuantity: 2,
    image: "buttonIcons/box.svg",
    category: "Instrumentação",
    description: "2 canais, 100 MHz, interface USB para captura de dados.",
  },
};

export function getMockInventoryItem(id: string) {
  return MOCK_INVENTORY_ITEMS[id] ?? Object.values(MOCK_INVENTORY_ITEMS).find((i) => i.id === id);
}
