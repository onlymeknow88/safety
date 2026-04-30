import { App, Button, Space, Tag, Typography } from "antd";
import { SaveOutlined, SendOutlined, DeleteOutlined, EditOutlined, FilePdfOutlined } from "@ant-design/icons";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDelete, useGet } from "@/Helpers/useRequest";

import TokenManager from "@/Utils/TokenManager";
import axios from "axios";
import dayjs from "dayjs";

const { Text } = Typography;

export default function useAccidentNotification(master = {}) {
    const { notification, modal } = App.useApp();

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
    const [modalMode, setModalMode] = useState("add"); // 'add', 'edit', 'detail'
    const [editingItem, setEditingItem] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
    const [previewRecord, setPreviewRecord] = useState(null);

    // Detail View Handler
    const handleDetail = (record) => {
        setEditingItem(record);
        setModalMode("detail");
        syncFormWithData(record);
        setIsModalVisible(true);
    };

    // Form Specific States
    const [isHpri, setIsHpri] = useState(false);
    const [severity, setSeverity] = useState({
        actual_k3: null,
        actual_kk: null,
        actual_lh: null,
        actual_ksl: null,
        actual_pp: null,
        potential_k3: null,
        potential_kk: null,
        potential_lh: null,
        potential_ksl: null,
        potential_pp: null,
    });
    const [incidentFacts, setIncidentFacts] = useState([""]);
    const [correctiveActions, setCorrectiveActions] = useState([""]);
    const [fileList, setFileList] = useState([]);

    // Fetching Data
    const fetchItems = useCallback(
        async (params = {}) => {
            try {
                const res = await getRequest(
                    {
                        ...params,
                        page:
                            (params.pageIndex !== undefined
                                ? params.pageIndex
                                : pagination.pageIndex) + 1,
                        load: params.pageSize || pagination.pageSize,
                        search:
                            params.search !== undefined
                                ? params.search
                                : searchText,
                    },
                    "accident-notification",
                );

                if (
                    res.data?.meta?.status === "success" ||
                    res.status === 200
                ) {
                    setData(res.data.result.data || []);
                    setTotalRows(res.data.result.total || 0);
                }
            } catch (error) {
                notification.error({
                    message: "Gagal mengambil data notifikasi kecelakaan",
                });
            }
        },
        [
            getRequest,
            pagination.pageIndex,
            pagination.pageSize,
            searchText,
            notification,
        ],
    );

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
        setModalMode("add");
        resetForm();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingItem(record);
        setModalMode("edit");
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
            if (response.data?.meta?.status === "success") {
                notification.success({
                    message: "Notifikasi kecelakaan berhasil dihapus",
                });
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
            actual_k3: null,
            actual_kk: null,
            actual_lh: null,
            actual_ksl: null,
            actual_pp: null,
            potential_k3: null,
            potential_kk: null,
            potential_lh: null,
            potential_ksl: null,
            potential_pp: null,
        });
        setIncidentFacts([""]);
        setCorrectiveActions([""]);
        setFileList([]);
    };

    const syncFormWithData = (record) => {
        setIsHpri(record.is_hpri);
        setSeverity({
            actual_k3: record.actual_k3,
            actual_kk: record.actual_kk,
            actual_lh: record.actual_lh,
            actual_ksl: record.actual_ksl,
            actual_pp: record.actual_pp,
            potential_k3: record.potential_k3,
            potential_kk: record.potential_kk,
            potential_lh: record.potential_lh,
            potential_ksl: record.potential_ksl,
            potential_pp: record.potential_pp,
        });
        setIncidentFacts(record.incident_facts || [""]);
        setCorrectiveActions(record.corrective_actions || [""]);

        if (record.photos) {
            setFileList(
                record.photos.map((p) => ({
                    uid: p.id,
                    name: p.filename,
                    status: "done",
                    url: `${window.location.origin}/storage/${p.path.replace(/\\/g, "/")}`,
                })),
            );
        } else {
            setFileList([]);
        }
    };

    const handleDownloadPdf = (record) => {
        const token = TokenManager.getToken();
        const url = `/api/accident-notification/${record.id}/export-pdf?token=${token}`;
        window.open(url, "_blank");
    };

    const handlePreviewPdf = (record) => {
        setPreviewRecord(record);
        setIsPreviewModalVisible(true);
    };

    const buildFormData = (values, statusIntent) => {
        const fd = new FormData();

        // Map status
        const statusName = statusIntent === "draft" ? "Draft" : "Submitted";
        const statusObj = master.statuses?.find(
            (s) => s.name.toLowerCase() === statusName.toLowerCase(),
        );
        if (statusObj) fd.append("status_id", statusObj.id);

        fd.append("is_hpri", isHpri ? 1 : 0);
        Object.entries(severity).forEach(([k, v]) => {
            if (v !== null) fd.append(k, v);
        });
        incidentFacts
            .filter((f) => f.trim() !== "")
            .forEach((f, i) => fd.append(`incident_facts[${i}]`, f));
        correctiveActions
            .filter((a) => a.trim() !== "")
            .forEach((a, i) => fd.append(`corrective_actions[${i}]`, a));
        fileList.forEach((file) => {
            if (file.originFileObj) fd.append("photos[]", file.originFileObj);
        });

        Object.entries(values).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
                if (v instanceof Date)
                    fd.append(k, v.toISOString().split("T")[0]);
                else if (typeof v === "object" && v?.format) {
                    fd.append(
                        k,
                        k.includes("time")
                            ? v.format("HH:mm:ss")
                            : v.format("YYYY-MM-DD"),
                    );
                } else fd.append(k, v);
            }
        });
        return fd;
    };

    const executeSave = async (values, statusIntent) => {
        const fd = buildFormData(values, statusIntent);
        const isEditing = !!editingItem;
        setLoading(true);

        try {
            const url = isEditing
                ? `/api/accident-notification/${editingItem.id}`
                : `/api/accident-notification`;
            
            if (isEditing) fd.append("_method", "PUT");

            const response = await axios({
                method: "POST",
                url: url,
                data: fd,
                timeout: 30000, // Batasan waktu 30 detik
                headers: {
                    Authorization: "Bearer " + TokenManager.getToken(),
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            });

            if (
                response.data?.meta?.status === "success" ||
                response.status === 200 ||
                response.status === 201
            ) {
                notification.success({
                    message: "Berhasil",
                    description: isEditing
                        ? "Data berhasil diperbarui"
                        : "Data berhasil disimpan",
                });
                setIsModalVisible(false);
                fetchItems();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Save Error:", error);
            
            if (error.code === 'ECONNABORTED') {
                notification.error({
                    message: 'Request Timeout',
                    description: 'Koneksi ke server terlalu lambat. Silakan coba lagi atau cek koneksi internet Anda.'
                });
            } else if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorList = Object.values(validationErrors).flat();
                
                notification.error({
                    message: 'Validasi Gagal',
                    description: (
                        <ul style={{ paddingLeft: 16, margin: 0 }}>
                            {errorList.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    ),
                    duration: 5,
                });
            } else {
                notification.error({ 
                    message: 'Gagal Menyimpan', 
                    description: error.response?.data?.message || 'Terjadi kesalahan pada server atau koneksi terputus.',
                    duration: 4,
                });
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (form, statusIntent) => {
        try {
            // Validasi di sisi frontend dulu
            const values = await form.validateFields();
            const isDraft = statusIntent === "draft";

            // Gunakan Promise untuk menunggu interaksi user di modal
            return new Promise((resolve) => {
                modal.confirm({
                    title: (
                        <div style={{ fontSize: 18, fontWeight: 900, color: "#1e293b", letterSpacing: "-0.5px" }}>
                            {isDraft ? "SIMPAN SEBAGAI DRAFT" : "KIRIM NOTIFIKASI"}
                        </div>
                    ),
                    icon: isDraft ? (
                        <SaveOutlined style={{ color: "#2563eb" }} />
                    ) : (
                        <SendOutlined style={{ color: "#059669" }} />
                    ),
                    content: (
                        <div style={{ marginTop: 8 }}>
                            <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6 }}>
                                {isDraft
                                    ? "Apakah Anda yakin ingin menyimpan laporan ini sebagai draf?"
                                    : "Laporan yang telah dikirim akan segera diproses. Pastikan data sudah benar."}
                            </p>
                        </div>
                    ),
                    okText: isDraft ? "Ya, Simpan" : "Ya, Kirim",
                    cancelText: "Batal",
                    okButtonProps: {
                        style: {
                            borderRadius: 8,
                            fontWeight: 700,
                            background: isDraft ? "#2563eb" : "#059669",
                            border: "none",
                            height: 40,
                        },
                    },
                    cancelButtonProps: {
                        style: { borderRadius: 8, fontWeight: 600, height: 40 },
                    },
                    centered: true,
                    onOk: async () => {
                        const result = await executeSave(values, statusIntent);
                        resolve(result);
                    },
                    onCancel: () => {
                        resolve(false);
                    },
                });
            });
        } catch (error) {
            // Jika validasi form antd gagal (bukan server error)
            if (error?.errorFields) {
                notification.warning({
                    message: "Data Belum Lengkap",
                    description: "Mohon periksa kembali inputan Anda yang berwarna merah.",
                });
            }
            return false;
        }
    };

    // Columns Managed by TanStack
    const columns = useMemo(
        () => [
            {
                header: "NO",
                id: "rowNumber",
                id: "row_number",
                cell: ({ row }) =>
                    pagination.pageIndex * pagination.pageSize + row.index + 1,
                meta: { align: "center", width: 60 },
            },
            {
                header: "NO. INVESTASI (IR)",
                accessorKey: "accident_number",
                cell: ({ row }) => (
                    <Text strong style={{ color: "#ef4444" }}>
                        {row.original.accident_number || "-"}
                    </Text>
                ),
                meta: { width: 150 },
            },
            {
                header: "NO. NOTIFIKASI (NI)",
                accessorKey: "notification_number",
                cell: ({ row }) => (
                    <Text 
                        strong 
                        style={{ color: "#2563eb", cursor: "pointer" }}
                        onClick={() => handleDetail(row.original)}
                    >
                        {row.original.notification_number || "-"}
                    </Text>
                ),
                meta: { width: 150 },
            },
            {
                header: "NO HSE ALERT",
                accessorKey: "hse_alert_no",
                cell: ({ row }) => row.original.hse_alert_no || "-",
                meta: { width: 150 },
            },
            {
                header: "CCOW",
                accessorKey: "ccow.name",
                cell: ({ row }) => row.original.ccow?.name || "-",
                meta: { width: 150 },
            },
            {
                header: "TANGGAL KEJADIAN",
                accessorKey: "incident_date",
                cell: ({ row }) => row.original.incident_date ? dayjs(row.original.incident_date).format('DD/MM/YYYY') : "-",
                meta: { width: 150, align: "center" },
            },
            {
                header: "TANGGAL PELAPORAN KEPADA KaIT / Kadis a/n KaIT",
                accessorKey: "kait_reporting_date",
                cell: ({ row }) => row.original.kait_reporting_date ? dayjs(row.original.kait_reporting_date).format('DD/MM/YYYY') : "N/A",
                meta: { width: 220, align: "center" },
            },
            {
                header: "HARI",
                id: "incident_day",
                cell: ({ row }) => {
                    if (!row.original.incident_date) return "-";
                    const days = {
                        'Sunday': 'Minggu', 'Monday': 'Senin', 'Tuesday': 'Selasa', 
                        'Wednesday': 'Rabu', 'Thursday': 'Kamis', 'Friday': 'Jumat', 'Saturday': 'Sabtu'
                    };
                    return days[dayjs(row.original.incident_date).format('dddd')] || "-";
                },
                meta: { width: 100, align: "center" },
            },
            {
                header: "JAM (hh:ss)",
                accessorKey: "incident_time",
                cell: ({ row }) =>
                    row.original.incident_time
                        ? row.original.incident_time.substring(0, 5)
                        : "-",
                meta: { width: 100, align: "center" },
            },
            {
                header: "KRITERIA WAKTU KECELAKAAN",
                id: "time_criteria",
                cell: ({ row }) => {
                    const time = row.original.incident_time;
                    if (!time) return "-";
                    const hour = parseInt(time.split(':')[0]);
                    
                    if (hour >= 0 && hour < 3) return "00.01 - 03.00";
                    if (hour >= 3 && hour < 6) return "03.01 - 06.00";
                    if (hour >= 6 && hour < 9) return "06.01 - 09.00";
                    if (hour >= 9 && hour < 12) return "09.01 - 12.00";
                    if (hour >= 12 && hour < 15) return "12.01 - 15.00";
                    if (hour >= 15 && hour < 18) return "15.01 - 18.00";
                    if (hour >= 18 && hour < 21) return "18.01 - 21.00";
                    return "21.01 - 00.00";
                },
                meta: { width: 180, align: "center" },
            },
            {
                header: "LOKASI",
                accessorKey: "location.name",
                cell: ({ row }) => row.original.location?.name || "-",
                meta: { width: 150 },
            },
            {
                header: "LOKASI DETAIL",
                accessorKey: "location_detail",
                cell: ({ row }) => (
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#475569' }}>
                        {row.original.location_detail || "-"}
                    </div>
                ),
                meta: { width: 200 },
            },
            {
                header: "JUDUL INSIDEN (40 KARAKTER)",
                accessorKey: "incident_title",
                cell: ({ row }) => row.original.incident_title || "-",
                meta: { width: 250 },
            },
            {
                header: "AKIBAT INSIDEN",
                accessorKey: "incident_consequence",
                cell: ({ row }) => row.original.incident_consequence || "-",
                meta: { width: 250 },
            },
            {
                header: "NAMA KORBAN/ ORANG YANG TERLIBAT DALAM INSIDEN",
                accessorKey: "victim_name",
                cell: ({ row }) => row.original.victim_name || "-",
                meta: { width: 250 },
            },
            {
                header: "JENIS KELAMIN",
                accessorKey: "victim_gender.name",
                cell: ({ row }) => row.original.victim_gender?.name || "-",
                meta: { width: 120, align: "center" },
            },
            {
                header: "UMUR",
                accessorKey: "victim_age",
                cell: ({ row }) => row.original.victim_age || "-",
                meta: { width: 80, align: "center" },
            },
            {
                header: "INTERVAL UMUR",
                accessorKey: "victim_age_interval.label",
                cell: ({ row }) => row.original.victim_age_interval?.label || "-",
                meta: { width: 150, align: "center" },
            },
            {
                header: "POSISI / JABATAN",
                accessorKey: "victim_position.name",
                cell: ({ row }) => row.original.victim_position?.name || "-",
                meta: { width: 150 },
            },
            {
                header: "DETAIL POSISI / JABATAN",
                accessorKey: "victim_position_detail",
                cell: ({ row }) => row.original.victim_position_detail || "-",
                meta: { width: 180 },
            },
            {
                header: "PENGALAMAN BEKERJA",
                accessorKey: "victim_experience.label",
                cell: ({ row }) => row.original.victim_experience?.label || "-",
                meta: { width: 180 },
            },
            {
                header: "DEPARTEMEN / DEPARTEMEN USER",
                accessorKey: "department.name",
                cell: ({ row }) => row.original.department?.name || "-",
                meta: { width: 180 },
            },
            {
                header: "PERUSAHAAN",
                accessorKey: "company.name",
                cell: ({ row }) => row.original.company?.name || "-",
                meta: { width: 180 },
            },
            {
                header: "JENIS INSIDEN / KECELAKAAN",
                id: "incident_type_group",
                columns: [
                    {
                        header: "DETAIL TIPE INSIDEN / KECELAKAAN",
                        accessorKey: "incident_type.description",
                        cell: ({ row }) => row.original.incident_type?.description || "-",
                        meta: { width: 200 },
                    },
                    {
                        header: "HPRI",
                        accessorKey: "is_hpri",
                        cell: ({ row }) => (
                            <Text strong color={row.original.is_hpri ? "red" : "default"}>
                                {row.original.is_hpri ? "HPRI" : "NON HPRI"}
                            </Text>
                        ),
                        meta: { align: "center", width: 120 },
                    },
                ],
            },
            {
                header: "AKIBAT INSIDEN / KECELAKAAN",
                id: "consequence_group",
                columns: [
                    {
                        header: "HARI HILANG (HARI)",
                        accessorKey: "lost_days",
                        cell: ({ row }) => row.original.lost_days ?? "-",
                        meta: { align: "center", width: 120 },
                    },
                    {
                        header: "BIAYA KERUGIAN AKTUAL (IDR)",
                        accessorKey: "actual_cost",
                        cell: ({ row }) => row.original.actual_cost ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(row.original.actual_cost) : "-",
                        meta: { align: "right", width: 180 },
                    },
                    {
                        header: "BIAYA KERUGIAN POTENSIAL (IDR)",
                        accessorKey: "potential_cost",
                        cell: ({ row }) => row.original.potential_cost ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(row.original.potential_cost) : "-",
                        meta: { align: "right", width: 180 },
                    },
                ],
            },
            {
                header: "PELAPORAN",
                id: "reporting_group",
                columns: [
                    {
                        header: "LPKS / LPKL",
                        accessorKey: "lpks_lpkl",
                        cell: ({ row }) => row.original.lpks_lpkl || "-",
                        meta: { width: 120, align: "center" },
                    },
                    {
                        header: "DUE DATE",
                        accessorKey: "due_date",
                        cell: ({ row }) => row.original.due_date ? dayjs(row.original.due_date).format('DD/MM/YYYY') : "-",
                        meta: { width: 120, align: "center" },
                    },
                    {
                        header: "TANGGAL PRESENTASI",
                        accessorKey: "presentation_date",
                        cell: ({ row }) => row.original.presentation_date ? dayjs(row.original.presentation_date).format('DD/MM/YYYY') : "-",
                        meta: { width: 160, align: "center" },
                    },
                    {
                        header: "SUBMIT DATE",
                        accessorKey: "submit_date",
                        cell: ({ row }) => row.original.submit_date ? dayjs(row.original.submit_date).format('DD/MM/YYYY') : "-",
                        meta: { width: 120, align: "center" },
                    },
                    {
                        header: "STATUS",
                        accessorKey: "report_status",
                        cell: ({ row }) => {
                            const status = row.original.report_status;
                            if (!status) return "-";
                            const isOverdue = status.toLowerCase().includes('overdue');
                            return (
                                <Tag color={isOverdue ? "orange" : "blue"} style={{ borderRadius: 4, fontWeight: 700 }}>
                                    {status.toUpperCase()}
                                </Tag>
                            );
                        },
                        meta: { width: 150, align: "center" },
                    },
                ],
            },
            {
                header: "UNDANGAN PRESENTASI",
                accessorKey: "presentation_invitation",
                cell: ({ row }) => {
                    const val = row.original.presentation_invitation;
                    if (!val) return "-";
                    return (
                        <Tag color={val === 'DONE' ? 'green' : 'default'} style={{ borderRadius: 4, fontWeight: 800 }}>
                            {val}
                        </Tag>
                    );
                },
                meta: { width: 180, align: "center" },
            },
            {
                header: "STATUS LAPORAN",
                accessorKey: "status.name",
                cell: ({ row }) => {
                    const statusName =
                        row.original.status?.name?.toLowerCase() || "";
                    let color = "default";
                    if (statusName === "draft") color = "orange";
                    else if (statusName === "submitted") color = "blue";
                    else if (statusName === "approved") color = "green";
                    return (
                        <Tag
                            color={color}
                            style={{ borderRadius: 6, fontWeight: 800 }}
                        >
                            {row.original.status?.name?.toUpperCase() || "-"}
                        </Tag>
                    );
                },
                meta: { width: 140, align: "center" },
            },
            {
                header: "AKSI",
                id: "actions",
                cell: ({ row }) => (
                    <Space>
                        <Button
                            size="small"
                            type="primary"
                            ghost
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(row.original)}
                        />
                        <Button
                            size="small"
                            style={{ color: '#dc2626', borderColor: '#fee2e2', background: '#fef2f2' }}
                            icon={<FilePdfOutlined />}
                            onClick={() => handlePreviewPdf(row.original)}
                        />
                        <Button
                            size="small"
                            danger
                            ghost
                            icon={<DeleteOutlined />}
                            onClick={() => showDeleteModal(row.original)}
                        />
                    </Space>
                ),
                meta: { align: "center" },
            },
        ],
        [
            pagination.pageIndex,
            pagination.pageSize,
            master.statuses,
            handleEdit,
            handleDetail,
        ],
    );

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
        data,
        searchText,
        handleSearchChange,
        isModalVisible,
        setIsModalVisible,
        modalMode,
        handleDetail,
        handleAdd,
        handleEdit,
        handleSave,
        isDeleteModalVisible,
        setIsDeleteModalVisible,
        showDeleteModal,
        handleConfirmDelete,
        itemToDelete,
        editingItem,
        totalRows,
        fetchItems,
        loading,
        isHpri,
        setIsHpri,
        severity,
        setSeverity,
        incidentFacts,
        setIncidentFacts,
        correctiveActions,
        setCorrectiveActions,
        fileList,
        setFileList,
        isPreviewModalVisible,
        setIsPreviewModalVisible,
        previewRecord,
        handlePreviewPdf,
        handleDownloadPdf,
    };
}
