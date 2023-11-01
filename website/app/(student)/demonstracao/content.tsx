'use client';
import { Logo } from '@/components/logo';
import type { Door, User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type FormData = {
    rfid: string;
};

export const Content = ({ door }: { user?: User; door?: Door }) => {
    // Formulário de demonstração do leitor de crachás
    const {
        register,
        handleSubmit,
        formState: { isValid },
    } = useForm<FormData>();
    const [loading, setLoading] = useState(false);
    const { push } = useRouter();

    // Requisição para a API
    const onSubmit = async ({ rfid }: FormData) => {
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/access/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rfid,
                    doorId: door?.id,
                }),
            });

            if (res.ok) {
                const data = await res.json();

                if (data?.message.includes('ID ')) {
                    toast.success(data.message);
                    push(`/registro/?id=${data.message.replace(/\D/g, '')}`);
                } else {
                    toast.success(data.message);
                    push(`/historico`);
                }
            } else {
                toast.error('Erro ao enviar requisição!');
            }
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error('Erro ao enviar requisição!');
        }

        setLoading(false);
    };

    // HTML da página de demonstração utilizando DaisyUI para estilização
    return (
        <div className="flex h-[80vh] w-full items-center justify-center">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b px-4 py-6 pt-8 text-center sm:px-16">
                    <Logo />
                    <h3 className="text-xl font-semibold">Demonstração do leitor de crachás</h3>
                    <p className="text-sm text-gray-400">
                        Digite o código do crachá abaixo para ver o resultado da requisição. (Ex.: 27:41:AA:AB)
                    </p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-3 px-4 py-6 pt-8 text-center sm:px-16">
                    <form className="flex flex-col space-y-3" onSubmit={handleSubmit(onSubmit)}>
                        <input
                            type="text"
                            placeholder="Código do crachá"
                            className="input input-bordered"
                            {...register('rfid', { required: true, pattern: /^[0-9A-Fa-f]{2}(:[0-9A-Fa-f]{2}){3}$/ })}
                        />
                        <button className="btn btn-primary normal-case" disabled={loading || !isValid}>
                            Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
