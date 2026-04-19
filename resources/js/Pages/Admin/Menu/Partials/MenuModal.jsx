import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, Switch, Row, Col } from "antd";

export default function MenuModal({ 
    visible, 
    onCancel, 
    onOk, 
    form, 
    editingItem, 
    loading,
    potentialParents = []
}) {
    useEffect(() => {
        if (visible) {
            if (editingItem) {
                form.setFieldsValue({
                    ...editingItem,
                    is_active: !!editingItem.is_active
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, editingItem, form]);
    const generateSlug = (name, parentId) => {
        if (!name) return "";
        const baseSlug = name
            .toLowerCase()
            .replace(/[^\w ]+/g, "")
            .replace(/ +/g, "-");
        
        const parent = potentialParents.find(p => p.id === parentId);
        if (parent && parent.slug) {
            return `${parent.slug}.${baseSlug}`;
        }
        return baseSlug;
    };

    const handleNameChange = (e) => {
        const name = e.target.value;
        const parentId = form.getFieldValue("parent_id");
        form.setFieldsValue({ slug: generateSlug(name, parentId) });
    };

    const handleParentChange = (parentId) => {
        const name = form.getFieldValue("name");
        form.setFieldsValue({ slug: generateSlug(name, parentId) });
    };

    return (
        <Modal
            title={editingItem ? "Edit Menu" : "Add Menu"}
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            centered
            confirmLoading={loading}
            styles={{
                content: { borderRadius: "16px" }
            }}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }} autoComplete="off">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Menu Name"
                            rules={[{ required: true, message: "Please input the name" }]}
                        >
                            <Input 
                                placeholder="Enter menu name" 
                                onChange={handleNameChange} 
                                style={{ borderRadius: 8 }} 
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="slug"
                            label="Slug"
                            rules={[{ required: true, message: "Please input the slug" }]}
                        >
                            <Input placeholder="menu-slug" style={{ borderRadius: 8 }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="icon"
                            label="Icon Class (Optional)"
                        >
                            <Input placeholder="e.g. DashboardOutlined" style={{ borderRadius: 8 }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="url"
                            label="URL"
                        >
                            <Input placeholder="e.g. /admin/dashboard" style={{ borderRadius: 8 }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="order"
                            label="Display Order"
                            rules={[{ required: true, message: "Required" }]}
                            initialValue={0}
                        >
                            <InputNumber min={0} style={{ width: "100%", borderRadius: 8 }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="is_active"
                            label="Status"
                            valuePropName="checked"
                            initialValue={true}
                        >
                            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name="parent_id"
                    label="Parent Menu (Optional)"
                >
                    <Select
                        placeholder="Select parent menu"
                        style={{ borderRadius: 8 }}
                        allowClear
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={handleParentChange}
                        options={potentialParents.map(item => ({
                            value: item.id,
                            label: item.name
                        }))}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
