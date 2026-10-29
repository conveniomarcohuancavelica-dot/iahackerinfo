import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, "Api key is needed"),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CLIENT_ORIGIN: z.string().url().default("http://localhost:3000"),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error("Error while parsing env");
}

const raw = parsed.data;

export const env = Object.freeze({
  OPENAI_API_KEY: raw.OPENAI_API_KEY,
  OPENAI_MODEL: raw.OPENAI_MODEL,
  PORT: raw.PORT,
  CLIENT_ORIGIN: raw.CLIENT_ORIGIN,
});
