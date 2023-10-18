// Página de CRUD de alunos registradas no banco de dados

import { type Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { notFound } from 'next/navigation';
import { List } from './client';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'StudentID - Administração - Alunos',
    description: 'Página de administração dos alunos cadastrados no StudentID',
};

export default async function AlunosPage() {
    const users = await prisma.user.findMany({
        orderBy: {
            name: 'asc',
        },
    });

    const session = await getServerSession(callbacks);

    if (!session?.user.activeSessionId) {
        notFound();
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Alunos registradas</h1>
            </div>
            <ul className="mt-8">
                <List users={users} session={session.user.activeSessionId} />
            </ul>
        </div>
    );
}
