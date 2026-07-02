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
                        fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                        borderRadius: 10,
                        ...(isDarkMode ? {
                            colorPrimary: "#0F828A",
                            colorInfo: "#0F828A",
                            colorSuccess: "#6CBB5D",
                            colorWarning: "#ED832D",
                            colorError: "#ef4444",
                            colorBgBase: "#012b3d",
                            colorBgLayout: "#012b3d",
                            colorBgContainer: "#02374e",
                            colorBgElevated: "#034561",
                            colorBorder: "#034561",
                            colorBorderSecondary: "#02374e",
                            colorTextBase: "#ffffff",
                            colorText: "#ffffff",
                            colorTextSecondary: "#abd096",
                            colorTextTertiary: "#7EA7B2",
                            colorTextQuaternary: "#5c7f8c",
                            boxShadowSecondary: "0 10px 40px rgba(1, 43, 61, 0.5)",
                        } : {
                            colorPrimary: "#0F828A",
                            colorInfo: "#0f828a",
                            colorSuccess: "#6CBB5D",
                            colorWarning: "#ED832D",
                            colorError: "#ef4444",
                            colorBgBase: "#f8fafc",
                            colorBgLayout: "#f8fafc",
                            colorBgContainer: "#ffffff",
                            colorBorder: "#e2e8f0",
                            colorTextBase: "#000000",
                        })
                    },
                    components: {
                        Layout: {
                            siderBg: isDarkMode ? "#013B52" : "#ffffff",
                            headerBg: isDarkMode ? "#02374e" : "#ffffff",
                        },
                        Table: {
                            colorBgContainer: isDarkMode ? "#02374e" : "#ffffff",
                            headerBg: isDarkMode ? "#034561" : "#005C96",
                            headerColor: "#ffffff",
                            borderColor: isDarkMode ? "#034561" : "#f1f5f9",
                            rowHoverBg: isDarkMode ? "#034561" : "#f0f9ff",
                        },
                        Card: {
                            colorBgContainer: isDarkMode ? "#02374e" : "#ffffff",
                            borderColor: isDarkMode ? "#034561" : "#e2e8f0",
                            borderRadiusLG: 20,
                        },
                        Modal: {
                            contentBg: isDarkMode ? "#02374e" : "#ffffff",
                            headerBg: isDarkMode ? "#02374e" : "#ffffff",
                            borderRadiusLG: 20,
                        },
                        Drawer: {
                            colorBgElevated: isDarkMode ? "#02374e" : "#ffffff",
                        },
                        Button: {
                            defaultBg: isDarkMode ? "#034561" : "#ffffff",
                            defaultBorderColor: isDarkMode ? "#034561" : "#d9d9d9",
                            defaultColor: isDarkMode ? "#ffffff" : "#000000",
                            borderRadius: 10,
                        },
                        Input: {
                            colorBgContainer: isDarkMode ? "#012535" : "#ffffff",
                            borderColor: isDarkMode ? "#034561" : "#d9d9d9",
                            activeBorderColor: "#0F828A",
                            hoverBorderColor: "#0F828A",
                            borderRadius: 10,
                            colorText: "#000000",
                        },
                        Select: {
                            selectorBg: isDarkMode ? "#012535" : "#ffffff",
                            borderColor: isDarkMode ? "#034561" : "#d9d9d9",
                            optionActiveBg: isDarkMode ? "#034561" : "#f5f5f5",
                            optionSelectedBg: isDarkMode ? "#0F828A" : "#e6f4ff",
                            borderRadius: 10,
                        },
                        Dropdown: {
                            colorBgElevated: isDarkMode ? "#034561" : "#ffffff",
                        },
                        Menu: {
                            activeBarWidth: 0,
                            activeBarBorderWidth: 0,
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
