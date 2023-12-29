'use client';

import type { MedicalInfo } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SignOut from '@/components/sign-out';
import toast from 'react-hot-toast';
import Image from 'next/image';

interface UserAccountProps {
    user: {
        name: string;
        email: string | undefined;
        phoneNumber: string | undefined;
        avatar: string | undefined;
    };
    session: string;
    medicalInfo: MedicalInfo;
}

const UserAccount = ({
    user,
    session,
    medicalInfo: { bloodType, deficiencies, diseases, medications, allergies, useHearingAid, useWheelchair },
}: UserAccountProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const { name, email, phoneNumber, avatar } = user;

    return (
        <div className="flex flex-col items-center w-full mt-4">
            <div className="flex flex-col w-full max-w-md items-stretch space-y-4 p-10 py-7 rounded-lg md:border">
                {avatar && (
                    <Image
                        src={'data:image/jpeg;base64,' + avatar}
                        alt={name + ' avatar'}
                        width={280}
                        height={280}
                        className="self-center rounded-full mb-8"
                    />
                )}
                <input
                    type="text"
                    id="name"
                    className="input w-full"
                    placeholder="Nome completo"
                    value={name}
                    disabled
                />
                <input type="text" id="name" className="input w-full" placeholder="E-mail" value={email} disabled />
                <input
                    type="text"
                    id="phoneNumber"
                    className="input w-full"
                    placeholder="Telefone"
                    value={phoneNumber ?? ''}
                    disabled
                />
                <button
                    onClick={async () => {
                        setLoading(true);

                        try {
                            const response = await fetch('/api/user/update/sync', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ session }),
                            });

                            if (response.ok) {
                                toast.success('Usuário atualizado com sucesso!');
                                router.refresh();
                            } else {
                                toast.error('Falha ao atualizar usuário...');
                            }
                        } catch (error) {
                            toast.error(`Falha ao atualizar usuário: ${error?.toString() ?? 'Erro desconhecido'}`);
                        }

                        setLoading(false);
                    }}
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Atualizando...' : 'Sincronizar com o SUAP'}
                </button>
                <div className="flex justify-evenly">
                    <SignOut type="button" className="btn btn-error" disabled={loading}>
                        Sair
                    </SignOut>
                    <button
                        type="submit"
                        className="btn btn-secondary"
                        disabled={loading}
                        onClick={() =>
                            (document.getElementById('medical_info_modal') as HTMLDialogElement)?.showModal()
                        }
                    >
                        {loading ? 'Atualizando...' : 'Dados Médicos'}
                    </button>
                </div>
            </div>
            <dialog id="medical_info_modal" className="modal">
                {/* Modal onde será mostrado as infos médica e poderá ser editada apenas as alergias do aluno, demais campos serão retratados apenas como texto */}
                <div className="bg-neutral text-neutral-content flex flex-col overflow-auto scrollbar-thin h-screen w-full md:max-w-md items-stretch space-y-4 px-10 pt-7 pb-4 md:rounded-lg md:h-[80vh] md:border">
                    <h1 className="text-2xl font-bold">Dados Médicos</h1>
                    <hr className="border-gray-400" />
                    <div className="flex flex-col space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="bloodType" className="text-lg font-semibold">
                                Tipo sanguíneo
                            </label>
                            <input
                                type="text"
                                id="bloodType"
                                className="bg-neutral w-full"
                                placeholder="Tipo sanguíneo"
                                value={bloodType ?? ''}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="deficiencies" className="text-lg font-semibold">
                                Deficiências
                            </label>
                            <input
                                type="text"
                                id="deficiencies"
                                className="bg-neutral w-full"
                                placeholder="Deficiências"
                                value={deficiencies?.join(', ') ?? ''}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="diseases" className="text-lg font-semibold">
                                Doenças
                            </label>
                            <input
                                type="text"
                                id="diseases"
                                className="bg-neutral w-full"
                                placeholder="Doenças"
                                value={diseases?.join(', ') ?? ''}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="medications" className="text-lg font-semibold">
                                Medicamentos
                            </label>
                            <input
                                type="text"
                                id="medications"
                                className="bg-neutral w-full"
                                placeholder="Medicamentos"
                                value={medications?.join(', ') ?? ''}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="allergies" className="text-lg font-semibold">
                                Alergias
                            </label>
                            <input
                                type="text"
                                id="allergies"
                                className="bg-neutral w-full"
                                placeholder="Alergias"
                                value={allergies?.join(', ') ?? ''}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="useHearingAid" className="text-lg font-semibold">
                                Usa aparelho auditivo?
                            </label>
                            <input
                                type="text"
                                id="useHearingAid"
                                className="bg-neutral w-full"
                                placeholder="Usa aparelho auditivo?"
                                value={useHearingAid ? 'Sim' : 'Não'}
                                disabled
                            />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label htmlFor="useWheelchair" className="text-lg font-semibold">
                                Usa cadeira de rodas?
                            </label>
                            <input
                                type="text"
                                id="useWheelchair"
                                className="bg-neutral w-full"
                                placeholder="Usa cadeira de rodas?"
                                value={useWheelchair ? 'Sim' : 'Não'}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex justify-evenly">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                                (document.getElementById('medical_info_modal') as HTMLDialogElement)?.close()
                            }
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default UserAccount;
