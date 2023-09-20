'use client';

import { useEffect, useState } from 'react';
import { useLocalStorage } from 'use-hooks';
import { FiMoon, FiSun } from 'react-icons/fi';

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
    const [theme, setTheme] = useLocalStorage('theme', 'mythemelight');

    const toggleTheme = () => {
        setTheme(theme === 'mythemedark' ? 'mythemelight' : 'mythemedark');
    };

    useEffect(() => {
        const body = document.body;
        body.setAttribute('data-theme', theme);
    }, [theme]);

    return (
        <div>
            <button className="btn btn-circle" onClick={toggleTheme}>
                {theme === 'mythemedark' ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
            </button>
        </div>
    );
};

export default SwitchThemeWrapper;
