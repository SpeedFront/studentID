// Endpoint para registrar os acessos feitos por um usuário por meio de um leitor RFID vínculado a uma porta, a informação recebida será apenas o RFID
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { rfid, doorId } = await req.json();

    if (typeof rfid !== 'string' || rfid.length <= 0 || typeof doorId !== 'string' || doorId.length <= 0) {
        return NextResponse.json({ status: 'error', message: 'Campos em falta' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { rfid },
    });

    const door = await prisma.door.findUnique({
        where: { id: doorId },
    });

    if (!door) {
        return NextResponse.json({ status: 'error', message: 'Porta não encontrada' }, { status: 401 });
    } else if (!user) {
        const request = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/add/request/`, {
            method: 'POST',
            body: JSON.stringify({ rfid, doorId }),
        });

        try {
            const response = await request.json();

            if (response.status === 'success') {
                return NextResponse.json(response);
            } else {
                return NextResponse.json(
                    {
                        status: 'error',
                        message: response.error ?? response.message ?? '',
                    },
                    { status: request.status },
                );
            }
        } catch (e) {
            return NextResponse.json({ status: 'error', message: (e as Error)?.toString() }, { status: 401 });
        }
    }

    try {
        await prisma.accessLog.create({
            data: {
                userId: user.id,
                doorId: door.id,
            },
        });

        return NextResponse.json({ status: 'success', message: 'Acesso registrado com sucesso' });
    } catch (e) {
        return NextResponse.json(
            { status: 'error', message: 'Erro ao registrar acesso', error: (e as Error)?.toString() },
            { status: 400 },
        );
    }
}
