import React from "react";
import { Space, Input, Button, Dropdown, Checkbox, Typography, Grid } from "antd";
import { SearchOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;

export default function BodyPartHeader({
    searchText,
    onSearchChange,
    onAddClick,
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
                        {typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id}
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
                    background: isDarkMode ? "#1f1f1f" : "#fff",
                    padding: isMobile ? "16px" : "16px 24px",
                    borderRadius: 20,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                <Space size={isMobile ? 8 : 16} direction={isMobile ? "vertical" : "horizontal"} style={{ width: isMobile ? '100%' : 'auto' }}>
                    <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                        <Input
                            placeholder="Cari bagian tubuh..."
                            prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                            value={searchText}
                            onChange={onSearchChange}
                            style={{
                                flex: 1,
                                minWidth: 0,
                                borderRadius: 10,
                                background: isDarkMode ? "#141414" : "#f5f5f5",
                                border: "none",
                                height: 40,
                            }}
                        />

                        <Dropdown
                            menu={{ items: columnItems }}
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

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onAddClick}
                    style={{
                        height: 40,
                        borderRadius: 10,
                        padding: "0 24px",
                        fontWeight: 600,
                        background: "#1677ff",
                        boxShadow: "0 4px 12px rgba(22, 119, 255, 0.2)",
                        width: isMobile ? '100%' : 'auto',
                    }}
                >
                    Tambah Bagian Tubuh
                </Button>
            </div>
        </div>
    );
}
