import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";


export async function getTopicsUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/topics/:userId', {
        schema: {
            params: z.object({
                userId: z.string().uuid(),
            })
        },
    }, async (request) => {

        const { userId } = request.params;

        const topics = await prisma.topic.findMany({
            where: {userId: userId},
            select: {  
                id: true,     
                title: true,
                content: true,
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }

            }
        })

        if(!topics) {
            throw new ClientError('Nenhum post encontrado.');
        }


        return { topics: topics };
    })
}