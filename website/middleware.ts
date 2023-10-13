import { withAuth } from 'next-auth/middleware';

const publicPages = ['/login', '/registro', '/termos'];

function addHours(date: Date, hours: number) {
    date.setTime(date.getTime() + hours * 60 * 60 * 1000);

    return date;
}

export default withAuth({
    callbacks: {
        authorized: ({ req, token }) => {
            const path = req.nextUrl.pathname;
            const isPublicPage = publicPages.includes(path);
            const iat = token?.iat as number | undefined;

            return (
                path.includes('.') ||
                isPublicPage ||
                (token !== null && iat !== undefined && Date.now() < addHours(new Date(iat * 1000), 8).getTime())
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
