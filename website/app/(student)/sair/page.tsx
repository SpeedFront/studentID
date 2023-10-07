'use client';

import type { Metadata } from 'next/types';
import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Logo } from '@/components/logo';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Saindo...',
    description: 'Saindo...',
};

export default function Login() {
    useEffect(() => {
        signOut();
    }, []);

    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="z-10 w-full lg:max-w-md overflow-hidden rounded-2xl lg:border border-[#555b5e] shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-[#555b5e] px-4 py-6 pt-8 text-center sm:px-16">
                    <Link href="/">
                        <Logo priority className="h-40 w-40" width={160} height={160} />
                    </Link>
                    <h3 className="text-xl font-semibold">Saindo...</h3>
                </div>
            </div>
        </div>
    );
}
