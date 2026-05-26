import { Col, DatePicker, Form, Input, Row, Select, TimePicker } from "antd";

import React from "react";

export default function IncidentOverviewSection({ master = {}, disabled = false }) {
    const form = Form.useFormInstance();
    const selectedCcowId = Form.useWatch('ccow_id', form);

    const labelStyle = {
        fontSize: 11,
        fontWeight: 800,
        color: disabled ? '#94a3b8' : '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    };

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

    const inputStyle = {
        height: 40,
        borderRadius: 8
    };

    return (
        <Row gutter={[32, 24]}>
            <Col xs={24} md={24}>
                <Form.Item
                    name="incident_title"
                    label={<span style={labelStyle}>Judul Insiden</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <Input.TextArea
                        placeholder="Contoh: Kaca Kabin EX-365 Pecah"
                        maxLength={255}
                        showCount
                        autoSize={{ minRows: 2, maxRows: 2 }}
                        style={{ borderRadius: 8, padding: '10px 12px' }}
                    />
                </Form.Item>
            </Col>
            {/* <Col xs={24} md={12}>
                <Form.Item
                    name="hse_alert_no"
                    label={<span style={labelStyle}>No HSE Alert</span>}
                >
                    <Input placeholder="Contoh: 01/HA-LC/I/2026" style={inputStyle} />
                </Form.Item>
            </Col> */}

            <Col xs={24} md={8}>
                <Form.Item
                    name="incident_date"
                    label={<span style={labelStyle}>Tanggal Insiden</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <DatePicker style={{ width: '100%', ...inputStyle }} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" />
                </Form.Item>
            </Col>
            <Col xs={24} md={8}>
                <Form.Item
                    name="lpks_lpkl"
                    label={<span style={labelStyle}>Tipe (LPKL/LPKS)</span>}
                >
                    <Input
                        placeholder="Otomatis"
                        style={{ ...inputStyle, background: '#f8fafc', fontWeight: 700, color: '#3b82f6' }}
                        readOnly
                    />
                </Form.Item>
            </Col>
            <Col xs={24} md={8}>
                <Form.Item
                    name="incident_time"
                    label={<span style={labelStyle}>Waktu (hh:ss)</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <TimePicker style={{ width: '100%', ...inputStyle }} format="HH:mm" placeholder="Pilih Jam" />
                </Form.Item>
            </Col>
            <Col xs={24} md={6}>
                <Form.Item
                    name="unit"
                    label={<span style={labelStyle}>Unit</span>}
                >
                    <Input placeholder="Contoh: DT-001" style={inputStyle} />
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
                        style={inputStyle}
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
                    <Select placeholder="Pilih Departemen" style={inputStyle} showSearch optionFilterProp="children">
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
                        style={inputStyle}
                        showSearch
                        optionFilterProp="children"
                        onChange={() => form.setFieldValue('location_detail_id', null)}
                        disabled={disabled || !selectedCcowId}
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
                    <Input placeholder="Contoh: KM 45, Area Workshop, dsb" style={inputStyle} disabled={disabled || !selectedLocationId} />
                </Form.Item>
            </Col>

            <Col xs={24} md={12}>
                <Form.Item
                    name="company_id"
                    label={<span style={labelStyle}>Perusahaan</span>}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <Select placeholder="Pilih Perusahaan" style={inputStyle} showSearch optionFilterProp="children">
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
                    <Select placeholder="Pilih Klasifikasi" style={inputStyle}>
                        {master.incidentTypes?.map(item => (
                            <Select.Option key={item.id} value={item.id}>{item.category}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
            </Col>
        </Row>
    );
}
