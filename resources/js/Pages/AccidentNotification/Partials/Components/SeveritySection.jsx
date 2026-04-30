import React from "react";
import { Space, Button, Row, Col } from "antd";

const SeveritySelector = ({ value, onChange, isDarkMode }) => {
    const levels = [1, 2, 3, 4, 5];
    
    return (
        <Space size={8} wrap>
            {levels.map((level) => (
                <Button
                    key={level}
                    type={value === level ? "primary" : "default"}
                    onClick={() => onChange(level)}
                    style={{
                        width: 48,
                        height: 32,
                        borderRadius: 6,
                        fontWeight: 700,
                        fontSize: 13,
                        borderColor: value === level ? 'transparent' : (isDarkMode ? '#475569' : '#e2e8f0'),
                        background: value === level ? '#1d4ed8' : (isDarkMode ? '#1e293b' : '#f8fafc'),
                        color: value === level ? '#fff' : (isDarkMode ? '#94a3b8' : '#64748b'),
                    }}
                >
                    {level}
                </Button>
            ))}
        </Space>
    );
};

export default function SeveritySection({ prefix, severity, setSeverity, isDarkMode }) {
    const handleChange = (aspect, val) => {
        const currentVal = severity[`${prefix}_${aspect}`];
        const newVal = currentVal === val ? null : val;
        setSeverity(prev => ({
            ...prev,
            [`${prefix}_${aspect}`]: newVal
        }));
    };

    const labelStyle = { 
        fontSize: 12, 
        fontWeight: 800, 
        color: '#475569', 
        textTransform: 'uppercase', 
        display: 'block', 
        marginBottom: 8 
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <span style={labelStyle}>K3 (Safety)</span>
                    <SeveritySelector
                        value={severity[`${prefix}_k3`]}
                        onChange={(v) => handleChange('k3', v)}
                        isDarkMode={isDarkMode}
                    />
                </Col>
                <Col span={12}>
                    <span style={labelStyle}>KK (Health)</span>
                    <SeveritySelector
                        value={severity[`${prefix}_kk`]}
                        onChange={(v) => handleChange('kk', v)}
                        isDarkMode={isDarkMode}
                    />
                </Col>
                <Col span={12}>
                    <span style={labelStyle}>LH (Environment)</span>
                    <SeveritySelector
                        value={severity[`${prefix}_lh`]}
                        onChange={(v) => handleChange('lh', v)}
                        isDarkMode={isDarkMode}
                    />
                </Col>
                <Col span={12}>
                    <span style={labelStyle}>KSL (Kepatuhan Legal)</span>
                    <SeveritySelector
                        value={severity[`${prefix}_ksl`]}
                        onChange={(v) => handleChange('ksl', v)}
                        isDarkMode={isDarkMode}
                    />
                </Col>
                <Col span={12}>
                    <span style={labelStyle}>PP (Produksi)</span>
                    <SeveritySelector
                        value={severity[`${prefix}_pp`]}
                        onChange={(v) => handleChange('pp', v)}
                        isDarkMode={isDarkMode}
                    />
                </Col>
            </Row>
        </div>
    );
}
