// These styles apply to every route in the application
import '@/styles/globals.css';

import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import clsx from 'clsx';

const inter = Inter({
    variable: '--font-inter',
    subsets: ['latin'],
});

export async function generateMetadata() {
    const title = 'StudentID';
    const description = 'Plataforma para gerenciamento de entrada e saída de alunos do IFPB Campus Santa Rita.';

    try {
        return {
            title,
            description,
            twitter: {
                card: 'summary_large_image',
                title,
                description,
            },
            metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
        } as Metadata;
    } catch {
        notFound();
    }
}

export const viewport: Viewport = {
    themeColor: '#FFF',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    try {
        return (
            <html lang="pt-BR">
                <body
                    className={clsx(
                        inter.variable,
                        'min-h-screen scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-100 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-100',
                    )}
                >
                    {children}
                </body>
            </html>
        );
    } catch {
        notFound();
    }
}
