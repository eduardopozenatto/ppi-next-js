import { z } from 'zod';

export const updateNotificationSchema = z.object({
  read: z.boolean(),
});

export type UpdateNotificationInput = z.infer<typeof updateNotificationSchema>;
