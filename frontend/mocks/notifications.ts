// TODO: substituir por chamada real quando backend estiver pronto

export type NotificationType = "approval" | "reminder" | "rejection" | "new_item" | "overdue";

export interface LabNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  type: NotificationType;
  createdAt: string;
}

export const MOCK_NOTIFICATIONS: LabNotification[] = [
  {
    id: "n1",
    title: "Empréstimo aprovado",
    body: "Seu pedido do Multímetro digital foi aprovado. Retire no balcão do laboratório.",
    read: false,
    type: "approval",
    createdAt: "2025-03-19T11:00:00Z",
  },
  {
    id: "n2",
    title: "Devolução em 3 dias",
    body: "O prazo do Kit sensores vence em 3 dias. Renove ou devolva pelo sistema.",
    read: false,
    type: "reminder",
    createdAt: "2025-03-18T08:00:00Z",
  },
  {
    id: "n3",
    title: "Empréstimo recusado",
    body: "Seu empréstimo foi recusado. Motivo: período muito longo solicitado.",
    read: true,
    type: "rejection",
    createdAt: "2025-03-15T10:30:00Z",
  },
  {
    id: "n4",
    title: "Novo item disponível",
    body: "ESP32 DevKit foi adicionado ao estoque. Confira na página de busca.",
    read: true,
    type: "new_item",
    createdAt: "2025-03-14T14:00:00Z",
  },
  {
    id: "n5",
    title: "Devolução atrasada",
    body: "Seu empréstimo do Arduino Uno R3 está atrasado. Devolva o mais rápido possível.",
    read: false,
    type: "overdue",
    createdAt: "2025-03-12T09:00:00Z",
  },
];
