import { Form, Input, Row, Col, Select, InputNumber } from "antd";

export default function VictimSection({ master = {}, disabled = false }) {
    const labelStyle = { 
        fontSize: 11, 
        fontWeight: 800, 
        color: '#64748b', 
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    };

    const inputStyle = {
        height: 40,
        borderRadius: 8
    };

    return (
        <Row gutter={[32, 24]}>
            <Col xs={24} md={24}>
                <Form.Item
                    name="victim_name"
                    label={<span style={labelStyle}>Nama Korban/ Orang Yang Terlibat</span>}
                >
                    <Input placeholder="Nama Lengkap" style={inputStyle} />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="victim_gender_id"
                    label={<span style={labelStyle}>Jenis Kelamin</span>}
                >
                    <Select placeholder="Pilih Jenis Kelamin" style={inputStyle}>
                        {master.genders?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item
                    name="victim_age"
                    label={<span style={labelStyle}>Umur</span>}
                >
                    <InputNumber placeholder="Contoh: 25" style={{ width: '100%', ...inputStyle }} />
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item
                    name="victim_age_interval_id"
                    label={<span style={labelStyle}>Interval Umur</span>}
                >
                    <Select placeholder="Pilih Interval" style={inputStyle}>
                        {master.intervalAges?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="victim_position_id"
                    label={<span style={labelStyle}>Posisi / Jabatan</span>}
                >
                    <Select placeholder="Pilih Posisi" style={inputStyle} showSearch optionFilterProp="children">
                        {master.jabatans?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="victim_position_detail"
                    label={<span style={labelStyle}>Detail Posisi / Jabatan</span>}
                >
                    <Input placeholder="Contoh: Operator Excavator" style={inputStyle} />
                </Form.Item>
            </Col>
            <Col xs={24}>
                <Form.Item
                    name="victim_experience_id"
                    label={<span style={labelStyle}>Pengalaman Bekerja</span>}
                >
                    <Select placeholder="Pilih Pengalaman" style={inputStyle}>
                        {master.intervalExperiences?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    );
}
