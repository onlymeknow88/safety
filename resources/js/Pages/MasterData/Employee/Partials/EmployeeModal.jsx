import React, { useEffect } from "react";
import { Modal, Form, Input, Switch, Button, Row, Col, Select } from "antd";

export default function EmployeeModal({ 
    visible, 
    onCancel, 
    onFinish, 
    loading, 
    initialValues,
    dropdowns 
}) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    is_active: initialValues.is_active === undefined ? true : !!initialValues.is_active,
                    can_approve: initialValues.can_approve === undefined ? false : !!initialValues.can_approve
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ is_active: true, can_approve: false });
            }
        }
    }, [visible, initialValues, form]);

    return (
        <Modal
            title={initialValues ? "Edit Karyawan" : "Tambah Karyawan Baru"}
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
            width={700}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="NIK"
                            name="nik"
                            rules={[{ required: true, message: "Masukan NIK!" }]}
                        >
                            <Input placeholder="Contoh: 123456" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Nama Lengkap"
                            name="name"
                            rules={[{ required: true, message: "Masukan nama karyawan!" }]}
                        >
                            <Input placeholder="Contoh: John Doe" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[{ type: 'email', message: 'Format email tidak valid' }]}
                        >
                            <Input placeholder="Contoh: john@example.com" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Company"
                            name="company_id"
                            rules={[{ required: true, message: "Pilih company!" }]}
                        >
                            <Select 
                                placeholder="Pilih Company" 
                                showSearch
                                optionFilterProp="children"
                                options={dropdowns.companies.map(c => ({ value: c.id, label: c.name }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Department"
                            name="department_id"
                            rules={[{ required: true, message: "Pilih department!" }]}
                        >
                            <Select 
                                placeholder="Pilih Department" 
                                showSearch
                                optionFilterProp="children"
                                options={dropdowns.departments.map(d => ({ value: d.id, label: d.name }))}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Jabatan"
                            name="jabatan_id"
                            rules={[{ required: true, message: "Pilih jabatan!" }]}
                        >
                            <Select 
                                placeholder="Pilih Jabatan" 
                                showSearch
                                optionFilterProp="children"
                                options={dropdowns.jabatans.map(j => ({ value: j.id, label: j.name }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="CCOW (Opsional)"
                            name="ccow_id"
                        >
                            <Select 
                                placeholder="Pilih CCOW" 
                                showSearch
                                allowClear
                                optionFilterProp="children"
                                options={dropdowns.ccows.map(c => ({ value: c.id, label: c.name }))}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Dapat Menyetujui?"
                            name="can_approve"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Ya" unCheckedChildren="Tidak" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Status Aktif"
                            name="is_active"
                            valuePropName="checked"
                        >
                            <Switch checkedChildren="Aktif" unCheckedChildren="Non-Aktif" />
                        </Form.Item>
                    </Col>
                </Row>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
                    <Button onClick={onCancel}>Batal</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        {initialValues ? "Simpan Perubahan" : "Tambah Data"}
                    </Button>
                </div>
            </Form>
        </Modal>
    );
}
