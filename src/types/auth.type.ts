export interface User {
  id: number;
  name: string;
  dni: string;
  username: string;
  email?: string;
  phone?: string;
  tipoDocId: number;
  tipo?: string;
}