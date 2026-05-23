import { z } from "zod";

export const RegisterSchema = z.object({
  role: z.enum(["S", "M"]),
  username: z.string().min(2).max(30),
  password: z.string().min(6).max(72),
});

export const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const BoxContentSchema = z.object({
  contentText: z.string().min(1).max(2000),
});

export const AssignBoxesSchema = z.object({
  count: z.number().int().min(1).max(1000),
});

export const AssignKeysSchema = z.object({
  delta: z.number().int().min(-100000).max(100000),
});
