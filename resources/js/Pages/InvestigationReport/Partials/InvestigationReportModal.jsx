import React, { useEffect, useState, useMemo } from "react";
import {
    Modal, Form, Row, Col, Select, Switch, Input, Button, Card,
    Tag, Space, Divider, Empty, Descriptions, Typography, Checkbox, Grid,
    Steps, Alert, Tooltip, Badge
} from "antd";
import {
    FileSearchOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
    BookOutlined,
    FileImageOutlined,
    CheckCircleOutlined,
    SafetyOutlined,
    AuditOutlined,
    PaperClipOutlined,
    NodeIndexOutlined,
    FileTextOutlined,
    WarningOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { usePage } from "@inertiajs/react";
import { useTheme } from "@/Contexts/ThemeContext";
import DocumentUploadSection from "./Components/DocumentUploadSection";
import ApprovalChainSection from "./Components/ApprovalChainSection";
import IncidentSpecificFactorsSection from "./Components/IncidentSpecificFactorsSection";
import RootCauseFactorsSection from "./Components/RootCauseFactorsSection";

const { Text } = Typography;

export default function InvestigationReportModal({
    visible,
    onCancel,
    onFinish,
    onApprove,
    onReturn,
    loading,
    initialValues,
    approvedNotifications = [],
    mode = "add", // 'add', 'edit', 'detail'
    hook = {},
    master = {}
}) {
    const { isDarkMode } = useTheme();
    const { auth } = usePage().props;
    const [form] = Form.useForm();
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType] = useState("");
    const [comment, setComment] = useState("");
    const [tickBox, setTickBox] = useState(false);

    // Permission Logic
    const userRoles = (auth?.user?.roles || []).map(r => r.toLowerCase());
    const isAdministrator = auth?.user?.is_administrator || false;
    const isCrs = userRoles.includes("crs") || userRoles.includes("admin") || userRoles.includes("superadmin") || userRoles.includes("super-admin") || isAdministrator;

    const currentLevel = initialValues?.current_approval_level;
    const isCompleted = initialValues?.investigation_status === "Completed" || currentLevel === "COMPLETED";

    const canUserApproveCurrentLevel = () => {
        if (isCompleted || !initialValues) return false;
        if (isCrs) return true;

        if (currentLevel === "KTT" && userRoles.includes("ktt")) return true;
        if (currentLevel === "OHS_DH" && (userRoles.includes("ohs_dh") || userRoles.includes("ohs"))) return true;
        if (currentLevel === "ENV_DH" && (userRoles.includes("env_dh") || userRoles.includes("env"))) return true;
        if (currentLevel === "PJA" && userRoles.includes("pja")) return true;

        return false;
    };
    const userCanAct = canUserApproveCurrentLevel();

    const getLevelLabel = (level) => {
        switch (level) {
            case "KTT": return "Kepala Teknik Tambang (KTT)";
            case "OHS_DH": return "OHS Department Head";
            case "ENV_DH": return "ENV Department Head";
            case "PJA": return "Penanggung Jawab Area (PJA)";
            default: return level || "";
        }
    };

    const isDetail = mode === "detail";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

    const getStatusColor = (status) => {
        const map = { Completed: '#10b981', Returned: '#ef4444', Draft: '#f59e0b' };
        return map[status] || '#3b82f6';
    };

    const {
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
        resetForm,

        // Incident Analysis states & setters
        incidentTypeId,
        setIncidentTypeId,
        sourceId,
        setSourceId,
        mobileEquipmentId,
        setMobileEquipmentId,
        workExperienceIntervalId,
        setWorkExperienceIntervalId,
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
    } = hook;

    // Reset or populate form values on visible changes
    useEffect(() => {
        if (visible) {
            if (initialValues && !isAdd) {
                // Mode edit/detail — populate dari initialValues
                form.setFieldsValue({
                    accident_notification_id: initialValues.accident_notification_id,
                    report_type: initialValues.report_type,
                });
            } else {
                // Mode add — selalu reset bersih
                form.resetFields();
                form.setFieldsValue({
                    accident_notification_id: undefined,
                    report_type: undefined,
                });
                if (resetForm) resetForm();
            }
        } else {
            form.resetFields();
            if (resetForm) resetForm();
        }
    }, [visible, initialValues, isAdd]);

    // Reset action modal states on close
    useEffect(() => {
        if (!isActionModalOpen) {
            setComment("");
            setTickBox(false);
        }
    }, [isActionModalOpen]);

    // Anti-screenshot protection
    useEffect(() => {
        if (visible && isDetail && initialValues?.investigation_status === 'Completed') {
            const handleKeyUp = (e) => {
                if (e.key === 'PrintScreen') {
                    navigator.clipboard.writeText('');
                }
            };
            const handleContextMenu = (e) => {
                e.preventDefault();
            };
            const handleCopy = (e) => {
                e.preventDefault();
            };

            window.addEventListener('keyup', handleKeyUp);
            window.addEventListener('contextmenu', handleContextMenu);
            window.addEventListener('copy', handleCopy);

            // Add print CSS
            const style = document.createElement('style');
            style.id = 'anti-print-style';
            style.innerHTML = '@media print { body { display: none !important; } }';
            document.head.appendChild(style);

            return () => {
                window.removeEventListener('keyup', handleKeyUp);
                window.removeEventListener('contextmenu', handleContextMenu);
                window.removeEventListener('copy', handleCopy);
                const styleEl = document.getElementById('anti-print-style');
                if (styleEl) styleEl.remove();
            };
        }
    }, [visible, isDetail, initialValues]);

    // Handle when notification dropdown changes
    const handleNotificationChange = (id) => {
        const notif = approvedNotifications.find(n => n.id === id);
        setSelectedNotification(notif);

        if (notif) {
            // Auto detect report type
            const actual = notif.actual_k3;
            const potential = notif.potential_k3;
            let detectedType = "LPKS";

            if ((actual === 4 || actual === 5) || (potential === 3 || potential === 4 || potential === 5)) {
                detectedType = "LPKL";
            } else if ((actual === 1 || actual === 2) && (potential === 1 || potential === 2 || potential === 3)) {
                detectedType = "LPKS";
            }

            form.setFieldsValue({ report_type: detectedType });
        } else {
            form.setFieldsValue({ report_type: undefined });
        }
    };

    const cardStyle = {
        marginBottom: 24,
        borderRadius: 20,
        border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
        background: isDarkMode ? "#1e293b" : "#ffffff",
        boxShadow: isDarkMode ? "0 4px 6px -1px rgba(0,0,0,0.2)" : "0 4px 6px -1px rgba(0,0,0,0.05)",
        overflow: "hidden"
    };

    const getTitle = () => {
        if (isDetail) return "DETAIL";
        if (isEdit) return "EDIT";
        return "BUAT";
    };

    const selectOptions = useMemo(() => {
        const opts = (approvedNotifications || []).map(n => ({
            label: `${n.notification_number || n.accident_number || ('No. Notif ' + n.id)} - ${n.incident_title || '(Tanpa Judul)'}`,
            value: n.id
        }));

        // Saat mode edit/detail, pastikan notifikasi yang dipilih ada di list
        // meskipun tidak ada di approvedNotifications (sudah In Investigation)
        if (!isAdd) {
            const currentNotif = selectedNotification || initialValues?.accident_notification;
            if (currentNotif && currentNotif.id && currentNotif.notification_number) {
                const hasNotif = opts.some(opt => opt.value === currentNotif.id);
                if (!hasNotif) {
                    opts.push({
                        label: `${currentNotif.notification_number} - ${currentNotif.incident_title || '(Tanpa Judul)'}`,
                        value: currentNotif.id
                    });
                }
            }
        }
        return opts;
    }, [approvedNotifications, initialValues, selectedNotification, isAdd]);

    const statusColor = getStatusColor(initialValues?.investigation_status);

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={1280}
            style={{ top: 16 }}
            styles={{ body: { padding: 0 }, content: { borderRadius: 24, overflow: 'hidden' } }}
            destroyOnClose
            centered
        >
            <div style={{ userSelect: (isDetail && initialValues?.investigation_status === 'Completed') ? 'none' : 'auto' }}>

                {/* ── HEADER ──────────────────────────────────────────────── */}
                <div style={{
                    background: isDarkMode ? '#1e293b' : '#ffffff',
                    padding: '20px 28px 16px',
                    borderBottom: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                }}>
                    <Row justify="space-between" align="middle" wrap={false}>
                        <Col flex="auto">
                            <Space size={12} align="center">
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: 'rgba(255,255,255,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <SafetyOutlined style={{ fontSize: 20, color: '#fff' }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 10, fontWeight: 700, color: isDarkMode ? '#94a3b8' : '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                        F-MAC-IMS-14-002 Rev. 2.0
                                    </div>
                                    <div style={{ fontSize: 20, fontWeight: 900, color: isDarkMode ? '#f8fafc' : '#0f172a', letterSpacing: '-0.5px' }}>
                                        {getTitle()} LAPORAN PENYELIDIKAN
                                    </div>
                                </div>
                            </Space>
                        </Col>
                        <Col>
                            <Space direction="vertical" size={4} align="end">
                                {initialValues?.report_number && (
                                    <span style={{ fontSize: 14, fontWeight: 900, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                                        {initialValues.report_number}
                                    </span>
                                )}
                                {initialValues?.investigation_status && (
                                    <Tag style={{
                                        background: statusColor + '20',
                                        border: `1.5px solid ${statusColor}`,
                                        color: statusColor, borderRadius: 6,
                                        fontWeight: 800, padding: '2px 10px', margin: 0,
                                    }}>
                                        {initialValues.investigation_status.toUpperCase()}
                                    </Tag>
                                )}
                                {initialValues?.report_type && (
                                    <Tag color={initialValues.report_type === 'LPKL' ? 'red' : 'blue'}
                                        style={{ fontWeight: 800, borderRadius: 6, margin: 0 }}>
                                        {initialValues.report_type}
                                    </Tag>
                                )}
                            </Space>
                        </Col>
                    </Row>

                    {/* Approve/Return buttons di header */}
                    {!isCompleted && userCanAct && isDetail && (
                        <Space style={{ marginTop: 12 }} size={8}>
                            <Button size="middle"
                                style={{ borderRadius: 8, fontWeight: 700, borderColor: '#f59e0b', color: '#d97706' }}
                                onClick={() => { setActionType('return'); setIsActionModalOpen(true); }}
                            >
                                ↩ Return for Correction
                            </Button>
                            <Button size="middle" type="primary"
                                style={{ borderRadius: 8, fontWeight: 700, background: '#10b981', border: 'none' }}
                                onClick={() => { setActionType('approve'); setIsActionModalOpen(true); }}
                            >
                                ✓ Approve — {getLevelLabel(currentLevel)}
                            </Button>
                        </Space>
                    )}
                </div>

                {/* Returned banner */}
                {initialValues?.investigation_status === 'Returned' && (
                    <div style={{ padding: '12px 28px 0' }}>
                        <Alert type="error" showIcon
                            message="Laporan dikembalikan untuk diperbaiki"
                            description="Periksa komentar di tab Approval, perbaiki laporan, lalu kirim ulang."
                            style={{ borderRadius: 10 }}
                        />
                    </div>
                )}

                {/* Action Modal */}
                <Modal
                    title={<span style={{ fontWeight: 800, fontSize: 16 }}>TINDAKAN APPROVAL: {(getLevelLabel(currentLevel) || "").toUpperCase()}</span>}
                    open={isActionModalOpen}
                    onCancel={() => setIsActionModalOpen(false)}
                    footer={null}
                    destroyOnClose
                    centered
                    styles={{ body: { paddingTop: 20 } }}
                >
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 700, fontSize: "13px", color: isDarkMode ? "#94a3b8" : "#475569", marginBottom: 6 }}>
                            Komentar / Catatan Penyelidikan:
                        </div>
                        <Input.TextArea
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={`Masukkan komentar peninjauan or alasan ${actionType === 'return' ? 'perbaikan' : 'persetujuan'}...`}
                            style={{ borderRadius: 10 }}
                        />
                    </div>

                    {actionType === 'approve' && currentLevel !== "ENV_DH" && (
                        <div style={{ marginBottom: 20 }}>
                            <Checkbox
                                checked={tickBox}
                                onChange={(e) => setTickBox(e.target.checked)}
                                style={{ fontWeight: 600, color: isDarkMode ? "#cbd5e1" : "#1e293b" }}
                            >
                                Saya telah memeriksa laporan penyelidikan kecelakaan ini dan menyatakan bahwa data adalah benar dan valid sesuai ketentuan operasional.
                            </Checkbox>
                        </div>
                    )}

                    <Space style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginTop: 24 }}>
                        <Button onClick={() => setIsActionModalOpen(false)} style={{ borderRadius: 10 }}>
                            Batal
                        </Button>
                        <Button
                            type="primary"
                            danger={actionType === 'return'}
                            disabled={actionType === 'approve' && currentLevel !== "ENV_DH" && !tickBox}
                            onClick={() => {
                                if (actionType === 'return') {
                                    onReturn(initialValues, currentLevel, comment);
                                } else {
                                    onApprove(initialValues, currentLevel, comment, tickBox);
                                }
                                setIsActionModalOpen(false);
                            }}
                            loading={loading}
                            style={{
                                background: actionType === 'approve' ? ((currentLevel !== "ENV_DH" && !tickBox) ? undefined : "linear-gradient(135deg, #059669 0%, #10b981 100%)") : undefined,
                                border: actionType === 'approve' ? "none" : undefined,
                                borderRadius: 10,
                                fontWeight: 700,
                                padding: "0 24px"
                            }}
                        >
                            {actionType === 'return' ? "Kembalikan" : "Setujui"}
                        </Button>
                    </Space>
                </Modal>

                {/* ── SCROLLABLE BODY ─────────────────────────────────── */}
                <div style={{ padding: '20px 28px', maxHeight: '68vh', overflowY: 'auto' }}>
                <Form form={form} layout="vertical" disabled={isDetail}>

                    {/* SECTION 1: Notifikasi */}
                    <Card
                        title={<Space><FileSearchOutlined style={{ color: '#3b82f6' }} /><span style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>PILIH NOTIFIKASI KECELAKAAN</span></Space>}
                        style={cardStyle}
                        styles={{ header: { borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', padding: '0 24px' }, body: { padding: '24px' } }}
                    >
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="accident_notification_id"
                                    label="Nomor Notifikasi Kecelakaan"
                                    rules={[{ required: true, message: "Silakan pilih nomor notifikasi!" }]}
                                >
                                    <Select
                                        placeholder="Pilih nomor notifikasi..."
                                        onChange={handleNotificationChange}
                                        disabled={isDetail}
                                        allowClear
                                        options={selectOptions}
                                        showSearch
                                        filterOption={(input, option) =>
                                            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                        }
                                        style={{ width: "100%" }}
                                    />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={12}>
                                <Form.Item
                                    name="report_type"
                                    label="Tipe Laporan Penyelidikan"
                                    rules={[{ required: true }]}
                                >
                                    <Input readOnly placeholder="Auto-populated berdasarkan tingkat keparahan" />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {selectedNotification && (
                        <Card
                            title={<Space><CheckCircleOutlined style={{ color: '#10b981' }} /><span style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>RINGKASAN NOTIFIKASI (AUTO-POPULATE)</span></Space>}
                            style={cardStyle}
                            styles={{ header: { borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', padding: '0 24px' }, body: { padding: '24px' } }}
                        >
                            <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }} size="middle">
                                <Descriptions.Item label="Judul Insiden" span={2}>
                                    <Text strong>{selectedNotification.incident_title || "-"}</Text>
                                </Descriptions.Item>
                                <Descriptions.Item label="Tanggal Kejadian">
                                    {selectedNotification.incident_date ? dayjs(selectedNotification.incident_date).format("DD MMMM YYYY") : "-"}
                                </Descriptions.Item>

                                <Descriptions.Item label="Waktu Kejadian">
                                    {selectedNotification.incident_time ? selectedNotification.incident_time.substring(0, 5) : "-"} WIB
                                </Descriptions.Item>
                                <Descriptions.Item label="CCOW Area">
                                    {selectedNotification.ccow?.name || "-"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Lokasi / Pit Area">
                                    {selectedNotification.location?.name || "-"}
                                </Descriptions.Item>

                                <Descriptions.Item label="Lokasi Detail" span={2}>
                                    {selectedNotification.location_detail || "-"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Perusahaan">
                                    {selectedNotification.company?.name || "-"}
                                </Descriptions.Item>

                                <Descriptions.Item label="Departemen">
                                    {selectedNotification.department?.name || "-"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Unit Terlibat">
                                    {selectedNotification.unit || "-"}
                                </Descriptions.Item>
                                <Descriptions.Item label="Tipe Klasifikasi">
                                    {selectedNotification.incident_type?.category || "-"}
                                </Descriptions.Item>

                                <Descriptions.Item label="HPRI?" span={3}>
                                    <Tag color={selectedNotification.is_hpri ? "red" : "blue"} style={{ fontWeight: 800 }}>
                                        {selectedNotification.is_hpri ? "YA (HIGH POTENTIAL)" : "TIDAK"}
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider style={{ margin: "20px 0" }} />

                            <Row gutter={24}>
                                <Col span={24}>
                                    <h4 style={{ fontWeight: 800, color: "#64748b", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                        <BookOutlined /> KRONOLOGI & FAKTA KEJADIAN AWAL
                                    </h4>
                                    <div style={{ padding: "16px", background: isDarkMode ? "#0f172a" : "#f8fafc", borderRadius: 12, border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`, height: "170px", overflowY: "auto" }}>
                                        <div style={{ fontWeight: 800, fontSize: 12, color: "#3b82f6", marginBottom: 6 }}>KRONOLOGI AWAL:</div>
                                        <p style={{ margin: "0 0 16px 0", fontSize: 13, lineHeight: 1.6 }}>{selectedNotification.initial_chronology || "-"}</p>

                                        <div style={{ fontWeight: 800, fontSize: 12, color: "#ef4444", marginBottom: 6 }}>FAKTA-FAKTA LAPANGAN:</div>
                                        <ul style={{ paddingLeft: 16, margin: 0, fontSize: 13, lineHeight: 1.6 }}>
                                            {(selectedNotification.incident_facts || []).map((fact, idx) => (
                                                <li key={idx}>{fact}</li>
                                            ))}
                                            {(selectedNotification.incident_facts || []).length === 0 && <li>-</li>}
                                        </ul>
                                    </div>
                                </Col>
                            </Row>

                            {selectedNotification.photos && selectedNotification.photos.length > 0 && (
                                <>
                                    <Divider style={{ margin: "20px 0" }} />
                                    <h4 style={{ fontWeight: 800, color: "#64748b", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                        <FileImageOutlined /> PREVIEW MEDIA / FOTO DARI NOTIFIKASI
                                    </h4>
                                    <Row gutter={[16, 16]}>
                                        {selectedNotification.photos.map((photo) => (
                                            <Col xs={12} sm={6} key={photo.id}>
                                                <div style={{
                                                    borderRadius: 12,
                                                    overflow: "hidden",
                                                    border: `1px solid ${isDarkMode ? "#334155" : "#cbd5e1"}`,
                                                    height: 120,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    background: "#000"
                                                }}>
                                                    <img
                                                        src={`${window.location.origin}/storage/${photo.path.replace(/\\/g, "/")}`}
                                                        alt={photo.filename}
                                                        style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                                                    />
                                                </div>
                                            </Col>
                                        ))}
                                    </Row>
                                </>
                            )}
                        </Card>
                    )}

                    {/* SECTION 2: Faktor & Dampak */}
                    {selectedNotification && <IncidentSpecificFactorsSection
                            disabled={isDetail}
                            isDarkMode={isDarkMode}
                            master={master}
                            incidentTypeId={incidentTypeId}
                            setIncidentTypeId={setIncidentTypeId}
                            sourceId={sourceId}
                            setSourceId={setSourceId}
                            mobileEquipmentId={mobileEquipmentId}
                            setMobileEquipmentId={setMobileEquipmentId}
                            workExperienceIntervalId={workExperienceIntervalId}
                            setWorkExperienceIntervalId={setWorkExperienceIntervalId}
                            injuryConditionId={injuryConditionId}
                            setInjuryConditionId={setInjuryConditionId}
                            bodyPartId={bodyPartId}
                            setBodyPartId={setBodyPartId}
                            environmentalPollutionQty={environmentalPollutionQty}
                            setEnvironmentalPollutionQty={setEnvironmentalPollutionQty}
                            lostDays={lostDays}
                            setLostDays={setLostDays}
                            actualCost={actualCost}
                            setActualCost={setActualCost}
                            potentialCost={potentialCost}
                            setPotentialCost={setPotentialCost}
                        />}

                    {/* SECTION 3: Analisa RCA */}
                    {selectedNotification && <RootCauseFactorsSection
                            disabled={isDetail}
                            isDarkMode={isDarkMode}
                            master={master}
                            unsafeActions={unsafeActions}
                            setUnsafeActions={setUnsafeActions}
                            unsafeConditions={unsafeConditions}
                            setUnsafeConditions={setUnsafeConditions}
                            personalFactors={personalFactors}
                            setPersonalFactors={setPersonalFactors}
                            jobFactors={jobFactors}
                            setJobFactors={setJobFactors}
                            causeDetails={causeDetails}
                            setCauseDetails={setCauseDetails}
                            investigationChecklist={investigationChecklist}
                            setInvestigationChecklist={setInvestigationChecklist}
                            correctiveActions={correctiveActions}
                            setCorrectiveActions={setCorrectiveActions}
                        />}

                    {/* SECTION 4: Narasi */}
                    {selectedNotification && (
                        <Card
                            title={<Space><FileTextOutlined style={{ color: '#8b5cf6' }} /><span style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>RINGKASAN NARASI INVESTIGASI</span></Space>}
                            style={cardStyle}
                            styles={{ header: { borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', padding: '0 24px' }, body: { padding: '24px' } }}
                        >
                            <Row gutter={24} style={{ marginBottom: 16 }}>
                                <Col span={24}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 20px", borderRadius: 10, background: isDarkMode ? "#0f172a" : "#fffbeb", border: `1px solid ${isDarkMode ? "#334155" : "#fef3c7"}`, marginBottom: 20 }}>
                                        <Switch
                                            checked={isEnvironmental}
                                            onChange={setIsEnvironmental}
                                            disabled={isDetail}
                                            style={{ background: isEnvironmental ? "#10b981" : undefined }}
                                        />
                                        <span style={{ fontWeight: 800, color: isEnvironmental ? "#10b981" : "#d97706" }}>
                                            Kecelakaan Lingkungan Kerja (Ada ceceran oli / minyak / limbah B3)?
                                        </span>
                                    </div>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label={<span style={{ fontWeight: 700 }}>Hasil Investigasi Detail (Penyelidikan Lengkap)</span>}>
                                        <Input.TextArea
                                            rows={4}
                                            value={investigationDetail}
                                            onChange={(e) => setInvestigationDetail(e.target.value)}
                                            placeholder="Tuliskan narasi lengkap hasil penyelidikan kronologis insiden di lapangan secara mendalam..."
                                            disabled={isDetail}
                                            style={{ borderRadius: 8 }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label={<span style={{ fontWeight: 700 }}>Analisa Akar Masalah (Root Cause Analysis - RCA Summary)</span>}>
                                        <Input.TextArea
                                            rows={4}
                                            value={rootCauseAnalysis}
                                            onChange={(e) => setRootCauseAnalysis(e.target.value)}
                                            placeholder="Gunakan metode RCA untuk menguraikan faktor penyebab utama secara tertulis..."
                                            disabled={isDetail}
                                            style={{ borderRadius: 8 }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item label={<span style={{ fontWeight: 700 }}>Tindakan Pencegahan Ulang (Preventive Action Summary)</span>}>
                                        <Input.TextArea
                                            rows={4}
                                            value={preventiveAction}
                                            onChange={(e) => setPreventiveAction(e.target.value)}
                                            placeholder="Langkah-langkah strategis preventif jangka panjang..."
                                            disabled={isDetail}
                                            style={{ borderRadius: 8 }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                                                </Card>
                    )}

                    {/* SECTION 5: Dokumen — hanya muncul setelah notifikasi dipilih */}
                    {selectedNotification && (
                        <Card
                            title={<Space><PaperClipOutlined style={{ color: '#f59e0b' }} /><span style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>DOKUMEN INVESTIGASI PENDUKUNG (MAKS 10 BERKAS)</span></Space>}
                            style={cardStyle}
                            styles={{ header: { borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', padding: '0 24px' }, body: { padding: '24px' } }}
                        >
                            <DocumentUploadSection
                                fileList={fileList}
                                setFileList={setFileList}
                                disabled={isDetail}
                                isDarkMode={isDarkMode}
                            />
                        </Card>
                    )}

                    {/* SECTION 6: Approval Chain */}
                    {(isDetail || isEdit) && initialValues && (
                        <ApprovalChainSection
                            record={initialValues}
                            authUser={auth?.user}
                            onApprove={onApprove}
                            onReturn={onReturn}
                            loading={loading}
                            isDarkMode={isDarkMode}
                        />
                    )}

                </Form>
                </div>{/* end scrollable body */}

                {/* ── FOOTER ────────────────────────────────────────────── */}
                <div style={{
                    display: 'flex', justifyContent: 'flex-end', alignItems: 'center',
                    padding: '14px 28px', gap: 10,
                    borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                    background: isDarkMode ? '#1e293b' : '#f8fafc',
                }}>
                    <Button onClick={onCancel}
                        style={{ borderRadius: 8, fontWeight: 700, height: 38 }}>
                        {isDetail ? 'Tutup' : 'Batal'}
                    </Button>
                    {!isDetail && (
                        <>
                            <Button onClick={() => onFinish(form, 'draft')} loading={loading}
                                style={{ borderRadius: 8, fontWeight: 700, height: 38 }}>
                                Simpan Draf
                            </Button>
                            <Button type="primary" onClick={() => onFinish(form, 'submitted')} loading={loading}
                                style={{ borderRadius: 8, fontWeight: 700, height: 38, padding: '0 24px',
                                    background: 'linear-gradient(135deg,#2563eb,#3b82f6)', border: 'none',
                                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}>
                                Kirim Laporan
                            </Button>
                        </>
                    )}
                </div>

            </div>
            <style>{`
                .ant-input, .ant-select-selector, .ant-picker {
                    border-radius: 10px !important;
                }
                .ant-modal-close {
                    top: 18px !important;
                    inset-inline-end: 20px !important;
                }
            `}</style>
        </Modal>
    );
}
