import { App, ConfigProvider, theme as antdTheme } from "antd";
import { createContext, useContext, useEffect, useState } from "react";

import idID from "antd/locale/id_ID";

// Mengganti teks tombol default secara global agar aman dan tidak memicu error internal rc-picker
if (idID.DatePicker?.lang) {
    idID.DatePicker.lang.now = "Now";
    idID.DatePicker.lang.ok = "Ok";
}
if (idID.TimePicker) {
    idID.TimePicker.now = "Now";
    idID.TimePicker.ok = "Ok";
}

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
                    algorithm: isDarkMode
                        ? antdTheme.darkAlgorithm
                        : antdTheme.defaultAlgorithm,
                    token: {
                        fontFamily: "Inter, sans-serif",
                        borderRadius: 12,
                        ...(isDarkMode ? {
                            // Palet premium terinspirasi dari referensi desain (Cosmic Obsidian & Sleek Matte Violet-Gray)
                            colorPrimary: "#3b82f6",
                            colorInfo: "#3b82f6",
                            colorBgBase: "#0d0d12",
                            colorBgLayout: "#0d0d12",
                            colorBgContainer: "#1c1c24",
                            colorBgElevated: "#262631",
                            colorBorder: "#2d2d3a",
                            colorBorderSecondary: "#23232f",
                            colorTextBase: "#ffffff",
                            colorText: "#ffffff",
                            colorTextSecondary: "#a2a2ae",
                            colorTextTertiary: "#7b7b88",
                            colorTextQuaternary: "#565664",
                            boxShadowSecondary: "0 10px 40px rgba(0, 0, 0, 0.6)",
                        } : {
                            colorPrimary: "#2563eb",
                            colorInfo: "#2563eb",
                            borderRadius: 8,
                        })
                    },
                    components: {
                        Layout: {
                            siderBg: isDarkMode ? "#0d0d12" : "#ffffff",
                            headerBg: isDarkMode ? "#1c1c24" : "#ffffff",
                        },
                        Table: {
                            colorBgContainer: isDarkMode ? "#1c1c24" : "#ffffff",
                            headerBg: isDarkMode ? "#262631" : "#f8fafc",
                            headerColor: isDarkMode ? "#ffffff" : "#475569",
                            borderColor: isDarkMode ? "#2d2d3a" : "#f1f5f9",
                            rowHoverBg: isDarkMode ? "#262631" : "#f8fafc",
                        },
                        Card: {
                            colorBgContainer: isDarkMode ? "#1c1c24" : "#ffffff",
                            borderColor: isDarkMode ? "#2d2d3a" : "#f1f5f9",
                        },
                        Modal: {
                            contentBg: isDarkMode ? "#1c1c24" : "#ffffff",
                            headerBg: isDarkMode ? "#1c1c24" : "#ffffff",
                        },
                        Drawer: {
                            colorBgElevated: isDarkMode ? "#1c1c24" : "#ffffff",
                        },
                        Button: {
                            defaultBg: isDarkMode ? "#262631" : "#ffffff",
                            defaultBorderColor: isDarkMode ? "#3a3a4a" : "#d9d9d9",
                            defaultColor: isDarkMode ? "#ffffff" : "rgba(0, 0, 0, 0.88)",
                        },
                        Input: {
                            colorBgContainer: isDarkMode ? "#0d0d12" : "#ffffff",
                            borderColor: isDarkMode ? "#2d2d3a" : "#d9d9d9",
                            activeBorderColor: "#3b82f6",
                            hoverBorderColor: "#3b82f6",
                        },
                        Select: {
                            selectorBg: isDarkMode ? "#0d0d12" : "#ffffff",
                            borderColor: isDarkMode ? "#2d2d3a" : "#d9d9d9",
                            optionActiveBg: isDarkMode ? "#262631" : "#f5f5f5",
                            optionSelectedBg: isDarkMode ? "#2563eb" : "#e6f4ff",
                        },
                        Dropdown: {
                            colorBgElevated: isDarkMode ? "#262631" : "#ffffff",
                        }
                    }
                }}
            >
                <App>
                    {children}
                </App>
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};
