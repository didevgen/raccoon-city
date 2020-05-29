import {ApolloError, ApolloServer, gql, AuthenticationError} from 'apollo-server';
import {config} from 'dotenv';
import Redis from 'ioredis';
import {logger} from './aws/logger';
import {PUBLIC_QUERIES, WHITELISTED_QUERIES} from './constants/whitelistedQuery';
import connect from './db/mongoose.client';
import {prisma} from './generated/prisma-client';
import resolvers from './resolvers';
import {default as typeDefs} from './schemas';

config();

async function tradeTokenForUser(token: string) {
    const userObj = JSON.parse(await redis.get(token));
    return userObj ? userObj : null;
}

const redis = new Redis();

const server = new ApolloServer({
    typeDefs: gql`
        ${typeDefs}
    `,
    resolvers,
    context: async ({req}) => {
        if (WHITELISTED_QUERIES.includes(req.body.operationName)) {
            return {
                ...req,
                prisma,
                redis
            };
        }

        let authToken = null;
        let currentUser = null;
        try {
            authToken = req.headers.authorization || '';
            currentUser = await tradeTokenForUser(authToken);
        } catch (e) {
            logger.warn(`Unable to authenticate using auth token: ${authToken}`);
        }

        if (!currentUser && req.headers.apitoken) {
            const token = req.headers.apitoken || '';
            // @ts-ignore
            const app = await tradeTokenForUser(token);

            if (app && PUBLIC_QUERIES.includes(req.body.operationName)) {
                return {
                    ...req,
                    prisma,
                    redis
                };
            }
        }

        if (!currentUser) {
            throw new AuthenticationError('you must be logged in');
        }

        return {
            ...req,
            prisma,
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
    logger.info(`🚀  Server ready at ${url}`);
});
