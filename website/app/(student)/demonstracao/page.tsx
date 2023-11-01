// Página de demonstração de como seria a requisição feita pelo leitor do crachá para a API, onde o usuário pode digitar o código (RFID) do crachá e ver o resultado da requisição.
// A página é acessível mesmo sem estar logado, pois é uma página de demonstração.
// Para os logados, a requisição na verdade vai criar um registro de entrada / saída.

import { type Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { Content } from './content';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
    title: 'StudentID - Demonstração',
    description: 'Página de demonstração do leitor de crachás',
};

export default async function Page() {
    const session = await getServerSession(callbacks);

    const door = await prisma.door.findFirst();

    return <Content user={session?.user ?? undefined} door={door ?? undefined} />;
}
