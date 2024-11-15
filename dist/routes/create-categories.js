"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = createCategory;
const zod_1 = require("zod");
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function createCategory(app) {
    app.withTypeProvider().post('/categories', {
        schema: {
            body: zod_1.z.object({
                name: zod_1.z.string().min(4, "Categoria precisa ter no minimo 4 caracteres.")
            })
        },
    }, async (request) => {
        const { name } = request.body;
        const findCategory = await prisma_1.prisma.category.findUnique({
            where: {
                name: name,
            }
        });
        if (findCategory) {
            throw new client_error_1.ClientError("Categoria ja existe!");
        }
        const category = await prisma_1.prisma.category.create({
            data: {
                name: name,
            }
        });
        return { categoryId: category.id };
    });
}
