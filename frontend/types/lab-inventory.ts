/** Item exibido no catálogo e no estoque (mock até GET /api/inventory). */
export interface LabInventoryListItem {
  id: string;
  name: string;
  isActive: boolean;
  quantity: number;
  availableQuantity: number;
  loanedQuantity: number;
  image: string;
  category: string;
  description: string;
}

export type LabInventoryList = Record<string, LabInventoryListItem>;
