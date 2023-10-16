// Página de CRUD de portas registradas no banco de dados

import { type Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';
import { List } from './client';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'StudentID - Administração - Portas',
    description: 'Página de administração de portas do StudentID',
};

export default async function PortasPage() {
    const doors = await prisma.door.findMany({
        orderBy: {
            createdAt: 'desc',
        },
    });

    const session = await getServerSession(callbacks);

    if (!session?.user.activeSessionId) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Portas registradas</h1>
            </div>
            <ul className="mt-8">
                <List doors={doors} session={session.user.activeSessionId} />
            </ul>
        </div>
    );
}
