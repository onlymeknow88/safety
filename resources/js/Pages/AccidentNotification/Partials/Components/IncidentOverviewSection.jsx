import { Col, DatePicker, Form, Input, Row, Select, TimePicker } from "antd";

import React from "react";

export default function IncidentOverviewSection({ master = {} }) {
    const form = Form.useFormInstance();
    const selectedCcowId = Form.useWatch('ccow_id', form);

    const labelStyle = { fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase' };

    // Filter lokasi utama (tanpa parent)
    const parentLocations = React.useMemo(() => {
        return master.locations?.filter(loc => !loc.parent_id) || [];
    }, [master.locations]);

    // Watch location_id untuk filter detail
    const selectedLocationId = Form.useWatch('location_id', form);

    // Filter lokasi berdasarkan CCOW yang dipilih (hanya untuk parent)
    const filteredParentLocations = React.useMemo(() => {
        if (!selectedCcowId) return parentLocations;
        return parentLocations.filter(loc =>
            loc.ccow_id && String(loc.ccow_id) === String(selectedCcowId)
        );
    }, [parentLocations, selectedCcowId]);

    return (
        <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
                <Form.Item
                    name="incident_title"
                    label={<span style={labelStyle}>Judul Insiden (Maks 40 Karakter)</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <Input.TextArea placeholder="Contoh: Kaca Kabin EX-365 Pecah" maxLength={40} showCount />
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="hse_alert_no"
                    label={<span style={labelStyle}>No HSE Alert</span>}
                >
                    <Input placeholder="Contoh: 01/HA-LC/I/2026" />
                </Form.Item>
            </Col>

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
                    name="kait_reporting_date"
                    label={<span style={labelStyle}>Pelaporan KaIT</span>}
                >
                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" />
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item
                    name="incident_time"
                    label={<span style={labelStyle}>Waktu (hh:ss)</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <TimePicker style={{ width: '100%' }} format="HH:mm" placeholder="Pilih Jam" />
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item
                    name="unit"
                    label={<span style={labelStyle}>Unit</span>}
                >
                    <Input placeholder="Contoh: DT-001" />
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
                        onChange={() => {
                            form.setFieldValue('location_id', null);
                            form.setFieldValue('location_detail_id', null);
                        }}
                    >
                        {master.ccows?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="department_id"
                    label={<span style={labelStyle}>Departemen / Departemen User</span>}
                >
                    <Select placeholder="Pilih Departemen" showSearch optionFilterProp="children">
                        {master.departments?.map(item => (
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
                    <Select
                        placeholder="Pilih Lokasi"
                        showSearch
                        optionFilterProp="children"
                        onChange={() => form.setFieldValue('location_detail_id', null)}
                        disabled={!selectedCcowId}
                    >
                        {filteredParentLocations.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="location_detail"
                    label={<span style={labelStyle}>Lokasi Detail</span>}
                >
                    <Input placeholder="Contoh: KM 45, Area Workshop, dsb" disabled={!selectedLocationId} />
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
            <Col xs={24} md={12}>
                <Form.Item
                    name="company_contractor_id"
                    label={<span style={labelStyle}>Perusahaan Kontraktor (Jika ada)</span>}
                >
                    <Select placeholder="Pilih Kontraktor" showSearch optionFilterProp="children">
                        {master.companies?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
            <Col xs={24} md={12}>
                <Form.Item
                    name="incident_type_id"
                    label={<span style={labelStyle}>Klasifikasi / Tipe Insiden</span>}
                >
                    <Select placeholder="Pilih Klasifikasi">
                        {master.incidentTypes?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.category} - {item.description}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    );
}
