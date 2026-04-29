import "./bootstrap";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { ConfigProvider, theme, App as AntdApp } from "antd";
import { StyleProvider } from '@ant-design/cssinjs';
import idID from "antd/locale/id_ID";
import { ThemeProvider } from "./Contexts/ThemeContext";

// Ant Design global CSS reset (v5)
import "antd/dist/reset.css";

import TokenManager from "./Utils/TokenManager";

// Check if token is expired (24 hours) on app load
if (TokenManager.isTokenExpired()) {
    TokenManager.removeToken();
}

const appName = window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,

    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob("./Pages/**/*.jsx")
        ),

    setup({ el, App: InertiaApp, props }) {
        const root = createRoot(el);

        root.render(
            <StyleProvider hashPriority="high">
                <ConfigProvider locale={idID}>
                    <ThemeProvider>
                        <AntdApp>
                            <InertiaApp {...props} />
                        </AntdApp>
                    </ThemeProvider>
                </ConfigProvider>
            </StyleProvider>
        );
    },

    progress: {
        color: "#1677ff",
    },
});
