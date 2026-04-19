import { Link, usePage, router } from "@inertiajs/react";
import axios from "axios";
import { Layout, Avatar, Dropdown, Badge, Button, theme, Typography, Space } from "antd";
import {
    UserOutlined,
    SettingOutlined,
    BellOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    ProfileOutlined,
    MoonOutlined,
    SunOutlined,
} from "@ant-design/icons";
import { useTheme } from "../Contexts/ThemeContext";

const { Header } = Layout;
const { Text } = Typography;

export default function Navbar({ collapsed, setCollapsed, title }) {
    const { auth } = usePage().props;
    const {
        token: { colorBgContainer, colorText },
    } = theme.useToken();
    const { isDarkMode, toggleTheme } = useTheme();

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
            label: <Link href="/profile">My Profile</Link>,
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

    return (
        <Header
            style={{
                padding: "0 24px",
                background: colorBgContainer,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 100,
                borderBottom: `1px solid ${isDarkMode ? '#303030' : '#f0f0f0'}`,
                boxShadow: isDarkMode ? "none" : "0 1px 4px rgba(0,21,41,0.08)",
            }}
        >
            <Space>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ fontSize: 16, width: 40, height: 40 }}
                />
                <Text strong style={{ fontSize: 16 }}>
                    {title}
                </Text>
            </Space>

            <Space size={16}>
                <Button
                    type="text"
                    icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                    onClick={toggleTheme}
                    style={{
                        zIndex: 10
                    }}
                />
                <Badge count={5} size="small">
                    <Button
                        type="text"
                        icon={<BellOutlined style={{ fontSize: 18 }} />}
                        style={{ width: 40, height: 40 }}
                    />
                </Badge>
                <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
                    <Space style={{ cursor: "pointer" }} size={8}>
                        <Avatar
                            size={34}
                            icon={<UserOutlined />}
                            style={{ background: "linear-gradient(135deg, #1677ff, #0958d9)" }}
                        />
                        <div style={{ lineHeight: 1.2 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: colorText }}>
                                {auth?.user?.name || "Admin User"}
                            </div>
                            <div style={{ fontSize: 11, color: isDarkMode ? "#a6a6a6" : "#8c8c8c" }}>
                                {auth?.user?.email || "admin@app.com"}
                            </div>
                        </div>
                    </Space>
                </Dropdown>
            </Space>
        </Header>
    );
}
