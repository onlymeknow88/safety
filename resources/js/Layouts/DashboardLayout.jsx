import { useState, useEffect } from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MainContent from "./MainContent";
import Footer from "./Footer";
import TokenManager from "@/Utils/TokenManager";

export default function DashboardLayout({ children, title = "Dashboard" }) {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        // Cek langsung saat pertama kali render (untuk handle Refresh)
        if (TokenManager.isTokenExpired()) {
            TokenManager.logout();
        }

        // Jalankan satpam pengecek token expired tiap 5 detik
        TokenManager.startExpirationCheck();
    }, []);

    return (
        <Layout style={{ minHeight: "100vh" }}>
            {/* Component Sidebar */}
            <Sidebar collapsed={collapsed} />

            <Layout
                style={{
                    marginInlineStart: collapsed ? 80 : 280,
                    transition: "all 0.2s",
                }}
            >
                {/* Component Navbar (Header) */}
                <Navbar collapsed={collapsed} setCollapsed={setCollapsed} title={title} />

                {/* Component Main Content */}
                <MainContent>
                    {children}
                </MainContent>

                {/* Component Footer */}
                <Footer />
            </Layout>
        </Layout>
    );
}
