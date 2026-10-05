import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    export interface User {
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }

    export interface Session {
        user: {
            _id?: string;
            username?: string;
            email?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
        } & DefaultSession['user'];
    }
}

declare module 'next-auth/jwt' {
    export interface JWT {
        _id?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
    }
}