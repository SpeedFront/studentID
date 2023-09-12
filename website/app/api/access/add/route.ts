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

    if (!user) {
        return NextResponse.json(
            { status: 'error', message: 'Esse crachá não está vinculado a nenhum aluno...' },
            { status: 400 },
        );
    } else if (!door) {
        return NextResponse.json({ status: 'error', message: 'Porta não encontrada' }, { status: 400 });
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
