// Página onde ficará o histórico de registros de entrada e saída do aluno por paginação (10 registros por página)
import { getServerSession } from 'next-auth';
import { NavigationBar } from './navigation';
import { FaRegSadTear } from 'react-icons/fa';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import dayjs from 'dayjs';

import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

export default async function HistoricoPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const session = await getServerSession(callbacks);

    if (!session) {
        redirect('/login');
    }

    const { page: rawPage } = searchParams;
    let page = 1;

    if (rawPage) {
        const parsedPage = Array.isArray(rawPage) ? +rawPage[0] : +rawPage;
        page = Number.isNaN(parsedPage) ? 1 : parsedPage;
    }

    const { user } = session;

    const totalPages = Math.ceil((await prisma.accessLog.count({ where: { userId: user.id } })) / 10);
    const records = await prisma.accessLog.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        skip: page - 1 > 0 ? (page - 1) * 10 : 0,
        take: 10,
        select: {
            id: true,
            createdAt: true,
            door: {
                select: {
                    name: true,
                },
            },
        },
    });

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Histórico</h1>
            </div>
            <ul className="mt-8">
                {records.length === 0 ? (
                    <li className="shadow overflow-hidden sm:rounded-lg mb-4">
                        <div className="px-4 py-5 sm:px-6">
                            <div className="flex items-center justify-center">
                                <FaRegSadTear className="text-gray-400 text-2xl mr-2" />
                                <h3 className="text-lg leading-6 font-medium text-gray-400">
                                    Nenhum registro encontrado.
                                </h3>
                            </div>
                        </div>
                    </li>
                ) : (
                    records.map(({ id, createdAt, door: { name } }) => (
                        <li key={id} className="shadow overflow-hidden sm:rounded-lg mb-4 border border-gray-200">
                            <div className="px-4 py-5 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg leading-6 font-medium">
                                        {dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss')}
                                    </h3>
                                    <span className="text-gray-400">{name}</span>
                                </div>
                            </div>
                        </li>
                    ))
                )}
            </ul>
            <div className="flex justify-center items-center mt-8">
                <NavigationBar page={page} totalPages={totalPages} />
            </div>
        </div>
    );
}
