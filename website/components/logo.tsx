'use client';

import { ComponentProps, useEffect, useState } from 'react';
import { useDarkMode } from 'usehooks-ts';
import Image from 'next/image';

function LogoUrl(props: Partial<ComponentProps<typeof Image>>) {
    const { isDarkMode } = useDarkMode();

    return <Image width={160} height={160} alt="Logo" {...props} src={isDarkMode ? '/logo-dark.png' : '/logo.png'} />;
}

export function Logo(props: Partial<ComponentProps<typeof Image>>) {
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
