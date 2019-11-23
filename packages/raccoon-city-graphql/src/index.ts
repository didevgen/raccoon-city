import {prisma} from './generated/prisma-client';
import resolvers from './resolvers';
import {default as typeDefs} from './schemas';
import connect from './db/mongoose.client';
import {ApolloServer} from 'apollo-server';
import {initFirebase} from './firebase';

const Firebase: any = initFirebase();
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: (request) => ({
        ...request,
        prisma,
        Firebase
    })
});
const db = process.env.MONGODB_URI;
connect({db});
server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`);
});
