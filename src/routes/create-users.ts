import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import env from "../env";
import bcrypt from "bcrypt";
import { ClientError } from "../error/client-error";

export async function createUser(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/users', {
        schema: {
            body: z.object({
                name: z.string().min(4, "Nome precisa ter no minimo 4 caracteres."),
                username: z.string().min(4, "Nome de usuario precisa ter no minimo 4 caracteres."),
                email: z.string().email(),
                password: z.string()
                            .regex(/[A-Z]/, "A senha precisa ter pelo menos uma letra maiuscula.")
                            .regex(/[0-9]/, "A senha precisa ter pelo menos um número.")
                            .regex(/[!@#$%^&*(),.?":{}|<>]/, "A senha precisa ter pelo menos um caractere especial.")
            })
        },
    }, async (request) => {

        const {name, username, email, password} = request.body;

        const findUserByMail = await prisma.user.findUnique({
            where: {
                email: email,
            }
        })

        const findUserByUsername = await prisma.user.findUnique({
            where: {
                username: username
            }
        })

        if(findUserByMail) {
            throw new ClientError("usuario ja existe!");
        }

        if(findUserByUsername) {
            throw new ClientError("nome de usuario ja existe!");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const users = await prisma.user.create({
            data: {
                email: email,
                name: name,
                username: username,
                password: hashedPassword,
                
            }
        })

        return { idUser: users.id }
    })
}