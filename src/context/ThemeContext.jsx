import { createContext, useContext, useEffect, useState } from "react";

import themes from "../styles/theme/themes";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {

    const [theme, setTheme] = useState(themes.default);

    useEffect(() => {

        const root = document.documentElement;

        const colors = theme.colors;

        root.style.setProperty("--bg", colors.bg);
        root.style.setProperty("--surface", colors.surface);
        root.style.setProperty("--card", colors.card);

        root.style.setProperty("--primary", colors.primary);
        root.style.setProperty("--primary-dark", colors.primaryDark);

        root.style.setProperty("--text", colors.text);
        root.style.setProperty("--sub-text", colors.subText);

        root.style.setProperty("--border", colors.border);

        root.style.setProperty("--success", colors.success);
        root.style.setProperty("--danger", colors.danger);
        root.style.setProperty("--warning", colors.warning);

    }, [theme]);

    return (

        <ThemeContext.Provider

            value={{

                theme,
                setTheme,
                themes,

            }}

        >

            {children}

        </ThemeContext.Provider>

    );

}

export function useTheme(){

    return useContext(ThemeContext);

}