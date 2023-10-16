import type { Metadata } from 'next/types';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
    title: 'StudentID - Em criação',
    description: 'Página de em criação do StudentID',
};

export default function Home() {
    redirect('/conta');

    return (
        <div className="flex h-[85vh] w-full flex-col justify-center items-center">
            <Logo width={512} height={512} className="w-48 h-48" />
            <div className="text-center max-w-screen-sm mb-10">
                <h1 className="font-bold text-2xl">🚧 Em criação 🚧</h1>
                <p className="mt-5">Volte mais tarde para ver o que temos de novo...</p>
            </div>
        </div>
    );
}
