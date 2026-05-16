import { Avatar, Badge, Button, Dropdown, Layout, Space, Typography, theme } from "antd";
import {
    BellOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    MoonOutlined,
    ProfileOutlined,
    SettingOutlined,
    SunOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link, router, usePage } from "@inertiajs/react";

import axios from "axios";
import { useTheme } from "../Contexts/ThemeContext";
import { useState } from "react";
import ProfileModal from "@/Pages/Profile/Partials/ProfileModal";

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar({ collapsed, setCollapsed, title, isMobile, setIsDrawerOpen }) {
    const { auth } = usePage().props;
    const {
        token: { colorBgContainer, colorText },
    } = theme.useToken();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const handleLogout = async () => {
        const token = localStorage.getItem("jwt_token");
        if (token) {
            try {
                await axios.post("/api/logout", {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            } catch (error) {
                console.error("JWT logout failed", error);
            }
            localStorage.removeItem("jwt_token");
        }
        router.post("/logout");
    };

    const userMenuItems = [
        {
            key: "profile",
            icon: <ProfileOutlined />,
            label: "My Profile",
            onClick: () => setIsProfileModalOpen(true),
        },
        {
            key: "settings",
            icon: <SettingOutlined />,
            label: <Link href="/settings">Settings</Link>,
        },
        { type: "divider" },
        {
            key: "logout",
            icon: <LogoutOutlined />,
            label: "Logout",
            onClick: handleLogout,
            danger: true,
        },
    ];

    const toggleSidebar = () => {
        if (isMobile) {
            setIsDrawerOpen(true);
        } else {
            setCollapsed(!collapsed);
        }
    };

    const getInitials = (name) => {
        if (!name) return "";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    return (
        <>
            <Header
                style={{
                    padding: isMobile ? "0 12px" : "0 24px",
                    background: colorBgContainer,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    borderBottom: `1px solid ${isDarkMode ? '#2d2d3a' : '#f0f0f0'}`,
                    boxShadow: isDarkMode ? "none" : "0 1px 4px rgba(0,21,41,0.08)",
                    height: 64,
                    lineHeight: "64px",
                }}
            >
                <Space size={isMobile ? 8 : 16}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={toggleSidebar}
                        style={{ fontSize: 16, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                </Space>

                <Space size={isMobile ? 8 : 16}>
                    <Button
                        type="text"
                        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                        onClick={toggleTheme}
                        style={{
                            zIndex: 10,
                            width: isMobile ? 32 : 40,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                    {!isMobile && (
                        <Badge count={5} size="small">
                            <Button
                                type="text"
                                icon={<BellOutlined style={{ fontSize: 18 }} />}
                                style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            />
                        </Badge>
                    )}

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                        <Space style={{ cursor: "pointer" }} size={isMobile ? 4 : 8}>
                            <Avatar
                                size={isMobile ? 28 : 36}
                                style={{ 
                                    background: "linear-gradient(135deg, #1677ff, #0958d9)",
                                    fontWeight: 700,
                                    fontSize: isMobile ? 12 : 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {getInitials(auth?.user?.name || "Admin User")}
                            </Avatar>
                            {!isMobile && (
                                <div style={{ lineHeight: 1.2 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: colorText }}>
                                        {auth?.user?.name || "Admin User"}
                                    </div>
                                    <div style={{ fontSize: 11, color: isDarkMode ? "#a6a6a6" : "#8c8c8c" }}>
                                        {auth?.user?.email || "admin@app.com"}
                                    </div>
                                </div>
                            )}
                        </Space>
                    </Dropdown>
                </Space>
            </Header>

            <ProfileModal 
                visible={isProfileModalOpen} 
                onCancel={() => setIsProfileModalOpen(false)} 
            />
        </>
    );
}

