import { type Session, getServerSession } from 'next-auth';
import { useTranslations } from 'next-intl';
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
    const t = useTranslations('Components.Admin.Drawer');

    return (
        <Drawer
            drawerId="admin-drawer"
            user={session.user}
            texts={{ dashboard: t('dashboard'), products: t('products') }}
        >
            {children}
        </Drawer>
    );
};
