"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_error_1 = require("../error/client-error");
async function createUser(app) {
    app.withTypeProvider().post('/users', {
        schema: {
            body: zod_1.z.object({
                name: zod_1.z.string().min(4, "Nome precisa ter no minimo 4 caracteres."),
                username: zod_1.z.string().min(4, "Nome de usuario precisa ter no minimo 4 caracteres."),
                email: zod_1.z.string().email(),
                password: zod_1.z.string()
                    .regex(/[A-Z]/, "A senha precisa ter pelo menos uma letra maiuscula.")
                    .regex(/[0-9]/, "A senha precisa ter pelo menos um número.")
                    .regex(/[!@#$%^&*(),.?":{}|<>]/, "A senha precisa ter pelo menos um caractere especial.")
            })
        },
    }, async (request) => {
        const { name, username, email, password } = request.body;
        const findUserByMail = await prisma_1.prisma.user.findUnique({
            where: {
                email: email,
            }
        });
        const findUserByUsername = await prisma_1.prisma.user.findUnique({
            where: {
                username: username
            }
        });
        if (findUserByMail) {
            throw new client_error_1.ClientError("usuario ja existe!");
        }
        if (findUserByUsername) {
            throw new client_error_1.ClientError("nome de usuario ja existe!");
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const users = await prisma_1.prisma.user.create({
            data: {
                email: email,
                name: name,
                username: username,
                password: hashedPassword,
            }
        });
        return { idUser: users.id };
    });
}
