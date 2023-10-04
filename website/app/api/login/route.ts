import { NextResponse } from 'next/server';
import { getUserData } from '@/services/suap/user';
import { suapLogin } from '@/services/suap/login';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { username, password } = await req.json();

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

    const user = await getUserData({
        value: sessionid?.value,
        expires: Math.floor((Date.now() + 8 * 60 * 60 * 1000) / 1000),
    });

    if (!user) {
        return NextResponse.json({ status: 'error', message: 'Erro ao obter dados do usuário' }, { status: 400 });
    }

    const userDB = await prisma.user.update({
        data: {
            name: user.name,
            email: user.email,
            suapId: user.registration,
            phoneNumber: user.phoneNumber,
            avatar: user.avatar,
        },
        where: {
            suapId: user.registration,
        },
    });

    return NextResponse.json({ status: 'success', data: userDB });
}
