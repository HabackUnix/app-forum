import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";

export async function updatePost(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put('/post/:postId', {
        schema: {
            params: z.object({
                postId: z.string().uuid(),
            }),
            body: z.object({
                content: z.string().optional(),
                topicId: z.string().uuid().optional(),
                imageUrl: z.string().url().optional(),
                userId: z.string().uuid(),
            })
        },
    }, async (request) => {
        const { postId } = request.params;
        const { content, topicId, imageUrl, userId} = request.body;

        
        const post = await prisma.post.findUnique({
            where: {id: postId}
        })
        

        if(!post) {
            throw new ClientError('Post não encontrado.');
        }

        await prisma.post.update({
            where: { userId: userId, id: postId },
            data: {
                content,
                topicId,
                imageUrl,
                userId,
            }
        })
        

        return { postId: post.id }
    })
}