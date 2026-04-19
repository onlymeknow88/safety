import { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Card,
    Table,
    Button,
    Space,
    Input,
    Tag,
    Avatar,
    Modal,
    Form,
    Select,
    Tooltip,
    Popconfirm,
    Typography,
    Row,
    Col,
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    ExportOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/Layouts/DashboardLayout";

const { Text } = Typography;

const dummyUsers = [
    { key: "1", name: "Ahmad Rizki", email: "ahmad@email.com", role: "admin", status: "active", joined: "10 Jan 2026" },
    { key: "2", name: "Siti Rahma", email: "siti@email.com", role: "editor", status: "active", joined: "15 Jan 2026" },
    { key: "3", name: "Budi Santoso", email: "budi@email.com", role: "viewer", status: "inactive", joined: "20 Feb 2026" },
    { key: "4", name: "Dewi Lestari", email: "dewi@email.com", role: "editor", status: "active", joined: "5 Mar 2026" },
    { key: "5", name: "Fajar Nugroho", email: "fajar@email.com", role: "viewer", status: "active", joined: "12 Mar 2026" },
];

const roleColor = { admin: "red", editor: "blue", viewer: "default" };

export default function Users({ users = dummyUsers }) {
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();

    const usersList = Array.isArray(users) ? users : (users?.data || []);
    
    const filtered = usersList.filter(
        (u) =>
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (record) => {
        setEditingUser(record);
        form.setFieldsValue(record);
        setModalOpen(true);
    };

    const handleAdd = () => {
        setEditingUser(null);
        form.resetFields();
        setModalOpen(true);
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            if (editingUser) {
                // router.put(`/users/${editingUser.key}`, values);
                console.log("Update:", values);
            } else {
                // router.post("/users", values);
                console.log("Create:", values);
            }
            setModalOpen(false);
        });
    };

    const columns = [
        {
            title: "User",
            key: "user",
            render: (_, r) => (
                <Space>
                    <Avatar
                        icon={<UserOutlined />}
                        style={{ background: "linear-gradient(135deg, #1677ff, #0958d9)" }}
                    />
                    <div>
                        <Text strong style={{ fontSize: 13 }}>{r.name}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: 12 }}>{r.email}</Text>
                    </div>
                </Space>
            ),
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
            render: (role) => (
                <Tag color={roleColor[role]} style={{ textTransform: "capitalize" }}>
                    {role}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: (s) => (
                <Tag color={s === "active" ? "success" : "default"}>
                    {s === "active" ? "Aktif" : "Tidak Aktif"}
                </Tag>
            ),
        },
        {
            title: "Bergabung",
            dataIndex: "joined",
            key: "joined",
            render: (t) => <Text type="secondary">{t}</Text>,
        },
        {
            title: "Aksi",
            key: "action",
            width: 100,
            render: (_, record) => (
                <Space size={4}>
                    <Tooltip title="Edit">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Hapus user ini?"
                        okText="Hapus"
                        cancelText="Batal"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => {
                            // router.delete(`/users/${record.key}`)
                            console.log("Delete:", record.key);
                        }}
                    >
                        <Tooltip title="Hapus">
                            <Button
                                type="text"
                                icon={<DeleteOutlined />}
                                size="small"
                                danger
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <DashboardLayout title="Users">
            <Head title="Users" />

            <Card
                style={{
                    borderRadius: 12,
                    border: "1px solid #f0f0f0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
            >
                {/* Toolbar */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                    <Col>
                        <Text strong style={{ fontSize: 16 }}>
                            Daftar User ({filtered.length})
                        </Text>
                    </Col>
                    <Col>
                        <Space>
                            <Input
                                placeholder="Cari user..."
                                prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ width: 220 }}
                                allowClear
                            />
                            <Button icon={<ExportOutlined />}>Export</Button>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                            >
                                Tambah User
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Table
                    dataSource={filtered}
                    columns={columns}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} user`,
                    }}
                    size="middle"
                />
            </Card>

            {/* Add/Edit Modal */}
            <Modal
                title={editingUser ? "Edit User" : "Tambah User Baru"}
                open={modalOpen}
                onOk={handleSubmit}
                onCancel={() => setModalOpen(false)}
                okText={editingUser ? "Simpan" : "Tambah"}
                cancelText="Batal"
                width={480}
            >
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: 16 }}
                >
                    <Form.Item
                        name="name"
                        label="Nama Lengkap"
                        rules={[{ required: true, message: "Nama wajib diisi" }]}
                    >
                        <Input placeholder="Masukkan nama lengkap" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Email wajib diisi" },
                            { type: "email", message: "Format email tidak valid" },
                        ]}
                    >
                        <Input placeholder="nama@email.com" />
                    </Form.Item>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="role"
                                label="Role"
                                rules={[{ required: true, message: "Pilih role" }]}
                            >
                                <Select placeholder="Pilih role">
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="editor">Editor</Select.Option>
                                    <Select.Option value="viewer">Viewer</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Status"
                                rules={[{ required: true, message: "Pilih status" }]}
                            >
                                <Select placeholder="Pilih status">
                                    <Select.Option value="active">Aktif</Select.Option>
                                    <Select.Option value="inactive">Tidak Aktif</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {!editingUser && (
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: "Password wajib diisi" }]}
                        >
                            <Input.Password placeholder="Minimal 8 karakter" />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </DashboardLayout>
    );
}
