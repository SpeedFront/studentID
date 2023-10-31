'use client';

import type { User } from '@prisma/client';
import { AiFillDelete } from 'react-icons/ai';
import { FaRegSadTear } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { IoIosAdd } from 'react-icons/io';
import { useState } from 'react';
import toast from 'react-hot-toast';

type ApiResponse = {
    status: 'success' | 'error';
    message?: string;
};

export function List({ users, session }: { users: User[]; session: string }) {
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Omit<User, 'createdAt' | 'updatedAt'>>();

    const { refresh } = useRouter();

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
                toast.success('Aluno deletado com sucesso!');
                refresh();
            } else {
                toast.error(message ?? 'Ocorreu um erro ao deletar o aluno!');
            }
        } catch (error) {
            toast.error('Ocorreu um erro inesperado ao deletar o aluno!');
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
                            <h3 className="text-lg leading-6 font-medium text-gray-400">Nenhum aluno cadastrada.</h3>
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
            <button
                className="btn btn-primary btn-circle w-16 h-16 fixed bottom-4 right-4"
                onClick={() => {
                    setSelectedUser(undefined);
                }}
            >
                <IoIosAdd size={44} />
            </button>
        </>
    );
}
