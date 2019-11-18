import {GraphQLServer} from 'graphql-yoga';
import {prisma} from './generated/prisma-client';
import resolvers from './resolvers';
import { default as typeDefs } from './schemas'

const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: (request) => ({
        ...request,
        prisma
    })
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
