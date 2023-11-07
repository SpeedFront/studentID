//TODO: Adaptar para o novo sistema de login sem NextAuth para uso no React Native
import { NextResponse } from 'next/server';
import { suapLogin } from '@/services/suap/login';

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

    return NextResponse.json({ status: 'success', data: { session: sessionid.value } });
}
