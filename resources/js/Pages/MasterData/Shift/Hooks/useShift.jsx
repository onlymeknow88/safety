import { App, Button, Space, Tag, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDelete, useGet, usePost, usePut } from "@/Helpers/useRequest";

const { Text } = Typography;

export default function useShift() {
    const { notification } = App.useApp();

    const [getRequest, getFeedback] = useGet();
    const [postRequest, postFeedback] = usePost("shift");
    const [putRequest, putFeedback] = usePut("shift");
    const [deleteRequest, deleteFeedback] = useDelete("shift");

    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalRows, setTotalRows] = useState(0);
    const debounceRef = useRef(null);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const fetchItems = useCallback(async (params = {}) => {
        try {
            const res = await getRequest({
                ...params,
                page: (params.pageIndex !== undefined ? params.pageIndex : pagination.pageIndex) + 1,
                load: params.pageSize || pagination.pageSize,
                search: params.search !== undefined ? params.search : searchText,
            }, "shift");

            if (res.data?.meta?.status === 'success') {
                setData(res.data.result.data);
                setTotalRows(res.data.result.total);
            }
        } catch (error) {
            notification.error({ message: "Gagal mengambil data Shift" });
        }
    }, [getRequest, pagination.pageIndex, pagination.pageSize, searchText, notification]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchItems({ search: value, pageIndex: 0 });
        }, 400);
    };

    const handleAdd = () => {
        setEditingItem(null);
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingItem(record);
        setIsModalVisible(true);
    };

    const showDeleteModal = (record) => {
        setItemToDelete(record);
        setIsDeleteModalVisible(true);
    };

    const handleOk = async (values) => {
        try {
            let response;
            if (editingItem) {
                response = await putRequest(values, editingItem.id);
            } else {
                response = await postRequest(values);
            }

            if (response.data?.meta?.status === 'success') {
                notification.success({
                    message: "Berhasil",
                    description: editingItem ? "Berhasil memperbarui data" : "Berhasil menambah data"
                });
                setIsModalVisible(false);
                fetchItems();
            }
        } catch (error) {
            notification.error({
                message: "Gagal",
                description: error.response?.data?.meta?.message || "Terjadi kesalahan pada server"
            });
        }
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const response = await deleteRequest(itemToDelete.id);
            if (response.data?.meta?.status === 'success') {
                notification.success({ message: "Data Shift berhasil dihapus" });
                setIsDeleteModalVisible(false);
                fetchItems();
            }
        } catch (error) {
            notification.error({ message: "Gagal menghapus data" });
        }
    };

    const columns = useMemo(() => [
        {
            header: "NAMA SHIFT",
            accessorKey: "name",
            cell: ({ row }) => (
                <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{row.original.name}</div>
            )
        },
        {
            header: "STATUS",
            accessorKey: "is_active",
            cell: ({ row }) => (
                <Tag color={row.original.is_active ? "green" : "red"} style={{ borderRadius: 6, fontWeight: 600 }}>
                    {row.original.is_active ? "ACTIVE" : "INACTIVE"}
                </Tag>
            )
        },
        {
            id: "actions",
            header: "AKSI",
            cell: ({ row }) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined style={{ color: "#2563eb" }} />} onClick={() => handleEdit(row.original)} />
                    <Button type="text" icon={<DeleteOutlined style={{ color: "#ef4444" }} />} onClick={() => showDeleteModal(row.original)} />
                </Space>
            ),
            meta: { align: "right" }
        }
    ], []);

    const table = useReactTable({
        data,
        columns,
        state: { pagination },
        onPaginationChange: setPagination,
        manualPagination: true,
        rowCount: totalRows,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    useEffect(() => {
        fetchItems();
    }, [pagination.pageIndex, pagination.pageSize]);

    return {
        table,
        loading: getFeedback.loading || postFeedback.loading || putFeedback.loading || deleteFeedback.loading,
        searchText,
        handleSearchChange,
        isModalVisible,
        setIsModalVisible,
        handleAdd,
        handleEdit,
        handleOk,
        isDeleteModalVisible,
        setIsDeleteModalVisible,
        showDeleteModal,
        handleConfirmDelete,
        itemToDelete,
        editingItem,
        totalRows,
        fetchItems
    };
}
