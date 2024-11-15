"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const client_error_1 = require("./error/client-error");
const zod_1 = require("zod");
const errorHandler = (error, request, reply) => {
    if (error instanceof zod_1.ZodError) {
        return reply.status(400).send({
            message: 'Invalid input',
            erros: error.flatten().fieldErrors
        });
    }
    if (error instanceof client_error_1.ClientError) {
        return reply.status(400).send({
            message: error.message
        });
    }
    return reply.status(500).send({ message: 'Internal Server error.' });
};
exports.errorHandler = errorHandler;
