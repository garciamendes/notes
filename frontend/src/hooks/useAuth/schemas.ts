import { z } from "zod";

export const UserRegisterSchema = z.object({
  name: z.string().optional(),
  email: z
    .string()
    .min(1, { message: "Email field required " })
    .email({ message: "Email invalid" }),
  password: z.string().min(1, { message: "Password field required" }),
});

export type UserRegister = z.infer<typeof UserRegisterSchema>;

export const UserLoginSchema = UserRegisterSchema.omit({ name: true });
export type UserLogin = z.infer<typeof UserLoginSchema>;

export const UserLoginResponseSchema = z.object({
  token: z.string().jwt(),
});
export type UserLoginResponse = z.infer<typeof UserLoginResponseSchema>;
