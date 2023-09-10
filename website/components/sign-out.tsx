'use client';
import type { DetailedHTMLProps, ButtonHTMLAttributes } from 'react';
import { signOut } from 'next-auth/react';

export default function SignOut(props: DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) {
    return (
        <button
            className="btn btn-error"
            // eslint-disable-next-line react/no-children-prop
            children="Sign Out"
            {...props}
            onClick={() => signOut()}
        />
    );
}
