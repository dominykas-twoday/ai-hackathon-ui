export type UserRole =
  | "USER"
  | "COACH"
  | "COMMITTEE_LEAD"
  | "DIRECTOR"
  | "ADMIN";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
  role: UserRole;
}
