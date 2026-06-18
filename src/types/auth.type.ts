export interface User {
  id: number;
  name: string;
  firstName?: string | null;
  lastName?: string | null;
  secondLastName?: string | null;
  dni: string;
  username: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  tipoDocId: number;
  tipo?: string;
}