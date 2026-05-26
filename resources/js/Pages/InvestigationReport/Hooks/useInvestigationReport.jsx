import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { usePage } from "@inertiajs/react";
import { App, Input, Tag, Space, Tooltip, Typography, Button } from "antd";
import { SaveOutlined, SendOutlined, RollbackOutlined, FileTextOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import TokenManager from "@/Utils/TokenManager";
import { useGet, useDelete } from "@/Helpers/useRequest";
import { useTheme } from "@/Contexts/ThemeContext";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";

const { Text } = Typography;


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
    const { isDarkMode } = useTheme();

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

    // Incident Analysis States
    const [incidentTypeId, setIncidentTypeId] = useState(null);
    const [sourceId, setSourceId] = useState(null);
    const [mobileEquipment, setMobileEquipment] = useState("");
    const [workExperienceIntervalId, setWorkExperienceIntervalId] = useState(null);
    const [hourOfShift, setHourOfShift] = useState("");
    const [injuryConditionId, setInjuryConditionId] = useState(null);
    const [bodyPartId, setBodyPartId] = useState(null);
    const [environmentalPollutionQty, setEnvironmentalPollutionQty] = useState(0);
    const [lostDays, setLostDays] = useState(0);
    const [actualCost, setActualCost] = useState(0);
    const [potentialCost, setPotentialCost] = useState(0);
    const [unsafeActions, setUnsafeActions] = useState([]);
    const [unsafeConditions, setUnsafeConditions] = useState([]);
    const [personalFactors, setPersonalFactors] = useState([]);
    const [jobFactors, setJobFactors] = useState([]);
    const [causeDetails, setCauseDetails] = useState([]);
    const [investigationChecklist, setInvestigationChecklist] = useState({});

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

        setIncidentTypeId(null);
        setSourceId(null);
        setMobileEquipment("");
        setWorkExperienceIntervalId(null);
        setHourOfShift("");
        setInjuryConditionId(null);
        setBodyPartId(null);
        setEnvironmentalPollutionQty(0);
        setLostDays(0);
        setActualCost(0);
        setPotentialCost(0);
        setUnsafeActions([]);
        setUnsafeConditions([]);
        setPersonalFactors([]);
        setJobFactors([]);
        setCauseDetails([]);
        setInvestigationChecklist({});
    };

    const syncFormWithData = (record) => {
        setSelectedNotification(record.accident_notification || null);
        setIsEnvironmental(!!record.is_environmental);
        setInvestigationDetail(record.investigation_detail || "");
        setRootCauseAnalysis(record.root_cause_analysis || "");
        setCorrectiveActions(record.corrective_action_plan || []);
        setPreventiveAction(record.preventive_action || "");

        setIncidentTypeId(record.incident_type_id || null);
        setSourceId(record.source_id || null);
        setMobileEquipment(record.mobile_equipment || "");
        setWorkExperienceIntervalId(record.work_experience_interval_id || null);
        setHourOfShift(record.hour_of_shift || "");
        setInjuryConditionId(record.injury_condition_id || null);
        setBodyPartId(record.body_part_id || null);
        setEnvironmentalPollutionQty(record.environmental_pollution_qty || 0);
        setLostDays(record.lost_days || 0);
        setActualCost(record.actual_cost || 0);
        setPotentialCost(record.potential_cost || 0);
        setUnsafeActions(record.unsafe_actions || []);
        setUnsafeConditions(record.unsafe_conditions || []);
        setPersonalFactors(record.personal_factors || []);
        setJobFactors(record.job_factors || []);
        setCauseDetails(record.cause_details || []);
        setInvestigationChecklist(record.investigation_checklist || {});

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

        fd.append("incident_type_id", incidentTypeId || "");
        fd.append("source_id", sourceId || "");
        fd.append("mobile_equipment", mobileEquipment || "");
        fd.append("work_experience_interval_id", workExperienceIntervalId || "");
        fd.append("hour_of_shift", hourOfShift || "");
        fd.append("injury_condition_id", injuryConditionId || "");
        fd.append("body_part_id", bodyPartId || "");
        fd.append("environmental_pollution_qty", environmentalPollutionQty || 0);
        fd.append("lost_days", lostDays || 0);
        fd.append("actual_cost", actualCost || 0);
        fd.append("potential_cost", potentialCost || 0);

        unsafeActions.forEach((val, index) => {
            fd.append(`unsafe_actions[${index}]`, val);
        });
        unsafeConditions.forEach((val, index) => {
            fd.append(`unsafe_conditions[${index}]`, val);
        });
        personalFactors.forEach((val, index) => {
            fd.append(`personal_factors[${index}]`, val);
        });
        jobFactors.forEach((val, index) => {
            fd.append(`job_factors[${index}]`, val);
        });
        causeDetails.forEach((item, index) => {
            fd.append(`cause_details[${index}][code]`, item.code || "");
            fd.append(`cause_details[${index}][cause]`, item.cause || "");
            fd.append(`cause_details[${index}][analysis_explanation]`, item.analysis_explanation || "");
        });
        Object.entries(investigationChecklist).forEach(([key, val]) => {
            fd.append(`investigation_checklist[${key}]`, val ? 1 : 0);
        });

        // Corrective actions list (PICA)
        correctiveActions.forEach((item, index) => {
            fd.append(`corrective_action_plan[${index}][action]`, item.action || "");
            fd.append(`corrective_action_plan[${index}][pic]`, item.pic || "");
            fd.append(`corrective_action_plan[${index}][target_date]`, item.target_date || "");
            fd.append(`corrective_action_plan[${index}][status]`, item.status || "Open");
            fd.append(`corrective_action_plan[${index}][recommendation_id]`, item.recommendation_id || "");
            fd.append(`corrective_action_plan[${index}][cause_code]`, item.cause_code || "");
            fd.append(`corrective_action_plan[${index}][cause_text]`, item.cause_text || "");
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

    const handleCallback = async (record) => {
        setLoading(true);
        try {
            const response = await axios({
                method: "POST",
                url: `/api/investigation-report/${record.id}/callback`,
                headers: {
                    Authorization: "Bearer " + TokenManager.getToken(),
                    Accept: "application/json",
                },
            });

            if (response.data?.meta?.status === "success") {
                notification.success({
                    message: "Laporan Di-callback",
                    description: `Laporan berhasil di-callback.`,
                });
                fetchItems();
                return true;
            }
        } catch (error) {
            notification.error({
                message: "Gagal Callback Laporan",
                description: error.response?.data?.message || "Terjadi kesalahan server.",
            });
        } finally {
            setLoading(false);
        }
    };

    // Columns Managed by TanStack
    const columns = useMemo(
        () => [
            {
                header: "NO",
                id: "row_number",
                cell: ({ row }) =>
                    pagination.pageIndex * pagination.pageSize + row.index + 1,
                meta: { align: "center", width: 60 },
            },
            {
                header: "NOMOR LAPORAN",
                accessorKey: "report_number",
                cell: ({ row }) => {
                    const text = row.original.report_number;
                    const type = row.original.report_type;
                    return (
                        <div style={{ fontWeight: 800, color: isDarkMode ? "#38bdf8" : "#0284c7" }}>
                            <FileTextOutlined style={{ marginRight: 8, color: type === 'LPKL' ? '#ef4444' : '#3b82f6' }} />
                            {text || "DRAFT REPORT"}
                        </div>
                    );
                },
                meta: { width: 180 },
            },
            {
                header: "TIPE",
                accessorKey: "report_type",
                cell: ({ row }) => {
                    const text = row.original.report_type;
                    return (
                        <Tag color={text === 'LPKL' ? 'red' : 'blue'} style={{ fontWeight: 800, padding: '2px 10px', borderRadius: 6 }}>
                            {text}
                        </Tag>
                    );
                },
                meta: { align: "center", width: 100 },
            },
            {
                header: "NOMOR NOTIFIKASI",
                accessorKey: "accident_notification.notification_number",
                cell: ({ row }) => {
                    const text = row.original.accident_notification?.notification_number;
                    return (
                        <Text strong style={{ color: isDarkMode ? "#cbd5e1" : "#1e293b" }}>
                            {text || "-"}
                        </Text>
                    );
                },
                meta: { width: 150 },
            },
            {
                header: "JUDUL INSIDEN",
                accessorKey: "accident_notification.incident_title",
                cell: ({ row }) => {
                    const text = row.original.accident_notification?.incident_title;
                    return (
                        <div style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {text || "-"}
                        </div>
                    );
                },
                meta: { width: 220 },
            },
            {
                header: "CCOW & DEPARTEMEN",
                id: "ccow_dept",
                cell: ({ row }) => {
                    const ccow = row.original.accident_notification?.ccow?.name || "-";
                    const dept = row.original.accident_notification?.department?.name || "-";
                    return (
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: isDarkMode ? "#cbd5e1" : "#334155" }}>{ccow}</div>
                            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{dept}</div>
                        </div>
                    );
                },
                meta: { width: 200 },
            },
            {
                header: "STATUS APPROVAL",
                accessorKey: "investigation_status",
                cell: ({ row }) => {
                    const status = row.original.investigation_status;
                    const record = row.original;
                    let color = "default";
                    let label = status;

                    if (status === 'Completed') {
                        color = "green";
                        label = "SELESAI";
                    } else if (status === 'Returned') {
                        color = "red";
                        label = "DIKEMBALIKAN";
                    } else if (status === 'Draft') {
                        color = "orange";
                        label = "DRAF";
                    } else {
                        color = "processing";
                        label = status.replace("Waiting ", "MENUNGGU ").replace("_", " ");
                    }

                    return (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                            <Tag color={color} style={{ fontWeight: 800, padding: "2px 8px", borderRadius: 6, margin: 0 }}>
                                {label.toUpperCase()}
                            </Tag>
                            {status !== 'Completed' && status !== 'Draft' && record.current_approval_level && (
                                <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748b" }}>
                                    LVL: {record.current_approval_level}
                                </span>
                            )}
                        </div>
                    );
                },
                meta: { align: "center", width: 140 },
            },
            {
                header: "AKSI",
                id: "actions",
                cell: ({ row }) => {
                    const record = row.original;
                    const isDraft = record.investigation_status === "Draft";
                    const isReturned = record.investigation_status === "Returned";
                    const showEdit = (isDraft || isReturned) && canEdit;

                    return (
                        <Space size="middle">
                            <Tooltip title="Lihat Detail">
                                <Button
                                    type="text"
                                    shape="circle"
                                    icon={<EyeOutlined style={{ color: "#3b82f6" }} />}
                                    onClick={() => handleDetail(record)}
                                />
                            </Tooltip>

                            {showEdit && (
                                <Tooltip title="Edit Laporan">
                                    <Button
                                        type="text"
                                        shape="circle"
                                        icon={<EditOutlined style={{ color: "#f59e0b" }} />}
                                        onClick={() => handleEdit(record)}
                                    />
                                </Tooltip>
                            )}

                            {canDelete && (
                                <Tooltip title="Hapus Laporan">
                                    <Button
                                        type="text"
                                        shape="circle"
                                        icon={<DeleteOutlined style={{ color: "#ef4444" }} />}
                                        onClick={() => showDeleteModal(record)}
                                    />
                                </Tooltip>
                            )}

                            {userRoles.includes("crs") && record.investigation_status === 'Completed' && (
                                <Tooltip title="Callback Laporan">
                                    <Button
                                        type="text"
                                        shape="circle"
                                        icon={<RollbackOutlined style={{ color: "#8b5cf6" }} />}
                                        onClick={() => {
                                            modal.confirm({
                                                title: 'Apakah Anda yakin ingin callback laporan ini?',
                                                content: 'Laporan akan dikembalikan ke status Draft dan semua approval akan direset.',
                                                onOk: () => handleCallback(record)
                                            });
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Space>
                    );
                },
                meta: { align: "center", width: 160 },
            },
        ],
        [
            pagination.pageIndex,
            pagination.pageSize,
            isDarkMode,
            canEdit,
            canDelete,
            handleDetail,
            handleEdit,
            showDeleteModal,
            handleCallback,
            userRoles
        ]
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
        getRowId: (row) => row.id,
    });

    useEffect(() => {
        fetchItems();
    }, [pagination.pageIndex, pagination.pageSize]);

    return {
        table,
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
        resetForm,
        
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

        // Incident Analysis states & setters
        incidentTypeId,
        setIncidentTypeId,
        sourceId,
        setSourceId,
        mobileEquipment,
        setMobileEquipment,
        workExperienceIntervalId,
        setWorkExperienceIntervalId,
        hourOfShift,
        setHourOfShift,
        injuryConditionId,
        setInjuryConditionId,
        bodyPartId,
        setBodyPartId,
        environmentalPollutionQty,
        setEnvironmentalPollutionQty,
        lostDays,
        setLostDays,
        actualCost,
        setActualCost,
        potentialCost,
        setPotentialCost,
        unsafeActions,
        setUnsafeActions,
        unsafeConditions,
        setUnsafeConditions,
        personalFactors,
        setPersonalFactors,
        jobFactors,
        setJobFactors,
        causeDetails,
        setCauseDetails,
        investigationChecklist,
        setInvestigationChecklist,

        // Actions
        handleApprove,
        handleReturn,
        showDeleteModal
    };
}

