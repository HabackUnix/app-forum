import type { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../error/client-error";
import dayjs from "dayjs";
import env from "../env";
import nodemailer from "nodemailer";
import { getMailClient } from "../lib/mail";

export async function SendMailPassword(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/user/sendmail', {
        schema: {
            body: z.object({
                email: z.string().email(),
            })
        },
    }, async (request, reply) => {
        try {
            const { email } = request.body;

            // Verificar se o usuário existe
            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true, email: true }
            });

            if (!user) {
                throw new ClientError('Usuário inexistente.');
            }

            // Gerar código de 6 dígitos
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString(); // Gera um número de 6 dígitos

            // Armazenar o código e a data de expiração no banco de dados
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetToken: resetCode, // Armazena o código como resetToken
                    resetTokenExpiry: dayjs().add(1, 'hour').toDate(), // Código válido por 1 hora
                }
            });

            // Obter cliente de e-mail
            const mail = await getMailClient();

            // Enviar o e-mail com o código de redefinição de senha
            const message = await mail.sendMail({
                from: {
                    name: 'Forum Web - IFAP',
                    address: 'no-reply@forumwebifap.com',
                },
                to: user.email,
                subject: 'Código de redefinição de senha',
                html: `
                    <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                        <p>Olá,</p>
                        <p>Recebemos uma solicitação para redefinir sua senha.</p>
                        <p>Seu código de redefinição de senha é:</p>
                        <p style="font-size: 24px; font-weight: bold;">${resetCode}</p>
                        <p>O código é válido por 1 hora.</p>
                        <p>Se você não fez essa solicitação, por favor, ignore este e-mail.</p>
                        <p>Atenciosamente,</p>
                        <p>Equipe Forum Web - IFAP</p>
                    </div>
                `.trim(),
            });

            console.log(`Código de redefinição: ${resetCode}`);
            console.log(nodemailer.getTestMessageUrl(message));

            return { user : user }
        } catch (err) {
            console.error('Erro ao enviar e-mail com código de redefinição de senha:', err);
            return reply.status(500).send({ error: 'Erro ao enviar o e-mail de redefinição de senha.' });
        }
    });
}
