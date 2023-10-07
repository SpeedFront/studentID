'use client';

import { ComponentProps, useEffect, useState } from 'react';
import { useDarkMode } from 'usehooks-ts';
import Image from 'next/image';

export type Props = Partial<ComponentProps<typeof Image> & { wide?: boolean; mode?: 'dark' | 'light' }>;

function LogoUrl(p: Props) {
    const { isDarkMode } = useDarkMode();
    const { wide, mode, ...props } = p;

    return (
        <Image
            width={160}
            height={160}
            alt="Logo"
            {...props}
            src={
                mode === undefined
                    ? isDarkMode
                        ? `/logo${wide ? '-wide' : ''}-dark.png`
                        : `/logo${wide ? '-wide' : ''}.png`
                    : mode === 'dark'
                    ? `/logo${wide ? '-wide' : ''}-dark.png`
                    : `/logo${wide ? '-wide' : ''}.png`
            }
        />
    );
}

export function Logo(p: Props) {
    const [windowDefined, setWindowDefined] = useState(false);

    useEffect(() => {
        setWindowDefined(true);
    }, []);

    const { wide, mode, ...props } = p;

    return windowDefined ? (
        <LogoUrl width={160} height={160} alt="Logo" {...props} mode={mode} wide={wide} />
    ) : (
        <Image width={160} height={160} alt="Logo" {...props} src="/logo.png" />
    );
}
