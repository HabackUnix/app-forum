import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";

export async function verifyToken(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/user/verify-token', {
        schema: {
            body: z.object({
                resetToken: z.coerce.string()
            })
        },
    }, async (request) => {
        const { resetToken } = request.body;

        // Buscar o usuário pelo e-mail
        const tokenPassword = await prisma.user.findFirst({
            where: {
                resetToken,
            },
            select: {
                resetToken: true
            }
        
        })

        if (!tokenPassword) {
            throw new ClientError('Codigo inexistente.');
        }


        return { resetCode: tokenPassword.resetToken};
    });
}
