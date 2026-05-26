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

    const permissions = authUser?.permissions || [];
    const isAdministrator = authUser?.is_administrator || false;
    // canApprove strictly follows role permissions for the ACTION
    const canApproveAction = isAdministrator || permissions.includes("accident-notification.approval");

    const showApproveButton = isDetail && 
        (initialValues?.status_id == 3 || initialValues?.status_id == 6 || initialValues?.status?.name?.toLowerCase() === 'submitted') && 
        canApproveAction;

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

    useEffect(() => {
        if (visible) {
            const actual = severity.actual_k3;
            const potential = severity.potential_k3;
            
            let type = null;
            // Rules:
            // LPKL: Actual 4,5 OR Potential 3,4,5
            // LPKS: Actual 1,2 AND Potential 1,2,3
            if ((actual === 4 || actual === 5) || (potential === 3 || potential === 4 || potential === 5)) {
                type = 'LPKL';
            } else if ((actual === 1 || actual === 2) && (potential === 1 || potential === 2 || potential === 3)) {
                type = 'LPKS';
            }
            
            if (type !== form.getFieldValue('lpks_lpkl')) {
                form.setFieldsValue({ lpks_lpkl: type });
            }
        }
    }, [severity.actual_k3, severity.potential_k3, visible]);

    const cardStyle = {
        marginBottom: 24,
        borderRadius: 20,
        border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
        background: isDarkMode ? "#1e293b" : "#ffffff",
        boxShadow: isDarkMode ? "0 4px 6px -1px rgba(0,0,0,0.2)" : "0 4px 6px -1px rgba(0,0,0,0.05)",
        overflow: 'hidden'
    };

    const headerTitleStyle = {
        margin: 0,
        fontWeight: 900,
        fontSize: 32,
        letterSpacing: '-0.02em',
        color: isDarkMode ? '#f8fafc' : '#0f172a',
        lineHeight: 1.2
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
            styles={{ body: { padding: '32px 24px' } }}
            destroyOnHidden
            centered
        >
            <div style={{ padding: '0 8px' }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 32, borderBottom: `2px solid ${isDarkMode ? '#334155' : '#f1f5f9'}`, paddingBottom: 24 }}>
                    <Col>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                            <h1 style={headerTitleStyle}>
                                {getTitle()} NOTIFIKASI KECELAKAAN
                            </h1>
                            {initialValues?.status && (
                                <Tag color={statusStyle.color} style={{ 
                                    borderRadius: 6, 
                                    fontSize: 12, 
                                    fontWeight: 800, 
                                    padding: '4px 12px',
                                    border: 'none',
                                    background: `${statusStyle.color}15`,
                                    color: statusStyle.color,
                                    margin: 0
                                }}>
                                    {initialValues.status.name.toUpperCase()}
                                </Tag>
                            )}
                        </div>
                        {showApproveButton && (
                            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                                <Button 
                                    onClick={() => onReturn(initialValues)} 
                                    loading={loading} 
                                    style={{ 
                                        color: "#d97706", 
                                        borderColor: "#f59e0b", 
                                        fontWeight: 700, 
                                        borderRadius: 8, 
                                        height: 38,
                                        padding: '0 16px',
                                        fontSize: 13
                                    }}
                                >
                                    Return for Correction
                                </Button>
                                <Button 
                                    type="primary" 
                                    onClick={() => onApprove(initialValues)} 
                                    loading={loading} 
                                    style={{ 
                                        background: "linear-gradient(135deg, #059669 0%, #10b981 100%)", 
                                        border: "none", 
                                        fontWeight: 700, 
                                        borderRadius: 8, 
                                        height: 38, 
                                        padding: '0 24px',
                                        fontSize: 13,
                                        boxShadow: "0 4px 12px rgba(5, 150, 105, 0.15)"
                                    }}
                                >
                                    Approve Now
                                </Button>
                            </div>
                        )}
                    </Col>
                    <Col style={{ textAlign: "right" }}>
                        <div style={{ marginBottom: 12 }}>
                            <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>
                                DOCUMENT ID
                            </div>
                            <div style={{ color: '#3b82f6', fontSize: 13, fontWeight: 900 }}>
                                F-MAC-IMS-14-001 Rev. 4.0
                            </div>
                        </div>
                        {initialValues && (
                            <div style={{ display: 'flex', gap: 24, justifyContent: 'flex-end' }}>
                                <div>
                                    <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>ACCIDENT NO</div>
                                    <div style={{ color: '#ef4444', fontSize: 16, fontWeight: 900 }}>{initialValues.accident_number}</div>
                                </div>
                                <div>
                                    <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 2 }}>NOTIFICATION NO</div>
                                    <div style={{ color: isDarkMode ? '#f8fafc' : '#1e293b', fontSize: 16, fontWeight: 900 }}>{initialValues.notification_number}</div>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>

                {initialValues?.approval_comment && (
                    <Alert
                        message={<span style={{ fontWeight: 800, fontSize: 14 }}>CATATAN PERBAIKAN DARI APPROVER</span>}
                        description={<div style={{ fontWeight: 600, fontSize: 14, marginTop: 4 }}>{initialValues.approval_comment}</div>}
                        type="warning"
                        showIcon
                        style={{ marginBottom: 32, borderRadius: 16, border: '1px solid #fde68a', background: '#fffbeb', padding: '16px 24px' }}
                    />
                )}

                <Form form={form} layout="vertical" disabled={isDetail} className={isDetail ? 'readonly-form' : ''}>
                    <Row gutter={24}>
                        <Col xs={24} lg={17}>
                            <Card
                                title={<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 4, height: 16, background: '#3b82f6', borderRadius: 2 }}></div>
                                    <span style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, letterSpacing: 0.5 }}>RINGKASAN INSIDEN</span>
                                </div>}
                                styles={{ 
                                    header: { borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', padding: '0 24px', minHeight: 56 },
                                    body: { padding: '24px' }
                                }}
                                style={cardStyle}
                            >
                                <IncidentOverviewSection master={master} disabled={isDetail} />
                            </Card>
                        </Col>
                        <Col xs={24} lg={7}>
                            <div style={{
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                padding: '40px 24px', 
                                borderRadius: 20,
                                border: isHpri ? '2px solid #22c55e' : `2px dashed ${isDarkMode ? '#334155' : '#cbd5e1'}`,
                                background: isHpri ? (isDarkMode ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4') : (isDarkMode ? '#1e293b' : '#ffffff'),
                                height: 'auto', 
                                marginBottom: 24, 
                                minHeight: 300, 
                                justifyContent: 'center',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: isHpri ? '0 10px 15px -3px rgba(34, 197, 94, 0.1)' : 'none'
                            }}>
                                <span style={{ 
                                    fontSize: 12, 
                                    fontWeight: 900, 
                                    color: isHpri ? '#16a34a' : (isDarkMode ? '#94a3b8' : '#64748b'), 
                                    textTransform: 'uppercase', 
                                    letterSpacing: '3px', 
                                    marginBottom: 16 
                                }}>POTENSI BAHAYA TINGGI</span>
                                
                                <div style={{ 
                                    fontSize: 56, 
                                    fontWeight: 950, 
                                    margin: '0 0 24px 0', 
                                    color: isHpri ? '#16a34a' : (isDarkMode ? '#f8fafc' : '#0f172a'), 
                                    lineHeight: 1,
                                    letterSpacing: '-0.05em'
                                }}>HPRI?</div>
                                
                                <Space align="center" style={{ marginBottom: 24 }}>
                                    <Switch 
                                        checked={isHpri} 
                                        onChange={setIsHpri} 
                                        size="large" 
                                        style={{ 
                                            background: isHpri ? '#22c55e' : '#94a3b8', 
                                            transform: 'scale(1.4)' 
                                        }} 
                                        disabled={isDetail} 
                                    />
                                    <span style={{ 
                                        fontSize: 24, 
                                        fontWeight: 900, 
                                        color: isHpri ? '#16a34a' : (isDarkMode ? '#94a3b8' : '#64748b'), 
                                        marginLeft: 20,
                                        width: 80
                                    }}>{isHpri ? 'YA' : 'TIDAK'}</span>
                                </Space>
                                
                                <p style={{ 
                                    fontSize: 13, 
                                    color: isHpri ? '#166534' : (isDarkMode ? '#94a3b8' : '#64748b'), 
                                    margin: 0, 
                                    textAlign: 'center', 
                                    lineHeight: 1.6, 
                                    fontWeight: 600,
                                    maxWidth: 200
                                }}>High Potential Risk Incident classification as per IMS-14-001</p>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Card 
                                title={<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 4, height: 16, background: '#ef4444', borderRadius: 2 }}></div>
                                    <span style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, letterSpacing: 0.5 }}>KEPARAHAN AKTUAL</span>
                                </div>} 
                                style={cardStyle}
                                styles={{ 
                                    header: { borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', padding: '0 24px' },
                                    body: { padding: '24px' }
                                }}
                            >
                                <SeveritySection prefix="actual" severity={severity} setSeverity={setSeverity} isDarkMode={isDarkMode} disabled={isDetail} />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card 
                                title={<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 4, height: 16, background: '#f59e0b', borderRadius: 2 }}></div>
                                    <span style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, letterSpacing: 0.5 }}>KEPARAHAN POTENSIAL</span>
                                </div>} 
                                style={cardStyle}
                                styles={{ 
                                    header: { borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', padding: '0 24px' },
                                    body: { padding: '24px' }
                                }}
                            >
                                <SeveritySection prefix="potential" severity={severity} setSeverity={setSeverity} isDarkMode={isDarkMode} disabled={isDetail} />
                            </Card>
                        </Col>
                    </Row>



                    <Row gutter={24}>
                        <Col xs={24} lg={16}>
                            <Card 
                                title={<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 4, height: 16, background: '#0ea5e9', borderRadius: 2 }}></div>
                                    <span style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, letterSpacing: 0.5 }}>KRONOLOGI AWAL & FAKTA KEJADIAN</span>
                                </div>} 
                                style={cardStyle}
                                styles={{ 
                                    header: { borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', padding: '0 24px' },
                                    body: { padding: '24px' }
                                }}
                            >
                                <ChronologySection
                                    incidentFacts={incidentFacts} setIncidentFacts={setIncidentFacts}
                                    correctiveActions={correctiveActions} setCorrectiveActions={setCorrectiveActions}
                                    isDarkMode={isDarkMode}
                                    disabled={isDetail}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card 
                                title={<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 4, height: 16, background: '#f43f5e', borderRadius: 2 }}></div>
                                    <span style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, letterSpacing: 0.5 }}>AKIBAT KECELAKAAN</span>
                                </div>} 
                                style={cardStyle}
                                styles={{ 
                                    header: { borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', padding: '0 24px' },
                                    body: { padding: '24px' }
                                }}
                            >
                                <ConsequenceSection disabled={isDetail} />
                            </Card>
                        </Col>
                    </Row>

                    <Card 
                        title={<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 4, height: 16, background: '#6366f1', borderRadius: 2 }}></div>
                            <span style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800, letterSpacing: 0.5 }}>LAMPIRAN MEDIA (PHOTOS)</span>
                        </div>} 
                        style={cardStyle}
                        styles={{ 
                            header: { borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #f1f5f9', padding: '0 24px' },
                            body: { padding: '24px' }
                        }}
                    >
                        <MediaSection fileList={fileList} setFileList={setFileList} disabled={isDetail} />
                    </Card>


                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <div style={{ 
                                background: isDarkMode ? 'rgba(59, 130, 246, 0.05)' : '#f8fafc', 
                                padding: '32px', 
                                borderRadius: 20, 
                                border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, 
                                marginBottom: 24,
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                                <ReporterSection type="reporter" disabled={isDetail} />
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div style={{ 
                                background: isDarkMode ? 'rgba(59, 130, 246, 0.05)' : '#f8fafc', 
                                padding: '32px', 
                                borderRadius: 20, 
                                border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`, 
                                marginBottom: 24,
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                                <ReporterSection type="approver" disabled={isDetail} />
                            </div>
                        </Col>
                    </Row>

                    {/* Metadata Section */}
                    <div style={{ 
                        marginTop: 16, 
                        padding: '24px 32px', 
                        borderRadius: 20, 
                        background: isDarkMode ? '#0f172a' : '#f1f5f9', 
                        border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                        fontSize: 13
                    }}>
                        <Row gutter={[32, 24]}>
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5, fontSize: 11 }}>Created By</div>
                                <div style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>
                                    {initialValues ? initialValues.created_by : authUser.name}
                                </div>
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                                <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5, fontSize: 11 }}>Created At</div>
                                <div style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>
                                    {initialValues ? dayjs(initialValues.created_at).format('DD MMM YYYY, HH:mm') : dayjs().format('DD MMM YYYY, HH:mm')}
                                </div>
                            </Col>
                            {initialValues && (
                                <>
                                    <Col xs={24} sm={12} md={6}>
                                        <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5, fontSize: 11 }}>Updated By</div>
                                        <div style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>
                                            {initialValues.updated_by || '-'}
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12} md={6}>
                                        <div style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6, letterSpacing: 0.5, fontSize: 11 }}>Updated At</div>
                                        <div style={{ color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>
                                            {dayjs(initialValues.updated_at).format('DD MMM YYYY, HH:mm')}
                                        </div>
                                    </Col>
                                </>
                            )}
                        </Row>
                    </div>

                </Form>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, paddingTop: 40, marginBottom: 16 }}>
                    <Button onClick={onCancel} style={{ borderRadius: 10, fontWeight: 700, padding: '0 24px', height: 40, fontSize: 14 }}>
                        {isDetail ? 'Close' : 'Cancel'}
                    </Button>

                    {!isDetail && (
                        <>
                            <Button onClick={() => onFinish(form, 'draft')} loading={loading} style={{ borderRadius: 10, fontWeight: 700, padding: '0 24px', height: 40, fontSize: 14 }}>
                                Save As Draft
                            </Button>
                            <Button 
                                type="primary" 
                                onClick={() => onFinish(form, 'submitted')} 
                                loading={loading} 
                                style={{ 
                                    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", 
                                    border: "none", 
                                    fontWeight: 700, 
                                    borderRadius: 10, 
                                    padding: '0 40px', 
                                    height: 40, 
                                    fontSize: 14,
                                    boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.2)" 
                                }}
                            >
                                Submit Notification
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <style>{`
                .readonly-form .ant-input-disabled,
                .readonly-form .ant-input-number-disabled,
                .readonly-form .ant-select-disabled .ant-select-selector,
                .readonly-form .ant-select-disabled .ant-select-selection-item,
                .readonly-form .ant-picker-disabled,
                .readonly-form .ant-picker-disabled input,
                .readonly-form .ant-checkbox-disabled + span,
                .readonly-form .ant-radio-disabled + span {
                    color: ${isDarkMode ? '#f8fafc' : '#0f172a'} !important;
                    background-color: transparent !important;
                    cursor: default !important;
                    border-color: transparent !important;
                    opacity: 1 !important;
                    padding-left: 0 !important;
                    font-weight: 700 !important;
                }
                .readonly-form .ant-select-disabled .ant-select-arrow,
                .readonly-form .ant-picker-suffix {
                    display: none !important;
                }
                .readonly-form .ant-form-item-label > label {
                    color: ${isDarkMode ? '#94a3b8' : '#64748b'} !important;
                }
                .readonly-form .ant-switch-disabled {
                    opacity: 0.8 !important;
                }
                .readonly-form .ant-btn-icon-only, 
                .readonly-form .ant-btn-dashed {
                    display: none !important;
                }
                .ant-card-head-title {
                    padding: 16px 0 !important;
                }
                .ant-form-item-label {
                    padding-bottom: 8px !important;
                }
                .ant-input, .ant-select-selector, .ant-picker {
                    border-radius: 8px !important;
                }
            `}</style>
        </Modal>
    );
}
