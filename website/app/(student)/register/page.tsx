import Image from 'next/image';
import Form from '@/components/form';
import Link from 'next/link';

export default function SignUp() {
    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-[#555b5e] shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-[#555b5e] px-4 py-6 pt-8 text-center sm:px-16">
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
                    <h3 className="text-xl font-semibold text-white">Vincule seu crachá</h3>
                    <p className="text-sm text-gray-400">
                        Preencha os campos abaixo para vincular seu crachá a sua conta do SUAP.
                    </p>
                </div>
                <Form type="register" />
            </div>
        </div>
    );
}
