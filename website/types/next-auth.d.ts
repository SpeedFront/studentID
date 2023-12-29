import type { Role, User as UserPrisma } from '@prisma/client';
import type { DefaultJWT } from 'next-auth/jwt';

export type CustomUser = Omit<UserPrisma, 'phoneNumber' | 'createdAt' | 'updatedAt'> & {
    suapId: string;
    role?: Role;
    activeSessionId?: string;
};

declare module 'next-auth' {
    type User = CustomUser;

    interface Session {
        user: User;
    }

    type JWT = DefaultJWT & User;
}
