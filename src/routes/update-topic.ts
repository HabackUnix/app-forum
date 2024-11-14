import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";
import { title } from "process";

export async function updateTopic(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/topic/:topicId', {
        schema: {
            params: z.object({
                topicId: z.string().uuid(),
            }),
            body: z.object({
                title: z.string().optional(),
                content: z.string().optional(),
                categoryId: z.string().uuid().optional(),
                userId: z.string().uuid()
            })
        },
    }, async (request) => {
        const { topicId } = request.params;
        const { title, content, categoryId, userId} = request.body;

        
        const topic = await prisma.topic.findUnique({
            where: {id: topicId, userId: userId}
        })

        if(!topic) {
            throw new ClientError('Topico não existe.');
        }

        await prisma.topic.update({
            where: {id: topicId, userId: userId},
            data: {
                title,
                content,
                categoryId,
                userId,
            }
        })

        return { topicId: topic.id }
    })
}