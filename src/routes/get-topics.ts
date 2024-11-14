import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";


export async function getTopics(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/topics', async (request) => {


        const topic = await prisma.topic.findMany({
            select: {       
                id: true, 
                title: true,
                content: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        })

        if(!topic) {
            throw new ClientError('Tópico não existe.');
        }


        return { topics: topic };
    })
}