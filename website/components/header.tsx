import { IoReorderThreeSharp } from 'react-icons/io5';
import { FiUser, FiSettings } from 'react-icons/fi';
import { getServerSession } from 'next-auth';
import { callbacks } from '@/app/api/auth/[...nextauth]/route';
import { Logo } from './logo';
import ReactThemeToggleButton from './theme-button';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

const Navbar = async () => {
    const session = await getServerSession(callbacks);

    const categories: { id: number; name: string; url: string }[] = [
        { id: 1, name: 'Histórico', url: '/historico' },
        // { id: 2, name: 'Comprovantes', url: '/comprovantes' },
        // { id: 3, name: 'Configurações', url: '/settings' },
    ];

    return (
        <header className="z-50 w-full sticky top-0 bg-neutral border-neutral-content border-b">
            <div className="w-full h-20 flex items-center justify-between">
                <IoReorderThreeSharp className="text-gray-800 border-black border-2 p-2 rounded-full text-5xl cursor-pointer hover:text-gray-600 ml-[1%] block lg:hidden" />
                <Link href="/" className="px-6 hidden sm:block">
                    <Logo wide alt="Logo" width={130} height={75} />
                </Link>
                <div className="flex items-center space-x-4 max-w-[18%] ml-auto mr-[1%] sm:mr-4 lg:mr-6">
                    <Link
                        href={session?.user.role && session?.user.role !== 'USER' ? '/admin' : '/'}
                        className="cursor-pointer relative inline-flex items-center"
                    >
                        {session?.user.role && session?.user.role !== 'USER' ? (
                            <FiSettings className="text-gray-800 text-3xl cursor-pointer hover:text-gray-600" />
                        ) : null}
                    </Link>
                    <Link href={!session?.user ? '/login' : '/account'} className="btn btn-circle">
                        {session?.user.avatar ? (
                            <Image
                                src={`data:image/jpeg;base64,${session.user.avatar}`}
                                alt={session.user.name + ' avatar'}
                                width={48}
                                height={48}
                            />
                        ) : (
                            <FiUser className="text-2xl" />
                        )}
                    </Link>
                    <div className="hidden lg:block">
                        <ReactThemeToggleButton />
                    </div>
                </div>
            </div>
            <nav className="hidden lg:block w-full">
                <ul className="block lg:flex">
                    <ListItem className="text-neutral-content border-neutral-content border-r px-8" NavLink="/">
                        Início
                    </ListItem>
                    {categories.map(({ id, name, url }) => (
                        <ListItem
                            key={'NavBar-' + id}
                            className="text-neutral-content border-neutral-content border-r px-8"
                            NavLink={`${process.env.NEXT_PUBLIC_SITE_URL}${url}`}
                        >
                            {name}
                        </ListItem>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;

const ListItem = ({
    children,
    className,
    NavLink,
}: {
    children: React.ReactNode;
    className?: string;
    NavLink: string;
}) => {
    return (
        <>
            <li>
                <Link
                    href={NavLink}
                    className={clsx('flex justify-center items-center py-2 text-base font-medium', className)}
                >
                    {children}
                </Link>
            </li>
        </>
    );
};
