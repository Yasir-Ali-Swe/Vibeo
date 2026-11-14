export type Role = "customer" | "admin";

export interface SessionUser {
  id: string;
  name: string;
  phone?: string;
  photo?: string | null;
  avatarUrl?: string;
  role: Role;
}
