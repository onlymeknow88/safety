import { useState, useEffect, useRef, useMemo } from "react";
import { Avatar, Space, Tag, Typography, message, Form, Popconfirm, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useGet, usePost, usePut, useDelete } from "@/Helpers/useRequest";

const { Text } = Typography;

export default function useUserManagement(isDarkMode) {
    // Hooks for API Requests
    const [getUsersReq, usersFeedback] = useGet();
    const [getRolesReq, rolesFeedback] = useGet();
    const [postUserReq, postFeedback] = usePost("users");
    const [putUserReq, putFeedback] = usePut("users");
    const [deleteUserReq, deleteFeedback] = useDelete("users");

    // Local States
    const [users, setUsers] = useState([]);
    const [rolesList, setRolesList] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalRows, setTotalRows] = useState(0);
    const debounceRef = useRef(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [form] = Form.useForm();

    const fetchRoles = async () => {
        try {
            const res = await getRolesReq({}, "roles");
            setRolesList(res.data);
        } catch (error) {
            console.error("Failed to fetch roles", error);
        }
    };

    const fetchUsers = async (
        search = searchText,
        page = pagination.pageIndex,
        size = pagination.pageSize,
    ) => {
        try {
            const params = {
                search: search,
                page: page + 1,
                load: size,
            };
            const res = await getUsersReq(params, "users");
            const result = res.data.result;
            setUsers(result.data);
            setTotalRows(result.total);
        } catch (error) {
            message.error("Failed to fetch users");
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchUsers(value, 0, pagination.pageSize);
        }, 400);
    };

    useEffect(() => {
        fetchUsers(searchText, pagination.pageIndex, pagination.pageSize);
    }, [pagination.pageIndex, pagination.pageSize]);

    useEffect(() => {
        fetchRoles();
    }, []);

    const showModal = (user = null) => {
        setEditingUser(user);
        if (user) {
            form.setFieldsValue({
                ...user,
                password: "",
                roles: user.roles?.[0]?.id ? Number(user.roles[0].id) : null,
            });
        } else {
            form.resetFields();
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setIsDeleteModalVisible(false); // Tambahkan ini
        setEditingUser(null);
        setItemToDelete(null); // Tambahkan ini
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingUser) {
                await putUserReq(values, editingUser.id);
                message.success("User updated successfully");
            } else {
                await postUserReq(values);
                message.success("User created successfully");
            }
            setIsModalVisible(false);
            fetchUsers(searchText, pagination.pageIndex, pagination.pageSize);
            form.resetFields();
        } catch (error) {
            if (error.response?.data?.errors) {
                const errorMessages = Object.values(error.response.data.errors)
                    .flat()
                    .join(", ");
                message.error(errorMessages);
            } else if (error.response?.data?.message) {
                message.error(error.response.data.message);
            }
        }
    };

    const showDeleteModal = (user) => {
        setItemToDelete(user);
        setIsDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteUserReq(itemToDelete.id);
            message.success("User deleted successfully");
            setIsDeleteModalVisible(false);
            setItemToDelete(null);
            fetchUsers(searchText, pagination.pageIndex, pagination.pageSize);
        } catch (error) {
            message.error(error.response?.data?.message || "Delete failed");
        }
    };

    const columns = useMemo(() => [
        {
            header: "USER",
            accessorKey: "name",
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <Space size="middle">
                        <Avatar
                            style={{
                                backgroundColor: isDarkMode
                                    ? "#303030"
                                    : "#f5f5f5",
                                color: "#1677ff",
                            }}
                        >
                            {record.name.charAt(0).toUpperCase()}
                        </Avatar>
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
                                ID: {record.id}
                            </div>
                        </div>
                    </Space>
                );
            },
        },
        {
            header: "EMAIL ADDRESS",
            accessorKey: "email",
            cell: ({ row }) => (
                <Text type="secondary" style={{ fontSize: 13 }}>
                    {row.original.email}
                </Text>
            ),
        },
        {
            header: "ROLES",
            accessorKey: "roles",
            cell: ({ row }) => {
                const roles = row.original.roles;
                if (!roles) return <Tag>No Role</Tag>;
                if (Array.isArray(roles)) {
                    return (
                        <Space wrap>
                            {roles.map((role) => (
                                <Tag color="blue" key={role.id}>
                                    {role.name}
                                </Tag>
                            ))}
                        </Space>
                    );
                }
                return <Tag color="blue">{roles.name || "N/A"}</Tag>;
            },
        },
        {
            id: "actions",
            header: "ACTIONS",
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <Space size="small">
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: "#1677ff" }} />}
                            onClick={() => showModal(record)}
                        />
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteModal(record)}
                        />
                    </Space>
                );
            },
            meta: { align: "right" },
        },
    ], [isDarkMode]);

    const table = useReactTable({
        data: users,
        columns,
        state: {
            pagination,
        },
        onPaginationChange: setPagination,
        manualPagination: true,
        rowCount: totalRows,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return {
        searchText,
        handleSearchChange,
        showModal,
        table,
        usersFeedback,
        columnsCount: columns.length,
        isModalVisible,
        isDeleteModalVisible,
        setIsDeleteModalVisible,
        showDeleteModal,
        handleConfirmDelete,
        handleCancel,
        handleOk,
        form,
        editingUser,
        itemToDelete,
        rolesList,
        postFeedback,
        putFeedback,
        deleteFeedback
    };
}
