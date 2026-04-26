import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { 
    useReactTable, 
    getCoreRowModel, 
    getPaginationRowModel,
} from "@tanstack/react-table";
import axios from "axios";
import TokenManager from "@/Utils/TokenManager";
import { useGet, useDelete } from "@/Helpers/useRequest";
import { App, Tag, Space, Button, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

export default function useAccidentNotification(master = {}) {
    const { notification } = App.useApp();

    // API Hooks
    const [getRequest, getFeedback] = useGet();
    const [deleteRequest, deleteFeedback] = useDelete("accident-notification");
    
    // List States
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalRows, setTotalRows] = useState(0);
    const debounceRef = useRef(null);

    // Modal & CRUD States
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form Specific States
    const [isHpri, setIsHpri] = useState(false);
    const [severity, setSeverity] = useState({
        actual_k3: null, actual_kk: null, actual_lh: null, actual_ksl: null, actual_pp: null,
        potential_k3: null, potential_kk: null, potential_lh: null, potential_ksl: null, potential_pp: null,
    });
    const [incidentFacts, setIncidentFacts] = useState(['']);
    const [correctiveActions, setCorrectiveActions] = useState(['']);
    const [fileList, setFileList] = useState([]);

    // Fetching Data
    const fetchItems = useCallback(async (params = {}) => {
        try {
            const res = await getRequest({
                ...params,
                page: (params.pageIndex !== undefined ? params.pageIndex : pagination.pageIndex) + 1,
                load: params.pageSize || pagination.pageSize,
                search: params.search !== undefined ? params.search : searchText,
            }, "accident-notification");
            
            if (res.data?.meta?.status === 'success' || res.status === 200) {
                setData(res.data.result.data || []);
                setTotalRows(res.data.result.total || 0);
            }
        } catch (error) {
            notification.error({ message: "Gagal mengambil data notifikasi kecelakaan" });
        }
    }, [getRequest, pagination.pageIndex, pagination.pageSize, searchText, notification]);

    // Handle Search
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        setPagination((prev) => ({ ...prev, pageIndex: 0 }));
        
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchItems({ search: value, pageIndex: 0 });
        }, 400);
    };

    // CRUD Actions
    const handleAdd = () => {
        setEditingItem(null);
        resetForm();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingItem(record);
        syncFormWithData(record);
        setIsModalVisible(true);
    };

    const showDeleteModal = (record) => {
        setItemToDelete(record);
        setIsDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            const response = await deleteRequest(itemToDelete.id);
            if (response.data?.meta?.status === 'success') {
                notification.success({ message: "Notifikasi kecelakaan berhasil dihapus" });
                setIsDeleteModalVisible(false);
                setItemToDelete(null);
                fetchItems();
            }
        } catch (error) {
            notification.error({ message: "Gagal menghapus data" });
        }
    };

    const resetForm = () => {
        setIsHpri(false);
        setSeverity({
            actual_k3: null, actual_kk: null, actual_lh: null, actual_ksl: null, actual_pp: null,
            potential_k3: null, potential_kk: null, potential_lh: null, potential_ksl: null, potential_pp: null,
        });
        setIncidentFacts(['']);
        setCorrectiveActions(['']);
        setFileList([]);
    };

    const syncFormWithData = (record) => {
        setIsHpri(record.is_hpri);
        setSeverity({
            actual_k3: record.actual_k3, actual_kk: record.actual_kk, actual_lh: record.actual_lh, actual_ksl: record.actual_ksl, actual_pp: record.actual_pp,
            potential_k3: record.potential_k3, potential_kk: record.potential_kk, potential_lh: record.potential_lh, potential_ksl: record.potential_ksl, potential_pp: record.potential_pp,
        });
        setIncidentFacts(record.incident_facts || ['']);
        setCorrectiveActions(record.corrective_actions || ['']);
        
        if (record.photos) {
            setFileList(record.photos.map(p => ({
                uid: p.id,
                name: p.filename,
                status: 'done',
                url: `/storage/${p.path}`,
            })));
        } else {
            setFileList([]);
        }
    };

    const buildFormData = (values, statusIntent) => {
        const fd = new FormData();
        
        // Map status
        const statusName = statusIntent === 'draft' ? 'Draft' : 'Submitted';
        const statusObj = master.statuses?.find(s => s.name.toLowerCase() === statusName.toLowerCase());
        if (statusObj) fd.append('status_id', statusObj.id);

        fd.append('is_hpri', isHpri ? 1 : 0);
        Object.entries(severity).forEach(([k, v]) => { if (v !== null) fd.append(k, v); });
        incidentFacts.filter(f => f.trim() !== '').forEach((f, i) => fd.append(`incident_facts[${i}]`, f));
        correctiveActions.filter(a => a.trim() !== '').forEach((a, i) => fd.append(`corrective_actions[${i}]`, a));
        fileList.forEach((file) => { if (file.originFileObj) fd.append('photos[]', file.originFileObj); });

        Object.entries(values).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
                if (v instanceof Date) fd.append(k, v.toISOString().split('T')[0]);
                else if (typeof v === 'object' && v?.format) {
                    fd.append(k, k.includes('time') ? v.format('HH:mm:ss') : v.format('YYYY-MM-DD'));
                } else fd.append(k, v);
            }
        });
        return fd;
    };

    const handleSave = async (form, statusIntent) => {
        try {
            const values = await form.validateFields();
            const fd = buildFormData(values, statusIntent);
            const isEditing = !!editingItem;
            setLoading(true);

            const url = isEditing ? `/api/accident-notification/${editingItem.id}` : `/api/accident-notification`;
            if (isEditing) fd.append('_method', 'PUT');

            const response = await axios({
                method: 'POST', url: url, data: fd,
                headers: {
                    'Authorization': 'Bearer ' + TokenManager.getToken(),
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data?.meta?.status === 'success' || response.status === 200 || response.status === 201) {
                notification.success({ message: 'Berhasil', description: isEditing ? 'Data berhasil diperbarui' : 'Data berhasil disimpan' });
                setIsModalVisible(false);
                fetchItems();
                return true;
            }
            return false;
        } catch (error) {
            if (error?.errorFields) return false;
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const firstError = Object.values(validationErrors)[0][0];
                notification.error({ message: 'Validasi Gagal', description: firstError });
            } else {
                notification.error({ message: 'Gagal Menyimpan', description: error.response?.data?.message || 'Terjadi kesalahan pada server.' });
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Columns Managed by TanStack
    const columns = useMemo(() => [
        {
            header: "NO",
            id: "rowNumber",
            cell: ({ row }) => pagination.pageIndex * pagination.pageSize + row.index + 1,
            meta: { align: "center", width: 60 }
        },
        {
            header: "NO. INVESTASI (IR)",
            accessorKey: "accident_number",
            cell: ({ row }) => <Text strong style={{ color: "#ef4444" }}>{row.original.accident_number || '-'}</Text>,
            meta: { width: 150 }
        },
        {
            header: "NO. NOTIFIKASI (NI)",
            accessorKey: "notification_number",
            cell: ({ row }) => <Text strong style={{ color: "#2563eb" }}>{row.original.notification_number || '-'}</Text>,
            meta: { width: 150 }
        },
        {
            header: "PERUSAHAAN",
            accessorKey: "company.name",
            cell: ({ row }) => row.original.company?.name || '-',
            meta: { width: 180 }
        },
        {
            header: "AREA",
            accessorKey: "ccow.name",
            cell: ({ row }) => row.original.ccow?.name || '-',
            meta: { width: 150 }
        },
        {
            header: "LOKASI / PIT",
            accessorKey: "location.name",
            cell: ({ row }) => row.original.location?.name || '-',
            meta: { width: 120 }
        },
        {
            header: "LOKASI DETAIL",
            accessorKey: "location_detail",
            cell: ({ row }) => row.original.location_detail || '-',
            meta: { width: 180 }
        },
        {
            header: "TIPE",
            accessorKey: "incident_type.description",
            cell: ({ row }) => row.original.incident_type?.description || '-',
            meta: { width: 120 }
        },
        {
            header: "JAM",
            accessorKey: "incident_time",
            cell: ({ row }) => row.original.incident_time ? row.original.incident_time.substring(0, 5) : '-',
            meta: { width: 80, align: "center" }
        },
        {
            header: "KEPARAHAN AKTUAL",
            id: "actual_severity_group",
            columns: [
                { header: "K3", accessorKey: "actual_k3", meta: { align: "center", width: 60 } },
                { header: "KK", accessorKey: "actual_kk", meta: { align: "center", width: 60 } },
                { header: "LH", accessorKey: "actual_lh", meta: { align: "center", width: 60 } },
                { header: "KSL", accessorKey: "actual_ksl", meta: { align: "center", width: 60 } },
                { header: "PP", accessorKey: "actual_pp", meta: { align: "center", width: 60 } },
            ]
        },
        {
            header: "KEPARAHAN POTENSIAL",
            id: "potential_severity_group",
            columns: [
                { header: "K3", accessorKey: "potential_k3", meta: { align: "center", width: 60 } },
                { header: "KK", accessorKey: "potential_kk", meta: { align: "center", width: 60 } },
                { header: "LH", accessorKey: "potential_lh", meta: { align: "center", width: 60 } },
                { header: "KSL", accessorKey: "potential_ksl", meta: { align: "center", width: 60 } },
                { header: "PP", accessorKey: "potential_pp", meta: { align: "center", width: 60 } },
            ]
        },
        {
            header: "HPRI",
            accessorKey: "is_hpri",
            cell: ({ row }) => <Text strong color={row.original.is_hpri ? "red" : "default"}>{row.original.is_hpri ? "YA" : "TIDAK"}</Text>,
            meta: { align: "center", width: 100 }
        },
        {
            header: "KRONOLOGI",
            accessorKey: "chronology",
            cell: ({ row }) => <div style={{ minWidth: 300, whiteSpace: 'normal' }}>{row.original.chronology || '-'}</div>,
            meta: { width: 400 }
        },
        {
            header: "FAKTA KEJADIAN",
            accessorKey: "incident_facts",
            cell: ({ row }) => (
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {row.original.incident_facts?.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            ),
            meta: { width: 350 }
        },
        {
            header: "AKIBAT KECELAKAAN",
            accessorKey: "consequence",
            cell: ({ row }) => <div style={{ minWidth: 200, whiteSpace: 'normal' }}>{row.original.consequence || '-'}</div>,
            meta: { width: 300 }
        },
        {
            header: "TINDAKAN PERBAIKAN",
            accessorKey: "corrective_actions",
            cell: ({ row }) => (
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {row.original.corrective_actions?.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
            ),
            meta: { width: 350 }
        },
        {
            header: "DILAPORKAN OLEH",
            columns: [
                { header: "NAMA", accessorKey: "reporter_name", meta: { width: 130 } },
                { header: "JABATAN", accessorKey: "reporter_position", meta: { width: 130 } },
            ]
        },
        {
            header: "DISETUJUI OLEH",
            columns: [
                { header: "NAMA", accessorKey: "approver_name", meta: { width: 130 } },
                { header: "JABATAN", accessorKey: "approver_position", meta: { width: 130 } },
            ]
        },
        {
            header: "STATUS",
            accessorKey: "status.name",
            cell: ({ row }) => {
                const statusName = row.original.status?.name?.toLowerCase() || '';
                let color = "default";
                if (statusName === 'draft') color = "orange";
                else if (statusName === 'submitted') color = "blue";
                else if (statusName === 'approved') color = "green";
                return <Tag color={color} style={{ borderRadius: 6, fontWeight: 800 }}>{row.original.status?.name?.toUpperCase() || '-'}</Tag>;
            },
            meta: { width: 140, align: "center" }
        },
        {
            header: "AKSI",
            id: "actions",
            cell: ({ row }) => (
                <Space>
                    <Button size="small" type="primary" ghost icon={<EditOutlined />} onClick={() => handleEdit(row.original)} />
                    <Button size="small" danger ghost icon={<DeleteOutlined />} onClick={() => showDeleteModal(row.original)} />
                </Space>
            ),
            meta: { align: "center" }
        }
    ], [pagination.pageIndex, pagination.pageSize, master.statuses, handleEdit]);

    const table = useReactTable({
        data, columns,
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
        table, data, searchText, handleSearchChange,
        isModalVisible, setIsModalVisible,
        handleAdd, handleEdit, handleSave,
        isDeleteModalVisible, setIsDeleteModalVisible,
        showDeleteModal, handleConfirmDelete,
        itemToDelete, editingItem, totalRows, fetchItems,
        loading, isHpri, setIsHpri, severity, setSeverity,
        incidentFacts, setIncidentFacts, correctiveActions, setCorrectiveActions,
        fileList, setFileList
    };
}
