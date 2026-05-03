import { Alert, Button, Card, Col, DatePicker, Form, Modal, Row, Select, Space, Switch, Tag } from "antd";
import React, { useEffect } from "react";
import { usePage } from "@inertiajs/react";

import ChronologySection from "@/Pages/AccidentNotification/Partials/Components/ChronologySection";
import ConsequenceSection from "@/Pages/AccidentNotification/Partials/Components/ConsequenceSection";
// Force refresh after moving components to subfolder
import IncidentOverviewSection from "@/Pages/AccidentNotification/Partials/Components/IncidentOverviewSection";
import MediaSection from "@/Pages/AccidentNotification/Partials/Components/MediaSection";
import ReporterSection from "@/Pages/AccidentNotification/Partials/Components/ReporterSection";
import SeveritySection from "@/Pages/AccidentNotification/Partials/Components/SeveritySection";
import VictimSection from "@/Pages/AccidentNotification/Partials/Components/VictimSection";
import dayjs from "dayjs";
import { useTheme } from "@/Contexts/ThemeContext";

export default function AccidentNotificationModal({
    visible,
    onCancel,
    onFinish,
    onApprove,
    onReturn,
    loading,
    initialValues,
    master = {},
    hook = {},
    mode = 'add' // 'add', 'edit', 'detail'
}) {
    const { isDarkMode } = useTheme();
    const [form] = Form.useForm();
    const isDetail = mode === 'detail';
    const authUser = usePage().props.auth.user;
    
    // Debugging (bisa dihapus setelah ok)
    // console.log('Auth User:', authUser);
    // console.log('Initial Values Status ID:', initialValues?.status_id);

    const canApprove = authUser?.can_approve;
    const showApproveButton = isDetail && 
        (initialValues?.status_id == 3 || initialValues?.status_id == 6 || initialValues?.status?.name?.toLowerCase() === 'submitted') && 
        canApprove;

    const getStatusColor = () => {
        const name = initialValues?.status?.name?.toLowerCase() || "";
        const id = initialValues?.status_id;
        
        if (name.includes("approved") || name.includes("closed") || id == 7) return { color: "#059669", bg: "#ecfdf5" };
        if (name.includes("submitted") || id == 6) return { color: "#2563eb", bg: "#eff6ff" };
        if (name.includes("open") || id == 3) return { color: "#0891b2", bg: "#ecfeff" };
        if (name.includes("return") || id == 8) return { color: "#d97706", bg: "#fffbeb" }; // Amber
        if (name.includes("overdue")) return { color: "#dc2626", bg: "#fef2f2" };
        return { color: "#64748b", bg: "#f8fafc" }; // Draft/Default
    };

    const statusStyle = getStatusColor();

    const userRoles = (authUser?.roles || []).map(r => r.toLowerCase());
    const isCrs = userRoles.includes('crs');
    const isApproved = initialValues?.status_id == 7;
    
    // Administrator can edit anytime, CRS only after full approval
    const canEditReporting = authUser?.is_administrator || (isCrs && isApproved);

    const {
        isHpri, setIsHpri,
        severity, setSeverity,
        incidentFacts, setIncidentFacts,
        correctiveActions, setCorrectiveActions,
        fileList, setFileList
    } = hook;

    useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    incident_date: initialValues.incident_date ? dayjs(initialValues.incident_date) : null,
                    incident_time: initialValues.incident_time ? dayjs(`2000-01-01 ${initialValues.incident_time}`) : null,
                    due_date: initialValues.due_date ? dayjs(initialValues.due_date) : null,
                    presentation_date: initialValues.presentation_date ? dayjs(initialValues.presentation_date) : null,
                    submit_date: initialValues.submit_date ? dayjs(initialValues.submit_date) : null,
                    kait_reporting_date: initialValues.kait_reporting_date ? dayjs(initialValues.kait_reporting_date) : null,
                });

                if (initialValues.photos) {
                    setFileList(initialValues.photos.map(p => ({
                        uid: p.id,
                        name: p.filename,
                        status: 'done',
                        url: `${window.location.origin}/storage/${p.path.replace(/\\/g, '/')}`,
                    })));
                }
            } else {
                form.resetFields();
                setIsHpri(false);
                setSeverity({
                    actual_k3: null, actual_kk: null, actual_lh: null, actual_ksl: null, actual_pp: null,
                    potential_k3: null, potential_kk: null, potential_lh: null, potential_ksl: null, potential_pp: null,
                });
                setIncidentFacts(['']);
                setCorrectiveActions(['']);
                setFileList([]);
            }
        }
    }, [visible, initialValues]);

    const cardStyle = {
        marginBottom: 24,
        borderRadius: 16,
        border: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9',
        background: isDarkMode ? "#1e293b" : "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
    };

    const headerTitleStyle = {
        margin: 0,
        fontWeight: 900,
        fontSize: 28,
        letterSpacing: -1,
        color: isDarkMode ? '#fff' : '#000000'
    };

    const getTitle = () => {
        if (isDetail) return 'DETAIL';
        return initialValues ? 'EDIT' : 'BUAT';
    };

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={1200}
            style={{ top: 20 }}
            styles={{ body: { padding: '24px 16px' } }}
            destroyOnHidden
        >
            <div style={{ padding: '0 16px' }}>
                <Row justify="space-between" align="top" style={{ marginBottom: 32, borderBottom: `2px solid ${isDarkMode ? '#334155' : '#f1f5f9'}`, paddingBottom: 16 }}>
                    <Col>
                        <h1 style={headerTitleStyle}>
                            {getTitle()} NOTIFIKASI KECELAKAAN
                        </h1>
                    </Col>
                    <Col style={{ textAlign: "right" }}>
                        <div style={{ color: isDarkMode ? '#94a3b8' : '#000000', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                            DOCUMENT ID
                        </div>
                        <div style={{ color: '#2563eb', fontSize: 14, fontWeight: 900, marginBottom: 8 }}>
                            F-MAC-IMS-14-001 Rev. 4.0
                        </div>
                        {initialValues && (
                            <Row gutter={24} justify="end">
                                <Col>
                                    <div style={{ color: isDarkMode ? '#94a3b8' : '#000000', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>ACCIDENT NO</div>
                                    <div style={{ color: '#dc2626', fontSize: 16, fontWeight: 900 }}>{initialValues.accident_number}</div>
                                </Col>
                                <Col>
                                    <div style={{ color: isDarkMode ? '#94a3b8' : '#000000', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>NOTIFICATION NO</div>
                                    <div style={{ color: isDarkMode ? '#fff' : '#1e293b', fontSize: 16, fontWeight: 900 }}>{initialValues.notification_number}</div>
                                </Col>
                            </Row>
                        )}
                    </Col>
                </Row>

                {initialValues?.approval_comment && (
                    <Alert
                        message={<span style={{ fontWeight: 800 }}>CATATAN PERBAIKAN DARI APPROVER:</span>}
                        description={<div style={{ fontWeight: 600 }}>{initialValues.approval_comment}</div>}
                        type="warning"
                        showIcon
                        style={{ marginBottom: 24, borderRadius: 12, border: '1px solid #faad14', background: '#fffbe6' }}
                    />
                )}

                <Form form={form} layout="vertical" disabled={isDetail} className={isDetail ? 'readonly-form' : ''}>
                    <Row gutter={24}>
                        <Col xs={24} lg={17}>
                            <Card
                                title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <span style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#000000', fontWeight: 800, letterSpacing: 0.5 }}>RINGKASAN INSIDEN</span>
                                    {initialValues?.status && (
                                        <Tag style={{ 
                                            borderRadius: 4, 
                                            fontSize: 11, 
                                            fontWeight: 800, 
                                            background: statusStyle.bg, 
                                            color: statusStyle.color, 
                                            border: `1px solid ${statusStyle.color}20`, 
                                            padding: '2px 8px' 
                                        }}>
                                            {initialValues.status.name.toUpperCase()}
                                        </Tag>
                                    )}
                                </div>}
                                styles={{ header: { borderBottom: '1px solid #f1f5f9' } }} style={cardStyle}
                            >
                                <IncidentOverviewSection master={master} />
                            </Card>
                        </Col>
                        <Col xs={24} lg={7}>
                            <div style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', borderRadius: 16,
                                border: `2px dashed ${isDarkMode ? 'rgba(255,255,255,0.15)' : '#cbd5e1'}`,
                                background: isDarkMode ? 'transparent' : '#fff', height: 'auto', marginBottom: 24, minHeight: 280, justifyContent: 'center'
                            }}>
                                <span style={{ fontSize: 12, fontWeight: 900, color: isDarkMode ? '#94a3b8' : '#64748b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>POTENSI BAHAYA TINGGI</span>
                                <h2 style={{ fontSize: 48, fontWeight: 900, margin: '0 0 16px 0', color: isDarkMode ? '#fff' : '#0f172a', lineHeight: 1 }}>HPRI?</h2>
                                <Space align="center" style={{ marginBottom: 20 }}>
                                    <Switch checked={isHpri} onChange={setIsHpri} size="large" style={{ background: isHpri ? '#22c55e' : '#cbd5e1', transform: 'scale(1.2)' }} disabled={isDetail} />
                                    <span style={{ fontSize: 18, fontWeight: 900, color: isHpri ? '#22c55e' : (isDarkMode ? '#fff' : '#000000'), marginLeft: 12 }}>{isHpri ? 'YA' : 'TIDAK'}</span>
                                </Space>
                                <p style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#000000', margin: 0, textAlign: 'center', lineHeight: 1.5, fontWeight: 600 }}>High Potential Risk Incident<br />classification as per IMS-14-001</p>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Card title={<span style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#000000', fontWeight: 800, letterSpacing: 0.5 }}>KEPARAHAN AKTUAL</span>} style={cardStyle} styles={{ header: { borderBottom: '1px solid #f1f5f9' } }}>
                                <SeveritySection prefix="actual" severity={severity} setSeverity={setSeverity} isDarkMode={isDarkMode} />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card title={<span style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#000000', fontWeight: 800, letterSpacing: 0.5 }}>KEPARAHAN POTENSIAL</span>} style={cardStyle} styles={{ header: { borderBottom: '1px solid #f1f5f9' } }}>
                                <SeveritySection prefix="potential" severity={severity} setSeverity={setSeverity} isDarkMode={isDarkMode} />
                            </Card>
                        </Col>
                    </Row>

                    <Card title={<span style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#000000', fontWeight: 800, letterSpacing: 0.5 }}>DATA KORBAN / ORANG YANG TERLIBAT</span>} style={cardStyle} styles={{ header: { borderBottom: '1px solid #f1f5f9' } }}>
                        <VictimSection master={master} />
                    </Card>

                    <Row gutter={24}>
                        <Col xs={24} lg={16}>
                            <Card title={<span style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#000000', fontWeight: 800, letterSpacing: 0.5 }}>KRONOLOGI AWAL & FAKTA KEJADIAN</span>} style={cardStyle} styles={{ header: { borderBottom: '1px solid #f1f5f9' } }}>
                                <ChronologySection
                                    incidentFacts={incidentFacts} setIncidentFacts={setIncidentFacts}
                                    correctiveActions={correctiveActions} setCorrectiveActions={setCorrectiveActions}
                                    isDarkMode={isDarkMode}
                                    disabled={isDetail}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card title={<span style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#000000', fontWeight: 800, letterSpacing: 0.5 }}>AKIBAT KECELAKAAN</span>} style={cardStyle} styles={{ header: { borderBottom: '1px solid #f1f5f9' } }}>
                                <ConsequenceSection />
                            </Card>
                        </Col>
                    </Row>

                    <Card title={<span style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#000000', fontWeight: 800, letterSpacing: 0.5 }}>LAMPIRAN MEDIA (PHOTOS)</span>} style={cardStyle} styles={{ header: { borderBottom: '1px solid #f1f5f9' } }}>
                        <MediaSection fileList={fileList} setFileList={setFileList} disabled={isDetail} />
                    </Card>

                    <Card title={<span style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#000000', fontWeight: 800, letterSpacing: 0.5 }}>PELAPORAN</span>} style={cardStyle} styles={{ header: { borderBottom: '1px solid #f1f5f9' } }}>
                        <Row gutter={24}>
                            <Col xs={24} md={4}>
                                <Form.Item name="lpks_lpkl" label={<span style={{ fontSize: 12, fontWeight: 800, color: '#475569' }}>LPKS / LPKL</span>}>
                                    <Select placeholder="Pilih Tipe" style={{ width: '100%' }} disabled={!canEditReporting}>
                                        <Select.Option value="LPKS">LPKS</Select.Option>
                                        <Select.Option value="LPKL">LPKL</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={5}>
                                <Form.Item name="due_date" label={<span style={{ fontSize: 12, fontWeight: 800, color: '#475569' }}>DUE DATE</span>}>
                                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" disabled={!canEditReporting} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={5}>
                                <Form.Item name="presentation_date" label={<span style={{ fontSize: 12, fontWeight: 800, color: '#475569' }}>TANGGAL PRESENTASI</span>}>
                                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" disabled={!canEditReporting} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={5}>
                                <Form.Item name="submit_date" label={<span style={{ fontSize: 12, fontWeight: 800, color: '#475569' }}>SUBMIT DATE</span>}>
                                    <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" placeholder="DD/MM/YYYY" disabled={!canEditReporting} />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={5}>
                                <Form.Item name="progress_status_id" label={<span style={{ fontSize: 12, fontWeight: 800, color: '#475569' }}>STATUS LAPORAN</span>}>
                                    <Select placeholder="Pilih Status" style={{ width: '100%' }} disabled={!canEditReporting}>
                                        <Select.Option value={1}>Closed</Select.Option>
                                        <Select.Option value={2}>Closed Overdue</Select.Option>
                                        <Select.Option value={3}>Open</Select.Option>
                                        <Select.Option value={4}>Overdue</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24}>
                                <Form.Item name="presentation_invitation" label={<span style={{ fontSize: 12, fontWeight: 800, color: '#475569' }}>UNDANGAN PRESENTASI</span>}>
                                    <Select placeholder="Pilih Status" style={{ width: '100%' }} disabled={!canEditReporting}>
                                        <Select.Option value="DONE">DONE</Select.Option>
                                        <Select.Option value="PENDING">PENDING</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <div style={{ background: isDarkMode ? 'rgba(30, 58, 138, 0.15)' : '#eff6ff', padding: '24px 32px', borderRadius: 16, border: `1px solid ${isDarkMode ? 'rgba(30, 58, 138, 0.3)' : '#dbeafe'}`, marginBottom: 24 }}>
                                <ReporterSection type="reporter" />
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div style={{ background: isDarkMode ? 'rgba(30, 58, 138, 0.15)' : '#eff6ff', padding: '24px 32px', borderRadius: 16, border: `1px solid ${isDarkMode ? 'rgba(30, 58, 138, 0.3)' : '#dbeafe'}`, marginBottom: 24 }}>
                                <ReporterSection type="approver" />
                            </div>
                        </Col>
                    </Row>

                    {/* Metadata Section */}
                    <div style={{ 
                        marginTop: 8, 
                        padding: '16px 24px', 
                        borderRadius: 12, 
                        background: isDarkMode ? '#0f172a' : '#f8fafc', 
                        border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                        fontSize: 12
                    }}>
                        <Row gutter={[24, 12]}>
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Created By</div>
                                <div style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a', fontWeight: 800 }}>
                                    {initialValues ? initialValues.created_by : usePage().props.auth.user.name}
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Created At</div>
                                <div style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a', fontWeight: 800 }}>
                                    {initialValues ? dayjs(initialValues.created_at).format('DD MMM YYYY HH:mm') : dayjs().format('DD MMM YYYY HH:mm')}
                                </div>
                            </Col>
                            {initialValues && (
                                <>
                                    <Col xs={24} sm={12} md={6}>
                                        <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Updated By</div>
                                        <div style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a', fontWeight: 800 }}>
                                            {initialValues.updated_by || '-'}
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Updated At</div>
                                        <div style={{ color: isDarkMode ? '#f1f5f9' : '#0f172a', fontWeight: 800 }}>
                                            {dayjs(initialValues.updated_at).format('DD MMM YYYY HH:mm')}
                                        </div>
                                    </Col>
                                </>
                            )}
                        </Row>
                    </div>
                </Form>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, paddingTop: 24, marginBottom: 24 }}>
                    <Button onClick={onCancel} style={{ borderRadius: 8, fontWeight: 600, padding: '0 32px', height: 42 }}>
                        {isDetail ? 'Close' : 'Cancel'}
                    </Button>
                    {isDetail && canEditReporting && (
                        <Button 
                            type="primary" 
                            onClick={() => onFinish(form, 'edit')} 
                            loading={loading} 
                            style={{ background: "#8b5cf6", border: "none", fontWeight: 700, borderRadius: 8, padding: '0 48px', height: 42, boxShadow: "0 4px 6px -1px rgba(139, 92, 246, 0.2)" }}
                        >
                            Update Reporting
                        </Button>
                    )}
                    {showApproveButton && (
                        <>
                            <Button 
                                onClick={() => {
                                    onReturn(initialValues);
                                    onCancel();
                                }} 
                                loading={loading} 
                                style={{ color: "#faad14", borderColor: "#faad14", fontWeight: 600, borderRadius: 8, padding: '0 32px', height: 42 }}
                            >
                                Return for Correction
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={() => {
                                    onApprove(initialValues);
                                    onCancel(); // Close modal after approval
                                }} 
                                loading={loading} 
                                style={{ background: "#059669", border: "none", fontWeight: 700, borderRadius: 8, padding: '0 48px', height: 42, boxShadow: "0 4px 6px -1px rgba(5, 150, 105, 0.2)" }}
                            >
                                Approve Now
                            </Button>
                        </>
                    )}
                    {!isDetail && (
                        <>
                            <Button onClick={() => onFinish(form, 'draft')} loading={loading} style={{ borderRadius: 8, fontWeight: 600, padding: '0 32px', height: 42 }}>
                                Save As Draft
                            </Button>
                            <Button type="primary" onClick={() => onFinish(form, 'submitted')} loading={loading} style={{ background: "#2563eb", border: "none", fontWeight: 700, borderRadius: 8, padding: '0 48px', height: 42, boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" }}>
                                Submit
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <style>{`
                .readonly-form .ant-input-disabled,
                .readonly-form .ant-input-number-disabled,
                .readonly-form .ant-select-disabled .ant-select-selector,
                .readonly-form .ant-picker-disabled,
                .readonly-form .ant-checkbox-disabled + span,
                .readonly-form .ant-radio-disabled + span {
                    color: ${isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)'} !important;
                    background-color: transparent !important;
                    cursor: default !important;
                    border-color: transparent !important;
                    opacity: 1 !important;
                    padding-left: 0 !important;
                }
                .readonly-form .ant-select-disabled .ant-select-arrow {
                    display: none;
                }
                .readonly-form .ant-switch-disabled {
                    opacity: 0.8 !important;
                }
                /* Hide delete buttons and add row buttons in detail mode if they exist */
                .readonly-form .ant-btn-icon-only, 
                .readonly-form .ant-btn-dashed {
                    display: none !important;
                }
            `}</style>
        </Modal>
    );
}
