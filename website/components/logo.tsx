'use client';

import { ComponentProps, useEffect, useState } from 'react';
import { useDarkMode } from 'usehooks-ts';
import Image from 'next/image';

export type Props = Partial<ComponentProps<typeof Image> & { wide?: boolean }>;

function LogoUrl(props: Props) {
    const { isDarkMode } = useDarkMode();

    return (
        <Image
            width={160}
            height={160}
            alt="Logo"
            {...props}
            src={isDarkMode ? `/logo${props.wide ? '-wide' : ''}-dark.png` : `/logo${props.wide ? '-wide' : ''}.png`}
        />
    );
}

export function Logo(props: Props) {
    const [windowDefined, setWindowDefined] = useState(false);

    useEffect(() => {
        setWindowDefined(true);
    }, []);

    return windowDefined ? (
        <LogoUrl width={160} height={160} alt="Logo" {...props} />
    ) : (
        <Image width={160} height={160} alt="Logo" {...props} src="/logo.png" />
    );
}
