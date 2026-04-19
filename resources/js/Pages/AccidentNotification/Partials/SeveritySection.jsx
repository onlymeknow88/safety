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
        setSeverity(prev => ({
            ...prev,
            [`${prefix}_${aspect}`]: val
        }));
    };

    const labelStyle = { 
        fontSize: 10, 
        fontWeight: 800, 
        color: '#94a3b8', 
        textTransform: 'uppercase', 
        display: 'block', 
        marginBottom: 8 
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
                <span style={labelStyle}>K3 (Safety)</span>
                <SeveritySelector
                    value={severity[`${prefix}_safety`]}
                    onChange={(v) => handleChange('safety', v)}
                    isDarkMode={isDarkMode}
                />
            </div>
            <div>
                <span style={labelStyle}>KK (Health)</span>
                <SeveritySelector
                    value={severity[`${prefix}_health`]}
                    onChange={(v) => handleChange('health', v)}
                    isDarkMode={isDarkMode}
                />
            </div>
            <div>
                <span style={labelStyle}>LH (Environment)</span>
                <SeveritySelector
                    value={severity[`${prefix}_environment`]}
                    onChange={(v) => handleChange('environment', v)}
                    isDarkMode={isDarkMode}
                />
            </div>
        </div>
    );
}
