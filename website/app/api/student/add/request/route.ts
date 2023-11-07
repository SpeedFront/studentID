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
        .catch(e => (e?.toString() ?? '') as string);

    if (!creationRequest) {
        return NextResponse.json({ status: 'error', message: 'Erro ao criar requisição' }, { status: 400 });
    } else if (typeof creationRequest === 'string') {
        if (creationRequest.includes('Unique constraint failed on the fields: (`rfid`)')) {
            const existingRequest = await prisma.creationRequest.findUnique({
                where: { rfid },
            });

            if (existingRequest && existingRequest.expiresAt > new Date()) {
                return NextResponse.json({
                    status: 'error',
                    message: `Já existe uma requisição pendente para o RFID, o ID da requisição é: ${existingRequest.id}`,
                });
            } else if (existingRequest) {
                await prisma.creationRequest.delete({
                    where: { id: existingRequest.id },
                });

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

            return NextResponse.json({ status: 'error', message: 'Erro ao criar requisição' }, { status: 400 });
        } else {
            return NextResponse.json({ status: 'error', message: creationRequest }, { status: 400 });
        }
    }

    return NextResponse.json({
        status: 'success',
        message: `Requisição criada com sucesso! ID: ${creationRequest.id}`,
    });
}
