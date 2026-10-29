import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const EnvSchema = z.object({
  GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
  API_SHARED_SECRET: z.string().min(32, "API_SHARED_SECRET must be at least 32 characters"),
  GEMINI_MODEL: z.string().default("gemini-2.5-flash"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:3000"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error("Error while parsing env");
}

const raw = parsed.data;

export const env = Object.freeze({
  GEMINI_API_KEY: raw.GEMINI_API_KEY,
  API_SHARED_SECRET: raw.API_SHARED_SECRET,
  GEMINI_MODEL: raw.GEMINI_MODEL,
  PORT: raw.PORT,
  CLIENT_ORIGIN: raw.CLIENT_ORIGIN,
});
