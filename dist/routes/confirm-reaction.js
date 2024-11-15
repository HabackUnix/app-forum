"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmReaction = confirmReaction;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
async function confirmReaction(app) {
    app.withTypeProvider().post('/post/reaction', {
        schema: {
            body: zod_1.z.object({
                type: zod_1.z.boolean().default(true),
                userId: zod_1.z.string().uuid(),
                postId: zod_1.z.string().uuid()
            })
        },
    }, async (request, reply) => {
        const { type, postId, userId } = request.body;
        // Verificar se já existe uma reação do usuário para o post específico
        let reaction = await prisma_1.prisma.reaction.findFirst({
            where: {
                postId,
                userId,
            }
        });
        if (reaction) {
            // Se a reação já existe, retornamos uma mensagem informando isso
            if (reaction.type !== type) {
                reaction = await prisma_1.prisma.reaction.delete({
                    where: { id: reaction.id }, // Usando o id da reação existente
                });
            }
            return reply.send({ message: 'Reação já existe.', reaction });
        }
        else {
            // Se a reação não existe, cria uma nova
            reaction = await prisma_1.prisma.reaction.create({
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
