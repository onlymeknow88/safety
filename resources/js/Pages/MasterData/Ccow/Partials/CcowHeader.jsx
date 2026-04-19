import React from "react";
import { Space, Input, Button, Dropdown, Checkbox, Typography } from "antd";
import { SearchOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function CcowHeader({
    searchText,
    onSearchChange,
    onAddClick,
    isDarkMode,
    table,
}) {
    const [columnsVisible, setColumnsVisible] = React.useState(false);

    // Ccow for column visibility
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
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: isDarkMode ? "#1f1f1f" : "#fff",
                    padding: "16px 24px",
                    borderRadius: 16,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    position: "relative",
                    zIndex: 2,
                }}
            >
                <Space size={16}>
                    <Input
                        placeholder="Search menu name..."
                        prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                        value={searchText}
                        onChange={onSearchChange}
                        style={{
                            width: 320,
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
                            Columns
                        </Button>
                    </Dropdown>
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
                    }}
                >
                    Add New Menu
                </Button>
            </div>
        </div>
    );
}
