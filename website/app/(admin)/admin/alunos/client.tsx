'use client';

import type { User } from '@prisma/client';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { FaRegSadTear } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { IoIosAdd } from 'react-icons/io';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

type ApiResponse = {
    status: 'success' | 'error';
    message?: string;
};

export function List({ users, session }: { users: User[]; session: string }) {
    const {
        register,
        handleSubmit,
        formState: { isValid },
        setValue,
    } = useForm<{ name: string; suapId: string }>();
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Omit<User, 'createdAt' | 'updatedAt'>>();

    const { refresh } = useRouter();

    const onSubmit = async (data: { name: string; suapId: string }) => {
        setLoading(true);

        if (!selectedUser) {
            try {
                const response = await fetch('/api/user/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...data, session }),
                });

                const { status, message } = (await response.json()) as ApiResponse;

                if (response.status === 200 && status === 'success') {
                    (document.getElementById('form_modal') as HTMLDialogElement).close();
                    toast.success('Aluno cadastrada com sucesso!');
                    refresh();
                } else {
                    toast.error(message ?? 'Ocorreu um erro ao cadastrar a aluno!');
                }
            } catch (error) {
                toast.error('Ocorreu um erro inesperado ao cadastrar a aluno!');
            }
        } else {
            try {
                const response = await fetch('/api/user/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...data, userId: selectedUser.id, session }),
                });

                const { status, message } = (await response.json()) as ApiResponse;

                if (response.status === 200 && status === 'success') {
                    (document.getElementById('form_modal') as HTMLDialogElement).close();
                    toast.success('Aluno atualizada com sucesso!');
                    refresh();
                } else {
                    toast.error(message ?? 'Ocorreu um erro ao atualizar a aluno!');
                }
            } catch (error) {
                toast.error('Ocorreu um erro inesperado ao atualizar a aluno!');
            }
        }

        setLoading(false);
    };

    const deleteUser = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/user/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: selectedUser?.id, session }),
            });

            const { status, message } = (await response.json()) as ApiResponse;

            if (response.status === 200 && status === 'success') {
                (document.getElementById('delete_modal') as HTMLDialogElement).close();
                toast.success('Aluno deletada com sucesso!');
                refresh();
            } else {
                toast.error(message ?? 'Ocorreu um erro ao deletar a aluno!');
            }
        } catch (error) {
            toast.error('Ocorreu um erro inesperado ao deletar a aluno!');
        }

        setLoading(false);
    };

    return (
        <>
            {users.length === 0 ? (
                <li className="shadow overflow-hidden sm:rounded-lg mb-4">
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex items-center justify-center">
                            <FaRegSadTear className="text-gray-400 text-2xl mr-2" />
                            <h3 className="text-lg leading-6 font-medium text-gray-400">Nenhuma aluno cadastrada. </h3>
                        </div>
                    </div>
                </li>
            ) : (
                users.map(user => (
                    <li key={user.id} className="shadow overflow-hidden sm:rounded-lg mb-4 border border-gray-200">
                        <div className="flex justify-around px-4 py-5 sm:px-6">
                            <div className="flex items-center justify-between w-[80%]">
                                <h3 className="text-lg leading-6 font-medium">{user.name}</h3>
                                <span className="text-gray-400">{user.suapId}</span>
                            </div>
                            <div className="flex justify-around w-[10%]">
                                <button
                                    className="btn btn-primary btn-circle"
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setValue('name', user.name ?? '');
                                        setValue('suapId', user.suapId ?? '');

                                        (document.getElementById('form_modal') as HTMLDialogElement).showModal();
                                    }}
                                >
                                    <AiFillEdit size={24} />
                                </button>
                                <button
                                    className="btn btn-error btn-circle"
                                    onClick={() => {
                                        setSelectedUser(user);
                                        (document.getElementById('delete_modal') as HTMLDialogElement).showModal();
                                    }}
                                >
                                    <AiFillDelete size={24} />
                                </button>
                            </div>
                        </div>
                    </li>
                ))
            )}
            <dialog id="delete_modal" className="modal">
                <div className="bg-neutral text-neutral-content flex flex-col w-full max-w-md items-stretch space-y-4 p-10 py-7 rounded-lg md:border">
                    <h1 className="text-2xl font-bold">Deletar aluno</h1>
                    <hr className="border-gray-400" />
                    <p className="text-lg">Tem certeza que deseja deletar a aluno?</p>
                    <div className="flex justify-evenly">
                        <button
                            disabled={loading}
                            type="button"
                            className="btn btn-accent"
                            onClick={() => (document.getElementById('delete_modal') as HTMLDialogElement)?.close()}
                        >
                            Cancelar
                        </button>
                        <button disabled={loading} type="submit" className="btn btn-error" onClick={deleteUser}>
                            Deletar
                        </button>
                    </div>
                </div>
            </dialog>
            <dialog id="form_modal" className="modal">
                {/* Modal onde será mostrado as infos médica e poderá ser editada apenas as alergias do aluno, demais campos serão retratados apenas como texto */}
                <form
                    className="bg-neutral text-neutral-content flex flex-col w-full max-w-md items-stretch space-y-4 p-10 py-7 rounded-lg md:border"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <h1 className="text-2xl font-bold">Dados para {selectedUser ? 'editar' : 'atualizar'}</h1>
                    <hr className="border-gray-400" />
                    <div className="flex flex-col space-y-4">
                        {selectedUser?.id && (
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="name" className="text-lg font-semibold">
                                    ID
                                </label>
                                <input className="input w-full" disabled value={selectedUser.id} />
                            </div>
                        )}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="name" className="text-lg font-semibold">
                                Nome
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="input w-full"
                                placeholder="Nome"
                                {...register('name', { required: true })}
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="suapId" className="text-lg font-semibold">
                                Descrição
                            </label>
                            <input
                                type="text"
                                id="suapId"
                                className="input w-full"
                                placeholder="Descrição"
                                {...register('suapId', { required: true })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-evenly">
                        <button
                            type="button"
                            className="btn btn-accent"
                            onClick={() => (document.getElementById('form_modal') as HTMLDialogElement)?.close()}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-warning" disabled={loading || !isValid}>
                            {selectedUser ? 'Editar' : 'Adicionar'}
                        </button>
                    </div>
                </form>
            </dialog>
            <button
                className="btn btn-primary btn-circle w-16 h-16 fixed bottom-4 right-4"
                onClick={() => {
                    setSelectedUser(undefined);
                    setValue('name', '');
                    setValue('suapId', '');
                    (document.getElementById('form_modal') as HTMLDialogElement).showModal();
                }}
            >
                <IoIosAdd size={44} />
            </button>
        </>
    );
}
