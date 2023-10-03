// Página de erro 404 padrão do serviço com um aviso e o link de retorno para o login do SUAP.
import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b px-4 py-6 pt-8 text-center sm:px-16">
                    <Link href="/">
                        <Logo priority className="h-64 w-64" width={256} height={256} />
                    </Link>
                    <h3 className="text-xl font-semibold">Página não encontrada</h3>
                    <p className="text-sm text-gray-400">A página que você está tentando acessar não existe.</p>
                    <Link href="/login" className="btn btn-primary normal-case">
                        Voltar para o login
                    </Link>
                </div>
            </div>
        </div>
    );
}
