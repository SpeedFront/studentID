import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/header';

export default async function StudentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Toaster position="top-center" />
            <Navbar />
            {children}
        </>
    );
}
