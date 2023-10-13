import { notFound } from 'next/navigation';
import { Logo } from '@/components/logo';
import remarkGfm from 'remark-gfm';
import Markdown from 'react-markdown';
import Link from 'next/link';

// Página onde o usuário pode ler os termos de uso do sistema. Os termos serão exibidos em Markdown.
export default async function Page() {
    const terms = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/terms.md`)
        .then(res => res.text())
        .catch(() => notFound());

    return (
        <div className="flex h-max items-center justify-center lg:py-6">
            <div className="z-10 w-full h-max xl:max-w-[90vw] rounded-2xl lg:border border-[#555b5e] shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-[#555b5e] px-4 py-6 pt-8 text-center sm:px-16">
                    <Link href="/">
                        <Logo priority className="h-40 w-40" width={160} height={160} />
                    </Link>
                    <h3 className="text-xl font-semibold">Termos de uso</h3>
                </div>
                <Markdown remarkPlugins={[remarkGfm]} className="grid gap-y-8 px-4 py-6 sm:px-16 ul-style">
                    {terms}
                </Markdown>
            </div>
        </div>
    );
}
