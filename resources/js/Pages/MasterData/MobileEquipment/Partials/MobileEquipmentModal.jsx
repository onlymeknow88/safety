import React, { useEffect } from "react";
import { Modal, Form, Input, InputNumber, Switch, Button } from "antd";

export default function MobileEquipmentModal({ visible, onCancel, onFinish, loading, initialValues }) {
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
            title={initialValues ? "Edit Jenis Mobile Equipment" : "Tambah Jenis Mobile Equipment Baru"}
            open={visible}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ is_active: true, sort_order: 0 }}
                autoComplete="off"
            >
                <Form.Item
                    label="Nama Mobile Equipment"
                    name="name"
                    rules={[{ required: true, message: "Masukan nama Jenis Mobile Equipment!" }]}
                >
                    <Input placeholder="Contoh: Haul Truck" />
                </Form.Item>

                <Form.Item
                    label="Urutan Sortir (Sort Order)"
                    name="sort_order"
                    rules={[{ required: true, message: "Masukan urutan sortir!" }]}
                >
                    <InputNumber min={0} style={{ width: "100%" }} placeholder="Contoh: 10" />
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
