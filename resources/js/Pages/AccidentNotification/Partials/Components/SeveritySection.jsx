import React from "react";
import { Space, Button, Row, Col } from "antd";

const SeveritySelector = ({ value, onChange, isDarkMode, disabled }) => {
    const levels = [
        { level: 1, color: '#10b981' }, // Emerald
        { level: 2, color: '#3b82f6' }, // Blue
        { level: 3, color: '#f59e0b' }, // Amber
        { level: 4, color: '#f97316' }, // Orange
        { level: 5, color: '#ef4444' }  // Red
    ];

    return (
        <Space size={4} wrap>
            {levels.map(({ level, color }) => (
                <Button
                    key={level}
                    type={value === level ? "primary" : "default"}
                    onClick={() => !disabled && onChange(level)}
                    disabled={disabled}
                    style={{
                        width: 44,
                        height: 36,
                        borderRadius: 8,
                        fontWeight: 900,
                        fontSize: 14,
                        borderColor: value === level ? color : (isDarkMode ? '#334155' : '#e2e8f0'),
                        background: value === level ? color : (isDarkMode ? '#1e293b' : '#ffffff'),
                        color: value === level ? '#fff' : (isDarkMode ? '#94a3b8' : '#64748b'),
                        opacity: disabled && value !== level ? 0.5 : 1,
                        cursor: disabled ? 'default' : 'pointer',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: value === level ? `0 4px 12px ${color}40` : 'none',
                        borderWidth: 2
                    }}
                >
                    {level}
                </Button>
            ))}
        </Space>
    );
};

export default function SeveritySection({ prefix, severity, setSeverity, isDarkMode, disabled = false }) {
    const handleChange = (aspect, val) => {
        const currentVal = severity[`${prefix}_${aspect}`];
        const newVal = currentVal === val ? null : val;
        setSeverity(prev => ({
            ...prev,
            [`${prefix}_${aspect}`]: newVal
        }));
    };

    const labelStyle = {
        fontSize: 11,
        fontWeight: 800,
        color: isDarkMode ? '#94a3b8' : '#64748b',
        textTransform: 'uppercase',
        display: 'block',
        marginBottom: 8,
        letterSpacing: '0.05em'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Row gutter={[24, 24]}>
                <Col span={12}>
                    <span style={labelStyle}>K3</span>
                    <SeveritySelector
                        value={severity[`${prefix}_k3`]}
                        onChange={(v) => handleChange('k3', v)}
                        isDarkMode={isDarkMode}
                        disabled={disabled}
                    />
                </Col>
                <Col span={12}>
                    <span style={labelStyle}>KK</span>
                    <SeveritySelector
                        value={severity[`${prefix}_kk`]}
                        onChange={(v) => handleChange('kk', v)}
                        isDarkMode={isDarkMode}
                        disabled={disabled}
                    />
                </Col>
                <Col span={12}>
                    <span style={labelStyle}>LH</span>
                    <SeveritySelector
                        value={severity[`${prefix}_lh`]}
                        onChange={(v) => handleChange('lh', v)}
                        isDarkMode={isDarkMode}
                        disabled={disabled}
                    />
                </Col>
                <Col span={12}>
                    <span style={labelStyle}>KSL (Legal)</span>
                    <SeveritySelector
                        value={severity[`${prefix}_ksl`]}
                        onChange={(v) => handleChange('ksl', v)}
                        isDarkMode={isDarkMode}
                        disabled={disabled}
                    />
                </Col>
                <Col span={12}>
                    <span style={labelStyle}>PP</span>
                    <SeveritySelector
                        value={severity[`${prefix}_pp`]}
                        onChange={(v) => handleChange('pp', v)}
                        isDarkMode={isDarkMode}
                        disabled={disabled}
                    />
                </Col>
            </Row>
        </div>
    );
}
