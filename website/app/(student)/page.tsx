import Image from 'next/image';

export default function Home() {
    return (
        <div className="flex h-screen w-full flex-col justify-center items-center">
            <Image width={512} height={512} src="/logo.png" alt="Platforms on Vercel" className="w-48 h-48" />
            <div className="text-center max-w-screen-sm mb-10">
                <h1 className="text-stone-200 font-bold text-2xl">🚧 Em criação 🚧</h1>
                <p className="text-stone-400 mt-5">Volte mais tarde para ver o que temos de novo...</p>
            </div>
        </div>
    );
}
