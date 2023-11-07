// Endpoint que atualiza uma porta já cadastrada no banco de dados (precisa de autenticação de um usuário ADM)
import type { Role } from '@prisma/client';
import { replaceNullWithUndefined } from '@/utils/object';
import { NextResponse } from 'next/server';
import { getUserData } from '@/services/suap/user';
import { suapLogin } from '@/services/suap/login';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { username, password, doorId, name, description, session } = await req.json();

    let user: Partial<{ admin: { type: Role } }> | undefined = undefined;

    if (typeof session !== 'string') {
        if (!/^\d+$/.test(username)) {
            return NextResponse.json({ status: 'error', message: 'Matrícula inválida' }, { status: 400 });
        } else if (
            typeof username !== 'string' ||
            typeof password !== 'string' ||
            typeof doorId !== 'string' ||
            (typeof name !== 'string' && name.length <= 0) ||
            (typeof description !== 'string' && description.length <= 0) ||
            username.length <= 0 ||
            password.length <= 0 ||
            doorId.length <= 0
        ) {
            return NextResponse.json({ status: 'error', message: 'Campos em falta' }, { status: 400 });
        }

        const suapUser = await suapLogin(username, password);

        if (!suapUser.sessionid) {
            return NextResponse.json({ status: 'error', message: 'Credenciais inválidas' }, { status: 400 });
        }

        user =
            replaceNullWithUndefined(
                await prisma.user.findFirst({
                    where: { student: { suapId: username } },
                    select: { admin: { select: { type: true } } },
                }),
            ) ?? undefined;
    } else {
        const userSuap = await getUserData({
            value: session,
            expires: Math.floor((Date.now() + 8 * 60 * 60 * 1000) / 1000),
        });

        user =
            replaceNullWithUndefined(
                await prisma.user.findFirst({
                    where: { student: { suapId: userSuap?.registration } },
                    select: { admin: { select: { type: true } } },
                }),
            ) ?? undefined;
    }

    if (!user?.admin?.type) {
        return NextResponse.json({ status: 'error', message: 'Usuário não encontrado' }, { status: 400 });
    } else if (!(['ADMIN', 'SUPER_ADMIN'] as Role[]).includes(user.admin.type)) {
        return NextResponse.json(
            { status: 'error', message: 'Você não tem permissão para fazer isso' },
            { status: 400 },
        );
    }

    const door = await prisma.door.findUnique({
        where: { id: doorId },
    });

    if (!door) {
        return NextResponse.json({ status: 'error', message: 'Porta não encontrada' }, { status: 400 });
    }

    const updatedDoor = await prisma.door
        .update({
            where: { id: doorId },
            data: {
                name,
                description,
            },
        })
        .catch(() => undefined);

    if (!updatedDoor) {
        return NextResponse.json({ status: 'error', message: 'Erro ao atualizar porta' }, { status: 400 });
    }

    return NextResponse.json({
        status: 'success',
        message: `Porta atualizada com sucesso! ID: ${updatedDoor.id}`,
    });
}
