"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDetails = getUserDetails;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function getUserDetails(app) {
    app.withTypeProvider().get('/user/:userId', {
        schema: {
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid(),
            })
        },
    }, async (request) => {
        const { userId } = request.params;
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true, // USER INFO
                name: true,
                username: true,
                email: true,
            }
        });
        if (!user) {
            throw new client_error_1.ClientError('Usuario não existe.');
        }
        return { user };
    });
}
