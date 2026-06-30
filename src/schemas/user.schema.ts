import { z } from "zod";

export const UserSchema = z.object({
  documentType: z.object({
    label: z.string(),
    value: z.string(),
  }),
  id: z.number().min(0),
  name: z.string(),
  dni: z
    .string()
    .min(1, "El número de documento es requerido")
    .max(20, "El número de documento no puede exceder los 20 caracteres"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  secondLastName: z.string().optional(),
  email: z.string().email("Correo electrónico no válido").optional(),
  phone: z.string().optional(),
  address: z.string().min(1, "La dirección es requerida"),
});

export type UserForm = z.infer<typeof UserSchema>;