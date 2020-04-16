import {ApolloServer, gql} from 'apollo-server';
import {config} from 'dotenv';
import {logger} from './aws/logger';
import connect from './db/mongoose.client';
import {initFirebase} from './firebase';
import {prisma} from './generated/prisma-client';
import resolvers from './resolvers';
import {default as typeDefs} from './schemas';
import Redis from 'ioredis';

config();

async function tradeTokenForUser(token: string) {
    console.log("TOKEN", token);
    const userObj = JSON.parse(await redis.get(token));
    console.log("USER", userObj);
    return userObj ? userObj : null;
}

const Firebase: any = initFirebase();
const redis = new Redis();
const server = new ApolloServer({
    typeDefs: gql`
        ${typeDefs}
    `,
    resolvers,
    context: async ({req}) => {
        let authToken = null;
        let currentUser = null;
        try {
            authToken = req.headers.authorization;
            if (authToken) {
                currentUser = await tradeTokenForUser(authToken);
            }
        } catch (e) {
            console.warn(`Unable to authenticate using auth token: ${authToken}`);
        }
        return {
            ...req,
            prisma,
            Firebase,
            authToken,
            currentUser,
            redis
        };
    },
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
