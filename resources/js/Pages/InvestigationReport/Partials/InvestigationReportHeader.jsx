import React from "react";
import { Space, Input, Button, Dropdown, Checkbox, Grid } from "antd";
import { SearchOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

export default function InvestigationReportHeader({
    searchText,
    onSearchChange,
    onAddClick,
    canCreate,
    isDarkMode,
    table,
}) {
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
                    background: isDarkMode ? "#1c1c24" : "#fff",
                    padding: isMobile ? "16px" : "16px 24px",
                    borderRadius: 20,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    position: "relative",
                    zIndex: 2,
                    border: `1px solid ${isDarkMode ? '#2d2d3a' : '#e2e8f0'}`
                }}
            >
                <Space size={isMobile ? 8 : 16} direction={isMobile ? "vertical" : "horizontal"} style={{ width: isMobile ? '100%' : 'auto' }}>
                    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                        <Input
                            placeholder="Cari Laporan..."
                            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                            value={searchText}
                            onChange={onSearchChange}
                            style={{
                                flex: 1,
                                minWidth: 280,
                                borderRadius: 10,
                                background: isDarkMode ? "#141414" : "#f5f5f5",
                                border: "none",
                                height: 40,
                            }}
                        />

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
                                    background: isDarkMode ? "#141414" : "#f5f5f5",
                                    border: "none",
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
                            fontWeight: 600,
                            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            border: "none",
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
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
