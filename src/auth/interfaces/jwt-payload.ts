export interface JwtPayload {
  id: string;
  iat?: number; // Fecha de creación
  exp?: number; // Fecha de expiración
}