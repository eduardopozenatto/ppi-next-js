/** Tipos de notificação suportados pelo sistema. */
export type NotificationType = "approval" | "reminder" | "rejection" | "new_item" | "overdue";

/** Notificação do laboratório retornada pela API. */
export interface LabNotification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  type: NotificationType;
  createdAt: string;
}
