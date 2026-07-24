import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import {
    Row, Col, Card, Tag, Button, Space, Badge, Tabs, Empty,
    Typography, Avatar, Tooltip, Modal, Input, Checkbox, Grid, Alert
} from "antd";
import {
    CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined,
    FileTextOutlined, BellOutlined, RollbackOutlined, CheckOutlined,
    CloseOutlined, ReloadOutlined, EyeOutlined, ArrowRightOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import axios from "axios";
import { App } from "antd";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTheme } from "@/Contexts/ThemeContext";
import TokenManager from "@/Utils/TokenManager";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

// ── Helpers ───────────────────────────────────────────────────────────────────

const LEVEL_LABELS = {
    KTT:    "Kepala Teknik Tambang (KTT)",
    OHS_DH: "OHS Department Head",
    ENV_DH: "ENV Department Head",
    PJA:    "Penanggung Jawab Area (PJA)",
};

const getLevelLabel = (level) => LEVEL_LABELS[level] || level || "-";

const getLevelColor = (level) => {
    const map = { KTT: "purple", OHS_DH: "blue", ENV_DH: "green", PJA: "orange" };
    return map[level] || "default";
};

const getStatusColor = (status) => {
    if (!status) return "default";
    const s = status.toLowerCase();
    if (s.includes("approved") || s.includes("completed")) return "success";
    if (s.includes("returned"))  return "error";
    if (s.includes("draft"))     return "warning";
    return "processing";
};

// ── Sub-components ────────────────────────────────────────────────────────────

function SummaryCard({ icon, label, count, color, isDarkMode }) {
    return (
        <Card
            style={{
                borderRadius: 16,
                border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`,
                background: isDarkMode ? "#1e293b" : "#ffffff",
                textAlign: "center",
            }}
            styles={{ body: { padding: "20px 16px" } }}
        >
            <div style={{ fontSize: 32, color, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: isDarkMode ? "#f8fafc" : "#0f172a" }}>
                {count}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {label}
            </div>
        </Card>
    );
}

function AccidentQueueCard({ record, isDarkMode, onViewDetail }) {
    return (
        <Card
            style={{
                borderRadius: 16,
                border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`,
                background: isDarkMode ? "#1e293b" : "#ffffff",
                marginBottom: 12,
            }}
            styles={{ body: { padding: "16px 20px" } }}
        >
            <Row justify="space-between" align="middle" gutter={[16, 8]}>
                <Col xs={24} md={16}>
                    <Space direction="vertical" size={4} style={{ width: "100%" }}>
                        <Space wrap>
                            <Tag color="blue" style={{ fontWeight: 800, borderRadius: 6 }}>
                                <BellOutlined style={{ marginRight: 4 }} />
                                NOTIFIKASI KECELAKAAN
                            </Tag>
                            {record.is_hpri && (
                                <Tag color="red" style={{ fontWeight: 800, borderRadius: 6 }}>
                                    ⚠ HPRI
                                </Tag>
                            )}
                            <Tag
                                color={getStatusColor(record.status?.name)}
                                style={{ fontWeight: 700, borderRadius: 6 }}
                            >
                                {(record.status?.name || "-").toUpperCase()}
                            </Tag>
                        </Space>

                        <Text strong style={{ fontSize: 15, color: isDarkMode ? "#f8fafc" : "#0f172a" }}>
                            {record.notification_number || "-"}
                        </Text>

                        <Text style={{ fontSize: 13, color: "#64748b" }}>
                            {record.incident_title || "(Tanpa Judul)"}
                        </Text>

                        <Space size={16} wrap>
                            <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                                📅 {record.incident_date ? dayjs(record.incident_date).format("DD MMM YYYY") : "-"}
                            </Text>
                            <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                                🏢 {record.ccow?.name || "-"}
                            </Text>
                            <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                                📍 {record.location?.name || "-"}
                            </Text>
                        </Space>
                    </Space>
                </Col>

                <Col xs={24} md={8} style={{ textAlign: "right" }}>
                    <Button
                        type="primary"
                        icon={<ArrowRightOutlined />}
                        onClick={() => onViewDetail(record)}
                        style={{ borderRadius: 10, fontWeight: 700, background: "#2563eb", border: "none" }}
                    >
                        Review
                    </Button>
                </Col>
            </Row>
        </Card>
    );
}

function InvestigationQueueCard({ record, isDarkMode, userApprovalLevels, isCrs, onAction, loading }) {
    const [isActionModalOpen, setIsActionModalOpen] = useState(false);
    const [actionType, setActionType]               = useState("");
    const [comment, setComment]                     = useState("");
    const [tickBox, setTickBox]                     = useState(false);

    const currentLevel = record.current_approval_level;
    const isReturned   = record.investigation_status === "Returned";

    const canActOnThis = isCrs || userApprovalLevels.includes(currentLevel);

    const openAction = (type) => {
        setActionType(type);
        setComment("");
        setTickBox(false);
        setIsActionModalOpen(true);
    };

    const handleSubmit = () => {
        onAction(record, actionType, currentLevel, comment, tickBox);
        setIsActionModalOpen(false);
    };

    const canConfirm = actionType === "return"
        ? comment.trim().length > 0
        : (currentLevel === "ENV_DH" ? true : tickBox);

    return (
        <>
            <Card
                style={{
                    borderRadius: 16,
                    border: `2px solid ${isReturned
                        ? "#fca5a5"
                        : (isDarkMode ? "#334155" : "#e2e8f0")}`,
                    background: isDarkMode ? "#1e293b" : "#ffffff",
                    marginBottom: 12,
                }}
                styles={{ body: { padding: "16px 20px" } }}
            >
                <Row justify="space-between" align="middle" gutter={[16, 8]}>
                    <Col xs={24} md={17}>
                        <Space direction="vertical" size={4} style={{ width: "100%" }}>
                            <Space wrap>
                                <Tag
                                    color={record.report_type === "LPKL" ? "red" : "blue"}
                                    style={{ fontWeight: 800, borderRadius: 6 }}
                                >
                                    <FileTextOutlined style={{ marginRight: 4 }} />
                                    {record.report_type}
                                </Tag>

                                {currentLevel && currentLevel !== "COMPLETED" && (
                                    <Tag
                                        color={getLevelColor(currentLevel)}
                                        style={{ fontWeight: 800, borderRadius: 6 }}
                                    >
                                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                                        MENUNGGU {getLevelLabel(currentLevel).toUpperCase()}
                                    </Tag>
                                )}

                                {isReturned && (
                                    <Tag color="red" style={{ fontWeight: 800, borderRadius: 6 }}>
                                        <RollbackOutlined style={{ marginRight: 4 }} />
                                        DIKEMBALIKAN
                                    </Tag>
                                )}
                            </Space>

                            <Text strong style={{ fontSize: 15, color: isDarkMode ? "#f8fafc" : "#0f172a" }}>
                                {record.report_number || "(Nomor belum di-generate)"}
                            </Text>

                            <Text style={{ fontSize: 13, color: "#64748b" }}>
                                Notifikasi: {record.accident_notification?.notification_number || "-"}
                                {" · "}
                                {record.accident_notification?.incident_title || "(Tanpa Judul)"}
                            </Text>

                            <Space size={16} wrap>
                                <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                                    🏢 {record.accident_notification?.ccow?.name || "-"}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                                    🏭 {record.accident_notification?.company?.name || "-"}
                                </Text>
                                <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                                    📅 {dayjs(record.created_at).format("DD MMM YYYY")}
                                </Text>
                            </Space>

                            {/* Approval progress mini indicator */}
                            <Space size={6} wrap style={{ marginTop: 4 }}>
                                {(record.approvals || [])
                                    .sort((a, b) => {
                                        const order = { PJA: 1, ENV_DH: 2, OHS_DH: 3, KTT: 4 };
                                        return (order[a.approval_level] || 9) - (order[b.approval_level] || 9);
                                    })
                                    .map((app) => (
                                        <Tooltip key={app.id} title={getLevelLabel(app.approval_level)}>
                                            <Tag
                                                style={{ borderRadius: 20, fontWeight: 700, fontSize: 11 }}
                                                color={
                                                    app.status === "Approved"  ? "green"  :
                                                    app.status === "Returned"  ? "red"    :
                                                    app.approval_level === currentLevel ? "processing" : "default"
                                                }
                                            >
                                                {app.approval_level}
                                            </Tag>
                                        </Tooltip>
                                    ))
                                }
                            </Space>
                        </Space>
                    </Col>

                    <Col xs={24} md={7} style={{ textAlign: "right" }}>
                        <Space direction="vertical" size={8} style={{ width: "100%" }}>
                            {canActOnThis && !isReturned && (
                                <>
                                    <Button
                                        type="primary"
                                        icon={<CheckOutlined />}
                                        block
                                        loading={loading}
                                        onClick={() => openAction("approve")}
                                        style={{
                                            borderRadius: 10, fontWeight: 700,
                                            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
                                            border: "none",
                                        }}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        icon={<CloseOutlined />}
                                        block
                                        onClick={() => openAction("return")}
                                        style={{
                                            borderRadius: 10, fontWeight: 700,
                                            borderColor: "#f59e0b", color: "#d97706",
                                        }}
                                    >
                                        Return
                                    </Button>
                                </>
                            )}
                            <Button
                                icon={<EyeOutlined />}
                                block
                                onClick={() => router.visit(`/analisa-kecelakaan?open_id=${record.id}`)}
                                style={{ borderRadius: 10, fontWeight: 700 }}
                            >
                                Lihat Detail
                            </Button>
                        </Space>
                    </Col>
                </Row>
            </Card>

            {/* Action Confirmation Modal */}
            <Modal
                title={
                    <span style={{ fontWeight: 800, fontSize: 16 }}>
                        {actionType === "approve" ? "✅ KONFIRMASI APPROVAL" : "↩ KONFIRMASI RETURN"}
                        {" — "}
                        {getLevelLabel(currentLevel).toUpperCase()}
                    </span>
                }
                open={isActionModalOpen}
                onCancel={() => setIsActionModalOpen(false)}
                footer={null}
                destroyOnClose
                centered
            >
                <div style={{ paddingTop: 8 }}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#475569", marginBottom: 6 }}>
                            {actionType === "return" ? "Alasan pengembalian (wajib):" : "Komentar / catatan (opsional):"}
                        </div>
                        <Input.TextArea
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder={
                                actionType === "return"
                                    ? "Tuliskan alasan pengembalian laporan..."
                                    : "Tambahkan catatan persetujuan (opsional)..."
                            }
                            style={{ borderRadius: 10 }}
                        />
                    </div>

                    {actionType === "approve" && currentLevel !== "ENV_DH" && (
                        <div style={{ marginBottom: 20 }}>
                            <Checkbox
                                checked={tickBox}
                                onChange={(e) => setTickBox(e.target.checked)}
                                style={{ fontWeight: 600, color: "#1e293b" }}
                            >
                                Saya telah memeriksa laporan penyelidikan ini dan menyatakan bahwa data adalah benar dan valid.
                            </Checkbox>
                        </div>
                    )}

                    <Space style={{ display: "flex", justifyContent: "flex-end", width: "100%", marginTop: 8 }}>
                        <Button
                            onClick={() => setIsActionModalOpen(false)}
                            style={{ borderRadius: 10 }}
                        >
                            Batal
                        </Button>
                        <Button
                            type="primary"
                            danger={actionType === "return"}
                            disabled={!canConfirm}
                            loading={loading}
                            onClick={handleSubmit}
                            style={{
                                borderRadius: 10,
                                fontWeight: 700,
                                padding: "0 24px",
                                background: actionType === "approve" && canConfirm
                                    ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
                                    : undefined,
                                border: actionType === "approve" ? "none" : undefined,
                            }}
                        >
                            {actionType === "return" ? "Kembalikan" : "Setujui"}
                        </Button>
                    </Space>
                </div>
            </Modal>
        </>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ApprovalQueueIndex({
    pendingAccidents      = [],
    pendingInvestigations = [],
    returnedInvestigations = [],
    summary               = {},
    userApprovalLevels    = [],
    isCrs                 = false,
}) {
    const { isDarkMode } = useTheme();
    const { notification } = App.useApp();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [loading, setLoading]   = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = () => {
        setRefreshing(true);
        router.reload({ onFinish: () => setRefreshing(false) });
    };

    const handleAccidentDetail = (record) => {
        router.visit(`/accident-notification?open_id=${record.id}`);
    };

    const handleInvestigationAction = async (record, actionType, level, comment, tickBox) => {
        setLoading(true);
        try {
            const url = `/api/investigation-report/${record.id}/${actionType}`;
            const payload =
                actionType === "approve"
                    ? { approval_level: level, comment, tick_box: tickBox ? 1 : 0 }
                    : { approval_level: level, comment };

            const response = await axios({
                method: "POST",
                url,
                data: payload,
                headers: {
                    Authorization: "Bearer " + TokenManager.getToken(),
                    Accept: "application/json",
                },
            });

            if (response.data?.meta?.status === "success") {
                notification.success({
                    message: actionType === "approve" ? "Laporan Disetujui" : "Laporan Dikembalikan",
                    description:
                        actionType === "approve"
                            ? `Laporan berhasil disetujui pada level ${getLevelLabel(level)}.`
                            : `Laporan dikembalikan untuk diperbaiki.`,
                });
                // Reload halaman agar antrian terupdate
                router.reload();
            }
        } catch (error) {
            notification.error({
                message: "Gagal Memproses",
                description: error.response?.data?.message || "Terjadi kesalahan server.",
            });
        } finally {
            setLoading(false);
        }
    };

    const tabItems = [
        {
            key: "investigations",
            label: (
                <Badge count={pendingInvestigations.length} size="small" offset={[6, -2]}>
                    <span style={{ fontWeight: 700, paddingRight: 8 }}>Investigasi Menunggu</span>
                </Badge>
            ),
            children:
                pendingInvestigations.length === 0 ? (
                    <Empty
                        description={
                            <span style={{ color: "#64748b", fontWeight: 600 }}>
                                Tidak ada laporan investigasi yang menunggu approval Anda.
                            </span>
                        }
                        style={{ padding: "48px 0" }}
                    />
                ) : (
                    pendingInvestigations.map((record) => (
                        <InvestigationQueueCard
                            key={record.id}
                            record={record}
                            isDarkMode={isDarkMode}
                            userApprovalLevels={userApprovalLevels}
                            isCrs={isCrs}
                            onAction={handleInvestigationAction}
                            loading={loading}
                        />
                    ))
                ),
        },
        {
            key: "returned",
            label: (
                <Badge count={returnedInvestigations.length} color="red" size="small" offset={[6, -2]}>
                    <span style={{ fontWeight: 700, paddingRight: 8 }}>Dikembalikan</span>
                </Badge>
            ),
            children:
                returnedInvestigations.length === 0 ? (
                    <Empty
                        description={
                            <span style={{ color: "#64748b", fontWeight: 600 }}>
                                Tidak ada laporan yang dikembalikan.
                            </span>
                        }
                        style={{ padding: "48px 0" }}
                    />
                ) : (
                    returnedInvestigations.map((record) => (
                        <InvestigationQueueCard
                            key={record.id}
                            record={record}
                            isDarkMode={isDarkMode}
                            userApprovalLevels={userApprovalLevels}
                            isCrs={isCrs}
                            onAction={handleInvestigationAction}
                            loading={loading}
                        />
                    ))
                ),
        },
        {
            key: "accidents",
            label: (
                <Badge count={pendingAccidents.length} color="orange" size="small" offset={[6, -2]}>
                    <span style={{ fontWeight: 700, paddingRight: 8 }}>Notifikasi Kecelakaan</span>
                </Badge>
            ),
            children:
                pendingAccidents.length === 0 ? (
                    <Empty
                        description={
                            <span style={{ color: "#64748b", fontWeight: 600 }}>
                                Tidak ada notifikasi kecelakaan yang menunggu review.
                            </span>
                        }
                        style={{ padding: "48px 0" }}
                    />
                ) : (
                    pendingAccidents.map((record) => (
                        <AccidentQueueCard
                            key={record.id}
                            record={record}
                            isDarkMode={isDarkMode}
                            onViewDetail={handleAccidentDetail}
                        />
                    ))
                ),
        },
    ];

    return (
        <DashboardLayout title="Antrian Approval">
            <Head title="Antrian Approval" />

            <div style={{ padding: isMobile ? "0" : "24px" }}>

                {/* ── Page Header ────────────────────────────────────────────── */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} md={16}>
                        <Title
                            level={2}
                            style={{
                                margin: 0,
                                fontWeight: 900,
                                fontSize: isMobile ? 22 : 28,
                                color: isDarkMode ? "#f8fafc" : "#0f172a",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            ANTRIAN APPROVAL
                        </Title>
                        <p style={{ margin: 0, color: "#64748b", fontSize: 14, fontWeight: 500 }}>
                            Daftar laporan yang membutuhkan tindakan approval dari Anda.
                        </p>
                        {userApprovalLevels.length > 0 && (
                            <Space wrap style={{ marginTop: 8 }}>
                                <Text style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>
                                    Level Anda:
                                </Text>
                                {userApprovalLevels.map((lvl) => (
                                    <Tag
                                        key={lvl}
                                        color={getLevelColor(lvl)}
                                        style={{ fontWeight: 800, borderRadius: 6 }}
                                    >
                                        {getLevelLabel(lvl)}
                                    </Tag>
                                ))}
                            </Space>
                        )}
                    </Col>
                    <Col xs={24} md={8} style={{ textAlign: isMobile ? "left" : "right" }}>
                        <Button
                            size="large"
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                            loading={refreshing}
                            style={{ borderRadius: 10, fontWeight: 700 }}
                        >
                            Muat Ulang
                        </Button>
                    </Col>
                </Row>

                {/* ── Info Banner untuk CRS ───────────────────────────────────── */}
                {isCrs && (
                    <Alert
                        message="Mode CRS / Admin — Anda dapat melihat dan memproses semua level approval."
                        type="info"
                        showIcon
                        style={{ borderRadius: 12, marginBottom: 20, fontWeight: 600 }}
                    />
                )}

                {/* ── Summary Cards ───────────────────────────────────────────── */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={12} sm={6}>
                        <SummaryCard
                            icon={<ClockCircleOutlined />}
                            label="Total Menunggu"
                            count={summary.total_pending ?? 0}
                            color="#3b82f6"
                            isDarkMode={isDarkMode}
                        />
                    </Col>
                    <Col xs={12} sm={6}>
                        <SummaryCard
                            icon={<FileTextOutlined />}
                            label="Laporan Investigasi"
                            count={summary.pending_investigations ?? 0}
                            color="#8b5cf6"
                            isDarkMode={isDarkMode}
                        />
                    </Col>
                    <Col xs={12} sm={6}>
                        <SummaryCard
                            icon={<RollbackOutlined />}
                            label="Dikembalikan"
                            count={summary.returned_investigations ?? 0}
                            color="#ef4444"
                            isDarkMode={isDarkMode}
                        />
                    </Col>
                    <Col xs={12} sm={6}>
                        <SummaryCard
                            icon={<BellOutlined />}
                            label="Notif. Kecelakaan"
                            count={summary.pending_accidents ?? 0}
                            color="#f59e0b"
                            isDarkMode={isDarkMode}
                        />
                    </Col>
                </Row>

                {/* ── Main Content (Tabs) ─────────────────────────────────────── */}
                <Card
                    style={{
                        borderRadius: 20,
                        border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`,
                        background: isDarkMode ? "#1e293b" : "#ffffff",
                    }}
                    styles={{ body: { padding: isMobile ? 16 : 24 } }}
                >
                    <Tabs
                        defaultActiveKey="investigations"
                        items={tabItems}
                        size="large"
                        tabBarStyle={{ fontWeight: 700 }}
                    />
                </Card>
            </div>
        </DashboardLayout>
    );
}
