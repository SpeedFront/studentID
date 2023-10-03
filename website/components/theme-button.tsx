'use client';

import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useDarkMode } from 'usehooks-ts';

const SwitchThemeWrapper = () => {
    const [windowDefined, setWindowDefined] = useState(false);

    useEffect(() => {
        setWindowDefined(true);
    }, []);

    return windowDefined ? (
        <SwitchTheme />
    ) : (
        <button className="btn btn-circle">
            <FiMoon className="w-5 h-5" />
        </button>
    );
};
const SwitchTheme = () => {
    const { isDarkMode, toggle } = useDarkMode();

    useEffect(() => {
        const body = document.body;
        body.setAttribute('data-theme', `${isDarkMode ? 'mythemedark' : 'mythemelight'}`);
    }, [isDarkMode]);

    return (
        <div>
            <button className="btn btn-circle" onClick={toggle}>
                {isDarkMode ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
            </button>
        </div>
    );
};

export default SwitchThemeWrapper;
