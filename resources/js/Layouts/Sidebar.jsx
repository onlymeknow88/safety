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
    ClusterOutlined,
    ApartmentOutlined,
    CarOutlined,
    SafetyOutlined,
    FileSearchOutlined,
    SearchOutlined,
    SunOutlined,
    MoonOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { Button, Layout, Menu, Drawer, Input, Switch, Space } from "antd";
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
    ClusterOutlined: <ClusterOutlined />,
    ApartmentOutlined: <ApartmentOutlined />,
    CarOutlined: <CarOutlined />,
    SafetyOutlined: <SafetyOutlined />,
    FileSearchOutlined: <FileSearchOutlined />,
};

export default function Sidebar({ collapsed, isMobile, isDrawerOpen, setIsDrawerOpen }) {
    const { url, props } = usePage();
    const { auth } = props;
    const { isDarkMode, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [openKeys, setOpenKeys] = useState([]);

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

    useEffect(() => {
        if (searchQuery) {
            const parents = auth.user?.menus?.filter(m => !m.parent_id && m.slug).map(m => m.slug) || [];
            setOpenKeys(parents);
        } else {
            setOpenKeys(getOpenKeys());
        }
    }, [searchQuery, url]);

    const filterMenus = (menus, query) => {
        if (!menus) return [];
        if (!query) return menus;

        const queryLower = query.toLowerCase();
        const matchedIds = new Set();

        menus.forEach((menu) => {
            if (menu.name && menu.name.toLowerCase().includes(queryLower)) {
                matchedIds.add(menu.id);
                if (menu.parent_id) {
                    matchedIds.add(menu.parent_id);
                }
            }
        });

        let addedAny = true;
        while (addedAny) {
            addedAny = false;
            menus.forEach((menu) => {
                if (matchedIds.has(menu.id) && menu.parent_id && !matchedIds.has(menu.parent_id)) {
                    matchedIds.add(menu.parent_id);
                    addedAny = true;
                }
            });
        }

        return menus.filter((menu) => matchedIds.has(menu.id));
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
        const finalize = (items, isTopLevel = false) => {
            const sorted = items.sort((a, b) => (a.order || 0) - (b.order || 0));

            if (!isTopLevel) {
                return sorted.map((item) => {
                    const newItem = { ...item };
                    if (newItem.children && newItem.children.length > 0) {
                        newItem.children = finalize(newItem.children, false);
                    } else {
                        delete newItem.children;
                    }
                    return newItem;
                });
            }

            const result = [];
            sorted.forEach((item) => {
                const newItem = { ...item };
                if (newItem.children && newItem.children.length > 0) {
                    newItem.children = finalize(newItem.children, false);
                } else {
                    delete newItem.children;
                }

                if (newItem.key === "safety") {
                    result.push({
                        key: "grp-laporan",
                        type: "group",
                        label: <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, letterSpacing: "1px", margin: "16px 0 8px 8px" }}>LAPORAN</div>,
                        children: newItem.children || [],
                    });
                } else if (newItem.key === "master-data") {
                    result.push({
                        key: "grp-master-data",
                        type: "group",
                        label: <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, letterSpacing: "1px", margin: "16px 0 8px 8px" }}>MASTER DATA</div>,
                        children: [newItem],
                    });
                } else if (newItem.key === "administrator") {
                    result.push({
                        key: "grp-konfigurasi",
                        type: "group",
                        label: <div style={{ color: "#64748b", fontSize: 10, fontWeight: 700, letterSpacing: "1px", margin: "16px 0 8px 8px" }}>KONFIGURASI</div>,
                        children: newItem.children || [],
                    });
                } else {
                    result.push(newItem);
                }
            });
            return result;
        };

        return finalize(tree, true);
    };

    const filteredMenus = filterMenus(auth.user?.menus, searchQuery);
    const menuItems = buildMenuTree(filteredMenus);

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
                    transition: all 0.15s ease;
                    font-weight: 600 !important; /* Semi-bold for clear visibility */
                    color: #8a99ad !important;
                    font-size: 14px !important;
                }
                .custom-tree-menu .ant-menu-item a,
                .custom-tree-menu .ant-menu-submenu-title a {
                    color: inherit !important;
                    text-decoration: none !important;
                }
                /* Hover State - Improved Contrast */
                .custom-tree-menu .ant-menu-item:not(.ant-menu-item-selected):hover,
                .custom-tree-menu .ant-menu-submenu-title:hover {
                    background-color: rgba(255, 255, 255, 0.08) !important;
                    color: #ffffff !important;
                    transition: all 0.2s ease !important;
                }

                .custom-tree-menu .ant-menu-item:not(.ant-menu-item-selected):hover *,
                .custom-tree-menu .ant-menu-submenu-title:hover * {
                    color: #ffffff !important;
                }

                .custom-tree-menu .ant-menu-item:not(.ant-menu-item-selected):hover .anticon,
                .custom-tree-menu .ant-menu-submenu-title:hover .anticon {
                    color: #ffffff !important;
                }

                /* Submenu Title Style when has Active Child (NOT HOVERED) */
                .custom-tree-menu .ant-menu-submenu-selected > .ant-menu-submenu-title:not(:hover) {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                    color: #ffffff !important;
                    font-weight: 700 !important;
                }

                .custom-tree-menu .ant-menu-submenu-selected > .ant-menu-submenu-title:not(:hover) * {
                    color: #ffffff !important;
                }

                .custom-tree-menu .ant-menu-submenu-selected > .ant-menu-submenu-title:not(:hover) .anticon {
                    color: #ffffff !important;
                }

                /* Active/Selected State - PILL LOOK */
                .custom-tree-menu .ant-menu-item-selected,
                .custom-tree-menu.ant-menu-light .ant-menu-item-selected,
                .custom-tree-menu.ant-menu-dark .ant-menu-item-selected {
                    background-color: #0F828A !important;
                    color: #ffffff !important;
                    font-weight: 700 !important; /* Bold for selected */
                    box-shadow: 0 4px 16px rgba(15, 130, 138, 0.4);
                }

                /* Ensure Selected state stays consistent even when hovered */
                .custom-tree-menu .ant-menu-item-selected:hover {
                    background-color: #128383 !important;
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
                    background-color: #00202e;
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
                    background-color: rgba(15, 130, 138, 0.2);
                    z-index: 1;
                }

                /* Sub-menu Popup Scrolling (when sidebar is collapsed) */
                .ant-menu-submenu-popup {
                    max-height: 100vh !important;
                    overflow: visible !important;
                    padding: 4px 0 !important;
                    z-index: 1050 !important;
                }
                
                .ant-menu-submenu-popup .ant-menu {
                    max-height: 50vh !important; /* Shorter height to ensure scrollbar is always visible and reachable */
                    overflow-y: auto !important;
                    overscroll-behavior: contain !important;
                    scrollbar-width: thin;
                    border-radius: 12px !important;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
                    padding: 8px 4px 40px 4px !important; /* More bottom padding for better visibility of last items */
                }

                /* Compact items in popup to fit more */
                .ant-menu-submenu-popup .ant-menu-item,
                .ant-menu-submenu-popup .ant-menu-submenu-title {
                    height: 40px !important;
                    line-height: 40px !important;
                    margin: 2px 0 !important;
                }

                /* Custom Scrollbar for the popup menu */
                .ant-menu-submenu-popup .ant-menu::-webkit-scrollbar {
                    width: 6px;
                }
                .ant-menu-submenu-popup .ant-menu::-webkit-scrollbar-thumb {
                    background: ${isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.15)"};
                    border-radius: 10px;
                }
                .ant-menu-submenu-popup .ant-menu::-webkit-scrollbar-thumb:hover {
                    background: ${isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.25)"};
                }

                /* Hide Ant Design default indicators */
                .custom-tree-menu .ant-menu-item-selected::after,
                .custom-tree-menu .ant-menu-item::after {
                    display: none !important;
                }
                `;

    const SidebarContent = (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#013B52" }}>
            <style>{sidebarStyles}</style>
            <div>
                <div
                    style={{
                        height: 80,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: (collapsed && !isMobile) ? "center" : "flex-start",
                        padding: (collapsed && !isMobile) ? "0" : "0 24px",
                        transition: "all 0.2s",
                        marginBottom: 4,
                    }}
                >
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #0F828A 0%, #013B52 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            boxShadow: "0 4px 12px rgba(15, 130, 138, 0.2)",
                        }}
                    >
                        <span
                            style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}
                        >
                            A
                        </span>
                    </div>
                    {(!collapsed || isMobile) && (
                        <div style={{ marginLeft: 12, lineHeight: 1.2 }}>
                            <div
                                style={{
                                    color: "#ffffff",
                                    fontWeight: 800,
                                    fontSize: 16,
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                AIM-SAFE
                            </div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: "#ABD096",
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.5px",
                                }}
                            >
                                SAFETY MANAGEMENT SYSTEM
                            </div>
                        </div>
                    )}
                </div>

                {(!collapsed || isMobile) && (
                    <div style={{ padding: "0 16px 12px 16px" }}>
                        <Input
                            placeholder="Search menus..."
                            prefix={<SearchOutlined style={{ color: "#7EA7B2" }} />}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                borderRadius: 10,
                                background: "#012535",
                                border: "1px solid #034561",
                                color: "#ffffff",
                                height: 38,
                            }}
                            allowClear
                        />
                    </div>
                )}
            </div>

            <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden" }} className="custom-sidebar-scroll">
                <Menu
                    className="custom-tree-menu"
                    theme="dark"
                    mode="inline"
                    selectedKeys={[getActiveKey()]}
                    openKeys={openKeys}
                    onOpenChange={setOpenKeys}
                    items={menuItems}
                    style={{ border: "none", background: "transparent" }}
                />
            </div>

            {(!collapsed || isMobile) && (
                <div style={{
                    marginTop: "auto",
                    padding: "16px 24px",
                    borderTop: "1px solid #034561",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}>
                    <Space size={8}>
                        <span style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 600 }}>
                            Tema {isDarkMode ? "Dark" : "Light"}
                        </span>
                    </Space>
                    <Switch
                        checked={isDarkMode}
                        onChange={toggleTheme}
                        checkedChildren={<MoonOutlined />}
                        unCheckedChildren={<SunOutlined />}
                    />
                </div>
            )}
        </div>
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
                    background: "#013B52",
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
            theme="dark"
            width={280}
            style={{
                overflow: "hidden",
                height: "100vh",
                position: "fixed",
                insetInlineStart: 0,
                top: 0,
                bottom: 0,
                background: "#013B52",
                borderRight: "1px solid #034561",
                zIndex: 100,
            }}
        >
            {SidebarContent}
        </Sider>
    );
}
