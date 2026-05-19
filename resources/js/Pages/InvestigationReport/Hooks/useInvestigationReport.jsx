import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { App, Input } from "antd";
import { SaveOutlined, SendOutlined, RollbackOutlined } from "@ant-design/icons";
import axios from "axios";
import TokenManager from "@/Utils/TokenManager";
import { useGet, useDelete } from "@/Helpers/useRequest";

export default function useInvestigationReport(initialReports = []) {
    const { auth } = usePage().props;
    const permissions = auth?.user?.permissions || [];
    const isAdministrator = auth?.user?.is_administrator || false;
    const userRoles = (auth?.user?.roles || []).map(r => r.toLowerCase());

    const canCreate = isAdministrator || permissions.includes("investigation-report.create") || userRoles.includes("crs") || userRoles.includes("mitra kerja") || userRoles.includes("dept ohs") || userRoles.includes("dept env");
    const canEdit = isAdministrator || permissions.includes("investigation-report.edit") || userRoles.includes("crs") || userRoles.includes("dept ohs") || userRoles.includes("dept env");
    const canDelete = isAdministrator || permissions.includes("investigation-report.delete") || userRoles.includes("crs");
    
    // Check if user is an approver at any level
    const canApprove = isAdministrator || auth?.user?.can_approve || userRoles.includes("ktt") || userRoles.includes("ohs_dh") || userRoles.includes("env_dh") || userRoles.includes("pja") || userRoles.includes("crs");

    const { notification, modal } = App.useApp();

    // API Hooks
    const [getRequest] = useGet();
    const [deleteRequest] = useDelete("investigation-report");

    // List States
    const [data, setData] = useState(initialReports);
    const [searchText, setSearchText] = useState("");
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [totalRows, setTotalRows] = useState(initialReports.length);
    const debounceRef = useRef(null);

    // Modal & CRUD States
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState("add"); // 'add', 'edit', 'detail'
    const [editingItem, setEditingItem] = useState(null);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [loading, setLoading] = useState(false);

    // Form Specific States
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isEnvironmental, setIsEnvironmental] = useState(false);
    const [investigationDetail, setInvestigationDetail] = useState("");
    const [rootCauseAnalysis, setRootCauseAnalysis] = useState("");
    const [correctiveActions, setCorrectiveActions] = useState([]); // Array of { action, pic, target_date, status }
    const [preventiveAction, setPreventiveAction] = useState("");
    const [fileList, setFileList] = useState([]);

    // Fetching Data
    const fetchItems = useCallback(
        async (params = {}) => {
            setLoading(true);
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
                    "investigation-report",
                );

                if (res.data?.meta?.status === "success" || res.status === 200) {
                    setData(res.data.result.data || []);
                    setTotalRows(res.data.result.total || 0);
                }
            } catch (error) {
                notification.error({
                    message: "Gagal mengambil data LPKS/LPKL",
                });
            } finally {
                setLoading(false);
            }
        },
        [getRequest, pagination.pageIndex, pagination.pageSize, searchText, notification],
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

    const handleDetail = (record) => {
        setEditingItem(record);
        setModalMode("detail");
        syncFormWithData(record);
        setIsModalVisible(true);
    };

    const showDeleteModal = (record) => {
        setItemToDelete(record);
        setIsDeleteModalVisible(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        setLoading(true);
        try {
            const response = await deleteRequest(itemToDelete.id);
            if (response.data?.meta?.status === "success") {
                notification.success({
                    message: "Laporan LPKS/LPKL berhasil dihapus",
                });
                setIsDeleteModalVisible(false);
                setItemToDelete(null);
                fetchItems();
            }
        } catch (error) {
            notification.error({ message: "Gagal menghapus data" });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setSelectedNotification(null);
        setIsEnvironmental(false);
        setInvestigationDetail("");
        setRootCauseAnalysis("");
        setCorrectiveActions([]);
        setPreventiveAction("");
        setFileList([]);
    };

    const syncFormWithData = (record) => {
        setSelectedNotification(record.accident_notification || null);
        setIsEnvironmental(!!record.is_environmental);
        setInvestigationDetail(record.investigation_detail || "");
        setRootCauseAnalysis(record.root_cause_analysis || "");
        setCorrectiveActions(record.corrective_action_plan || []);
        setPreventiveAction(record.preventive_action || "");

        if (record.documents) {
            setFileList(
                record.documents.map((doc) => ({
                    uid: doc.id,
                    name: doc.filename,
                    status: "done",
                    url: `${window.location.origin}/storage/${doc.path.replace(/\\/g, "/")}`,
                    size: doc.file_size,
                    type: doc.file_type,
                }))
            );
        } else {
            setFileList([]);
        }
    };

    const buildFormData = (values, statusIntent) => {
        const fd = new FormData();
        const isDraft = statusIntent === "draft";

        fd.append("accident_notification_id", selectedNotification?.id || "");
        fd.append("report_type", values.report_type || "LPKS");
        fd.append("is_environmental", isEnvironmental ? 1 : 0);
        fd.append("investigation_detail", investigationDetail || "");
        fd.append("root_cause_analysis", rootCauseAnalysis || "");
        fd.append("preventive_action", preventiveAction || "");
        fd.append("safe_draft", isDraft ? 1 : 0);

        // Corrective actions list (PICA)
        correctiveActions.forEach((item, index) => {
            fd.append(`corrective_action_plan[${index}][action]`, item.action || "");
            fd.append(`corrective_action_plan[${index}][pic]`, item.pic || "");
            fd.append(`corrective_action_plan[${index}][target_date]`, item.target_date || "");
            fd.append(`corrective_action_plan[${index}][status]`, item.status || "Open");
        });

        // Supporting documents
        fileList.forEach((file) => {
            if (file.originFileObj) {
                fd.append("documents[]", file.originFileObj);
            } else {
                fd.append("existing_documents[]", file.uid);
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
                ? `/api/investigation-report/${editingItem.id}`
                : `/api/investigation-report`;

            if (isEditing) fd.append("_method", "PUT");

            const response = await axios({
                method: "POST",
                url: url,
                data: fd,
                timeout: 30000,
                headers: {
                    Authorization: "Bearer " + TokenManager.getToken(),
                    Accept: "application/json",
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data?.meta?.status === "success" || response.status === 200 || response.status === 201) {
                notification.success({
                    message: "Berhasil",
                    description: isEditing ? "Laporan berhasil diperbarui" : "Laporan berhasil disimpan",
                });
                setIsModalVisible(false);
                fetchItems();
                // reload current page since Inertia might have loaded approved list
                window.location.reload();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Save Error:", error);
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                const errorList = Object.values(validationErrors).flat();
                notification.error({
                    message: "Validasi Gagal",
                    description: (
                        <ul style={{ paddingLeft: 16, margin: 0 }}>
                            {errorList.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    ),
                    duration: 5,
                });
            } else {
                notification.error({
                    message: "Gagal Menyimpan Laporan",
                    description: error.response?.data?.message || "Terjadi kesalahan server.",
                });
            }
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (form, statusIntent) => {
        try {
            const values = await form.validateFields();
            if (!selectedNotification) {
                notification.warning({
                    message: "Notifikasi Belum Dipilih",
                    description: "Silakan pilih nomor notifikasi kecelakaan terlebih dahulu.",
                });
                return false;
            }

            const isDraft = statusIntent === "draft";
            return new Promise((resolve) => {
                modal.confirm({
                    title: (
                        <div style={{ fontSize: 18, fontWeight: 900, color: "#1e293b", letterSpacing: "-0.5px" }}>
                            {isDraft ? "SIMPAN SEBAGAI DRAFT" : "KIRIM LAPORAN PENYELIDIKAN"}
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
                                    ? "Apakah Anda yakin ingin menyimpan laporan penyelidikan ini sebagai draf?"
                                    : "Laporan yang dikirim akan segera didistribusikan untuk proses approval berjenjang. Pastikan semua data investigasi terisi lengkap."}
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
            if (error?.errorFields) {
                notification.warning({
                    message: "Data Belum Lengkap",
                    description: "Mohon periksa kembali inputan Anda yang wajib diisi.",
                });
            }
            return false;
        }
    };

    const handleApprove = async (record, level, comment, tickBox) => {
        setLoading(true);
        try {
            const response = await axios({
                method: "POST",
                url: `/api/investigation-report/${record.id}/approve`,
                data: {
                    approval_level: level,
                    comment,
                    tick_box: tickBox ? 1 : 0
                },
                headers: {
                    Authorization: "Bearer " + TokenManager.getToken(),
                    Accept: "application/json",
                },
            });

            if (response.data?.meta?.status === "success") {
                notification.success({
                    message: "Persetujuan Berhasil",
                    description: `Laporan berhasil disetujui pada level ${level}`,
                });
                setIsModalVisible(false);
                fetchItems();
                window.location.reload();
                return true;
            }
        } catch (error) {
            notification.error({
                message: "Gagal Menyetujui Laporan",
                description: error.response?.data?.message || "Terjadi kesalahan server.",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (record, level, comment) => {
        if (!comment) {
            notification.warning({
                message: "Komentar Wajib Diisi",
                description: "Silakan masukkan alasan pengembalian laporan.",
            });
            return false;
        }
        setLoading(true);
        try {
            const response = await axios({
                method: "POST",
                url: `/api/investigation-report/${record.id}/return`,
                data: {
                    approval_level: level,
                    comment
                },
                headers: {
                    Authorization: "Bearer " + TokenManager.getToken(),
                    Accept: "application/json",
                },
            });

            if (response.data?.meta?.status === "success") {
                notification.success({
                    message: "Laporan Dikembalikan",
                    description: `Laporan berhasil dikembalikan dari level ${level}.`,
                });
                setIsModalVisible(false);
                fetchItems();
                window.location.reload();
                return true;
            }
        } catch (error) {
            notification.error({
                message: "Gagal Mengembalikan Laporan",
                description: error.response?.data?.message || "Terjadi kesalahan server.",
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        searchText,
        handleSearchChange,
        isModalVisible,
        setIsModalVisible,
        modalMode,
        canCreate,
        canEdit,
        canDelete,
        canApprove,
        handleAdd,
        handleEdit,
        handleDetail,
        handleSave,
        isDeleteModalVisible,
        setIsDeleteModalVisible,
        handleConfirmDelete,
        itemToDelete,
        editingItem,
        totalRows,
        fetchItems,
        
        // Form states
        selectedNotification,
        setSelectedNotification,
        isEnvironmental,
        setIsEnvironmental,
        investigationDetail,
        setInvestigationDetail,
        rootCauseAnalysis,
        setRootCauseAnalysis,
        correctiveActions,
        setCorrectiveActions,
        preventiveAction,
        setPreventiveAction,
        fileList,
        setFileList,

        // Actions
        handleApprove,
        handleReturn,
    };
}
