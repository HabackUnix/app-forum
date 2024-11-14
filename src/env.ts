import { config } from 'dotenv';
import { z } from 'zod';

config(); // Carrega as variáveis de ambiente do arquivo .env

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  WEB_BASE_URL: z.string().url(),
  JWT_SECRET: z.string(),
  PORT: z.string().regex(/^\d+$/).transform(Number)
});

const env = envSchema.parse(process.env);

export default env;
