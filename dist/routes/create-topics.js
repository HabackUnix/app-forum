"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTopic = createTopic;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function createTopic(app) {
    app.withTypeProvider().post('/topics', {
        schema: {
            body: zod_1.z.object({
                title: zod_1.z.string().min(4, "Titulo precisa de no minimo 4 caracteres."),
                content: zod_1.z.string().min(12, "Conteudo precisa de no minimo 12 caracteres."),
                userId: zod_1.z.string().uuid(),
                categoryId: zod_1.z.string().uuid()
            })
        },
    }, async (request) => {
        const { title, content, userId, categoryId } = request.body;
        const findTopic = await prisma_1.prisma.topic.findFirst({
            where: {
                title: title
            }
        });
        if (findTopic) {
            throw new client_error_1.ClientError("Topico ja existe!");
        }
        const topic = await prisma_1.prisma.topic.create({
            data: {
                title: title,
                content: content,
                userId: userId,
                categoryId: categoryId
            }
        });
        return { topicId: topic.id };
    });
}
