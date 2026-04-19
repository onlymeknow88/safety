import React from "react";
import { Form, Input } from "antd";

export default function ConsequenceSection() {
    const labelStyle = { fontSize: 10, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' };
    const inputStyle = { 
        background: '#f8fafc', 
        borderRadius: 8, 
        padding: '12px',
        border: '1px solid #f1f5f9'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Form.Item
                name="consequence_human"
                label={<span style={labelStyle}>A. Manusia</span>}
            >
                <Input.TextArea placeholder="Contoh: Cedera Ringan (First Aid)" style={inputStyle} autoSize={{ minRows: 2 }} />
            </Form.Item>

            <Form.Item
                name="consequence_tool"
                label={<span style={labelStyle}>B. Alat</span>}
            >
                <Input.TextArea placeholder="Contoh: Kerusakan Front Bumper" style={inputStyle} autoSize={{ minRows: 2 }} />
            </Form.Item>

            <Form.Item
                name="consequence_environment"
                label={<span style={labelStyle}>C. Lingkungan</span>}
            >
                <Input.TextArea placeholder="Contoh: Ceceran Oli (Minor Spillage)" style={inputStyle} autoSize={{ minRows: 2 }} />
            </Form.Item>
        </div>
    );
}
