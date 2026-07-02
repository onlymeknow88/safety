import React from "react";
import { Modal, Form, Input, Select, AutoComplete } from "antd";

export default function UserModal({ 
    visible, 
    onCancel, 
    onOk, 
    form, 
    editingUser, 
    rolesList, 
    loading 
}) {
    return (
        <Modal
            title={editingUser ? "Edit User" : "Add User"}
            open={visible}
            onOk={onOk}
            onCancel={onCancel}
            centered
            confirmLoading={loading}
            styles={{
                content: { borderRadius: "20px" }
            }}
            destroyOnHidden
        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                <Form.Item
                    name="name"
                    label="Full Name"
                    rules={[{ required: true, message: "Please input the name" }]}
                >
                    <Input placeholder="Enter user name" style={{ borderRadius: 8 }} />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[{ required: true, type: "email", message: "Please input a valid email" }]}
                >
                    <Input placeholder="Enter user email" style={{ borderRadius: 8 }} />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{ required: !editingUser, min: 8, message: "Password must be at least 8 chars" }]}
                >
                    <Input.Password
                        placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                        style={{ borderRadius: 8 }}
                    />
                </Form.Item>
                <Form.Item
                    name="roles"
                    label="User Role"
                    rules={[{ required: true, message: "Please select a role" }]}
                >
                    <Select
                        placeholder="Search and select a role"
                        style={{ borderRadius: 8, height: '40px' }}
                        showSearch
                        allowClear
                        optionLabelProp="label" // Agar saat terpilih, yang muncul cuma namanya saja
                        filterOption={(input, option) =>
                             (option?.searchValues ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        options={rolesList.map(role => ({
                            value: Number(role.id),
                            label: role.name, // Ini yang tampil saat terpilih
                            searchValues: `${role.name} ${role.description || ""}`, // Untuk pencarian
                            display: ( // Kita gunakan properti kustom untuk merender isi dropdown
                                <div style={{ 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    padding: '4px 0' 
                                }}>
                                    <span style={{ fontWeight: 600, fontSize: '14px' }}>{role.name}</span>
                                    {role.description && (
                                        <span style={{ 
                                            fontSize: '11px', 
                                            color: '#8c8c8c',
                                            marginTop: '2px',
                                            lineHeight: '1.2'
                                        }}>
                                            {role.description}
                                        </span>
                                    )}
                                </div>
                            )
                        }))}
                        // Render khusus untuk isi dropdown
                        optionRender={(option) => option.data.display}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
}
