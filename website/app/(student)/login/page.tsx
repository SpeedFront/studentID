import { getServerSession } from 'next-auth';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Form from '@/components/form';
import Link from 'next/link';

export default async function Login() {
    const session = await getServerSession(callbacks);

    if (session?.user) {
        redirect('/account');
    }

    return <Content />;
}

function Content() {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
                    <Link href="/">
                        <Image
                            src="/logo.png"
                            priority
                            alt="Logo"
                            className="h-10 w-10 rounded-full"
                            width={20}
                            height={20}
                        />
                    </Link>
                    <h3 className="text-xl font-semibold">Entre na sua conta</h3>
                    <p className="text-sm text-gray-500">Preencha os campos abaixo para entrar na sua conta.</p>
                </div>
                <Form type="login" />
            </div>
        </div>
    );
}
