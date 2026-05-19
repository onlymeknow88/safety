import React, { useEffect } from "react";
import { 
    Modal, Form, Row, Col, Select, Switch, Input, Button, Card, 
    Tag, Space, Divider, Empty, Descriptions, Avatar, Typography
} from "antd";
import { 
    FileSearchOutlined, 
    ExclamationCircleOutlined,
    UserOutlined,
    BookOutlined,
    FileImageOutlined,
    CheckCircleOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { usePage } from "@inertiajs/react";
import { useTheme } from "@/Contexts/ThemeContext";
import PicaIntegration from "./Components/PicaIntegration";
import DocumentUploadSection from "./Components/DocumentUploadSection";
import ApprovalChainSection from "./Components/ApprovalChainSection";

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
    hook = {}
}) {
    const { isDarkMode } = useTheme();
    const { auth } = usePage().props;
    const [form] = Form.useForm();
    
    const isDetail = mode === "detail";
    const isEdit = mode === "edit";
    const isAdd = mode === "add";

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
        setFileList
    } = hook;

    // Reset or populate form values on visible changes
    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    accident_notification_id: initialValues.accident_notification_id,
                    report_type: initialValues.report_type
                });
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues]);

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

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={1200}
            style={{ top: 20 }}
            styles={{ body: { padding: "32px 24px" } }}
            destroyOnClose
            centered
        >
            <div style={{ padding: "0 8px" }}>
                {/* Header Title Section */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 32, borderBottom: `2px solid ${isDarkMode ? "#334155" : "#f1f5f9"}`, paddingBottom: 24 }}>
                    <Col>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <h1 style={{
                                margin: 0,
                                fontWeight: 900,
                                fontSize: 28,
                                letterSpacing: "-0.02em",
                                color: isDarkMode ? "#f8fafc" : "#0f172a"
                            }}>
                                {getTitle()} LAPORAN PENYELIDIKAN
                            </h1>
                            {initialValues?.investigation_status && (
                                <Tag color={initialValues.investigation_status === "Completed" ? "green" : "orange"} style={{ borderRadius: 6, fontWeight: 800, padding: "4px 12px" }}>
                                    {initialValues.investigation_status.toUpperCase()}
                                </Tag>
                            )}
                        </div>
                    </Col>
                    <Col style={{ textAlign: "right" }}>
                        <div style={{ color: "#3b82f6", fontSize: 13, fontWeight: 900 }}>
                            F-MAC-IMS-14-002 Rev. 2.0
                        </div>
                        {initialValues?.report_number && (
                            <div style={{ color: isDarkMode ? "#f8fafc" : "#1e293b", fontSize: 16, fontWeight: 900, marginTop: 4 }}>
                                {initialValues.report_number}
                            </div>
                        )}
                    </Col>
                </Row>

                <Form form={form} layout="vertical" disabled={isDetail}>
                    
                    {/* SECTION 1: Pilih Notifikasi Kecelakaan (Form Input / Dropdown) */}
                    <Card
                        title={<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 4, height: 16, background: "#3b82f6", borderRadius: 2 }}></div>
                            <span style={{ fontSize: 14, color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 800 }}>PILIH NOTIFIKASI KECELAKAAN</span>
                        </div>}
                        style={cardStyle}
                        styles={{ 
                            header: { borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9", padding: "0 24px" },
                            body: { padding: "24px" }
                        }}
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
                                        disabled={!isAdd}
                                        options={approvedNotifications.map(n => ({
                                            label: `${n.notification_number} - ${n.incident_title}`,
                                            value: n.id
                                        }))}
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
                                    <Select disabled>
                                        <Select.Option value="LPKS">LPKS (Laporan Penyelidikan Kecelakaan Sederhana)</Select.Option>
                                        <Select.Option value="LPKL">LPKL (Laporan Penyelidikan Kecelakaan Lengkap)</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {/* SECTION 2: Tampilkan Data Ter-Populate (Read Only) */}
                    {selectedNotification && (
                        <Card
                            title={<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <div style={{ width: 4, height: 16, background: "#8b5cf6", borderRadius: 2 }}></div>
                                <span style={{ fontSize: 14, color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 800 }}>RINGKASAN DATA NOTIFIKASI KECELAKAAN (AUTO-POPULATE)</span>
                            </div>}
                            style={cardStyle}
                            styles={{ 
                                header: { borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9", padding: "0 24px" },
                                body: { padding: "24px" }
                            }}
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
                                    {selectedNotification.incident_type?.name || "-"}
                                </Descriptions.Item>
                                
                                <Descriptions.Item label="HPRI?" span={3}>
                                    <Tag color={selectedNotification.is_hpri ? "red" : "blue"} style={{ fontWeight: 800 }}>
                                        {selectedNotification.is_hpri ? "YA (HIGH POTENTIAL)" : "TIDAK"}
                                    </Tag>
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider style={{ margin: "20px 0" }} />

                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <h4 style={{ fontWeight: 800, color: "#64748b", display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                        <UserOutlined /> DATA KORBAN KECELAKAAN
                                    </h4>
                                    {selectedNotification.victim_name ? (
                                        <Descriptions bordered column={1} size="small">
                                            <Descriptions.Item label="Nama Korban">{selectedNotification.victim_name}</Descriptions.Item>
                                            <Descriptions.Item label="Jenis Kelamin">{selectedNotification.victim_gender?.name || "-"}</Descriptions.Item>
                                            <Descriptions.Item label="Umur">{selectedNotification.victim_age || "-"} Tahun</Descriptions.Item>
                                            <Descriptions.Item label="Jabatan">{selectedNotification.victim_position?.name || "-"}</Descriptions.Item>
                                            <Descriptions.Item label="Pengalaman">{selectedNotification.victim_experience?.label || "-"}</Descriptions.Item>
                                        </Descriptions>
                                    ) : (
                                        <div style={{ color: "#64748b", fontStyle: "italic", padding: "12px", background: isDarkMode ? "#0f172a" : "#f8fafc", borderRadius: 8 }}>
                                            Tidak ada korban dilaporkan.
                                        </div>
                                    )}
                                </Col>
                                <Col xs={24} md={12}>
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

                    {/* SECTION 3: Detail Investigasi Lanjutan (Manual Inputs) */}
                    <Card
                        title={<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 4, height: 16, background: "#ef4444", borderRadius: 2 }}></div>
                            <span style={{ fontSize: 14, color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 800 }}>HASIL PENYELIDIKAN & ANALISIS AKAR MASALAH (ROOT CAUSE)</span>
                        </div>}
                        style={cardStyle}
                        styles={{ 
                            header: { borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9", padding: "0 24px" },
                            body: { padding: "24px" }
                        }}
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
                                <Form.Item label={<span style={{ fontWeight: 700 }}>1. Hasil Investigasi Detail (Penyelidikan Lengkap)</span>}>
                                    <Input.TextArea
                                        rows={6}
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
                                <Form.Item label={<span style={{ fontWeight: 700 }}>2. Analisa Akar Masalah (Root Cause Analysis - RCA)</span>}>
                                    <Input.TextArea
                                        rows={6}
                                        value={rootCauseAnalysis}
                                        onChange={(e) => setRootCauseAnalysis(e.target.value)}
                                        placeholder="Gunakan metode RCA (contoh: 5 Whys, Fishbone, dll.) untuk menguraikan faktor penyebab utama..."
                                        disabled={isDetail}
                                        style={{ borderRadius: 8 }}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item label={<span style={{ fontWeight: 700 }}>3. Tindakan Pencegahan Ulang (Preventive Action)</span>}>
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

                    {/* SECTION 4: PICA (Rencana Perbaikan Rinci) */}
                    <Card
                        title={<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 4, height: 16, background: "#f59e0b", borderRadius: 2 }}></div>
                            <span style={{ fontSize: 14, color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 800 }}>PICA (PROBLEM IDENTIFICATION & CORRECTIVE ACTION)</span>
                        </div>}
                        style={cardStyle}
                        styles={{ 
                            header: { borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9", padding: "0 24px" },
                            body: { padding: "24px" }
                        }}
                    >
                        <PicaIntegration 
                            correctiveActions={correctiveActions} 
                            setCorrectiveActions={setCorrectiveActions}
                            disabled={isDetail}
                            isDarkMode={isDarkMode}
                        />
                    </Card>

                    {/* SECTION 5: Pendukung (Attachments) */}
                    <Card
                        title={<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 4, height: 16, background: "#6366f1", borderRadius: 2 }}></div>
                            <span style={{ fontSize: 14, color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 800 }}>DOKUMEN INVESTIGASI PENDUKUNG (MAKS 10 BERKAS)</span>
                        </div>}
                        style={cardStyle}
                        styles={{ 
                            header: { borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9", padding: "0 24px" },
                            body: { padding: "24px" }
                        }}
                    >
                        <DocumentUploadSection 
                            fileList={fileList} 
                            setFileList={setFileList}
                            disabled={isDetail}
                            isDarkMode={isDarkMode}
                        />
                    </Card>

                    {/* SECTION 6: Multi-level Approval UI */}
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

                {/* Footer Buttons */}
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 40, borderTop: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`, marginBottom: 16 }}>
                    <Button onClick={onCancel} style={{ borderRadius: 10, fontWeight: 700, padding: "0 24px", height: 40 }}>
                        {isDetail ? "Tutup" : "Batal"}
                    </Button>
                    
                    {!isDetail && (
                        <>
                            <Button 
                                onClick={() => onFinish(form, "draft")} 
                                loading={loading} 
                                style={{ borderRadius: 10, fontWeight: 700, padding: "0 24px", height: 40 }}
                            >
                                Simpan Draf
                            </Button>
                            <Button 
                                type="primary"
                                onClick={() => onFinish(form, "submitted")} 
                                loading={loading}
                                style={{ 
                                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", 
                                    border: "none", 
                                    fontWeight: 700, 
                                    borderRadius: 10, 
                                    padding: "0 40px", 
                                    height: 40,
                                    boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.2)"
                                }}
                            >
                                Kirim Penyelidikan (Submit)
                            </Button>
                        </>
                    )}
                </div>

            </div>
        </Modal>
    );
}
