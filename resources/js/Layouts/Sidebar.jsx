import {
    AccountBookOutlined,
    AppstoreOutlined,
    BarChartOutlined,
    DashboardOutlined,
    FileTextOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    TeamOutlined,
    EnvironmentOutlined,
    FieldTimeOutlined,
    MedicineBoxOutlined,
    WarningOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Drawer } from "antd";
import { Link, usePage } from "@inertiajs/react";

import { useTheme } from "../Contexts/ThemeContext";

const { Sider } = Layout;

const iconMap = {
    DashboardOutlined: <DashboardOutlined />,
    TeamOutlined: <TeamOutlined />,
    SettingOutlined: <SettingOutlined />,
    AppstoreOutlined: <AppstoreOutlined />,
    BarChartOutlined: <BarChartOutlined />,
    ShoppingCartOutlined: <ShoppingCartOutlined />,
    FileTextOutlined: <FileTextOutlined />,
    AccountBookOutlined: <AccountBookOutlined />,
    EnvironmentOutlined: <EnvironmentOutlined />,
    FieldTimeOutlined: <FieldTimeOutlined />,
    MedicineBoxOutlined: <MedicineBoxOutlined />,
    WarningOutlined: <WarningOutlined />,
    SafetyCertificateOutlined: <SafetyCertificateOutlined />,
};

export default function Sidebar({ collapsed, isMobile, isDrawerOpen, setIsDrawerOpen }) {
    const { url, props } = usePage();
    const { auth } = props;
    const { isDarkMode } = useTheme();

    const getActiveKey = () => {
        const currentPath = url.split("?")[0].split("#")[0]; // Clean URL

        // Find the menu item with the longest matching URL (most specific match)
        const matchedMenu = auth.user?.menus
            ?.filter((m) => m.url)
            .sort((a, b) => b.url.length - a.url.length)
            .find((m) => {
                // Exact match
                if (currentPath === m.url) return true;
                // Path match (e.g., /master-data/ccow should match /master-data/ccow, not just /master-data)
                // Add trailing slash for segment matching
                const itemUrl = m.url.endsWith("/") ? m.url : `${m.url}/`;
                return currentPath.startsWith(itemUrl);
            });

        return matchedMenu ? matchedMenu.slug : "dashboard";
    };

    const getOpenKeys = () => {
        const activeKey = getActiveKey();
        if (!activeKey || activeKey === "dashboard") return [];

        const activeMenu = auth.user?.menus?.find((m) => m.slug === activeKey);
        if (activeMenu && activeMenu.parent_id) {
            const parent = auth.user?.menus?.find(
                (m) => m.id === activeMenu.parent_id,
            );
            return parent ? [parent.slug] : [];
        }
        return [];
    };

    const buildMenuTree = (menus) => {
        if (!menus) return [];

        const menuMap = {};
        const tree = [];

        // First pass: create mapping and initial AntD objects
        menus.forEach((menu) => {
            menuMap[menu.id] = {
                key: menu.slug,
                icon: menu.icon ? iconMap[menu.icon] : null,
                label: menu.url ? (
                    <Link href={menu.url} onClick={() => isMobile && setIsDrawerOpen(false)}>{menu.name}</Link>
                ) : (
                    menu.name
                ),
                order: menu.order,
                children: [],
            };
        });

        // Second pass: build hierarchy
        menus.forEach((menu) => {
            if (menu.parent_id && menuMap[menu.parent_id]) {
                menuMap[menu.parent_id].children.push(menuMap[menu.id]);
            } else {
                tree.push(menuMap[menu.id]);
            }
        });

        // Helper to cleanup items without children and sort by order
        const finalize = (items) => {
            return items
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((item) => {
                    const newItem = { ...item };
                    if (newItem.children && newItem.children.length > 0) {
                        newItem.children = finalize(newItem.children);
                    } else {
                        delete newItem.children;
                    }
                    return newItem;
                });
        };

        return finalize(tree);
    };

    const menuItems = buildMenuTree(auth.user?.menus);

    const sidebarStyles = `
             /* General Sidebar Overrides */
                .custom-tree-menu.ant-menu {
                    background: transparent !important;
                    padding: 0 12px;
                }
                .custom-tree-menu .ant-menu-item,
                .custom-tree-menu .ant-menu-submenu-title {
                    border-radius: 12px !important;
                    padding: 0 16px !important;
                    height: 48px !important; /* Slightly taller for more premium feel */
                    line-height: 48px !important;
                    transition: all 0.1s ease;
                    font-weight: 600 !important; /* Semi-bold for clear visibility */
                    color: ${isDarkMode ? "#a6a6a6" : "#475569"} !important;
                    font-size: 14px !important;
                }
                .custom-tree-menu .ant-menu-item a,
                .custom-tree-menu .ant-menu-submenu-title a {
                    color: inherit !important;
                    text-decoration: none !important;
                }
                /* Hover State - Improved Contrast & Theme Alignment */
                .custom-tree-menu .ant-menu-item:not(.ant-menu-item-selected):hover,
                .custom-tree-menu .ant-menu-submenu-title:hover {
                    background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#f0f7ff"} !important;
                    transition: all 0.2s ease !important;
                }

                .custom-tree-menu .ant-menu-item:not(.ant-menu-item-selected):hover *,
                .custom-tree-menu .ant-menu-submenu-title:hover * {
                    color: ${isDarkMode ? "#fff" : "#1a1a1a"} !important;
                }

                .custom-tree-menu .ant-menu-item:not(.ant-menu-item-selected):hover .anticon,
                .custom-tree-menu .ant-menu-submenu-title:hover .anticon {
                    color: #2563eb !important;
                }

                /* Submenu Title Style when has Active Child (NOT HOVERED) */
                .custom-tree-menu .ant-menu-submenu-selected > .ant-menu-submenu-title:not(:hover) {
                    background-color: ${isDarkMode ? "rgba(37, 99, 235, 0.15)" : "#e6f4ff"} !important;
                    color: #2563eb !important;
                    font-weight: 700 !important;
                }

                .custom-tree-menu .ant-menu-submenu-selected > .ant-menu-submenu-title:not(:hover) * {
                    color: #2563eb !important;
                }

                /* Active/Selected State - PILL LOOK */
                .custom-tree-menu .ant-menu-item-selected,
                .custom-tree-menu.ant-menu-light .ant-menu-item-selected,
                .custom-tree-menu.ant-menu-dark .ant-menu-item-selected {
                    background-color: #2563eb !important;
                    color: #ffffff !important;
                    font-weight: 700 !important; /* Bold for selected */
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
                }

                /* Ensure Selected state stays consistent even when hovered */
                .custom-tree-menu .ant-menu-item-selected:hover {
                    background-color: #1d4ed8 !important;
                    color: #ffffff !important;
                }
                .custom-tree-menu .ant-menu-item-selected a,
                .custom-tree-menu .ant-menu-item-selected .anticon,
                .custom-tree-menu .ant-menu-item-selected:hover a,
                .custom-tree-menu .ant-menu-item-selected:hover .anticon {
                    color: #ffffff !important;
                    font-weight: 700 !important;
                }

                .custom-tree-menu .ant-menu-item .anticon {
                    font-size: 18px !important;
                    transition: all 0.2s;
                }
                /* Tree lines for nested menus */
                .custom-tree-menu .ant-menu-submenu .ant-menu-sub.ant-menu-inline {
                    position: relative;
                    background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#f8fafc"};
                    border-radius: 14px;
                    margin: 4px 12px !important;
                    width: calc(100% - 24px) !important;
                }
                /* Vertical trunk */
                .custom-tree-menu .ant-menu-submenu .ant-menu-sub.ant-menu-inline::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    bottom: 20px;
                    left: 20px;
                    width: 1px;
                    background-color: ${isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"};
                    z-index: 1;
                }

                /* Hide Ant Design default indicators */
                .custom-tree-menu .ant-menu-item-selected::after,
                .custom-tree-menu .ant-menu-item::after {
                    display: none !important;
                }
                `;

    const SidebarContent = (
        <>
            <style>{sidebarStyles}</style>
            <div
                style={{
                    height: 80,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: (collapsed && !isMobile) ? "center" : "flex-start",
                    padding: (collapsed && !isMobile) ? "0" : "0 24px",
                    transition: "all 0.2s",
                    marginBottom: 8,
                }}
            >
                <div
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                    }}
                >
                    <span
                        style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}
                    >
                        P
                    </span>
                </div>
                {(!collapsed || isMobile) && (
                    <div style={{ marginLeft: 12, lineHeight: 1.2 }}>
                        <div
                            style={{
                                color: isDarkMode ? "#fff" : "#1a1a1a",
                                fontWeight: 800,
                                fontSize: 16,
                                letterSpacing: "-0.5px",
                            }}
                        >
                            Panicle Sales
                        </div>
                        <div
                            style={{
                                fontSize: 10,
                                color: "#8c8c8c",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                            }}
                        >
                            Modern CRM
                        </div>
                    </div>
                )}
            </div>

            <Menu
                className="custom-tree-menu"
                theme={isDarkMode ? "dark" : "light"}
                mode="inline"
                selectedKeys={[getActiveKey()]}
                defaultOpenKeys={getOpenKeys()}
                items={menuItems}
                style={{ border: "none", marginTop: 8 }}
            />
        </>
    );

    if (isMobile) {
        return (
            <Drawer
                placement="left"
                onClose={() => setIsDrawerOpen(false)}
                open={isDrawerOpen}
                styles={{
                    body: { padding: 0, height: '100%' },
                }}
                width={280}
                closable={false}
                drawerStyle={{
                    background: isDarkMode ? "#141414" : "#ffffff",
                }}
            >
                <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
                    {SidebarContent}
                </div>
            </Drawer>
        );
    }

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme={isDarkMode ? "dark" : "light"}
            width={280}
            style={{
                overflow: "auto",
                height: "100vh",
                position: "fixed",
                insetInlineStart: 0,
                top: 0,
                bottom: 0,
                scrollbarWidth: "thin",
                scrollbarColor: "unset",
                boxShadow: isDarkMode ? "none" : "2px 0 8px rgba(0,0,0,0.05)",
                borderRight: isDarkMode
                    ? "1px solid #303030"
                    : "1px solid #f0f0f0",
                zIndex: 100,
            }}
        >
            {SidebarContent}
        </Sider>
    );
}
