"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPosts = getPosts;
const prisma_1 = require("../lib/prisma");
async function getPosts(app) {
    app.withTypeProvider().get('/posts', {}, async (request, reply) => {
        const post = await prisma_1.prisma.post.findMany({
            select: {
                id: true,
                content: true,
                imageUrl: true,
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                },
                topic: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        });
        return { post: post };
    });
}
