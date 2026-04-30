import { Form, Input, Row, Col, InputNumber } from "antd";

export default function ConsequenceSection() {
    const labelStyle = { fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase' };
    const inputStyle = { 
        background: '#f8fafc', 
        borderRadius: 8, 
        padding: '12px',
        border: '1px solid #f1f5f9'
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <Form.Item
                name="incident_consequence"
                label={<span style={labelStyle}>Akibat Insiden (Umum)</span>}
            >
                <Input.TextArea placeholder="Deskripsi singkat akibat insiden" style={inputStyle} autoSize={{ minRows: 2 }} />
            </Form.Item>

            <div style={{ padding: '16px', background: '#f1f5f9', borderRadius: 12 }}>
                <span style={{ ...labelStyle, color: '#475569', display: 'block', marginBottom: 16, borderBottom: '1px solid #cbd5e1', paddingBottom: 8 }}>DAMPAK TAMBAHAN (HARI & BIAYA)</span>
                
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="lost_days"
                            label={<span style={{ ...labelStyle, fontSize: 11 }}>Hari Hilang (Hari)</span>}
                        >
                            <InputNumber placeholder="0" style={{ ...inputStyle, width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="actual_cost"
                            label={<span style={{ ...labelStyle, fontSize: 11 }}>Biaya Aktual (IDR)</span>}
                        >
                            <InputNumber 
                                placeholder="0" 
                                style={{ ...inputStyle, width: '100%' }} 
                                prefix="Rp"
                                formatter={currencyFormatter}
                                parser={currencyParser}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="potential_cost"
                            label={<span style={{ ...labelStyle, fontSize: 11 }}>Biaya Potensial (IDR)</span>}
                        >
                            <InputNumber 
                                placeholder="0" 
                                style={{ ...inputStyle, width: '100%' }} 
                                prefix="Rp"
                                formatter={currencyFormatter}
                                parser={currencyParser}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16 }}>
                <span style={{ ...labelStyle, color: '#94a3b8', display: 'block', marginBottom: 12 }}>KLASIFIKASI DAMPAK (IMS-14-001)</span>
                <Form.Item
                    name="consequence_human"
                    label={<span style={{ ...labelStyle, fontWeight: 700 }}>A. Manusia</span>}
                >
                    <Input.TextArea placeholder="Contoh: Cedera Ringan (First Aid)" style={inputStyle} autoSize={{ minRows: 2 }} />
                </Form.Item>

                <Form.Item
                    name="consequence_tool"
                    label={<span style={{ ...labelStyle, fontWeight: 700 }}>B. Alat</span>}
                >
                    <Input.TextArea placeholder="Contoh: Kerusakan Front Bumper" style={inputStyle} autoSize={{ minRows: 2 }} />
                </Form.Item>

                <Form.Item
                    name="consequence_environment"
                    label={<span style={{ ...labelStyle, fontWeight: 700 }}>C. Lingkungan</span>}
                >
                    <Input.TextArea placeholder="Contoh: Ceceran Oli (Minor Spillage)" style={inputStyle} autoSize={{ minRows: 2 }} />
                </Form.Item>
            </div>
        </div>
    );
}
