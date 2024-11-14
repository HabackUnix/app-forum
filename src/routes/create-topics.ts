import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import env from "../env";
import { ClientError } from "../error/client-error";

export async function createTopic(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/topics', {
        schema: {
            body: z.object({
                title: z.string().min(4, "Titulo precisa de no minimo 4 caracteres."),
                content: z.string().min(12, "Conteudo precisa de no minimo 12 caracteres."),
                userId: z.string().uuid(),
                categoryId: z.string().uuid()
            })
        },
    }, async (request) => {

        const {title, content, userId, categoryId} = request.body;

        const findTopic = await prisma.topic.findFirst({
            where: {
                title: title
            }
        });

        if(findTopic) {
            throw new ClientError("Topico ja existe!");
        }

        const topic = await prisma.topic.create({
            data: {
                title: title,
                content: content,
                userId: userId,
                categoryId: categoryId
            }
        })

        return { topicId: topic.id }
    })
}