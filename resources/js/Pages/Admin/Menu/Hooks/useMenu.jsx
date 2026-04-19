import { App, Avatar, Button, Form, Popconfirm, Space, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined, FileOutlined, FolderOutlined } from "@ant-design/icons";
import {
    getCoreRowModel,
    getExpandedRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useDelete, useGet, usePost, usePut } from "@/Helpers/useRequest";
import { useEffect, useMemo, useRef, useState } from "react";

import axios from "axios";
import { router } from "@inertiajs/react"; // Tambahkan router

const { Text } = Typography;

export default function useMenu(isDarkMode) {
    // Hooks for API Requests
    const [getItemsReq, itemsFeedback] = useGet();
    const [postItemReq, postFeedback] = usePost("menu");
    const [putItemReq, putFeedback] = usePut("menu");
    const [deleteItemReq, deleteFeedback] = useDelete("menu");
    const [reorderItemReq, reorderFeedback] = usePost("menu/reorder");

    // Local States
    const [data, setData] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [columnVisibility, setColumnVisibility] = useState({});
    const [isFilterVisible, setIsFilterVisible] = useState(false);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalRows, setTotalRows] = useState(0);
    const debounceRef = useRef(null);
    const { message, notification } = App.useApp();
    const [form] = Form.useForm();

    const fetchItems = async (params = {}) => {
        try {
            const res = await getItemsReq({
                ...params,
                page: params.page || pagination.pageIndex + 1,
                load: params.limit || pagination.pageSize,
                search: params.search !== undefined ? params.search : searchText,
            }, "menu");
            const result = res.data.result;
            setData(result.data);
            setTotalRows(result.total);
        } catch (error) {
            message.error("Failed to fetch menu data");
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchItems({
                search: value,
                page: 1,
                limit: pagination.pageSize
            });
        }, 400);
    };



    const showModal = (item = null) => {
        setEditingItem(item);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingItem(null);
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingItem) {
                await putItemReq(values, editingItem.id);
                message.success("Menu updated successfully");
            } else {
                await postItemReq(values);
                message.success("Menu created successfully");
            }
            setIsModalVisible(false);
            router.reload({ only: ["auth"] }); // Refresh sidebar
            fetchItems();
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

    const showDeleteModal = (item) => {
        setItemToDelete(item);
        setIsDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await deleteItemReq(itemToDelete.id);
            message.success("Menu deleted successfully");
            setIsDeleteModalVisible(false);
            setItemToDelete(null);
            router.reload({ only: ["auth"] }); // Refresh sidebar
            fetchItems();
        } catch (error) {
            message.error(error.response?.data?.message || "Delete failed");
        }
    };

    const handleReorder = async (activeId, overId) => {
        // Fungsi rekursif untuk mencari dan memindahkan item di dalam tingkat yang sama (siblings)
        const reorderInLevel = (items) => {
            const oldIndex = items.findIndex((i) => i.id === activeId);
            const newIndex = items.findIndex((i) => i.id === overId);

            if (oldIndex !== -1 && newIndex !== -1) {
                // Item ditemukan di tingkat ini
                const newList = [...items];
                const [movedItem] = newList.splice(oldIndex, 1);
                newList.splice(newIndex, 0, movedItem);

                // Update urutan secara lokal untuk tingkat ini
                return newList.map((item, index) => ({
                    ...item,
                    order: index + 1
                }));
            }

            // Jika tidak ketemu di sini, cari di dalam children-nya
            return items.map((item) => {
                if (item.children && item.children.length > 0) {
                    const updatedChildren = reorderInLevel(item.children);
                    if (updatedChildren !== item.children) {
                        return { ...item, children: updatedChildren };
                    }
                }
                return item;
            });
        };

        const newData = reorderInLevel(data);

        // Cek apakah ada perubahan (jika geser antar parent yang berbeda, sementara kita batasi)
        if (newData === data) return;

        setData(newData);

        // Siapkan data flat untuk dikirim ke server (semua item yang urutannya berubah)
        const getFlatUpdates = (items) => {
            let results = [];
            items.forEach((item, index) => {
                results.push({ id: item.id, order: index + 1 });
                if (item.children) {
                    results = [...results, ...getFlatUpdates(item.children)];
                }
            });
            return results;
        };

        const itemsToUpdate = getFlatUpdates(newData);

        // 2. Kirim ke Server menggunakan helper usePost (Cara yang paling benar)
        try {
            await reorderItemReq({ items: itemsToUpdate });
            message.success("Menu order updated");

            // Refresh data auth (termasuk menu sidebar) tanpa reload browser
            router.reload({ only: ['auth'] });
        } catch (error) {
            message.error("Failed to update menu order");
            fetchItems(); // Rollback jika gagal
        }
    };

    const columns = useMemo(() => [
        {
            header: "NAME",
            accessorKey: "name",
            cell: ({ row }) => {
                const record = row.original;
                return (
                    <Space size="middle">
                        <Avatar
                            icon={record.parent_id ? <FileOutlined /> : <FolderOutlined />}
                            style={{
                                backgroundColor: isDarkMode ? "#303030" : "#f5f5f5",
                                color: "#1677ff",
                            }}
                        />
                        <div>
                            <div style={{ fontWeight: 600, color: isDarkMode ? "#fff" : "#1a1a1a", fontSize: 14 }}>
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
            header: "URL",
            accessorKey: "url",
            cell: ({ row }) => <Text type="secondary" style={{ fontSize: 13 }}>{row.original.url || "-"}</Text>,
        },
        {
            header: "ORDER",
            accessorKey: "order",
            cell: ({ row }) => <Tag>{row.original.order}</Tag>,
        },
        {
            header: "STATUS",
            accessorKey: "is_active",
            cell: ({ row }) => (
                <Tag color={row.original.is_active ? "green" : "red"}>
                    {row.original.is_active ? "Active" : "Inactive"}
                </Tag>
            ),
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

    useEffect(() => {
        fetchItems({
            page: pagination.pageIndex + 1,
            limit: pagination.pageSize,
            search: searchText,
            status: filterStatus !== "all" ? filterStatus : undefined,
        });
    }, [pagination.pageIndex, pagination.pageSize, searchText, filterStatus]);

    const table = useReactTable({
        data,
        columns,
        getSubRows: (row) => row.children,
        state: {
            pagination,
            columnVisibility,
        },
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        manualPagination: true,
        rowCount: totalRows,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    return {
        searchText,
        setSearchText,
        handleSearchChange,
        filterStatus,
        setFilterStatus,
        columnVisibility,
        setColumnVisibility,
        isFilterVisible,
        setIsFilterVisible,
        showModal,
        table,
        totalRows,
        handleReorder, // Tambahkan ini
        loading: itemsFeedback.loading || reorderFeedback.loading,
        columnsCount: columns.length,
        isModalVisible,
        isDeleteModalVisible,
        setIsDeleteModalVisible,
        showDeleteModal,
        handleConfirmDelete,
        handleCancel,
        handleOk,
        form,
        editingItem,
        postFeedback,
        putFeedback,
        deleteFeedback
    };
}
