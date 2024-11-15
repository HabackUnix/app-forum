"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = verifyUser;
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = __importDefault(require("../env"));
const JWT_SECRET = env_1.default.JWT_SECRET || '3b7f22d8c1602e0b36aea6c35ebec772d1194d62f09439c3fbf5135e4f10796790f0197b9015261e20e27d785f9c2c21ddb2b48112beceee8a70deeb4b9eb668'; // Use uma variável de ambiente para o segredo
async function verifyUser(app) {
    app.withTypeProvider().post('/user/verify', {
        schema: {
            body: zod_1.z.object({
                email: zod_1.z.string().email(),
                password: zod_1.z.string(),
            })
        },
    }, async (request, reply) => {
        const { email, password } = request.body;
        // Buscar o usuário pelo e-mail
        const user = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new client_error_1.ClientError('Usuário inexistente.');
        }
        // Comparar a senha fornecida com o hash armazenado
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            throw new client_error_1.ClientError('Senha incorreta.');
        }
        // Gerar o token JWT com o id e email do usuário
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, JWT_SECRET, {
            expiresIn: '1h', // O token expira em 1 hora
        });
        const userId = user.id;
        const userData = {
            userId,
            token
        };
        return { userData };
    });
}
