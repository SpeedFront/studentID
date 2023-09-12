import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { rfid, doorId } = await req.json();

    if (typeof rfid !== 'string' || rfid.length <= 0 || typeof doorId !== 'string' || doorId.length <= 0) {
        return NextResponse.json({ status: 'error', message: 'Campos em falta' }, { status: 400 });
    }

    const door = await prisma.door.findUnique({
        where: { id: doorId },
    });

    if (!door) {
        return NextResponse.json({ status: 'error', message: 'Porta não encontrada' }, { status: 400 });
    }

    const creationRequest = await prisma.creationRequest
        .create({
            data: {
                rfid,
            },
        })
        .catch(() => undefined);

    if (!creationRequest) {
        return NextResponse.json({ status: 'error', message: 'Erro ao criar requisição' }, { status: 400 });
    }

    return NextResponse.json({
        status: 'success',
        message: `Requisição criada com sucesso! ID: ${creationRequest.id}`,
    });
}
