import { withAuth } from 'next-auth/middleware';

const publicPages = ['/login', '/register'];
const publicPathnameRegex = RegExp(`^/(${publicPages.join('|')})/?$`, 'i');

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

            return isPublicPage || token !== null;
        },
    },
    pages: {
        signIn: '/login',
    },
});

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)'],
};
