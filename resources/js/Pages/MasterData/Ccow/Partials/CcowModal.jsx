import React, { useEffect } from "react";
import { Modal, Form, Input, Switch, Button } from "antd";

export default function CcowModal({ visible, onCancel, onFinish, loading, initialValues }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    is_active: !!initialValues.is_active
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    return (
        <Modal
            title={initialValues ? "Edit CCOW" : "Tambah CCOW Baru"}
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnHidden
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ is_active: true }}
                autoComplete="off"
            >
                <Form.Item
                    label="Nama CCOW"
                    name="name"
                    rules={[{ required: true, message: "Masukan nama CCOW!" }]}
                >
                    <Input placeholder="Contoh: Central Control Office" />
                </Form.Item>

                <Form.Item
                    label="Inisial"
                    name="inisial"
                    rules={[{ required: false }]}
                >
                    <Input placeholder="Contoh: CCO01" />
                </Form.Item>

                <Form.Item
                    label="Status Aktif"
                    name="is_active"
                    valuePropName="checked"
                >
                    <Switch checkedChildren="Aktif" unCheckedChildren="Non-Aktif" />
                </Form.Item>

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
