'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function NavigationBar({ page, totalPages }: { page: number; totalPages: number }) {
    const [loading, setLoading] = useState(false);
    const { push } = useRouter();

    useEffect(() => {
        setLoading(false);
    }, [page]);

    return (
        <div className="flex justify-between items-center join">
            <button
                className="join-item btn"
                disabled={page <= 1 || loading}
                onClick={() => {
                    setLoading(true);
                    push(`?page=${page - 1}`);
                }}
            >
                «
            </button>
            <button className="join-item btn">Página {page}</button>
            <button
                className="join-item btn"
                disabled={page >= totalPages || loading}
                onClick={() => {
                    setLoading(true);
                    push(`?page=${page + 1}`);
                }}
            >
                »
            </button>
        </div>
    );
}
