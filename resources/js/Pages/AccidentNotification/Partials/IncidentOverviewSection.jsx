import React from "react";
import { Form, Input, DatePicker, TimePicker, Row, Col } from "antd";

export default function IncidentOverviewSection() {
    const labelStyle = { fontSize: 10, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' };

    return (
        <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
                <Form.Item
                    name="incident_date"
                    label={<span style={labelStyle}>Tanggal Insiden</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
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
                    name="location"
                    label={<span style={labelStyle}>Lokasi / Pit Area</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <Input placeholder="Contoh: Pit West Alpha - Section 4" />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="company"
                    label={<span style={labelStyle}>Perusahaan / Kontraktor</span>}
                >
                    <Input placeholder="Contoh: PT. Ababil Deo Resource" />
                </Form.Item>
            </Col>

            <Col xs={24}>
                <Form.Item
                    name="incident_classification"
                    label={<span style={labelStyle}>Klasifikasi Insiden</span>}
                >
                    <Input placeholder="Contoh: First Injured / Kerusakan Alat" />
                </Form.Item>
            </Col>
        </Row>
    );
}
