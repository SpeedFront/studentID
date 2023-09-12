// Endpoint que adiciona uma porta ao banco de dados (precisa de autenticação de um usuário ADM)
import { NextResponse } from 'next/server';
import { suapLogin } from '@/services/suap/login';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { id, username, password, name, description } = await req.json();

    if (!/^\d+$/.test(username) && (!/^\d+$/.test(id) || id === undefined)) {
        return NextResponse.json({ status: 'error', message: 'Matrícula inválida' }, { status: 400 });
    } else if (
        (id !== undefined && typeof id !== 'string') ||
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        typeof name !== 'string' ||
        typeof description !== 'string' ||
        username.length <= 0 ||
        password.length <= 0 ||
        name.length <= 0 ||
        description.length <= 0
    ) {
        return NextResponse.json({ status: 'error', message: 'Campos em falta' }, { status: 400 });
    }

    const suapUser = await suapLogin(username, password);

    if (!suapUser.sessionid) {
        return NextResponse.json({ status: 'error', message: 'Credenciais inválidas' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { id: id ?? username },
    });

    if (!user) {
        return NextResponse.json({ status: 'error', message: 'Usuário não encontrado' }, { status: 400 });
    } else if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        return NextResponse.json(
            { status: 'error', message: 'Você não tem permissão para fazer isso' },
            { status: 400 },
        );
    }

    const door = await prisma.door
        .create({
            data: {
                name,
                description,
            },
        })
        .catch(() => undefined);

    if (!door) {
        return NextResponse.json({ status: 'error', message: 'Erro ao criar porta' }, { status: 400 });
    }

    return NextResponse.json({
        status: 'success',
        message: `Porta criada com sucesso! ID: ${door.id}`,
    });
}
