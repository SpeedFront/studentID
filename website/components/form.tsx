'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import LoadingDots from './loading-dots';
import toast from 'react-hot-toast';
import Link from 'next/link';
import clsx from 'clsx';

type FormValues = {
    requestId?: string;
    approveTerms?: boolean;
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
        watch,
        formState: { errors, isValid },
    } = useForm<FormValues>();

    const approveTerms = watch('approveTerms');
    const disabled = loading || (type === 'register' && !approveTerms) || !isValid;

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
                router.push(searchParams.get('callbackUrl') ?? '/conta');
            }
        } else {
            if (!data.approveTerms) {
                toast.error('Você precisa aceitar os termos de uso!');
                setLoading(false);
                return;
            }

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
                        router.push('/login');
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
            <div>
                <label htmlFor="registration" className="label">
                    <span className="label-text">Matrícula</span>
                </label>
                <input
                    id="registration"
                    {...register('registration', { required: true, pattern: /^\d{12}$/ })}
                    placeholder="Matrícula do SUAP"
                    className="input input-bordered w-full lg:max-w-xs"
                />
                {errors.registration && <p className="text-sm text-red-500">Matrícula inválida</p>}
            </div>
            <div>
                <label htmlFor="password" className="label">
                    <span className="label-text">Senha</span>
                </label>
                <input
                    id="password"
                    {...register('password', { required: true })}
                    type="password"
                    placeholder="Senha do SUAP"
                    className="input input-bordered w-full lg:max-w-xs"
                />
                {errors.password && <p className="text-sm text-red-500">Senha inválida</p>}
            </div>
            {type === 'register' && (
                <div>
                    <label htmlFor="requestId" className="label">
                        <span className="label-text">ID</span>
                    </label>
                    <input
                        id="requestId"
                        {...register('requestId', {
                            required: true,
                            pattern: /^\d+$/,
                        })}
                        type="text"
                        placeholder="ID do pedido de vinculação do cartão"
                        className="input input-bordered w-full lg:max-w-xs"
                    />
                    {errors.requestId && <p className="text-sm text-red-500">ID inválido</p>}
                </div>
            )}
            {type === 'register' && (
                <div className="flex items-center space-x-2">
                    <input
                        id="approveTerms"
                        {...register('approveTerms', { required: true })}
                        type="checkbox"
                        className="checkbox checkbox-accent"
                    />
                    <label htmlFor="approveTerms">
                        <span className="label-text">
                            Aceito os{' '}
                            <Link className="text-accent font-extrabold" href="/termos">
                                termos de uso
                            </Link>
                        </span>
                    </label>
                </div>
            )}
            <button
                type="submit"
                disabled={disabled}
                className={clsx({ 'cursor-not-allowed': disabled }, `btn btn-neutral normal-case`)}
            >
                {loading ? <LoadingDots color="#808080" /> : <p>{type === 'login' ? 'Entrar' : 'Criar conta'}</p>}
            </button>
            {type === 'login' ? (
                <p className="text-center text-sm">
                    Não tem uma conta?{' '}
                    <Link href="/registro" className="font-semibold">
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
