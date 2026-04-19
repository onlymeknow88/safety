import { Button, Form, Input, Modal, Select, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useGet } from "@/Helpers/useRequest";

export default function LocationModal({ visible, onCancel, onFinish, loading, initialValues }) {
    const [form] = Form.useForm();
    const [ccows, setCcows] = useState([]);
    const [getCcows] = useGet();

    useEffect(() => {
        if (visible) {
            fetchCcows();
            if (initialValues) form.setFieldsValue({ ...initialValues, is_active: !!initialValues.is_active });
            else form.resetFields();
        }
    }, [visible, initialValues, form]);

    const fetchCcows = async () => {
        const res = await getCcows({}, "ccow");
        if (res.data?.meta?.status === 'success') {
            setCcows(res.data.result.data.map(c => ({ label: c.name, value: c.id })));
        }
    };

    return (
        <Modal title={initialValues ? "Edit Lokasi" : "Tambah Lokasi"} open={visible} onCancel={onCancel} footer={null} destroyOnHidden>
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ is_active: true }}>
                <Form.Item label="CCOW" name="ccow_id" rules={[{ required: true, message: "Pilih CCOW!" }]}>
                    <Select placeholder="Pilih CCOW" options={ccows} />
                </Form.Item>
                <Form.Item label="Nama Lokasi" name="name" rules={[{ required: true, message: "Masukan nama lokasi!" }]}>
                    <Input placeholder="Contoh: CAMP HAJU" />
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
