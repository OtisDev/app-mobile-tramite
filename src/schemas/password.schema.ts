import { z } from "zod";

export const ChangePasswordSchema = z.object({
  currentPassword: z.string().min(1, "La contraseña actual es requerida"),
  newPassword: z
    .string()
    .min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
  confirmNewPassword: z
    .string()
    .min(
      8,
      "La confirmación de la nueva contraseña debe tener al menos 8 caracteres",
    ),
});

export type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>;