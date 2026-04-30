import { Form, Input, Row, Col, Select, InputNumber } from "antd";

export default function VictimSection({ master = {} }) {
    const labelStyle = { fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase' };

    return (
        <Row gutter={[24, 16]}>
            <Col xs={24} md={24}>
                <Form.Item
                    name="victim_name"
                    label={<span style={labelStyle}>Nama Korban/ Orang Yang Terlibat</span>}
                >
                    <Input placeholder="Nama Lengkap" />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="victim_gender_id"
                    label={<span style={labelStyle}>Jenis Kelamin</span>}
                >
                    <Select placeholder="Pilih Jenis Kelamin">
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
                    <InputNumber placeholder="Contoh: 25" style={{ width: '100%' }} />
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item
                    name="victim_age_interval_id"
                    label={<span style={labelStyle}>Interval Umur</span>}
                >
                    <Select placeholder="Pilih Interval">
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
                    <Select placeholder="Pilih Posisi" showSearch optionFilterProp="children">
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
                    <Input placeholder="Contoh: Operator Excavator" />
                </Form.Item>
            </Col>
            <Col xs={24}>
                <Form.Item
                    name="victim_experience_id"
                    label={<span style={labelStyle}>Pengalaman Bekerja</span>}
                >
                    <Select placeholder="Pilih Pengalaman">
                        {master.intervalExperiences?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.label}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    );
}
