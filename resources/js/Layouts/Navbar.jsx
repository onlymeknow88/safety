import { Avatar, Badge, Button, Dropdown, Layout, Space, Typography, theme, Input, Popover, List } from "antd";
import {
    BellOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProfileOutlined,
    SettingOutlined,
    UserOutlined,
    SearchOutlined,
    DownOutlined,
} from "@ant-design/icons";
import { Link, router, usePage } from "@inertiajs/react";

import axios from "axios";
import { useTheme } from "../Contexts/ThemeContext";
import { useState } from "react";
import ProfileModal from "@/Pages/Profile/Partials/ProfileModal";

const { Header } = Layout;
const { Text } = Typography;

const mockNotifications = [
    { id: 1, title: "Unsafe Act Reported", desc: "Report #UA-2049 in Pit A by John Doe", time: "5 mins ago", unread: true },
    { id: 2, title: "PICA Target Overdue", desc: "Action item #PICA-901 requires immediate review", time: "1 hour ago", unread: true },
    { id: 3, title: "Investigation Closed", desc: "Report #INV-088 approved by Admin", time: "4 hours ago", unread: false },
    { id: 4, title: "Guideline Updated", desc: "UI Guideline v2.0 updated for implementation", time: "1 day ago", unread: false },
];

export default function Navbar({ collapsed, setCollapsed, title, isMobile, setIsDrawerOpen }) {
    const { auth } = usePage().props;
    const {
        token: { colorBgContainer, colorText },
    } = theme.useToken();
    const { isDarkMode, toggleTheme } = useTheme();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    const notificationContent = (
        <div style={{ width: 320, margin: "-12px -16px" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text strong>Notifications</Text>
                <a href="#" style={{ fontSize: 12 }} onClick={(e) => e.preventDefault()}>Mark all as read</a>
            </div>
            <List
                dataSource={mockNotifications}
                renderItem={(item) => (
                    <List.Item
                        style={{
                            padding: "12px 16px",
                            cursor: "pointer",
                            background: item.unread ? (isDarkMode ? "rgba(59, 130, 246, 0.08)" : "#f0f7ff") : "transparent",
                            transition: "background 0.2s",
                            borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                        }}
                    >
                        <List.Item.Meta
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text strong={item.unread} style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#0f172a' }}>{item.title}</Text>
                                    {item.unread && <Badge status="processing" />}
                                </div>
                            }
                            description={
                                <div>
                                    <div style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: 2 }}>{item.desc}</div>
                                    <div style={{ fontSize: 10, color: isDarkMode ? '#64748b' : '#94a3b8', marginTop: 4 }}>{item.time}</div>
                                </div>
                            }
                        />
                    </List.Item>
                )}
            />
            <div style={{ padding: "12px 16px", textAlign: 'center' }}>
                <a href="#" style={{ fontSize: 12, fontWeight: 600 }} onClick={(e) => e.preventDefault()}>View all notifications</a>
            </div>
        </div>
    );

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
                    borderBottom: `1px solid ${isDarkMode ? '#034561' : '#e2e8f0'}`,
                    boxShadow: isDarkMode ? "none" : "0 1px 4px rgba(0,21,41,0.08)",
                    height: 72,
                    lineHeight: "72px",
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
                    {!isMobile && (
                        <Popover
                            content={notificationContent}
                            trigger="click"
                            placement="bottomRight"
                            arrow
                        >
                            <Badge count={2} size="small" style={{ cursor: 'pointer' }}>
                                <Button
                                    type="text"
                                    icon={<BellOutlined style={{ fontSize: 18 }} />}
                                    style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                />
                            </Badge>
                        </Popover>
                    )}

                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                        <Space style={{ cursor: "pointer" }} size={isMobile ? 4 : 8}>
                            <Avatar
                                size={isMobile ? 28 : 36}
                                style={{ 
                                    background: "linear-gradient(135deg, #0F828A 0%, #013B52 100%)",
                                    fontWeight: 700,
                                    fontSize: isMobile ? 12 : 14,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {getInitials(auth?.user?.name || "Ahmad Wijaya")}
                            </Avatar>
                            {!isMobile && (
                                <div style={{ lineHeight: 1.2 }}>
                                    <div style={{ fontSize: 13, fontWeight: 600, color: colorText }}>
                                        {auth?.user?.name || "Ahmad Wijaya"}
                                    </div>
                                    <div style={{ fontSize: 11, color: isDarkMode ? "#cbd5e1" : "#64748b" }}>
                                        {auth?.user?.roles?.[0]?.name || "Safety Officer"}
                                    </div>
                                </div>
                            )}
                            <DownOutlined style={{ fontSize: 10, color: isDarkMode ? "#cbd5e1" : "#64748b" }} />
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

