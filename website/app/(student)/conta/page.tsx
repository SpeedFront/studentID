import type { Metadata } from 'next/types';
import { getServerSession } from 'next-auth/next';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/logo';
import UserAccount from './content';
import prisma from '@/lib/prisma';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'StudentID - Minha conta',
    description: 'Página de configurações da conta do usuário',
};

export default async function Account() {
    const session = await getServerSession(callbacks);

    if (!session) {
        redirect('/login');
    }

    const { user } = session;

    const medicalInfo = await prisma.medicalInfo.findUnique({
        where: { userId: session.user.id },
    });

    if (!user.activeSessionId) {
        redirect('/login');
    } else if (!medicalInfo) {
        return (
            <div className="flex h-[80vh] w-full items-center justify-center">
                <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border shadow-xl">
                    <div className="flex flex-col items-center justify-center space-y-3 border-b px-4 py-6 pt-8 text-center sm:px-16">
                        <Link href="/">
                            <Logo priority className="h-64 w-64" width={256} height={256} />
                        </Link>
                        <h3 className="text-xl font-semibold">Dados médicos não encontrados</h3>
                        <p className="text-sm text-gray-400">Os dados médicos do usuário não foram encontrados.</p>
                        <Link href="/login" className="btn btn-primary normal-case">
                            Voltar para o login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return <UserAccount user={user} session={user.activeSessionId} medicalInfo={medicalInfo} />;
}
