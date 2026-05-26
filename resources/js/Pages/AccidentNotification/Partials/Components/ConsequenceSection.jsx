import { Form, Input, Row, Col, InputNumber } from "antd";

export default function ConsequenceSection({ disabled = false }) {
    const labelStyle = { 
        fontSize: 11, 
        fontWeight: 800, 
        color: '#64748b', 
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    };
    
    const inputStyle = { 
        background: '#f8fafc', 
        borderRadius: 10, 
        padding: '12px 16px',
        border: '1px solid #e2e8f0',
        fontSize: 14,
        fontWeight: 600
    };

    const currencyFormatter = (value) => {
        if (!value) return '';
        return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    const currencyParser = (value) => {
        if (!value) return '';
        return value.replace(/\.\s?|(,*)/g, '');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <Form.Item
                name="incident_consequence"
                label={<span style={labelStyle}>Akibat Insiden (Umum)</span>}
                style={{ marginBottom: 0 }}
            >
                <Input.TextArea placeholder="Deskripsi singkat akibat insiden" style={inputStyle} autoSize={{ minRows: 2 }} />
            </Form.Item>



            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 8 }}>
                <span style={{ 
                    ...labelStyle, 
                    color: '#94a3b8', 
                    display: 'block', 
                    marginBottom: 20,
                    letterSpacing: '0.1em'
                }}>KLASIFIKASI DAMPAK (IMS-14-001)</span>
                
                <Form.Item
                    name="consequence_human"
                    label={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }}></div>
                        <span style={{ ...labelStyle, color: '#334155', fontWeight: 900 }}>A. Manusia</span>
                    </div>}
                    style={{ marginBottom: 16 }}
                >
                    <Input.TextArea placeholder="Contoh: Cedera Ringan (First Aid)" style={inputStyle} autoSize={{ minRows: 2 }} />
                </Form.Item>

                <Form.Item
                    name="consequence_tool"
                    label={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }}></div>
                        <span style={{ ...labelStyle, color: '#334155', fontWeight: 900 }}>B. Alat</span>
                    </div>}
                    style={{ marginBottom: 16 }}
                >
                    <Input.TextArea placeholder="Contoh: Kerusakan Front Bumper" style={inputStyle} autoSize={{ minRows: 2 }} />
                </Form.Item>

                <Form.Item
                    name="consequence_environment"
                    label={<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }}></div>
                        <span style={{ ...labelStyle, color: '#334155', fontWeight: 900 }}>C. Lingkungan</span>
                    </div>}
                    style={{ marginBottom: 0 }}
                >
                    <Input.TextArea placeholder="Contoh: Ceceran Oli (Minor Spillage)" style={inputStyle} autoSize={{ minRows: 2 }} />
                </Form.Item>
            </div>
        </div>
    );
}
