import { Button, Form, Input, Modal, Select, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useGet } from "@/Helpers/useRequest";

export default function LocationDetailModal({ visible, onCancel, onFinish, loading, initialValues }) {
    const [form] = Form.useForm();
    const [generals, setGenerals] = useState([]);
    const [getGeneral] = useGet();

    useEffect(() => {
        if (visible) {
            fetchGenerals();
            if (initialValues) form.setFieldsValue({ ...initialValues, is_active: !!initialValues.is_active });
            else form.resetFields();
        }
    }, [visible, initialValues, form]);

    const fetchGenerals = async () => {
        const res = await getGeneral({}, "location-general");
        if (res.data?.meta?.status === 'success') {
            setGenerals(res.data.result.data.map(g => ({ label: g.name, value: g.id })));
        }
    };

    return (
        <Modal title={initialValues ? "Edit Detail Lokasi" : "Tambah Detail Lokasi"} open={visible} onCancel={onCancel} footer={null} destroyOnHidden>
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ is_active: true }}>
                <Form.Item label="Lokasi Umum" name="general_id" rules={[{ required: true, message: "Pilih lokasi umum!" }]}>
                    <Select placeholder="Pilih Lokasi Umum" options={generals} />
                </Form.Item>
                <Form.Item label="Nama Lokasi Detail" name="name" rules={[{ required: true, message: "Masukan nama lokasi detail!" }]}>
                    <Input placeholder="Contoh: Bengkel Utama" />
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
