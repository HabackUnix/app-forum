import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import env from "../env";
import { ClientError } from "../error/client-error";

export async function createPost(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/posts', {
        schema: {
            body: z.object({
           
                content: z.string().min(12, "Conteudo precisa de no minimo 12 caracteres."),
                userId: z.string().uuid(),
                topicId: z.string().uuid(),
                imageUrl: z.string().optional(),
            })
        },
    }, async (request) => {

        const {content, userId, topicId, imageUrl} = request.body;

        const post = await prisma.post.create({
            data: {
                content: content,
                userId: userId,
                topicId: topicId,
                imageUrl: imageUrl,
            }
        })

        return { postId: post.id }
    })
}