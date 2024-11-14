import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import env from "../env";
import { ClientError } from "../error/client-error";

export async function createCategory(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/categories', {
        schema: {
            body: z.object({
                name: z.string().min(4, "Categoria precisa ter no minimo 4 caracteres.")
            })
        },
    }, async (request) => {

        const {name} = request.body;

        const findCategory = await prisma.category.findUnique({
            where: {
                name: name,
            }
        })

        if(findCategory) {
            throw new ClientError("Categoria ja existe!");
        }

        const category = await prisma.category.create({
            data: {
                name: name,
            }
        })

        return { categoryId: category.id }
    })
}