import { Logo } from '@/components/logo';

export default function Home() {
    return (
        <div className="flex h-screen w-full flex-col justify-center items-center">
            <Logo width={512} height={512} className="w-48 h-48" />
            <div className="text-center max-w-screen-sm mb-10">
                <h1 className="text-stone-200 font-bold text-2xl">🚧 Em criação 🚧</h1>
                <p className="text-stone-400 mt-5">Volte mais tarde para ver o que temos de novo...</p>
            </div>
        </div>
    );
}
