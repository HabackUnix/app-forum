"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTopic = updateTopic;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function updateTopic(app) {
    app.withTypeProvider().post('/topic/:topicId', {
        schema: {
            params: zod_1.z.object({
                topicId: zod_1.z.string().uuid(),
            }),
            body: zod_1.z.object({
                title: zod_1.z.string().optional(),
                content: zod_1.z.string().optional(),
                categoryId: zod_1.z.string().uuid().optional(),
                userId: zod_1.z.string().uuid()
            })
        },
    }, async (request) => {
        const { topicId } = request.params;
        const { title, content, categoryId, userId } = request.body;
        const topic = await prisma_1.prisma.topic.findUnique({
            where: { id: topicId, userId: userId }
        });
        if (!topic) {
            throw new client_error_1.ClientError('Topico não existe.');
        }
        await prisma_1.prisma.topic.update({
            where: { id: topicId, userId: userId },
            data: {
                title,
                content,
                categoryId,
                userId,
            }
        });
        return { topicId: topic.id };
    });
}
