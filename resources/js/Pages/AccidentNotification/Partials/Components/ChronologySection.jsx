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
        fontSize: 11,
        fontWeight: 800,
        color: '#3b82f6',
        textTransform: 'uppercase',
        marginBottom: 16,
        display: 'block',
        letterSpacing: '0.05em'
    };

    return (
        <div style={{ marginBottom: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={sectionTitleStyle}>{title}</span>
                <span style={{ fontSize: 11, fontWeight: 800, color: items.length >= 5 ? '#ef4444' : '#94a3b8' }}>
                    {items.length}/5 LANGKAH
                </span>
            </div>
            <List
                dataSource={items}
                split={false}
                renderItem={(item, index) => (
                    <div style={{
                        display: 'flex',
                        gap: 16,
                        marginBottom: 12,
                        background: isDarkMode ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                        alignItems: 'center',
                        transition: 'all 0.2s ease'
                    }}>
                        <div style={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            background: '#3b82f6',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 900,
                            flexShrink: 0
                        }}>
                            {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                            <Input
                                value={item}
                                variant="borderless"
                                placeholder={placeholder}
                                onChange={(e) => updateItem(index, e.target.value)}
                                style={{ padding: 0, fontWeight: 600, fontSize: 14 }}
                                disabled={disabled}
                            />
                        </div>
                        {!disabled && items.length > 1 && (
                            <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined style={{ fontSize: 18 }} />}
                                onClick={() => removeItem(index)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
                    style={{ borderRadius: 12, height: 40, fontWeight: 700, borderColor: '#3b82f6', color: '#3b82f6' }}
                >
                    Tambah Langkah
                </Button>
            )}
        </div>
    );
};

export default function ChronologySection({ incidentFacts, setIncidentFacts, correctiveActions, setCorrectiveActions, isDarkMode, disabled }) {
    const labelStyle = {
        fontSize: 11,
        fontWeight: 800,
        color: '#3b82f6',
        textTransform: 'uppercase',
        marginBottom: 16,
        display: 'block',
        letterSpacing: '0.05em'
    };

    return (
        <div style={{ padding: '8px 0' }}>
            <div style={{ marginBottom: 40 }}>
                <span style={labelStyle}>Ringkasan Fakta / Kronologi</span>
                <Form.Item name="chronology" style={{ marginBottom: 0 }}>
                    <Input.TextArea
                        placeholder="Uraikan kronologi singkat kejadian..."
                        autoSize={{ minRows: 4, maxRows: 8 }}
                        showCount
                        maxLength={1000}
                        style={{
                            background: isDarkMode ? 'rgba(255,255,255,0.02)' : '#f8fafc',
                            borderRadius: 20,
                            padding: '16px 20px',
                            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                            fontSize: 14,
                            fontWeight: 500,
                            lineHeight: 1.6
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
