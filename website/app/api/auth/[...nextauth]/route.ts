import NextAuth, { type NextAuthOptions, type AuthOptions, type CallbacksOptions } from 'next-auth';
import { suapLogin } from '@/services/suap/login';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma';

export const callbacks = {
    callbacks: {
        async session({ session, token, user }) {
            const dbUser = await prisma.user.findFirst({
                where: {
                    email: token?.email ?? undefined,
                },
            });

            session.user = dbUser ?? user;

            const activeSession = await prisma.session.findFirst({
                where: {
                    userId: session.user.id,
                    expiresAt: {
                        gt: new Date(),
                    },
                },
                orderBy: {
                    expiresAt: 'desc',
                },
            });

            if (activeSession) {
                session.user.activeSessionId = activeSession.sessionToken;
                return session;
            } else {
                return undefined;
            }
        },
    },
} as Partial<Omit<AuthOptions, 'callbacks'>> & {
    callbacks?: Omit<AuthOptions['callbacks'], 'session'> & {
        session?: (...args: Parameters<CallbacksOptions['session']>) => any;
    };
};

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                registration: { label: 'Matrícula', type: 'text' },
                password: { label: 'Senha', type: 'password' },
            },
            async authorize(credentials) {
                const { registration, password } = credentials ?? {};

                if (!registration || !password) {
                    throw new Error('Matrícula e senha são obrigatórios');
                }

                const exists = await suapLogin(registration, password);

                if (exists.status === 'error' || exists.sessionid === undefined) {
                    throw new Error(exists.message ?? 'Erro ao fazer login');
                }

                const user = await prisma.user.findUnique({
                    where: {
                        suapId: registration,
                    },
                });

                if (!user) {
                    throw new Error('Usuário não encontrado');
                }

                await prisma.session.create({
                    data: {
                        userId: user.id,
                        sessionToken: exists.sessionid.value,
                    },
                });

                return { ...user, activeSessionId: exists.sessionid.value };
            },
        }),
    ],
    callbacks: callbacks.callbacks,
    pages: {
        signIn: '/login',
        signOut: '/sair',
        newUser: '/conta',
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
