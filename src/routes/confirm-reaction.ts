import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";

export async function confirmReaction(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/post/reaction', {
        schema: {
            body: z.object({
                type: z.boolean().default(true),
                userId: z.string().uuid(),
                postId: z.string().uuid()
            })
        },
    }, async (request, reply) => {

        const { type, postId, userId } = request.body;

        // Verificar se já existe uma reação do usuário para o post específico
        let reaction = await prisma.reaction.findFirst({
            where: {
                postId,
                userId,
            }
        });

        if (reaction) {
            // Se a reação já existe, retornamos uma mensagem informando isso
            if (reaction.type !== type) {
                reaction = await prisma.reaction.delete({
                    where: { id: reaction.id },  // Usando o id da reação existente
                });
            }

            return reply.send({ message: 'Reação já existe.', reaction });
        } else {
            // Se a reação não existe, cria uma nova
            reaction = await prisma.reaction.create({
                data: {
                    type,
                    postId,
                    userId
                }
            });

            return reply.send({ id: reaction.id }); // Retorna apenas o id da nova reação criada
        }
    });
}
