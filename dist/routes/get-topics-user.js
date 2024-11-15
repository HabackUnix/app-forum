"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopicsUser = getTopicsUser;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function getTopicsUser(app) {
    app.withTypeProvider().get('/topics/:userId', {
        schema: {
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid(),
            })
        },
    }, async (request) => {
        const { userId } = request.params;
        const topics = await prisma_1.prisma.topic.findMany({
            where: { userId: userId },
            select: {
                id: true,
                title: true,
                content: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });
        if (!topics) {
            throw new client_error_1.ClientError('Nenhum post encontrado.');
        }
        return { topics: topics };
    });
}
