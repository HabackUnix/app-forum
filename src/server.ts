import fastify from "fastify";
import cors from "@fastify/cors";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

import env from "./env";
import { errorHandler } from "./error-handler";
import { createUser } from "./routes/create-users";
import { createCategory } from "./routes/create-categories";
import { createTopic } from "./routes/create-topics";
import { createPost } from "./routes/create-posts";
import { getUserDetails } from "./routes/get-user-details";
import { updatePost } from "./routes/update-post";
import { deletePost } from "./routes/delete-post";
import { updateTopic } from "./routes/update-topic";
import { confirmReaction } from "./routes/confirm-reaction";
import { deleteTopic } from "./routes/delete-topic";
import { verifyUser } from "./routes/verify-user";
import { SendMailPassword } from "./routes/sendmail-password";
import { verifyToken } from "./routes/verify-token-password";
import { updateUserPassword } from "./routes/update-user-password";
import { getCategories } from "./routes/get-categories";
import { getTopics } from "./routes/get-topics";
import { getPosts } from "./routes/get-posts";
import { getPostsUser } from "./routes/get-posts-user";
import { getTopicsUser } from "./routes/get-topics-user";


const app = fastify();

app.register(cors, {
    origin: '*'
})

app.setErrorHandler(errorHandler);

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);


app.register(createUser);
app.register(createCategory);
app.register(createTopic);
app.register(createPost);
app.register(confirmReaction);

app.register(SendMailPassword);
app.register(verifyUser);
app.register(verifyToken);

app.register(updatePost);
app.register(updateTopic);
app.register(updateUserPassword);
app.register(getUserDetails);
app.register(getCategories);
app.register(getTopics);
app.register(getPosts);
app.register(getPostsUser);
app.register(getTopicsUser);

app.register(deletePost);
app.register(deleteTopic);

app.addHook('onRequest', (request, reply, done) => {
    console.log('Recebendo requisição de:', request.ip);
    done();
});


app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
    console.log('Server running!');
});
