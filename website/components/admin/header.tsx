import type { DetailedHTMLProps, HTMLAttributes } from 'react';
import type { User } from 'next-auth';
import Link from 'next/link';

import { AiOutlineHome, AiOutlineMenu } from 'react-icons/ai';
import { FaDoorOpen } from 'react-icons/fa';
//TODO import { PiStudent } from 'react-icons/pi';

type DrawerItem = {
    icon: React.ReactNode;
    name: string;
    href: string;
};

export const adminDrawerItems: DrawerItem[] = [
    {
        icon: <AiOutlineHome size={22} />,
        name: 'Início',
        href: '/admin',
    },
    {
        icon: <FaDoorOpen size={22} />,
        name: 'Portas',
        href: '/admin/portas',
    },
    /*{
        icon: <PiStudent size={22} />,
        name: 'Alunos',
        href: '/admin/alunos',
    },*/
];

export const superAdminDrawerItems: DrawerItem[] = [...adminDrawerItems];

const drawerItems = {
    ADMIN: adminDrawerItems,
    SUPER_ADMIN: superAdminDrawerItems,
};

export const Drawer = async ({
    drawerId,
    user,
    ...props
}: { drawerId: string; user: User } & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
    const { role } = user;

    return (
        <>
            <div className="drawer lg:drawer-open">
                <input id={drawerId} type="checkbox" className="drawer-toggle" />
                <div {...props} className={`drawer-content ${props.className ?? ''}`} />
                <div className="drawer-side z-50">
                    {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
                    <label htmlFor={drawerId} className="drawer-overlay" />
                    <ul className="menu p-4 w-80 h-full bg-neutral text-base-content gap-y-2">
                        {drawerItems[role as keyof typeof drawerItems].map(({ name, icon, href }) => (
                            <Link href={href} key={`drawer-item-${href}`}>
                                <li>
                                    <div className="flex items-end justify-start">
                                        {icon}
                                        <p>{name}</p>
                                    </div>
                                </li>
                            </Link>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="drawer-content fixed top-2 left-2 flex flex-col items-center justify-center z-40 lg:hidden">
                <label htmlFor={drawerId} className="btn btn-primary btn-circle drawer-button">
                    <AiOutlineMenu size={22} />
                </label>
            </div>
        </>
    );
};
