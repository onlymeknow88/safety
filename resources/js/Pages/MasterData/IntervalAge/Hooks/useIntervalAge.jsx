import { App, Button, Space, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDelete, useGet, usePost, usePut } from "@/Helpers/useRequest";

export default function useIntervalAge() {
    const { notification } = App.useApp();
    const [getRequest, getFeedback] = useGet();
    const [postRequest] = usePost("interval-age");
    const [putRequest] = usePut("interval-age");
    const [deleteRequest] = useDelete("interval-age");

    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 50 });
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
            }, "interval-age");
            if (res.data?.meta?.status === 'success') {
                setData(res.data.result.data);
                setTotalRows(res.data.result.total);
            }
        } catch (error) { notification.error({ message: "Gagal" }); }
    }, [getRequest, pagination, searchText, notification]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchItems({ search: value, pageIndex: 0 }), 400);
    };

    const columns = useMemo(() => [
        { header: "LABEL USIA", accessorKey: "label", cell: ({ row }) => <span style={{ fontWeight: 600 }}>{row.original.label}</span> },
        { header: "STATUS", accessorKey: "is_active", cell: ({ row }) => <Tag color={row.original.is_active ? "green" : "red"}>{row.original.is_active ? "ACTIVE" : "INACTIVE"}</Tag> },
        { id: "actions", header: "AKSI", cell: ({ row }) => (
            <Space>
                <Button type="text" icon={<EditOutlined style={{ color: "#2563eb" }} />} onClick={() => { setEditingItem(row.original); setIsModalVisible(true); }} />
                <Button type="text" icon={<DeleteOutlined style={{ color: "#ef4444" }} />} onClick={() => { setItemToDelete(row.original); setIsDeleteModalVisible(true); }} />
            </Space>
        ), meta: { align: "right" } }
    ], []);

    const table = useReactTable({ data, columns, state: { pagination }, onPaginationChange: setPagination, manualPagination: true, rowCount: totalRows, getCoreRowModel: getCoreRowModel(), getPaginationRowModel: getPaginationRowModel() });

    useEffect(() => { fetchItems(); }, [pagination]);

    return { table, loading: getFeedback.loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd: () => { setEditingItem(null); setIsModalVisible(true); }, handleOk: async (v) => {
        try {
            const res = editingItem ? await putRequest(v, editingItem.id) : await postRequest(v);
            if (res.data?.meta?.status === 'success') { notification.success({ message: "Berhasil" }); setIsModalVisible(false); fetchItems(); }
        } catch (e) { notification.error({ message: "Gagal" }); }
    }, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete: async () => {
        try {
            const res = await deleteRequest(itemToDelete.id);
            if (res.data?.meta?.status === 'success') { notification.success({ message: "Berhasil dihapus" }); setIsDeleteModalVisible(false); fetchItems(); }
        } catch (e) { notification.error({ message: "Gagal" }); }
    }, itemToDelete, editingItem, totalRows, fetchItems };
}
