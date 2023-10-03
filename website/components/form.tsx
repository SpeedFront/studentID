'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import LoadingDots from './loading-dots';
import toast from 'react-hot-toast';
import Link from 'next/link';

type FormValues = {
    requestId: string;
    registration: string;
    password: string;
};

type FormProps = {
    type: 'login' | 'register';
};

export default function Form({ type }: FormProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();

    const searchParams = useSearchParams();

    const onSubmit = async (data: FormValues) => {
        setLoading(true);

        if (type === 'login') {
            const { registration, password } = data;
            const response = await signIn('credentials', {
                redirect: false,
                registration,
                password,
            });

            if (response?.error) {
                setLoading(false);
                toast.error(response.error);
            } else {
                toast.success('Logado com sucesso! Redirecionando...');

                setTimeout(() => {
                    router.push(searchParams.get('callbackUrl') ?? '/conta');
                }, 2000);
            }
        } else {
            const { requestId, registration, password } = data;

            if (requestId) {
                fetch('/api/user/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: +requestId,
                        username: registration,
                        password,
                    }),
                }).then(async res => {
                    setLoading(false);

                    if (res.status === 200) {
                        toast.success('Conta criado com sucesso! Redirecionando para a página de login...');

                        setTimeout(() => {
                            router.push('/login');
                        }, 2000);
                    } else {
                        const { message } = await res.json();

                        toast.error(`Falha ao criar a conta: ${message ?? 'unknown error'}`);
                    }
                });
            } else {
                setLoading(false);
                toast.error('Preencha todos os campos!');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 px-4 py-8 sm:px-16">
            {type === 'register' && (
                <div>
                    <label htmlFor="requestId" className="block text-xs uppercase">
                        ID
                    </label>
                    <input
                        id="requestId"
                        {...register('requestId', {
                            required: true,
                            pattern: /^\d+$/,
                        })}
                        type="text"
                        placeholder="ID do pedido de vinculação do cartão"
                        className="mt-1 block w-full appearance-none rounded-md px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    />
                    {errors.requestId && <p className="text-sm text-red-500">ID inválido</p>}
                </div>
            )}
            <div>
                <label htmlFor="registration" className="block text-xs uppercase">
                    Matrícula
                </label>
                <input
                    id="registration"
                    {...register('registration', { required: true, pattern: /^\d{12}$/ })}
                    placeholder="Matrícula do SUAP"
                    className="mt-1 block w-full appearance-none rounded-md px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
                {errors.registration && <p className="text-sm text-red-500">Matrícula inválida</p>}
            </div>
            <div>
                <label htmlFor="password" className="block text-xs uppercase">
                    Senha
                </label>
                <input
                    id="password"
                    {...register('password', { required: true })}
                    type="password"
                    placeholder="Senha do SUAP"
                    className="mt-1 block w-full appearance-none rounded-md px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
                {errors.password && <p className="text-sm text-red-500">Senha inválida</p>}
            </div>
            <button disabled={loading} className={`btn btn-neutral ${loading ? 'cursor-not-allowed' : ''} normal-case`}>
                {loading ? <LoadingDots color="#808080" /> : <p>{type === 'login' ? 'Entrar' : 'Criar conta'}</p>}
            </button>
            {type === 'login' ? (
                <p className="text-center text-sm">
                    Não tem uma conta?{' '}
                    <Link href="/register" className="font-semibold">
                        Criar uma conta
                    </Link>
                </p>
            ) : (
                <p className="text-center text-sm">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="font-semibold">
                        Entrar na conta
                    </Link>
                </p>
            )}
        </form>
    );
}
