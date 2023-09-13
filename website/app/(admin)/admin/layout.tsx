import { type Session, getServerSession } from 'next-auth';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';
import { Drawer } from '@/components/admin/header';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(callbacks);

    if (session?.user.role === undefined || session?.user.role === 'USER') {
        notFound();
    }

    return <Content session={session}>{children}</Content>;
}

const Content = ({ children, session }: { children: React.ReactNode; session: Session }) => {
    return (
        <Drawer drawerId="admin-drawer" user={session.user}>
            {children}
        </Drawer>
    );
};
