"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCategories = getCategories;
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function getCategories(app) {
    app.withTypeProvider().get('/categories', async (request) => {
        const categories = await prisma_1.prisma.category.findMany({
            select: {
                id: true,
                name: true,
            }
        });
        if (!categories || categories.length === 0) {
            throw new client_error_1.ClientError('Nenhuma categoria encontrada.');
        }
        return { categories };
    });
}
