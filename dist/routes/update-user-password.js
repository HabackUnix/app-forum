"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPassword = updateUserPassword;
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
const dayjs_1 = __importDefault(require("dayjs"));
async function updateUserPassword(app) {
    app.withTypeProvider().put('/user/:userId/reset-password', {
        schema: {
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid(),
            }),
            body: zod_1.z.object({
                password: zod_1.z.string()
                    .regex(/[A-Z]/, "A senha precisa ter pelo menos uma letra maiuscula.")
                    .regex(/[0-9]/, "A senha precisa ter pelo menos um número.")
                    .regex(/[!@#$%^&*(),.?":{}|<>]/, "A senha precisa ter pelo menos um caractere especial."),
            })
        },
    }, async (request) => {
        const { userId } = request.params;
        const { password } = request.body;
        const user = await prisma_1.prisma.user.findFirst({
            where: { id: userId },
        });
        if (!user) {
            throw new client_error_1.ClientError('Usuario não existe.');
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const expirationDate = (0, dayjs_1.default)(user.resetTokenExpiry);
        const now = (0, dayjs_1.default)();
        if (!expirationDate.isAfter(now)) {
            throw new client_error_1.ClientError('Token invalido!');
        }
        await prisma_1.prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            }
        });
        return { userInfo: user };
    });
}
