export const ROLE = {
  S: "S",
  M: "M",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];
