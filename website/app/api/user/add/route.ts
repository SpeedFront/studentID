import { NextResponse } from 'next/server';
import { getUserData } from '@/services/suap/user';
import { suapLogin } from '@/services/suap/login';
import prisma from '@/lib/prisma';

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

    const creationRequest = await prisma.creationRequest.findUnique({
        where: { id, used: false },
    });

    if (typeof creationRequest?.rfid !== 'string') {
        return NextResponse.json({ status: 'error', message: 'Requisição inválida' }, { status: 400 });
    } else {
        const { sessionid } = await suapLogin(username, password);
        const { rfid } = creationRequest;

        if (!sessionid) {
            return NextResponse.json({ status: 'error', message: 'Credenciais inválidas' }, { status: 400 });
        }

        const user = await getUserData(
            {
                value: sessionid?.value,
                expires: Math.floor((Date.now() + 8 * 60 * 60 * 1000) / 1000),
            },
            true,
        );

        if (!user) {
            return NextResponse.json({ status: 'error', message: 'Erro ao obter dados do usuário' }, { status: 400 });
        }

        const { registration, name, email, phoneNumber, avatar, medicalInfo } = user;

        const userDB = await prisma.user
            .create({
                data: {
                    suapId: registration,
                    rfid,
                    name,
                    email,
                    phoneNumber,
                    avatar,
                },
            })
            .catch(() => undefined);

        if (!userDB) {
            return NextResponse.json({ status: 'error', message: 'O usuário já existe!' }, { status: 400 });
        }

        if (medicalInfo) {
            await prisma.medicalInfo.create({
                data: {
                    ...medicalInfo,
                    userId: userDB.id,
                },
            });
        }

        await prisma.creationRequest.update({ data: { used: true }, where: { id } });

        return NextResponse.json({ status: 'success', data: user });
    }
}
