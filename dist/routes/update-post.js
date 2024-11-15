"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePost = updatePost;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function updatePost(app) {
    app.withTypeProvider().put('/post/:postId', {
        schema: {
            params: zod_1.z.object({
                postId: zod_1.z.string().uuid(),
            }),
            body: zod_1.z.object({
                content: zod_1.z.string().optional(),
                topicId: zod_1.z.string().uuid().optional(),
                imageUrl: zod_1.z.string().url().optional(),
                userId: zod_1.z.string().uuid(),
            })
        },
    }, async (request) => {
        const { postId } = request.params;
        const { content, topicId, imageUrl, userId } = request.body;
        const post = await prisma_1.prisma.post.findUnique({
            where: { id: postId }
        });
        if (!post) {
            throw new client_error_1.ClientError('Post não encontrado.');
        }
        await prisma_1.prisma.post.update({
            where: { userId: userId, id: postId },
            data: {
                content,
                topicId,
                imageUrl,
                userId,
            }
        });
        return { postId: post.id };
    });
}
