import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { suapLogin } from '@/services/suap/login';
import { getUserData } from '@/services/suap/user';

export async function POST(req: Request) {
    const { id, username, password } = await req.json();

    if (!/^\d+$/.test(username)) {
        return NextResponse.json({ status: 'error', message: 'Matrícula inválida' }, { status: 400 });
    } else if (
        typeof id !== 'number' ||
        typeof username !== 'string' ||
        typeof password !== 'string' ||
        username.length <= 0 ||
        password.length <= 0 ||
        id <= 0
    ) {
        return NextResponse.json({ status: 'error', message: 'Campos em falta' }, { status: 400 });
    }

    const creationRequest = (await prisma.creationRequest.findUnique({
        where: { id },
    })) ?? { id: 1, rfid: '' };

    if (typeof creationRequest?.rfid !== 'string') {
        return NextResponse.json({ error: 'Requisição inválida' }, { status: 400 });
    } else {
        console.log(creationRequest);
        console.time('suapLogin');
        const { sessionid } = await suapLogin(username, password);
        console.timeEnd('suapLogin');
        const { rfid } = creationRequest;

        console.log(sessionid?.value);
        if (!sessionid) {
            return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 400 });
        }

        const user = await getUserData({
            value: sessionid?.value,
            expires: Math.floor((Date.now() + 8 * 60 * 60 * 1000) / 1000),
        });

        console.log(user);

        return NextResponse.json(user);
    }
}
