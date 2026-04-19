import { Button, Form, Input, Modal, Switch } from "antd";
import React, { useEffect } from "react";

export default function JobFactorModal({ visible, onCancel, onFinish, loading, initialValues }) {
    const [form] = Form.useForm();
    useEffect(() => {
        if (visible) {
            if (initialValues) form.setFieldsValue({ ...initialValues, is_active: !!initialValues.is_active });
            else form.resetFields();
        }
    }, [visible, initialValues, form]);

    return (
        <Modal title={initialValues ? "Edit Job Factor" : "Tambah Job Factor"} open={visible} onCancel={onCancel} footer={null} destroyOnHidden>
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ is_active: true }}>
                <Form.Item label="Kode" name="code" rules={[{ required: true, message: "Masukan kode!" }]}>
                    <Input placeholder="Contoh: JF-01" />
                </Form.Item>
                <Form.Item label="Deskripsi" name="description" rules={[{ required: true, message: "Masukan deskripsi!" }]}>
                    <Input.TextArea rows={3} placeholder="Masukan deskripsi faktor pekerjaan" />
                </Form.Item>
                <Form.Item label="Status Aktif" name="is_active" valuePropName="checked">
                    <Switch checkedChildren="Aktif" unCheckedChildren="Non-Aktif" />
                </Form.Item>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
                    <Button onClick={onCancel}>Batal</Button>
                    <Button type="primary" htmlType="submit" loading={loading}>{initialValues ? "Simpan Perubahan" : "Tambah Data"}</Button>
                </div>
            </Form>
        </Modal>
    );
}
