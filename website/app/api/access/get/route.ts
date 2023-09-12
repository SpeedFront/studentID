// Endpoint para retornar os acessos de um usuário (ou de algum em específico caso a pessoa que esteja pedindo a solicitação seja ADM)
import { NextResponse } from 'next/server';
import { suapLogin } from '@/services/suap/login';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    const { id, username, password } = await req.json();

    if (!/^\d+$/.test(username) && (!/^\d+$/.test(id) || id === undefined)) {
        return NextResponse.json({ status: 'error', message: 'Matrícula inválida' }, { status: 400 });
    } else if (
        (id !== undefined && typeof id !== 'string') ||
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        username.length <= 0 ||
        password.length <= 0
    ) {
        return NextResponse.json({ status: 'error', message: 'Campos em falta' }, { status: 400 });
    }

    const suapUser = await suapLogin(username, password);

    if (!suapUser.sessionid) {
        return NextResponse.json({ status: 'error', message: 'Credenciais inválidas' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { id: id ?? username },
        include: {
            accesses: {
                include: {
                    door: true,
                },
            },
        },
    });

    if (!user) {
        return NextResponse.json({ status: 'error', message: 'Usuário não encontrado' }, { status: 400 });
    } else if (id !== undefined && !['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        return NextResponse.json(
            { status: 'error', message: 'Você não tem permissão para fazer isso' },
            { status: 400 },
        );
    }

    return NextResponse.json({
        status: 'success',
        user: user.suapId,
        data: user.accesses.map(access => ({
            id: access.id,
            door: {
                id: access.door.id,
                name: access.door.name,
                description: access.door.description,
            },
            date: access.createdAt,
        })),
    });
}
