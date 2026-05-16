import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Space, Divider, Typography } from "antd";
import { PlusOutlined, DeleteOutlined, MailOutlined, UserOutlined, UsergroupAddOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function EmailGroupModal({ visible, onCancel, onFinish, initialValues, loading }) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    name: initialValues.name,
                    description: initialValues.description,
                    recipients: initialValues.recipients || [{ email: "", name: "" }]
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ recipients: [{ email: "", name: "" }] });
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onFinish(values);
        });
    };

    return (
        <Modal
            title={
                <Space>
                    <div style={{ background: "#3b82f6", padding: 8, borderRadius: 8, display: "flex" }}>
                        <UsergroupAddOutlined style={{ color: "#fff" }} />
                    </div>
                    <span style={{ fontWeight: 800 }}>{initialValues ? "EDIT GRUP EMAIL" : "TAMBAH GRUP EMAIL"}</span>
                </Space>
            }
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={700}
            centered
            okText="Simpan"
            cancelText="Batal"
            styles={{ body: { paddingTop: 24 } }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label={<Text strong>Nama Grup</Text>}
                    rules={[{ required: true, message: "Nama grup wajib diisi" }]}
                >
                    <Input placeholder="Contoh: AMI All Site Users" size="large" style={{ borderRadius: 8 }} />
                </Form.Item>

                <Form.Item
                    name="description"
                    label={<Text strong>Deskripsi</Text>}
                >
                    <Input.TextArea placeholder="Penjelasan mengenai grup ini..." rows={2} style={{ borderRadius: 8 }} />
                </Form.Item>

                <Divider orientation="left">
                    <Space>
                        <MailOutlined />
                        <span style={{ fontWeight: 700, fontSize: 13 }}>DAFTAR PENERIMA</span>
                    </Space>
                </Divider>

                <Form.List name="recipients">
                    {(fields, { add, remove }) => (
                        <>
                            <div style={{ maxHeight: 300, overflowY: "auto", paddingRight: 8 }}>
                                {fields.map(({ key, name, ...restField }) => (
                                    <Space key={key} style={{ display: "flex", marginBottom: 8 }} align="baseline">
                                        <Form.Item
                                            {...restField}
                                            name={[name, "email"]}
                                            rules={[
                                                { required: true, message: "Email wajib diisi" },
                                                { type: "email", message: "Format email tidak valid" }
                                            ]}
                                            style={{ marginBottom: 0, width: 300 }}
                                        >
                                            <Input prefix={<MailOutlined style={{ color: "#bfbfbf" }} />} placeholder="Email" style={{ borderRadius: 6 }} />
                                        </Form.Item>
                                        <Form.Item
                                            {...restField}
                                            name={[name, "name"]}
                                            style={{ marginBottom: 0, width: 250 }}
                                        >
                                            <Input prefix={<UserOutlined style={{ color: "#bfbfbf" }} />} placeholder="Nama (Opsional)" style={{ borderRadius: 6 }} />
                                        </Form.Item>
                                        <Button type="text" onClick={() => remove(name)} icon={<DeleteOutlined style={{ color: "#ff4d4f" }} />} />
                                    </Space>
                                ))}
                            </div>
                            <Form.Item style={{ marginTop: 16 }}>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />} style={{ height: 40, borderRadius: 8 }}>
                                    Tambah Penerima
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form>
        </Modal>
    );
}
