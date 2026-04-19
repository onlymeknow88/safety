import {
    AppstoreOutlined,
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    FileTextOutlined,
    FilterOutlined,
    PlusOutlined,
    SafetyCertificateOutlined,
    SafetyOutlined,
    SearchOutlined,
    SettingOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Button,
    Card,
    Checkbox,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    Popconfirm,
    Progress,
    Row,
    Space,
    Spin,
    Tag,
    Typography,
    message,
    theme,
} from "antd";
import { Head, usePage } from "@inertiajs/react";
import React, { useEffect, useRef, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import DashboardLayout from "@/Layouts/DashboardLayout";
import PermissionProtectedRoute from "@/Components/PermissionProtectedRoute";
import TokenManager from "@/Utils/TokenManager";
import axios from "axios";
import { useTheme } from "@/Contexts/ThemeContext";

const { Title, Text, Paragraph } = Typography;

export default function RoleIndex() {
    const { isDarkMode } = useTheme();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [roles, setRoles] = useState([]);
    const [permissionsList, setPermissionsList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [searchText, setSearchText] = useState("");
    const debounceRef = useRef(null);
    const [form] = Form.useForm();

    const fetchRoles = async (search = "") => {
        setLoading(true);
        try {
            const token = TokenManager.getToken();
            if (token) {
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${token}`;
            }

            const params = search ? { search } : {};
            const rolesRes = await axios.get("/api/roles", { params });
            setRoles(rolesRes.data);
        } catch (error) {
            message.error("Failed to fetch roles");
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissions = async () => {
        try {
            const token = TokenManager.getToken();
            if (token) {
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${token}`;
            }
            const permsRes = await axios.get("/api/permissions");
            setPermissionsList(permsRes.data);
        } catch (error) {
            message.error("Failed to fetch permissions");
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchRoles(value);
        }, 400);
    };

    useEffect(() => {
        fetchRoles();
        fetchPermissions();
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    const showModal = (role = null) => {
        setEditingRole(role);
        form.resetFields();
        if (role) {
            const menuPermissions = {};
            role.menus?.forEach((menu) => {
                menuPermissions[menu.id] = {
                    view: !!menu.pivot.can_view,
                    create: !!menu.pivot.can_create,
                    edit: !!menu.pivot.can_edit,
                    delete: !!menu.pivot.can_delete,
                    approval: !!menu.pivot.can_approval,
                };
            });
            form.setFieldsValue({
                name: role.name,
                description: role.description,
                menu_permissions: menuPermissions,
            });
        }
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        form.resetFields();
        setIsModalOpen(false);
        setEditingRole(null);
    };

    const handleFinish = async (values) => {
        try {
            const token = TokenManager.getToken();
            if (token) {
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${token}`;
            }

            if (editingRole) {
                await axios.put(`/api/roles/${editingRole.id}`, values);
                message.success("Role updated successfully");
            } else {
                await axios.post("/api/roles", values);
                message.success("Role created successfully");
            }
            setIsModalOpen(false);
            fetchRoles(searchText);
        } catch (error) {
            message.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = TokenManager.getToken();
            if (token) {
                axios.defaults.headers.common["Authorization"] =
                    `Bearer ${token}`;
            }

            await axios.delete(`/api/roles/${id}`);
            message.success("Role deleted successfully");
            fetchRoles(searchText);
        } catch (error) {
            message.error(error.response?.data?.message || "Delete failed");
        }
    };

    // TanStack Columns
    const columns = [
        {
            header: "ROLE NAME",
            accessorKey: "name",
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <Space size="middle">
                        <div>
                            <div
                                style={{
                                    fontWeight: 600,
                                    color: isDarkMode ? "#fff" : "#1a1a1a",
                                    fontSize: 14,
                                }}
                            >
                                {record.name}
                            </div>
                            <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                                {record.slug}
                            </div>
                        </div>
                    </Space>
                );
            },
        },
        {
            header: "DESCRIPTION",
            accessorKey: "description",
            cell: ({ row }) => (
                <Text type="secondary" style={{ fontSize: 13 }}>
                    {row.original.description || "No description provided"}
                </Text>
            ),
        },
        {
            id: "actions",
            header: "actions",
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <Space size="small">
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: "#1677ff" }} />}
                            onClick={() => showModal(record)}
                        />
                        {record.slug !== "admin" && (
                            <Popconfirm
                                title="Delete this role?"
                                onConfirm={() => handleDelete(record.id)}
                            >
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                />
                            </Popconfirm>
                        )}
                    </Space>
                );
            },
            meta: { align: "right" },
        },
    ];

    const table = useReactTable({
        data: roles,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <PermissionProtectedRoute
            roles={["admin"]}
            permissions={["role-management.view"]}
        >
            <DashboardLayout title="Role Management">
                <Head title="Role Management" />

                <div style={{ padding: "8px 32px 32px 32px" }}>
                    {/* Header Action Bar */}
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: 24,
                            background: isDarkMode ? "#1f1f1f" : "#fff",
                            padding: "16px 24px",
                            borderRadius: 16,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                    >
                        <Space size={16}>
                            <Input
                                placeholder="Search role name, slug, description..."
                                prefix={
                                    <SearchOutlined
                                        style={{ color: "#bfbfbf" }}
                                    />
                                }
                                value={searchText}
                                onChange={handleSearchChange}
                                style={{
                                    width: 350,
                                    borderRadius: 10,
                                    background: isDarkMode
                                        ? "#141414"
                                        : "#f5f5f5",
                                    border: "none",
                                    height: 40,
                                }}
                            />
                            <Button
                                icon={<FilterOutlined />}
                                style={{
                                    borderRadius: 10,
                                    height: 40,
                                    background: isDarkMode
                                        ? "#141414"
                                        : "#f5f5f5",
                                    border: "none",
                                }}
                            >
                                Filter
                            </Button>
                        </Space>

                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => showModal()}
                            style={{
                                height: 40,
                                borderRadius: 10,
                                padding: "0 24px",
                                fontWeight: 600,
                                background: "#1677ff",
                                boxShadow: "0 4px 12px rgba(22, 119, 255, 0.2)",
                            }}
                        >
                            Add new role
                        </Button>
                    </div>

                    {/* Table Section (TanStack Implementation) */}
                    <div
                        style={{
                            background: isDarkMode ? "#1f1f1f" : "#fff",
                            borderRadius: 20,
                            overflow: "hidden",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                            border: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                        }}
                    >
                        <div style={{ overflowX: "auto" }}>
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                }}
                                className="tanstack-table"
                            >
                                <thead>
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => (
                                                        <th
                                                            key={header.id}
                                                            style={{
                                                                textAlign:
                                                                    header
                                                                        .column
                                                                        .columnDef
                                                                        .meta
                                                                        ?.align ===
                                                                    "right"
                                                                        ? "right"
                                                                        : "left",
                                                                padding:
                                                                    "20px 24px",
                                                                fontSize: 11,
                                                                fontWeight: 700,
                                                                color: "#bfbfbf",
                                                                textTransform:
                                                                    "uppercase",
                                                                letterSpacing:
                                                                    "0.5px",
                                                                borderBottom: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                                                                cursor: header.column.getCanSort()
                                                                    ? "pointer"
                                                                    : "default",
                                                            }}
                                                            onClick={header.column.getToggleSortingHandler()}
                                                        >
                                                            {flexRender(
                                                                header.column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext(),
                                                            )}
                                                            {header.column.getIsSorted() &&
                                                                (header.column.getIsSorted() ===
                                                                "asc"
                                                                    ? " ▲"
                                                                    : " ▼")}
                                                        </th>
                                                    ),
                                                )}
                                            </tr>
                                        ))}
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                style={{
                                                    textAlign: "center",
                                                    padding: 40,
                                                }}
                                            >
                                                <Spin />
                                            </td>
                                        </tr>
                                    ) : table.getRowModel().rows.length > 0 ? (
                                        table.getRowModel().rows.map((row) => (
                                            <tr
                                                key={row.id}
                                                style={{
                                                    borderBottom: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                                                    transition:
                                                        "background 0.2s",
                                                }}
                                                className="row-hover"
                                            >
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <td
                                                            key={cell.id}
                                                            style={{
                                                                padding:
                                                                    "16px 24px",
                                                                textAlign:
                                                                    cell.column
                                                                        .columnDef
                                                                        .meta
                                                                        ?.align ===
                                                                    "right"
                                                                        ? "right"
                                                                        : "left",
                                                            }}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </td>
                                                    ))}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={columns.length}
                                                style={{
                                                    textAlign: "center",
                                                    padding: 40,
                                                }}
                                            >
                                                <Text type="secondary">
                                                    No roles found.
                                                </Text>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Bar */}
                        <div
                            style={{
                                padding: "16px 24px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                borderTop: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                            }}
                        >
                            <Text type="secondary" style={{ fontSize: 13 }}>
                                Showing {table.getRowModel().rows.length} of{" "}
                                {table.getPreFilteredRowModel().rows.length}{" "}
                                results
                            </Text>
                            <Space>
                                <Button
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                    style={{ borderRadius: 8 }}
                                >
                                    Previous
                                </Button>
                                <Text style={{ padding: "0 8px" }}>
                                    Page{" "}
                                    {table.getState().pagination.pageIndex + 1}{" "}
                                    of {table.getPageCount()}
                                </Text>
                                <Button
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                    style={{ borderRadius: 8 }}
                                >
                                    Next
                                </Button>
                            </Space>
                        </div>
                    </div>
                </div>

                <Modal
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                    width={1000}
                    centered
                    styles={{
                        body: { padding: 0 },
                        content: { borderRadius: "24px", overflow: "hidden" },
                    }}
                    closable={false}
                >
                    <div
                        style={{ background: isDarkMode ? "#1f1f1f" : "#fff" }}
                    >
                        <div
                            style={{
                                padding: "32px 40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                borderBottom: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                            }}
                        >
                            <div>
                                <Title
                                    level={3}
                                    style={{ margin: 0, fontWeight: 800 }}
                                >
                                    {editingRole
                                        ? "Configure Role"
                                        : "Create New Role"}
                                </Title>
                                <Text type="secondary" style={{ fontSize: 14 }}>
                                    Adjust identification and granular
                                    permission Matrix
                                </Text>
                            </div>
                            <Button
                                type="text"
                                icon={<CloseOutlined />}
                                onClick={handleCancel}
                                style={{
                                    background: isDarkMode
                                        ? "#303030"
                                        : "#f5f5f5",
                                    borderRadius: 10,
                                }}
                            />
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFinish}
                            style={{ padding: "40px" }}
                        >
                            <Row gutter={40}>
                                <Col span={10}>
                                    <Form.Item
                                        name="name"
                                        label={
                                            <Text
                                                strong
                                                style={{
                                                    fontSize: 12,
                                                    color: "#8c8c8c",
                                                }}
                                            >
                                                ROLE LABEL
                                            </Text>
                                        }
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            placeholder="e.g. Content Editor"
                                            size="large"
                                            style={{
                                                borderRadius: 12,
                                                height: 48,
                                            }}
                                        />
                                    </Form.Item>
                                    <Form.Item
                                        name="description"
                                        label={
                                            <Text
                                                strong
                                                style={{
                                                    fontSize: 12,
                                                    color: "#8c8c8c",
                                                }}
                                            >
                                                PURPOSE / DESCRIPTION
                                            </Text>
                                        }
                                    >
                                        <Input.TextArea
                                            placeholder="Why is this role needed?"
                                            rows={4}
                                            style={{ borderRadius: 12 }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={14}>
                                    <Text
                                        strong
                                        style={{
                                            fontSize: 12,
                                            color: "#8c8c8c",
                                            display: "block",
                                            marginBottom: 16,
                                        }}
                                    >
                                        PERMISSION MATRIX
                                    </Text>
                                    <div
                                        style={{
                                            background: isDarkMode
                                                ? "#141414"
                                                : "#fafafa",
                                            borderRadius: 20,
                                            overflow: "auto",
                                            maxHeight: 450,
                                            border: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                                        }}
                                    >
                                        <table
                                            style={{
                                                width: "100%",
                                                borderCollapse: "collapse",
                                            }}
                                        >
                                            <thead>
                                                <tr
                                                    style={{
                                                        position: "sticky",
                                                        top: 0,
                                                        zIndex: 10,
                                                        background: isDarkMode
                                                            ? "#262626"
                                                            : "#f5f5f5",
                                                    }}
                                                >
                                                    <th
                                                        style={{
                                                            textAlign: "left",
                                                            padding:
                                                                "16px 20px",
                                                            fontSize: 11,
                                                            fontWeight: 800,
                                                            color: "#8c8c8c",
                                                        }}
                                                    >
                                                        MODULE
                                                    </th>
                                                    {[
                                                        "VIEW",
                                                        "CREATE",
                                                        "EDIT",
                                                        "DEL",
                                                        "APP",
                                                    ].map((h) => (
                                                        <th
                                                            key={h}
                                                            style={{
                                                                width: 60,
                                                                textAlign:
                                                                    "center",
                                                                padding:
                                                                    "16px 10px",
                                                                fontSize: 11,
                                                                fontWeight: 800,
                                                                color: "#8c8c8c",
                                                            }}
                                                        >
                                                            {h}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Array.isArray(
                                                    permissionsList,
                                                ) &&
                                                    permissionsList.map(
                                                        (menu) => (
                                                            <tr
                                                                key={menu.id}
                                                                style={{
                                                                    borderBottom: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                                                                }}
                                                            >
                                                                <td
                                                                    style={{
                                                                        padding:
                                                                            "16px 20px",
                                                                    }}
                                                                >
                                                                    <div style={{ 
                                                                        paddingLeft: (menu.level || 0) * 24,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 8
                                                                    }}>
                                                                        {(menu.level || 0) > 0 && (
                                                                            <span style={{ color: '#bfbfbf' }}>└─</span>
                                                                        )}
                                                                        <Text
                                                                            strong={menu.level === 0}
                                                                            style={{
                                                                                fontSize: menu.level === 0 ? 14 : 13,
                                                                                color: menu.level === 0 ? (isDarkMode ? '#fff' : '#1a1a1a') : '#595959'
                                                                            }}
                                                                        >
                                                                            {menu.name}
                                                                        </Text>
                                                                    </div>
                                                                </td>
                                                                {[
                                                                    "view",
                                                                    "create",
                                                                    "edit",
                                                                    "delete",
                                                                    "approval",
                                                                ].map(
                                                                    (
                                                                        action,
                                                                    ) => (
                                                                        <td
                                                                            key={
                                                                                action
                                                                            }
                                                                            style={{
                                                                                textAlign:
                                                                                    "center",
                                                                                padding:
                                                                                    "16px 10px",
                                                                            }}
                                                                        >
                                                                            <Form.Item
                                                                                name={[
                                                                                    "menu_permissions",
                                                                                    menu.id,
                                                                                    action,
                                                                                ]}
                                                                                valuePropName="checked"
                                                                                noStyle
                                                                            >
                                                                                <Checkbox />
                                                                            </Form.Item>
                                                                        </td>
                                                                    ),
                                                                )}
                                                            </tr>
                                                        ),
                                                    )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Col>
                            </Row>

                            <div
                                style={{
                                    marginTop: 40,
                                    display: "flex",
                                    justifyContent: "flex-end",
                                    gap: 16,
                                }}
                            >
                                <Button
                                    onClick={handleCancel}
                                    size="large"
                                    style={{
                                        borderRadius: 12,
                                        padding: "0 32px",
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => form.submit()}
                                    style={{
                                        borderRadius: 12,
                                        padding: "0 48px",
                                        fontWeight: 700,
                                        background: "#1677ff",
                                    }}
                                >
                                    Submit
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Modal>

                <style
                    dangerouslySetInnerHTML={{
                        __html: `
                    .row-hover:hover {
                        background: ${isDarkMode ? "#262626" : "#fafafa"} !important;
                    }
                `,
                    }}
                />
            </DashboardLayout>
        </PermissionProtectedRoute>
    );
}
