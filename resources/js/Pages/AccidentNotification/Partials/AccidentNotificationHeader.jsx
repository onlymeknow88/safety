import React from "react";
import { Space, Input, Button, Dropdown, Checkbox, Typography, Grid, Select } from "antd";
import { SearchOutlined, PlusOutlined, SettingOutlined, FilterOutlined } from "@ant-design/icons";
import { usePage } from "@inertiajs/react";

const { useBreakpoint } = Grid;

export default function AccidentNotificationHeader({
    searchText,
    onSearchChange,
    companyFilter,
    setCompanyFilter,
    ccowFilter,
    setCcowFilter,
    master = {},
    onAddClick,
    canCreate,
    isDarkMode,
    table,
}) {
    const { auth } = usePage().props;
    const userRoles = (auth?.user?.roles || []).map(r => r.toLowerCase());
    const isAdministrator = auth?.user?.is_administrator || false;
    const isCrsOrAdmin = isAdministrator || userRoles.includes("crs") || userRoles.includes("admin") || userRoles.includes("superadmin") || userRoles.includes("super-admin") || userRoles.includes("hse admin") || userRoles.includes("hse_admin");

    const [columnsVisible, setColumnsVisible] = React.useState(false);
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const columnItems = [
        {
            key: 'header',
            label: <div style={{ padding: '4px 0', fontWeight: 700, fontSize: 11, color: '#8c8c8c', letterSpacing: '1px' }}>COLUMN VISIBILITY</div>,
            type: 'group',
        },
        ...table.getAllLeafColumns()
            .filter(col => col.id !== "actions")
            .map(col => ({
                key: col.id,
                label: (
                    <Checkbox
                        checked={col.getIsVisible()}
                        onChange={col.getToggleVisibilityHandler()}
                        onClick={(e) => e.stopPropagation()}
                        style={{ width: '100%', padding: '4px 0' }}
                    >
                        {typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id.toUpperCase()}
                    </Checkbox>
                ),
            }))
    ];

    return (
        <div style={{ marginBottom: 24 }}>
            <div
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "stretch" : "center",
                    gap: isMobile ? 12 : 0,
                    background: isDarkMode ? "#1e293b" : "#fff",
                    padding: isMobile ? "16px" : "16px 24px",
                    borderRadius: 20,
                    border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                    boxShadow: isDarkMode ? "none" : "0 2px 8px rgba(0,0,0,0.04)",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                <Space size={isMobile ? 8 : 16} direction={isMobile ? "vertical" : "horizontal"} style={{ width: isMobile ? '100%' : 'auto' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, width: '100%', alignItems: 'center' }}>
                        <Input
                            placeholder="Cari laporan..."
                            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                            value={searchText}
                            onChange={onSearchChange}
                            style={{
                                width: isMobile ? '100%' : 220,
                                borderRadius: 10,
                                background: isDarkMode ? "#0f172a" : "#ffffff",
                                border: `1px solid ${isDarkMode ? '#334155' : '#cbd5e1'}`,
                                color: isDarkMode ? "#fff" : "#0f172a",
                                height: 40,
                            }}
                        />

                        {isCrsOrAdmin && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                <span style={{ color: isDarkMode ? "#94a3b8" : "#475569", fontWeight: 700, fontSize: 13 }}>CCOW</span>
                                <Select
                                    placeholder="Semua CCOW"
                                    allowClear
                                    value={ccowFilter}
                                    onChange={setCcowFilter}
                                    style={{ width: isMobile ? '100%' : 150, height: 40 }}
                                    className="custom-filter-select"
                                >
                                    {master.ccows?.map(item => (
                                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                    ))}
                                </Select>

                                <span style={{ color: isDarkMode ? "#94a3b8" : "#475569", fontWeight: 700, fontSize: 13 }}>Company</span>
                                <Select
                                    placeholder="Semua Company"
                                    allowClear
                                    value={companyFilter}
                                    onChange={setCompanyFilter}
                                    style={{ width: isMobile ? '100%' : 180, height: 40 }}
                                    showSearch
                                    optionFilterProp="children"
                                    className="custom-filter-select"
                                >
                                    {master.companies?.map(item => (
                                        <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                                    ))}
                                </Select>
                            </div>
                        )}

                        <Button
                            icon={<FilterOutlined />}
                            style={{
                                borderRadius: 10,
                                height: 40,
                                background: isDarkMode ? "#334155" : "#ffffff",
                                border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                                color: isDarkMode ? "#fff" : "#475569",
                                fontWeight: 700,
                            }}
                        >
                            Filter Lainnya
                        </Button>

                        <Dropdown
                            menu={{ 
                                items: columnItems,
                                style: { maxHeight: '500px', overflowY: 'auto' }
                            }}
                            trigger={['click']}
                            placement="bottomRight"
                            open={columnsVisible}
                            onOpenChange={(flag) => setColumnsVisible(flag)}
                        >
                            <Button
                                icon={<SettingOutlined />}
                                style={{
                                    borderRadius: 10,
                                    height: 40,
                                    background: isDarkMode ? "#334155" : "#ffffff",
                                    border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                                    color: isDarkMode ? "#fff" : "#475569",
                                }}
                            >
                                {!isMobile && "Columns"}
                            </Button>
                        </Dropdown>
                    </div>
                </Space>

                {canCreate && (
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onAddClick}
                        style={{
                            height: 40,
                            borderRadius: 10,
                            padding: "0 24px",
                            fontWeight: 700,
                            background: isDarkMode ? "#3b82f6" : "#2563eb",
                            border: "none",
                            boxShadow: isDarkMode ? "0 4px 12px rgba(59, 130, 246, 0.3)" : "0 4px 12px rgba(37, 99, 235, 0.25)",
                            width: isMobile ? '100%' : 'auto',
                        }}
                    >
                        Buat Laporan
                    </Button>
                )}
            </div>
        </div>
    );
}
