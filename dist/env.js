"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)(); // Carrega as variáveis de ambiente do arquivo .env
const envSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string().url(),
    API_BASE_URL: zod_1.z.string().url(),
    WEB_BASE_URL: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string(),
    PORT: zod_1.z.string().regex(/^\d+$/).transform(Number)
});
const env = envSchema.parse(process.env);
exports.default = env;
