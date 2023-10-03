import { withAuth } from 'next-auth/middleware';

const publicPages = ['/login', '/register'];

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const path = req.nextUrl.pathname;
            const isPublicPage = publicPages.includes(path);
            const now = new Date();
            const exp = token?.exp as number | undefined;

            return (
                path.includes('.') ||
                isPublicPage ||
                !!(token !== null && exp !== undefined && exp > Math.round(now.getTime() / 1000))
            );
        },
    },
    pages: {
        signIn: '/login',
    },
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
