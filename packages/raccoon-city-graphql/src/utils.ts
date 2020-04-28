import * as jwt from 'jsonwebtoken';
import {Prisma} from './generated/prisma-client';
import {User} from './db/models/user';

export interface Context {
    prisma: Prisma;
    request: any;
}

export function getUserId(ctx: Context) {
    const Authorization = ctx.request.get('Authorization');
    if (Authorization) {
        const token = Authorization.replace('Bearer ', '');
        const {userId} = jwt.verify(token, process.env.APP_SECRET) as {userId: string};
        return userId;
    }

    throw new AuthError();
}

export function authTokenGenerate(user: User) {
    return jwt.sign({userId: user._id}, process.env.APP_SECRET, {
        expiresIn: process.env.JWT_LIFETIME
    });
}

export class AuthError extends Error {
    constructor() {
        super('Not authorized');
    }
}
