import { Button, Checkbox, Dropdown, Input, Space } from "antd";
import { PlusOutlined, SearchOutlined, SettingOutlined } from "@ant-design/icons";
import React from "react";

export default function IncidentTypeHeader({ searchText, onSearchChange, onAddClick, isDarkMode, table }) {
    const [columnsVisible, setColumnsVisible] = React.useState(false);
    const columnItems = [
        { key: 'header', label: <div style={{ padding: '4px 0', fontWeight: 700, fontSize: 11, color: '#8c8c8c' }}>COLUMN VISIBILITY</div>, type: 'group' },
        ...table.getAllLeafColumns().filter(col => col.id !== "actions").map(col => ({
            key: col.id,
            label: <Checkbox checked={col.getIsVisible()} onChange={col.getToggleVisibilityHandler()}>{typeof col.columnDef.header === 'string' ? col.columnDef.header : col.id}</Checkbox>
        }))
    ];
    return (
        <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", background: isDarkMode ? "#1f1f1f" : "#fff", padding: "16px 24px", borderRadius: 16 }}>
            <Space size={16}>
                <Input placeholder="Cari Tipe Insiden..." prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />} value={searchText} onChange={onSearchChange} style={{ width: 320, borderRadius: 10, background: isDarkMode ? "#141414" : "#f5f5f5", border: "none", height: 40 }} />
                <Dropdown menu={{ items: columnItems }} trigger={['click']} open={columnsVisible} onOpenChange={setColumnsVisible}>
                    <Button icon={<SettingOutlined />} style={{ borderRadius: 10, height: 40, background: isDarkMode ? "#141414" : "#f5f5f5", border: "none" }}>Columns</Button>
                </Dropdown>
            </Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={onAddClick} style={{ height: 40, borderRadius: 10, fontWeight: 600 }}>Tambah Tipe</Button>
        </div>
    );
}
