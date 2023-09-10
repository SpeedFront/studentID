// These styles apply to every route in the application
import '@/styles/globals.css';

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';

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
            themeColor: '#FFF',
        } as Metadata;
    } catch {
        notFound();
    }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    try {
        return (
            <html data-theme="light" lang="pt-BR">
                <body className={inter.variable}>
                    <Toaster />
                    {children}
                </body>
            </html>
        );
    } catch {
        notFound();
    }
}
