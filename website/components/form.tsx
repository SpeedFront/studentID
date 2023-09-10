'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import LoadingDots from './loading-dots';
import toast from 'react-hot-toast';
import Link from 'next/link';

type FormValues = {
    fullName?: string;
    email: string;
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
            const { email, password } = data;
            const response = await signIn('credentials', {
                redirect: false,
                email,
                password,
            });

            if (response?.error) {
                setLoading(false);
                toast.error(response.error);
            } else {
                toast.success('Logado com sucesso! Redirecionando...');

                setTimeout(() => {
                    router.push(searchParams.get('callbackUrl') ?? '/account');
                }, 2000);
            }
        } else {
            const { fullName, email, password } = data;

            if (fullName) {
                fetch('/api/user/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        fullName,
                        email,
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
                        const { error } = await res.json();

                        toast.error(`Falha ao criar a conta: ${error ?? 'unknown error'}`);
                    }
                });
            } else {
                setLoading(false);
                toast.error('Preencha todos os campos!');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
            {type === 'register' && (
                <div>
                    <label htmlFor="fullName" className="block text-xs text-gray-600 uppercase">
                        Nome completo
                    </label>
                    <input
                        id="fullName"
                        {...register('fullName', {
                            required: true,
                            pattern: /\S+\s+\S+.*/,
                        })}
                        type="text"
                        placeholder="Nome completo"
                        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    />
                    {errors.fullName && <p className="text-xs text-red-500">Nome inválido</p>}
                </div>
            )}
            <div>
                <label htmlFor="email" className="block text-xs text-gray-600 uppercase">
                    Email
                </label>
                <input
                    id="email"
                    {...register('email', { required: true })}
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
                {errors.email && <p className="text-xs text-red-500">Email inválido</p>}
            </div>
            <div>
                <label htmlFor="password" className="block text-xs text-gray-600 uppercase">
                    Senha
                </label>
                <input
                    id="password"
                    {...register('password', { required: true })}
                    type="password"
                    className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
                {errors.password && <p className="text-xs text-red-500">Senha inválida</p>}
            </div>
            <button
                disabled={loading}
                className={`${
                    loading
                        ? 'cursor-not-allowed border-gray-200 bg-gray-100'
                        : 'border-black bg-black text-white hover:bg-white hover:text-black'
                } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
            >
                {loading ? <LoadingDots color="#808080" /> : <p>{type === 'login' ? 'Entrar' : 'Criar conta'}</p>}
            </button>
            {type === 'login' ? (
                <p className="text-center text-sm text-gray-600">
                    Não tem uma conta?{' '}
                    <Link href="/register" className="font-semibold text-gray-800">
                        Criar uma conta
                    </Link>
                </p>
            ) : (
                <p className="text-center text-sm text-gray-600">
                    Já tem uma conta?{' '}
                    <Link href="/login" className="font-semibold text-gray-800">
                        Entrar na conta
                    </Link>
                </p>
            )}
        </form>
    );
}
