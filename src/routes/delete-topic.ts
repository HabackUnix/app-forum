import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";

export async function deleteTopic(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/topic/delete/:topicId', {
        schema: {
            params: z.object({
                topicId: z.string().uuid(),
            }),

            body: z.object({
                userId: z.string().uuid(),
            })

        },
    }, async (request) => {
        const { topicId } = request.params;
        const { userId } = request.body;
        
        const topic = await prisma.topic.findUnique({
            where: {id: topicId, userId: userId}
        })

        if(!topic) {
            throw new ClientError('Topico não encontrado.');
        }

        await prisma.topic.delete({
            where: {id: topicId, userId: userId},
        })

        return { topicId: topic.id }
    })
}