import React from "react";
import { Form, Input, Button, List, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const DynamicList = ({ title, items, setItems, placeholder, isDarkMode, disabled }) => {
    const addItem = () => {
        if (items.length < 5) {
            setItems([...items, ""]);
        }
    };

    const updateItem = (index, value) => {
        const newItems = [...items];
        newItems[index] = value;
        setItems(newItems);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            setItems(items.filter((_, i) => i !== index));
        }
    };

    const sectionTitleStyle = { 
        fontSize: 12, 
        fontWeight: 800, 
        color: '#3b82f6', 
        textTransform: 'uppercase', 
        marginBottom: 12, 
        display: 'block' 
    };

    return (
        <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={sectionTitleStyle}>{title}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: items.length >= 5 ? '#ef4444' : '#94a3b8' }}>
                    {items.length}/5 LANGKAH
                </span>
            </div>
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
                                disabled={disabled}
                            />
                        </div>
                        {!disabled && items.length > 1 && (
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => removeItem(index)}
                            />
                        )}
                    </div>
                )}
            />
            {!disabled && items.length < 5 && (
                <Button
                    type="dashed"
                    onClick={addItem}
                    block
                    icon={<PlusOutlined />}
                    style={{ borderRadius: 8 }}
                >
                    Tambah Langkah
                </Button>
            )}
        </div>
    );
};

export default function ChronologySection({ incidentFacts, setIncidentFacts, correctiveActions, setCorrectiveActions, isDarkMode, disabled }) {
    const labelStyle = { 
        fontSize: 12, 
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
                        showCount
                        maxLength={255}
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
                disabled={disabled}
            />

            <DynamicList
                title="Tindakan Perbaikan yang Dilakukan"
                items={correctiveActions}
                setItems={setCorrectiveActions}
                placeholder="Contoh: Melaporkan insiden ke Channel Emergency"
                isDarkMode={isDarkMode}
                disabled={disabled}
            />
        </div>
    );
}
