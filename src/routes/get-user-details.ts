import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";


export async function getUserDetails(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/user/:userId', {
        schema: {
            params: z.object({
                userId: z.string().uuid(),
            }),
            body: z.object({
                authToken: z.coerce.string()
            })
        },
    }, async (request) => {

        const { userId } = request.params;
        const { authToken } = request.body;

        if(!authToken) {
            throw new ClientError('Solicitação negada!');
        }

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