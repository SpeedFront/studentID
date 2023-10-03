import { getServerSession } from 'next-auth/next';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import UserAccount from './content';

export default async function Account() {
    const session = await getServerSession(callbacks);

    if (!session?.user) {
        redirect('/login');
    }

    return <UserAccount user={session.user} />;
}
