import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { 
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
} from "@tanstack/react-table";
import { useGet, usePost, usePut, useDelete } from "@/Helpers/useRequest";
import { App, Tag, Space, Button, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

export default function useEmployee() {
    const { notification } = App.useApp();

    // API Hooks
    const [getRequest, getFeedback] = useGet();
    const [postRequest, postFeedback] = usePost("employee");
    const [putRequest, putFeedback] = usePut("employee");
    const [deleteRequest, deleteFeedback] = useDelete("employee");
    
    // States
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalRows, setTotalRows] = useState(0);
    const debounceRef = useRef(null);

    // Modal States
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    // Dropdown States
    const [ccows, setCcows] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [jabatans, setJabatans] = useState([]);

    const fetchItems = useCallback(async (params = {}) => {
        try {
            const res = await getRequest({
                ...params,
                page: (params.pageIndex !== undefined ? params.pageIndex : pagination.pageIndex) + 1,
                limit: params.pageSize || pagination.pageSize,
                search: params.search !== undefined ? params.search : searchText,
            }, "employee");
            
            if (res.data?.meta?.status === 'success') {
                setData(res.data.result.data);
                setTotalRows(res.data.result.total);
            }
        } catch (error) {
            notification.error({ message: "Gagal mengambil data karyawan" });
        }
    }, [getRequest, pagination.pageIndex, pagination.pageSize, searchText, notification]);

    const fetchDropdowns = async () => {
        try {
            const [ccowRes, companyRes, deptRes, jabRes] = await Promise.all([
                getRequest({ limit: 100 }, "ccow"),
                getRequest({ limit: 100 }, "company"),
                getRequest({ limit: 100 }, "department"),
                getRequest({ limit: 100 }, "jabatan"),
            ]);

            if (ccowRes.data?.meta?.status === 'success') setCcows(ccowRes.data.result.data);
            if (companyRes.data?.meta?.status === 'success') setCompanies(companyRes.data.result.data);
            if (deptRes.data?.meta?.status === 'success') setDepartments(deptRes.data.result.data);
            if (jabRes.data?.meta?.status === 'success') setJabatans(jabRes.data.result.data);
        } catch (error) {
            console.error("Failed to fetch dropdown data", error);
        }
    };

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
                    description: editingItem ? "Berhasil memperbarui data karyawan" : "Berhasil menambah data karyawan"
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
                notification.success({ message: "Data karyawan berhasil dihapus" });
                setIsDeleteModalVisible(false);
                setItemToDelete(null);
                fetchItems();
            }
        } catch (error) {
            notification.error({ message: "Gagal menghapus data" });
        }
    };

    const columns = useMemo(() => [
        {
            header: "KARYAWAN",
            accessorKey: "name",
            cell: ({ row }) => (
                <div>
                    <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{row.original.name}</div>
                    <Text type="secondary" style={{ fontSize: 11 }}>NIK: {row.original.nik}</Text>
                </div>
            )
        },
        {
            header: "JABATAN / DEPT",
            accessorKey: "jabatan",
            cell: ({ row }) => (
                <div>
                    <div style={{ fontSize: 13 }}>{row.original.jabatan?.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{row.original.department?.name}</div>
                </div>
            )
        },
        {
            header: "COMPANY",
            accessorKey: "company",
            cell: ({ row }) => (
                <div style={{ fontSize: 13 }}>{row.original.company?.name}</div>
            )
        },
        {
            header: "CCOW",
            accessorKey: "ccow",
            cell: ({ row }) => (
                <div style={{ fontSize: 13 }}>{row.original.ccow?.name || "-"}</div>
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

    useEffect(() => {
        fetchDropdowns();
    }, []);

    return {
        table,
        data,
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
        fetchItems,
        dropdowns: {
            ccows,
            companies,
            departments,
            jabatans
        }
    };
}
