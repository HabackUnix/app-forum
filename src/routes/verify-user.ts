import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";
import jwt from "jsonwebtoken";
import env from "../env";

const JWT_SECRET =  env.JWT_SECRET || '3b7f22d8c1602e0b36aea6c35ebec772d1194d62f09439c3fbf5135e4f10796790f0197b9015261e20e27d785f9c2c21ddb2b48112beceee8a70deeb4b9eb668';  // Use uma variável de ambiente para o segredo

export async function verifyUser(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/user/verify', {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string(),
      })
    },
  }, async (request, reply) => {
    const { email, password } = request.body;

    // Buscar o usuário pelo e-mail
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new ClientError('Usuário inexistente.');
    }

    // Comparar a senha fornecida com o hash armazenado
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ClientError('Senha incorreta.');
    }

    // Gerar o token JWT com o id e email do usuário
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',  // O token expira em 1 hora
    });

    const userId = user.id

    const userData = {
      userId,
      token
    }

    return { userData };
  });
}
