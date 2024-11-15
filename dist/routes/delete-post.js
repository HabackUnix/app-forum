"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = deletePost;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function deletePost(app) {
    app.withTypeProvider().post('/post/:postId', {
        schema: {
            params: zod_1.z.object({
                postId: zod_1.z.string().uuid(),
            }),
            body: zod_1.z.object({
                userId: zod_1.z.string().uuid(),
            })
        },
    }, async (request) => {
        const { postId } = request.params;
        const { userId } = request.body;
        const post = await prisma_1.prisma.post.findUnique({
            where: { id: postId, userId: userId }
        });
        if (!post) {
            throw new client_error_1.ClientError('Post não encontrado.');
        }
        await prisma_1.prisma.post.delete({
            where: { id: postId, userId: userId },
        });
        return { postId: post.id };
    });
}
