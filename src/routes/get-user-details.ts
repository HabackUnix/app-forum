import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";


export async function getUserDetails(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/user/:userId', {
        schema: {
            params: z.object({
                userId: z.string().uuid(),
            })
        },
    }, async (request) => {

        const { userId } = request.params;

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {         
                id: true,         // USER INFO
                name: true,
                username: true,
                email: true,
            }
        })

        if(!user) {
            throw new ClientError('Usuario não existe.');
        }


        return { user };
    })
}