import type { Metadata } from 'next/types';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
    title: 'StudentID - Administração',
    description: 'Página de administração do StudentID',
};

export default function Home() {
    return (
        <div className="flex h-[85vh] w-full flex-col justify-center items-center">
            <Logo width={512} height={512} className="w-48 h-48" />
            <div className="text-center max-w-screen-sm mb-10">
                <h1 className="font-bold text-2xl">Página de administração</h1>
                <p className="text-base text-neutral-content">
                    Use o menu lateral para navegar entre as páginas de administração.
                </p>
            </div>
        </div>
    );
}
