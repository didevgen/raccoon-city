import resolvers from './resolvers';
import {default as typeDefs} from './schemas';
import connect from './db/mongoose.client';
import {ApolloServer, gql} from 'apollo-server';
import {initFirebase} from './firebase';

try {
    const Firebase: any = initFirebase();
    const server = new ApolloServer({
        typeDefs: gql`
            ${typeDefs}
        `,
        resolvers,
        cors: false,
        context: (request) => ({
            ...request,
            Firebase
        })
    });
    const db = process.env.MONGODB_URI;
    connect({db});
    server.listen({port: process.env.PORT || 4000}).then(({url}) => {
        console.log(`🚀  Server ready at ${url}`);
    });
} catch (e) {
    console.log(e);
}
