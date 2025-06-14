import { z } from "zod";

export const UserDetailSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  email: z.string().email(),
});

export type UserDetail = z.infer<typeof UserDetailSchema>;