"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopics = getTopics;
const prisma_1 = require("../lib/prisma");
const client_error_1 = require("../error/client-error");
async function getTopics(app) {
    app.withTypeProvider().get('/topics', async (request) => {
        const topic = await prisma_1.prisma.topic.findMany({
            select: {
                id: true,
                title: true,
                content: true,
                category: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        });
        if (!topic) {
            throw new client_error_1.ClientError('Tópico não existe.');
        }
        return { topics: topic };
    });
}
