"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
async function createPost(app) {
    app.withTypeProvider().post('/posts', {
        schema: {
            body: zod_1.z.object({
                content: zod_1.z.string().min(12, "Conteudo precisa de no minimo 12 caracteres."),
                userId: zod_1.z.string().uuid(),
                topicId: zod_1.z.string().uuid(),
                imageUrl: zod_1.z.string().optional(),
            })
        },
    }, async (request) => {
        const { content, userId, topicId, imageUrl } = request.body;
        const post = await prisma_1.prisma.post.create({
            data: {
                content: content,
                userId: userId,
                topicId: topicId,
                imageUrl: imageUrl,
            }
        });
        return { postId: post.id };
    });
}
