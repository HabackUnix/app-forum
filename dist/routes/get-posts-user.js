"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsUser = getPostsUser;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function getPostsUser(app) {
    app.withTypeProvider().get('/posts/:userId', {
        schema: {
            params: zod_1.z.object({
                userId: zod_1.z.string().uuid(),
            })
        },
    }, async (request) => {
        const { userId } = request.params;
        const posts = await prisma_1.prisma.post.findMany({
            where: { userId: userId },
            select: {
                id: true,
                content: true,
                imageUrl: true,
                topicId: true,
                userId: true,
                user: {
                    select: {
                        name: true,
                        username: true,
                    }
                }
            }
        });
        if (!posts) {
            throw new client_error_1.ClientError('Nenhum post encontrado.');
        }
        return { posts: posts };
    });
}
