'use client';

import type { Door } from '@prisma/client';
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

export function List({ doors, session }: { doors: Door[]; session: string }) {
    const {
        register,
        handleSubmit,
        formState: { isValid },
        setValue,
    } = useForm<{ name: string; description: string }>();
    const [loading, setLoading] = useState(false);
    const [selectedDoor, setSelectedDoor] = useState<Omit<Door, 'createdAt' | 'updatedAt'>>();

    const { refresh } = useRouter();

    const onSubmit = async (data: { name: string; description: string }) => {
        setLoading(true);

        if (!selectedDoor) {
            try {
                const response = await fetch('/api/door/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...data, session }),
                });

                const { status, message } = (await response.json()) as ApiResponse;

                if (response.status === 200 && status === 'success') {
                    (document.getElementById('form_modal') as HTMLDialogElement).close();
                    toast.success('Porta cadastrada com sucesso!');
                    refresh();
                } else {
                    toast.error(message ?? 'Ocorreu um erro ao cadastrar a porta!');
                }
            } catch (error) {
                toast.error('Ocorreu um erro inesperado ao cadastrar a porta!');
            }
        } else {
            try {
                const response = await fetch('/api/door/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...data, doorId: selectedDoor.id, session }),
                });

                const { status, message } = (await response.json()) as ApiResponse;

                if (response.status === 200 && status === 'success') {
                    (document.getElementById('form_modal') as HTMLDialogElement).close();
                    toast.success('Porta atualizada com sucesso!');
                    refresh();
                } else {
                    toast.error(message ?? 'Ocorreu um erro ao atualizar a porta!');
                }
            } catch (error) {
                toast.error('Ocorreu um erro inesperado ao atualizar a porta!');
            }
        }

        setLoading(false);
    };

    const deleteDoor = async () => {
        setLoading(true);

        try {
            const response = await fetch('/api/door/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ doorId: selectedDoor?.id, session }),
            });

            const { status, message } = (await response.json()) as ApiResponse;

            if (response.status === 200 && status === 'success') {
                (document.getElementById('delete_modal') as HTMLDialogElement).close();
                toast.success('Porta deletada com sucesso!');
                refresh();
            } else {
                toast.error(message ?? 'Ocorreu um erro ao deletar a porta!');
            }
        } catch (error) {
            toast.error('Ocorreu um erro inesperado ao deletar a porta!');
        }

        setLoading(false);
    };

    return (
        <>
            {doors.length === 0 ? (
                <li className="shadow overflow-hidden sm:rounded-lg mb-4">
                    <div className="px-4 py-5 sm:px-6">
                        <div className="flex items-center justify-center">
                            <FaRegSadTear className="text-gray-400 text-2xl mr-2" />
                            <h3 className="text-lg leading-6 font-medium text-gray-400">Nenhuma porta cadastrada. </h3>
                        </div>
                    </div>
                </li>
            ) : (
                doors.map(({ id, name, description }) => (
                    <li key={id} className="shadow overflow-hidden sm:rounded-lg mb-4 border border-gray-200">
                        <div className="flex justify-around px-4 py-5 sm:px-6">
                            <div className="flex items-center justify-between w-[80%]">
                                <h3 className="text-lg leading-6 font-medium">{name}</h3>
                                <span className="text-gray-400">{description}</span>
                            </div>
                            <div className="flex justify-around w-[10%]">
                                <button
                                    className="btn btn-primary btn-circle"
                                    onClick={() => {
                                        setSelectedDoor({ id, name, description });
                                        setValue('name', name ?? '');
                                        setValue('description', description ?? '');

                                        (document.getElementById('form_modal') as HTMLDialogElement).showModal();
                                    }}
                                >
                                    <AiFillEdit size={24} />
                                </button>
                                <button
                                    className="btn btn-error btn-circle"
                                    onClick={() => {
                                        setSelectedDoor({ id, name, description });
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
                    <h1 className="text-2xl font-bold">Deletar porta</h1>
                    <hr className="border-gray-400" />
                    <p className="text-lg">Tem certeza que deseja deletar a porta?</p>
                    <div className="flex justify-evenly">
                        <button
                            disabled={loading}
                            type="button"
                            className="btn btn-accent"
                            onClick={() => (document.getElementById('delete_modal') as HTMLDialogElement)?.close()}
                        >
                            Cancelar
                        </button>
                        <button disabled={loading} type="submit" className="btn btn-error" onClick={deleteDoor}>
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
                    <h1 className="text-2xl font-bold">Dados para {selectedDoor ? 'editar' : 'atualizar'}</h1>
                    <hr className="border-gray-400" />
                    <div className="flex flex-col space-y-4">
                        {selectedDoor?.id && (
                            <div className="flex flex-col space-y-2">
                                <label htmlFor="name" className="text-lg font-semibold">
                                    ID
                                </label>
                                <input className="bg-neutral w-full cursor-text" disabled value={selectedDoor.id} />
                            </div>
                        )}
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="name" className="text-lg font-semibold">
                                Nome
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="input w-full !text-black dark:!text-neutral-content"
                                placeholder="Nome"
                                {...register('name', { required: true })}
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="description" className="text-lg font-semibold">
                                Descrição
                            </label>
                            <input
                                type="text"
                                id="description"
                                className="input w-full !text-black dark:!text-neutral-content"
                                placeholder="Descrição"
                                {...register('description', { required: true })}
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
                            {selectedDoor ? 'Editar' : 'Adicionar'}
                        </button>
                    </div>
                </form>
            </dialog>
            <button
                className="btn btn-primary btn-circle w-16 h-16 fixed bottom-4 right-4"
                onClick={() => {
                    setSelectedDoor(undefined);
                    setValue('name', '');
                    setValue('description', '');
                    (document.getElementById('form_modal') as HTMLDialogElement).showModal();
                }}
            >
                <IoIosAdd size={44} />
            </button>
        </>
    );
}
