import React from "react";
import { Form, Input, DatePicker, TimePicker, Row, Col, Select } from "antd";

export default function IncidentOverviewSection({ master = {} }) {
    const form = Form.useFormInstance();
    const selectedCcowId = Form.useWatch('ccow_id', form);
    
    const labelStyle = { fontSize: 12, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' };

    // Filter lokasi berdasarkan CCOW yang dipilih
    const filteredLocations = master.locations?.filter(loc => 
        !selectedCcowId || loc.ccow_id === selectedCcowId
    ) || [];

    return (
        <Row gutter={[24, 16]}>
            <Col xs={24} md={6}>
                <Form.Item
                    name="incident_date"
                    label={<span style={labelStyle}>Tanggal Insiden</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" />
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item
                    name="incident_time"
                    label={<span style={labelStyle}>Waktu (WIT)</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <TimePicker style={{ width: '100%' }} format="HH:mm" placeholder="Pilih Jam" />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="ccow_id"
                    label={<span style={labelStyle}>CCOW Area</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <Select 
                        placeholder="Pilih Area" 
                        onChange={() => form.setFieldValue('location_id', null)}
                    >
                        {master.ccows?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            
            <Col xs={24} md={12}>
                <Form.Item
                    name="location_id"
                    label={<span style={labelStyle}>Lokasi / Pit Area</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <Select placeholder="Pilih Lokasi" showSearch optionFilterProp="children">
                        {filteredLocations.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="company_id"
                    label={<span style={labelStyle}>Perusahaan / Kontraktor</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <Select placeholder="Pilih Perusahaan" showSearch optionFilterProp="children">
                        {master.companies?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>

            <Col xs={24}>
                <Form.Item
                    name="incident_type_id"
                    label={<span style={labelStyle}>Klasifikasi / Tipe Insiden</span>}
                >
                    <Select placeholder="Pilih Klasifikasi">
                        {master.incidentTypes?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.category}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    );
}
