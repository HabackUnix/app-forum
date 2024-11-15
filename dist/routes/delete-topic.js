"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopic = deleteTopic;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function deleteTopic(app) {
    app.withTypeProvider().post('/topic/delete/:topicId', {
        schema: {
            params: zod_1.z.object({
                topicId: zod_1.z.string().uuid(),
            }),
            body: zod_1.z.object({
                userId: zod_1.z.string().uuid(),
            })
        },
    }, async (request) => {
        const { topicId } = request.params;
        const { userId } = request.body;
        const topic = await prisma_1.prisma.topic.findUnique({
            where: { id: topicId, userId: userId }
        });
        if (!topic) {
            throw new client_error_1.ClientError('Topico não encontrado.');
        }
        await prisma_1.prisma.topic.delete({
            where: { id: topicId, userId: userId },
        });
        return { topicId: topic.id };
    });
}
