import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";

export async function getCategories(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/categories', async (request) => {

        const categories = await prisma.category.findMany({
            select: {       // Correção no findMany
                id: true,
                name: true,
            }
        });

        if (!categories || categories.length === 0) {
            throw new ClientError('Nenhuma categoria encontrada.');
        }

        return { categories };
    });
}
