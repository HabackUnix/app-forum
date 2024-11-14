import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";


export async function getPostsUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/posts/:userId', {
        schema: {
            params: z.object({
                userId: z.string().uuid(),
            })
        },
    }, async (request) => {

        const { userId } = request.params;

        const posts = await prisma.post.findMany({
            where: {userId: userId},
            select: {  
                id: true,     
                content: true,
                imageUrl: true,
                topicId: true,
                userId: true,
                user: {
                    select: {
                        name: true,
                        username: true,
                    }
                }
            }
        })

        if(!posts) {
            throw new ClientError('Nenhum post encontrado.');
        }


        return { posts: posts };
    })
}