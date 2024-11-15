"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = verifyToken;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function verifyToken(app) {
    app.withTypeProvider().post('/user/verify-token', {
        schema: {
            body: zod_1.z.object({
                resetToken: zod_1.z.coerce.string()
            })
        },
    }, async (request) => {
        const { resetToken } = request.body;
        // Buscar o usuário pelo e-mail
        const tokenPassword = await prisma_1.prisma.user.findFirst({
            where: {
                resetToken,
            },
            select: {
                resetToken: true
            }
        });
        if (!tokenPassword) {
            throw new client_error_1.ClientError('Codigo inexistente.');
        }
        return { resetCode: tokenPassword.resetToken };
    });
}
