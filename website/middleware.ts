import { withAuth } from 'next-auth/middleware';

const publicPages = ['/login', '/register'];

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const path = req.nextUrl.pathname;
            const isPublicPage = publicPages.includes(path);

            return path.includes('.') || isPublicPage || token !== null;
        },
    },
    pages: {
        signIn: '/login',
    },
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
