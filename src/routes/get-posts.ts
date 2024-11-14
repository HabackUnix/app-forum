import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";


export async function getPosts(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/posts', {

    }, async (request,reply) => {

        const post = await prisma.post.findMany({
            select: {       
                id: true,
                content: true,
                imageUrl: true,
                user: {
                    select: {
                        id: true,
                        username: true
                    }
                }, 
                topic: {
                    select: {
                        id: true,
                        title: true,
                    }
                }
            }
        })


        return { post: post };
    })
}