export type UserRole = "user" | "coach" | "committee_lead" | "director";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}
