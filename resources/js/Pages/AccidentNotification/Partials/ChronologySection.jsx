import React from "react";
import { Form, Input, Button, List, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const DynamicList = ({ title, items, setItems, placeholder, isDarkMode }) => {
    const addItem = () => {
        setItems([...items, ""]);
    };

    const updateItem = (index, value) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const sectionTitleStyle = { 
        fontSize: 10, 
        fontWeight: 800, 
        color: '#3b82f6', 
        textTransform: 'uppercase', 
        marginBottom: 12, 
        display: 'block' 
    };

    return (
        <div style={{ marginBottom: 32 }}>
            <span style={sectionTitleStyle}>{title}</span>
            <List
                dataSource={items}
                renderItem={(item, index) => (
                    <div style={{ 
                        display: 'flex', 
                        gap: 12, 
                        marginBottom: 12, 
                        background: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc', 
                        padding: '8px 12px', 
                        borderRadius: 8,
                        border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}`
                    }}>
                        <div style={{ flex: 1 }}>
                            <Input
                                value={item}
                                variant="borderless"
                                placeholder={placeholder}
                                onChange={(e) => updateItem(index, e.target.value)}
                                style={{ padding: 0 }}
                            />
                        </div>
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeItem(index)}
                        />
                    </div>
                )}
            />
            <Button
                type="dashed"
                onClick={addItem}
                block
                icon={<PlusOutlined />}
                style={{ borderRadius: 8 }}
            >
                Tambah Baris
            </Button>
        </div>
    );
};

export default function ChronologySection({ incidentFacts, setIncidentFacts, correctiveActions, setCorrectiveActions, isDarkMode }) {
    const labelStyle = { 
        fontSize: 10, 
        fontWeight: 800, 
        color: '#3b82f6', 
        textTransform: 'uppercase',
        marginBottom: 12,
        display: 'block'
    };

    return (
        <div>
            <div style={{ marginBottom: 32 }}>
                <span style={labelStyle}>Ringkasan Fakta / Kronologi</span>
                <Form.Item name="chronology" style={{ marginBottom: 0 }}>
                    <Input.TextArea
                        placeholder="Uraikan kronologi singkat..."
                        autoSize={{ minRows: 4, maxRows: 8 }}
                        style={{ 
                            background: isDarkMode ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                            borderRadius: 12,
                            padding: 16,
                            border: `1px solid ${isDarkMode ? 'rgba(255,255,255,0.05)' : '#f1f5f9'}`
                        }}
                    />
                </Form.Item>
            </div>

            <DynamicList
                title="Fakta Kejadian"
                items={incidentFacts}
                setItems={setIncidentFacts}
                placeholder="Contoh: Ditemukan ceceran oli transmisi di area TKR"
                isDarkMode={isDarkMode}
            />

            <DynamicList
                title="Tindakan Perbaikan yang Dilakukan"
                items={correctiveActions}
                setItems={setCorrectiveActions}
                placeholder="Contoh: Melaporkan insiden ke Channel Emergency"
                isDarkMode={isDarkMode}
            />
        </div>
    );
}
