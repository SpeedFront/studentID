import { withAuth } from 'next-auth/middleware';

const publicPages = ['/login', '/register'];
const publicPathnameRegex = RegExp(`^/(${publicPages.join('|')})/?$`, 'i');

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const path = req.nextUrl.pathname;
            const isPublicPage = publicPathnameRegex.test(path);

            if (path.includes('.')) {
                return true;
            }

            return isPublicPage || token !== null;
        },
    },
    pages: {
        signIn: '/login',
    },
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
