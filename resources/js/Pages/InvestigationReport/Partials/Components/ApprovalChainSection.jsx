import React, { useState } from "react";
import { Timeline, Card, Tag, Input, Checkbox, Button, Space, Alert, Typography, Modal } from "antd";
import { 
    CheckCircleOutlined, 
    ClockCircleOutlined, 
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    UserOutlined,
    MessageOutlined,
    CalendarOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

export default function ApprovalChainSection({ 
    record, 
    authUser, 
    onApprove, 
    onReturn, 
    loading, 
    isDarkMode 
}) {
    const [comment, setComment] = useState("");
    const [tickBox, setTickBox] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!record || !record.approvals) return null;

    const userRoles = (authUser?.roles || []).map(r => r.toLowerCase());
    const isAdministrator = authUser?.is_administrator || false;
    const isCrs = userRoles.includes("crs") || userRoles.includes("admin") || userRoles.includes("superadmin") || userRoles.includes("super-admin") || isAdministrator;

    // Check if the current user can act on the active level
    const currentLevel = record.current_approval_level;
    const isCompleted = record.investigation_status === "Completed" || currentLevel === "COMPLETED";

    const canUserApproveCurrentLevel = () => {
        if (isCompleted) return false;
        if (isCrs) return true;

        if (currentLevel === "KTT" && userRoles.includes("ktt")) return true;
        if (currentLevel === "OHS_DH" && (userRoles.includes("ohs_dh") || userRoles.includes("ohs"))) return true;
        if (currentLevel === "ENV_DH" && (userRoles.includes("env_dh") || userRoles.includes("env"))) return true;
        if (currentLevel === "PJA" && userRoles.includes("pja")) return true;

        return false;
    };

    const userCanAct = canUserApproveCurrentLevel();

    // Map level names to human-readable labels
    const getLevelLabel = (level) => {
        switch (level) {
            case "KTT": return "Kepala Teknik Tambang (KTT)";
            case "OHS_DH": return "OHS Department Head";
            case "ENV_DH": return "ENV Department Head";
            case "PJA": return "Penanggung Jawab Area (PJA)";
            default: return level || "";
        }
    };

    const getTimelineItems = () => {
        return record.approvals.map((app) => {
            let statusDot = <ClockCircleOutlined style={{ fontSize: "16px", color: "#64748b" }} />;
            let color = "gray";
            let statusLabel = "Menunggu Antrean";
            
            if (app.status === "Approved") {
                statusDot = <CheckCircleOutlined style={{ fontSize: "16px", color: "#10b981" }} />;
                color = "green";
                statusLabel = "Disetujui";
            } else if (app.status === "Returned") {
                statusDot = <CloseCircleOutlined style={{ fontSize: "16px", color: "#ef4444" }} />;
                color = "red";
                statusLabel = "Dikembalikan";
            } else if (record.current_approval_level === app.approval_level && !isCompleted) {
                statusDot = <ClockCircleOutlined style={{ fontSize: "16px", color: "#3b82f6" }} className="animate-spin" />;
                color = "blue";
                statusLabel = "Sedang Direview";
            }

            return {
                label: (
                    <div style={{ paddingRight: 8 }}>
                        <Tag color={color} style={{ fontWeight: 800, margin: 0, borderRadius: 6 }}>
                            {statusLabel.toUpperCase()}
                        </Tag>
                    </div>
                ),
                dot: statusDot,
                children: (
                    <div style={{ marginBottom: 20 }}>
                        <h4 style={{ margin: 0, fontWeight: 800, fontSize: "14px", color: isDarkMode ? "#f8fafc" : "#0f172a" }}>
                            {getLevelLabel(app.approval_level)}
                        </h4>
                        
                        {app.approved_by && (
                            <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: "12px", color: "#64748b" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                    <UserOutlined /> {app.approved_by?.name || app.approved_by_name || "Sistem"}
                                </span>
                                {app.approved_at && (
                                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                        <CalendarOutlined /> {dayjs(app.approved_at).format("DD MMM YYYY, HH:mm")}
                                    </span>
                                )}
                            </div>
                        )}
                        
                        {app.comment && (
                            <div style={{ 
                                marginTop: 8, 
                                padding: "8px 12px", 
                                borderRadius: 8, 
                                background: isDarkMode ? "#0f172a" : "#f1f5f9",
                                borderLeft: `3px solid ${app.status === "Returned" ? "#ef4444" : "#10b981"}`,
                                fontSize: "13px",
                                fontWeight: 500,
                                color: isDarkMode ? "#cbd5e1" : "#475569"
                            }}>
                                <div style={{ fontWeight: 700, fontSize: "11px", color: "#64748b", marginBottom: 2, textTransform: "uppercase" }}>
                                    KOMENTAR / ALASAN
                                </div>
                                {app.comment}
                            </div>
                        )}
                    </div>
                )
            };
        });
    };

    return (
        <Card 
            title={
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 4, height: 16, background: "#10b981", borderRadius: 2 }}></div>
                    <span style={{ fontSize: 14, color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 800, letterSpacing: 0.5 }}>
                        ALUR APPROVAL BERJENJANG (APPROVAL CHAIN)
                    </span>
                </div>
            }
            styles={{ 
                header: { borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9", padding: "0 24px" },
                body: { padding: "24px" }
            }}
            style={{ 
                borderRadius: 20,
                border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
                background: isDarkMode ? "#1e293b" : "#ffffff",
                marginBottom: 24
            }}
        >
            <div style={{ padding: "8px 0" }}>
                <Timeline
                    mode="left"
                    items={getTimelineItems()}
                />

                {isCompleted && (
                    <Alert
                        message={<span style={{ fontWeight: 800, color: "#065f46" }}>INVESTIGASI SELESAI & DISETUJUI</span>}
                        description="Laporan penyelidikan kecelakaan (LPKS/LPKL) telah disetujui sepenuhnya oleh KTT, OHS D/H, ENV D/H (jika ada), dan PJA. Dokumen ini sekarang dalam mode View Only."
                        type="success"
                        showIcon
                        icon={<CheckCircleOutlined />}
                        style={{ borderRadius: 12, marginTop: 12 }}
                    />
                )}

                {!isCompleted && !userCanAct && (
                    <div style={{ 
                        marginTop: 12, 
                        padding: "12px 16px", 
                        borderRadius: 10, 
                        background: isDarkMode ? "#1e293b" : "#f8fafc", 
                        border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`,
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: "13px",
                        color: "#64748b",
                        fontWeight: 500
                    }}>
                        <ExclamationCircleOutlined />
                        <span>Menunggu tindakan persetujuan dari <strong>{getLevelLabel(currentLevel)}</strong>.</span>
                    </div>
                )}
            </div>
        </Card>
    );
}
