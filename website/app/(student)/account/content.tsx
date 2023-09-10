'use client';

import type { User } from '@prisma/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import SignOut from '@/components/sign-out';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface UserAccountProps {
    user: User;
}

const UserAccount = ({ user }: UserAccountProps) => {
    const router = useRouter();
    const [blockForm, setBlockForm] = useState(true);

    type FormValues = {
        name: string;
        phoneNumber?: string;
    };

    const { name, email, phoneNumber, avatar } = user;

    const {
        register,
        handleSubmit,
        setValue,
        formState: { isValid, isDirty },
    } = useForm<FormValues>({
        defaultValues: {
            name: name ?? undefined,
            phoneNumber: phoneNumber ?? undefined,
        },
    });

    useEffect(() => {
        if (name) {
            setValue('name', name);
        }

        if (phoneNumber) {
            setValue('phoneNumber', phoneNumber);
        }

        setBlockForm(false);
    }, [name, phoneNumber, setValue]);

    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: FormValues) => {
        setLoading(true);

        try {
            const response = await fetch('/api/user/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...user, ...data }),
            });

            if (response.ok) {
                toast.success('Usuário atualizado com sucesso!');

                setTimeout(() => router.refresh(), 2000);
            } else {
                toast.error('Falha ao atualizar usuário...');
            }
        } catch (error) {
            toast.error(`Falha ao atualizar usuário: ${error?.toString() ?? 'Erro desconhecido'}`);
        }

        setLoading(false);
    };

    return (
        <>
            <div className="flex flex-col items-center w-full gap-4 mt-4">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col space-y-4 p-10 py-7 rounded-lg border-black border"
                >
                    {avatar && (
                        <Image
                            src={avatar}
                            alt={name + ' avatar'}
                            width={280}
                            height={280}
                            className="rounded-full border-black border mb-8"
                        />
                    )}
                    <input
                        type="text"
                        id="name"
                        className="input w-full input-bordered"
                        placeholder="Nome completo"
                        {...register('name')}
                        disabled={blockForm}
                    />
                    {email && (
                        <input
                            type="text"
                            id="name"
                            className="input w-full input-bordered"
                            placeholder="E-mail"
                            value={email}
                            disabled
                        />
                    )}
                    <input
                        type="text"
                        id="phoneNumber"
                        className="input w-full input-bordered"
                        placeholder="Telefone"
                        {...register('phoneNumber', {
                            pattern: /^(?:\+\d{2,3}\s?)?(?:\(?\d{2,3}\)?\s?)?\d{4,5}-?\d{4}$/,
                        })}
                        disabled={blockForm}
                    />
                    <div className="flex justify-evenly">
                        <SignOut type="button" className="btn btn-error">
                            Sair
                        </SignOut>
                        <button type="submit" className="btn btn-primary" disabled={loading || blockForm || !isValid}>
                            {!isDirty ? 'Editar' : loading ? 'Atualizando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default UserAccount;
