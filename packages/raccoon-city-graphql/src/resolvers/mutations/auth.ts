import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import {authTokenGenerate, Context} from '../../utils';
import {UserModel} from '../../db/models/user';
import { ApolloError } from 'apollo-server';

export const auth = {
    async signup(parent, args, ctx: Context) {
        const password = await bcrypt.hash(args.password, 10);
        const user = await ctx.prisma.createUser({...args, password});

        return {
            token: jwt.sign({userId: user.id}, process.env.APP_SECRET),
            user
        };
    },

    async login(parent, {email, password}, {redis}) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw new Error(`No such user found for email: ${email}`);
        }
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            throw new ApolloError("Unauthorized", "401");
        }
        const token = authTokenGenerate(user);
        await redis.set(token, JSON.stringify({id: user._id, features: user.features}), 'ex', process.env.REDIS_KEY_TTL);
        return {token};
    },

    async logout(parent, {key}, {redis}) {
        try {
            await redis.del(key);
            return true;
        } catch (e) {
            return false;
        }
    }
};
