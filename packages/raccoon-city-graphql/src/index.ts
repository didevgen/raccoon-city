import {GraphQLServer} from 'graphql-yoga';
import {prisma} from './generated/prisma-client';
import resolvers from './resolvers';
import { default as typeDefs } from './schemas'
import connect from './db/mongoose.client';
const server = new GraphQLServer({
    typeDefs,
    resolvers,
    context: (request) => ({
        ...request,
        prisma
    })
});
const db = process.env.MONGODB_URI;
connect({db});
server.start(() => console.log(`Server is running on http://localhost:4000`));
