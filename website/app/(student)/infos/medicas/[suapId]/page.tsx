// Página para mostrar as informações médicas do aluno (alergias, doenças, etc.) de acordo com a matrícula recebida pela rota dinâmica [suapId], que é a matrícula do aluno no SUAP. Aqui não deve ser mostrada nenhuma informação de identificação do aluno, apenas as informações médicas.
import type { Metadata } from 'next/types';
import prisma from '@/lib/prisma';
import { Logo } from '@/components/logo';

export const metadata: Metadata = {
    title: 'StudentID - Informações Médicas',
    description: 'Informações médicas do aluno',
};

export default async function MedicalInfo({ params: { suapId } }: Readonly<{ params: { suapId: string } }>) {
    const medicalInfo = await prisma.medicalInfo.findFirst({
        select: {
            bloodType: true,
            allergies: true,
            diseases: true,
            medications: true,
            deficiencies: true,
            useWheelchair: true,
            useHearingAid: true,
        },
        where: {
            student: {
                suapId,
            },
        },
    });

    if (!medicalInfo) {
        //Informações médicas não encontradas
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="z-10 w-full lg:max-w-md overflow-hidden rounded-2xl lg:border border-[#555b5e] shadow-xl">
                    <div className="flex flex-col items-center justify-center space-y-3 border-b border-[#555b5e] px-4 py-6 pt-8 text-center sm:px-16">
                        <h3 className="text-xl font-semibold text-white">Informações Médicas</h3>
                        <p>Informações médicas do aluno não encontradas</p>
                    </div>
                </div>
            </div>
        );
    }

    const { bloodType, allergies, diseases, medications, deficiencies, useHearingAid, useWheelchair } = medicalInfo;

    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="z-10 w-full lg:max-w-md overflow-hidden rounded-2xl lg:border border-[#555b5e] shadow-xl">
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-[#555b5e] px-4 py-6 pt-8 text-center sm:px-16">
                    <Logo priority className="h-40 w-40" width={160} height={160} />
                    <h3 className="text-xl font-semibold">Informações Médicas</h3>
                    <p>Informações médicas do aluno</p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-3 border-b border-[#555b5e] px-4 py-6 pt-8 text-center sm:px-16">
                    <p>
                        Tipo sanguíneo: <b>{bloodType}</b>
                    </p>
                    <p>
                        Alergias: <b>{allergies.length > 0 ? allergies.join(', ') : 'Nenhuma'}</b>
                    </p>
                    <p>
                        Doenças: <b>{diseases.length > 0 ? diseases.join(', ') : 'Nenhuma'}</b>
                    </p>
                    <p>
                        Medicamentos: <b>{medications.length > 0 ? medications.join(', ') : 'Nenhum'}</b>
                    </p>
                    <p>
                        Deficiências: <b>{deficiencies.length > 0 ? deficiencies.join(', ') : 'Nenhuma'}</b>
                    </p>
                    <p>
                        Utiliza cadeira de rodas? <b>{useWheelchair ? 'Sim' : 'Não'}</b>
                    </p>
                    <p>
                        Utiliza aparelho auditivo? <b>{useHearingAid ? 'Sim' : 'Não'}</b>
                    </p>
                </div>
            </div>
        </div>
    );
}
