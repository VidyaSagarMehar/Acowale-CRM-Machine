export type UserRole = "admin";

export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
};
