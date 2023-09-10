import type { User as UserPrisma } from '@prisma/client';
import type { DefaultJWT } from 'next-auth/jwt';

type CustomUser = UserPrisma & { activeSessionId?: string };

declare module 'next-auth' {
    interface Session {
        user: User;
    }

    type JWT = DefaultJWT & User;

    type User = CustomUser;
}
