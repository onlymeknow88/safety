import { App, ConfigProvider, theme as antdTheme } from "antd";
import { createContext, useContext, useEffect, useState } from "react";

import idID from "antd/locale/id_ID";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // default light
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark";
    });

    useEffect(() => {
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");

        // Add class to body to customize any global CSS if needed
        if (isDarkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <ConfigProvider
                locale={idID}
                theme={{
                    token: {
                        colorPrimary: "#1677ff",
                        borderRadius: 6,
                        fontFamily: "Inter, sans-serif",
                    },
                    algorithm: isDarkMode
                        ? antdTheme.darkAlgorithm
                        : antdTheme.defaultAlgorithm,
                }}
            >
                <App>
                    {children}
                </App>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};
