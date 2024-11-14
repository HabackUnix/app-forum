import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";
import dayjs from "dayjs";

export async function updateUserPassword(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().put('/user/:userId/reset-password', {
        schema: {
            params: z.object({
                userId: z.string().uuid(),
            }),
            body: z.object({
                password: z.string()
                            .regex(/[A-Z]/, "A senha precisa ter pelo menos uma letra maiuscula.")
                            .regex(/[0-9]/, "A senha precisa ter pelo menos um número.")
                            .regex(/[!@#$%^&*(),.?":{}|<>]/, "A senha precisa ter pelo menos um caractere especial."),
    
            })
        },
    }, async (request) => {
        const { userId } = request.params;
        const { password } = request.body;

        
        const user = await prisma.user.findFirst({
            where: {id: userId},
        })

        if(!user) {
            throw new ClientError('Usuario não existe.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const expirationDate = dayjs(user.resetTokenExpiry);
        const now = dayjs()

        if(!expirationDate.isAfter(now)) {
            throw new ClientError('Token invalido!');
        }

        await prisma.user.update({
            where: {id: userId},
            data: {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
            }
        })

        return { userInfo: user }
    })
}