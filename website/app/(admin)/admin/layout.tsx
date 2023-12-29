import type { Role } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Drawer } from '@/components/admin/header';

export const adminRole = ['ADMIN', 'SUPER_ADMIN'] as Role[];

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const session = await getServerSession(callbacks);

    if (!session?.user.role || !adminRole.includes(session.user.role)) {
        notFound();
    }

    return (
        <>
            <Toaster position="top-center" />
            <Drawer drawerId="admin-drawer" user={session.user}>
                {children}
            </Drawer>
        </>
    );
}
