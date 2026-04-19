import { useState, useEffect } from "react";
import { Layout, Grid } from "antd";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import MainContent from "./MainContent";
import Footer from "./Footer";
import TokenManager from "@/Utils/TokenManager";

const { useBreakpoint } = Grid;

export default function DashboardLayout({ children, title = "Dashboard" }) {
    const [collapsed, setCollapsed] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const screens = useBreakpoint();
    
    // Screens will be empty on first render/SSR, which might cause flicker.
    // md is usually the breakpoint for tablet/desktop (768px)
    const isMobile = screens.md === false;

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
            <Sidebar 
                collapsed={collapsed} 
                isMobile={isMobile} 
                isDrawerOpen={isDrawerOpen} 
                setIsDrawerOpen={setIsDrawerOpen} 
            />

            <Layout
                style={{
                    marginInlineStart: isMobile ? 0 : (collapsed ? 80 : 280),
                    transition: "all 0.2s",
                    minWidth: 0, // Prevent layout overflow
                }}
            >
                {/* Component Navbar (Header) */}
                <Navbar 
                    collapsed={collapsed} 
                    setCollapsed={setCollapsed} 
                    title={title} 
                    isMobile={isMobile}
                    setIsDrawerOpen={setIsDrawerOpen}
                />

                {/* Component Main Content */}
                <MainContent isMobile={isMobile}>
                    {children}
                </MainContent>

                {/* Component Footer */}
                <Footer />
            </Layout>
        </Layout>
    );
}
