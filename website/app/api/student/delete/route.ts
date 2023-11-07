// Endpoint que delete uma porta cadastrada no banco de dados (precisa de autenticação de um usuário ADM)
import type { Role } from '@prisma/client';
import { replaceNullWithUndefined } from '@/utils/object';
import { NextResponse } from 'next/server';
import { getUserData } from '@/services/suap/user';
import { suapLogin } from '@/services/suap/login';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { username, password, session, userId, studentId, suapId, fullyDelete } = await req.json();

    let user: Partial<{ admin: { type: Role } }> | undefined = undefined;

    if (typeof session !== 'string') {
        if (!/^\d+$/.test(username) || !/^\d+$/.test(studentId)) {
            return NextResponse.json({ status: 'error', message: 'Matrícula inválida' }, { status: 400 });
        } else if (
            typeof username !== 'string' ||
            typeof password !== 'string' ||
            typeof studentId !== 'string' ||
            username.length <= 0 ||
            password.length <= 0 ||
            studentId.length <= 0
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

    if (!fullyDelete) {
        const studentD = await prisma.student.findFirst({
            where: { OR: [{ id: studentId }, { suapId }] },
        });

        if (!studentD) {
            return NextResponse.json({ status: 'error', message: 'Aluno não encontrado' }, { status: 400 });
        }

        const deletedStudent = await prisma.student
            .delete({
                where: { id: studentD.id },
            })
            .catch(() => undefined);

        if (!deletedStudent) {
            return NextResponse.json({ status: 'error', message: 'Erro ao deletar aluno' }, { status: 400 });
        }
    } else {
        const userD = await prisma.user.findFirst({
            where: { OR: [{ id: userId }, { student: { OR: [{ suapId }, { id: studentId }] } }] },
        });

        if (!userD) {
            return NextResponse.json({ status: 'error', message: 'Usuário não encontrado' }, { status: 400 });
        }

        const deletedUser = await prisma.user
            .delete({
                where: { id: userD.id },
            })
            .catch(() => undefined);

        if (!deletedUser) {
            return NextResponse.json({ status: 'error', message: 'Erro ao deletar usuário' }, { status: 400 });
        }
    }

    return NextResponse.json({
        status: 'success',
        message: fullyDelete ? 'Usuário deletado com sucesso' : 'Aluno deletado com sucesso',
    });
}
