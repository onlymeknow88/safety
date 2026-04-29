import { Button, Card, Col, Form, Modal, Row, Space, Switch, Tag } from "antd";
import React, { useEffect } from "react";

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
    loading,
    initialValues,
    master = {},
    hook = {}
}) {
    const { isDarkMode } = useTheme();
    const [form] = Form.useForm();
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
                            {initialValues ? 'EDIT' : 'BUAT'} NOTIFIKASI KECELAKAAN
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

                <Form form={form} layout="vertical">
                    <Row gutter={24}>
                        <Col xs={24} lg={17}>
                            <Card
                                title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <span style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#000000', fontWeight: 800, letterSpacing: 0.5 }}>RINGKASAN INSIDEN</span>
                                    <Tag color="blue" style={{ borderRadius: 4, fontSize: 11, fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '2px 8px' }}>DRAFT UTAMA</Tag>
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
                                    <Switch checked={isHpri} onChange={setIsHpri} size="large" style={{ background: isHpri ? '#22c55e' : '#cbd5e1', transform: 'scale(1.2)' }} />
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

                    <Row gutter={24}>
                        <Col xs={24} lg={16}>
                            <Card title={<span style={{ fontSize: 13, color: isDarkMode ? '#fff' : '#000000', fontWeight: 800, letterSpacing: 0.5 }}>KRONOLOGI AWAL & FAKTA KEJADIAN</span>} style={cardStyle} styles={{ header: { borderBottom: '1px solid #f1f5f9' } }}>
                                <ChronologySection
                                    incidentFacts={incidentFacts} setIncidentFacts={setIncidentFacts}
                                    correctiveActions={correctiveActions} setCorrectiveActions={setCorrectiveActions}
                                    isDarkMode={isDarkMode}
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
                        <MediaSection fileList={fileList} setFileList={setFileList} />
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

                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 16, paddingTop: 24, marginBottom: 24 }}>
                        <Button onClick={onCancel} style={{ borderRadius: 8, fontWeight: 600, padding: '0 32px', height: 42 }}>
                            Cancel
                        </Button>
                        <Button onClick={() => onFinish(form, 'draft')} loading={loading} style={{ borderRadius: 8, fontWeight: 600, padding: '0 32px', height: 42 }}>
                            Save As Draft
                        </Button>
                        <Button type="primary" onClick={() => onFinish(form, 'submitted')} loading={loading} style={{ background: "#2563eb", border: "none", fontWeight: 700, borderRadius: 8, padding: '0 48px', height: 42, boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)" }}>
                            Submit
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
}
