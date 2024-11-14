import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";

export async function deletePost(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/post/:postId', {
        schema: {
            params: z.object({
                postId: z.string().uuid(),
            }),
            body: z.object({
                userId: z.string().uuid(),
            })

        },
    }, async (request) => {
        const { postId } = request.params;
        const { userId } = request.body;
        
        const post = await prisma.post.findUnique({
            where: {id: postId, userId: userId}
        })

        if(!post) {
            throw new ClientError('Post não encontrado.');
        }

        await prisma.post.delete({
            where: {id: postId, userId: userId},
        })

        return { postId: post.id }
    })
}