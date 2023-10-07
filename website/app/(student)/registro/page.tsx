import type { Metadata } from 'next/types';
import { Logo } from '@/components/logo';
import Form from '@/components/form';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'StudentID - Registro',
    description: 'Página de registro do StudentID',
};

export default function SignUp() {
    return (
        <div className="flex min-h-fit py-4 items-center justify-center">
            <div className="z-10 w-full lg:max-w-md overflow-hidden rounded-2xl lg:border border-[#555b5e] shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-[#555b5e] px-4 py-6 pt-8 text-center sm:px-16">
                    <Link href="/">
                        <Logo priority className="h-40 w-40" width={160} height={160} />
                    </Link>
                    <h3 className="text-xl font-semibold">Vincule seu crachá</h3>
                    <p className="text-sm">Preencha os campos abaixo para vincular seu crachá a sua conta do SUAP.</p>
                </div>
                <Form type="register" />
            </div>
        </div>
    );
}
