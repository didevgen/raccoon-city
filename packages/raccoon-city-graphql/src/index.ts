import {ApolloServer, gql} from 'apollo-server';
import {config} from 'dotenv';
import {logger} from './aws/logger';
import connect from './db/mongoose.client';
import {prisma} from './generated/prisma-client';
import resolvers from './resolvers';
import {default as typeDefs} from './schemas';

config();

const server = new ApolloServer({
    typeDefs: gql`
        ${typeDefs}
    `,
    resolvers,
    context: (request) => ({
        ...request,
        prisma
    }),
    formatError: (error) => {
        logger.error(error);
        return error;
    }
});
const db = process.env.MONGODB_URI;
connect({db});
server.listen({port: process.env.PORT || 4000}).then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});
