import { getServerSession, type User } from 'next-auth';
import { returnIfCorrectType } from '@/utils/types';
import { NextResponse } from 'next/server';
import { callbacks } from '../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    const { name, password, image, phoneNumber } = (await req.json()) as User;
    const session = await getServerSession(callbacks);

    if (typeof session?.user?.id !== 'string') {
        return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const exists = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (exists) {
        const user = await prisma.user.update({
            data: {
                name: returnIfCorrectType(name, 'string'),
                password: returnIfCorrectType(password, 'string'),
                image: returnIfCorrectType(image, 'string'),
                phoneNumber: returnIfCorrectType(
                    phoneNumber,
                    'string',
                    /^(?:\+\d{2,3}\s?)?(?:\(?\d{2,3}\)?\s?)?\d{4,5}-?\d{4}$/,
                ),
            },
            where: { id: session.user.id },
        });

        return NextResponse.json(user);
    } else {
        return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }
}
