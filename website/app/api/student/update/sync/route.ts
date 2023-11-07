import { type UserData, getUserData } from '@/services/suap/user';
import { NextResponse } from 'next/server';
import { suapLogin } from '@/services/suap/login';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { username, password, session } = await req.json();

    let user: Partial<UserData> | undefined = undefined;

    if (typeof session === 'string') {
        user = await getUserData({ value: session }, true);
    } else {
        if (!/^\d+$/.test(username)) {
            return NextResponse.json({ status: 'error', message: 'Matrícula inválida' }, { status: 400 });
        } else if (
            typeof username !== 'string' ||
            typeof password !== 'string' ||
            username.length <= 0 ||
            password.length <= 0
        ) {
            return NextResponse.json({ status: 'error', message: 'Campos em falta' }, { status: 400 });
        }

        const { sessionid } = await suapLogin(username, password);

        if (!sessionid) {
            return NextResponse.json({ status: 'error', message: 'Credenciais inválidas' }, { status: 400 });
        }

        user = await getUserData({ value: sessionid?.value }, true);
    }

    if (!user) {
        return NextResponse.json({ status: 'error', message: 'Erro ao obter dados do usuário' }, { status: 400 });
    }

    const { registration, name, email, avatar, phoneNumber, medicalInfo } = user;

    const userDB = await prisma.student.update({
        data: {
            medicalInfo: {
                update: medicalInfo,
            },
            user: {
                update: {
                    name,
                    email,
                    avatar,
                    phoneNumber,
                },
            },
        },
        where: {
            suapId: registration,
        },
    });

    return NextResponse.json({ status: 'success', data: userDB });
}
