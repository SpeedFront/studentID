import { getServerSession } from 'next-auth';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/logo';
import Form from '@/components/form';
import Link from 'next/link';

export default async function Login() {
    const session = await getServerSession(callbacks);

    if (session?.user) {
        redirect('/conta');
    }

    return <Content />;
}

function Content() {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="z-10 w-full lg:max-w-md overflow-hidden rounded-2xl lg:border border-[#555b5e] shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-[#555b5e] px-4 py-6 pt-8 text-center sm:px-16">
                    <Link href="/">
                        <Logo priority className="h-40 w-40" width={160} height={160} />
                    </Link>
                    <h3 className="text-xl font-semibold text-white">Entre na sua conta</h3>
                    <p className="text-sm text-gray-400">Preencha os campos abaixo para entrar na sua conta.</p>
                </div>
                <Form type="login" />
            </div>
        </div>
    );
}
