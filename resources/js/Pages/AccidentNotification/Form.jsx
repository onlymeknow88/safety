import React, { useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Form, Button, Card, Row, Col, Space, Switch, Tag } from "antd";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTheme } from "@/Contexts/ThemeContext";
import useAccidentNotification from "./Hooks/useAccidentNotification";
import IncidentOverviewSection from "./Partials/IncidentOverviewSection";
import SeveritySection from "./Partials/SeveritySection";
import ChronologySection from "./Partials/ChronologySection";
import ConsequenceSection from "./Partials/ConsequenceSection";
import MediaSection from "./Partials/MediaSection";
import ReporterSection from "./Partials/ReporterSection";
import dayjs from "dayjs";

export default function AccidentNotificationForm({ accidentNotification = null }) {
    const { isDarkMode } = useTheme();
    const [form] = Form.useForm();
    const {
        isHpri, setIsHpri,
        severity, setSeverity,
        incidentFacts, setIncidentFacts,
        correctiveActions, setCorrectiveActions,
        fileList, setFileList,
        handleSave,
        loading,
    } = useAccidentNotification(accidentNotification);

    useEffect(() => {
        if (accidentNotification) {
            form.setFieldsValue({
                ...accidentNotification,
                incident_date: accidentNotification.incident_date ? dayjs(accidentNotification.incident_date) : null,
                incident_time: accidentNotification.incident_time ? dayjs(`2000-01-01 ${accidentNotification.incident_time}`) : null,
            });

            if (accidentNotification.photos) {
                const photos = accidentNotification.photos.map(p => ({
                    uid: p.id,
                    name: p.filename,
                    status: 'done',
                    url: `/storage/${p.path}`,
                }));
                setFileList(photos);
            }
        }
    }, [accidentNotification]);

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
        color: '#000000'
    };

    return (
        <DashboardLayout title="Pemberitahuan Kecelakaan">
            <Head title="Pemberitahuan Kecelakaan" />

            <div style={{ padding: '24px 32px', maxWidth: 1400, margin: "0 auto" }}>

                {/* ── Header Form ── */}
                <Row justify="space-between" align="top" style={{ marginBottom: 32, borderBottom: `2px solid ${isDarkMode ? '#334155' : '#f1f5f9'}`, paddingBottom: 16 }}>
                    <Col>
                        <h1 style={headerTitleStyle}>
                            PEMBERITAHUAN KECELAKAAN
                        </h1>
                    </Col>
                    <Col style={{ textAlign: "right" }}>
                        <div style={{ color: '#000000', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                            DOCUMENT ID
                        </div>
                        <div style={{ color: '#2563eb', fontSize: 13, fontWeight: 900, marginBottom: 8 }}>
                            F-MAC-IMS-14-001 Rev. 4.0
                        </div>
                        <div style={{ color: '#000000', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                            NOTIFICATION NUMBER
                        </div>
                        <div style={{ color: '#1e293b', fontSize: 16, fontWeight: 900 }}>
                            {accidentNotification?.notification_number ?? "240529-NI-PD-HD 701"}
                        </div>
                    </Col>
                </Row>

                <Form form={form} layout="vertical">

                    {/* Baris 1: Overview & HPRI */}
                    <Row gutter={24}>
                        <Col xs={24} lg={17}>
                            <Card
                                title={<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <span style={{ fontSize: 11, color: '#000000', fontWeight: 800, letterSpacing: 0.5 }}>RINGKASAN INSIDEN (INCIDENT OVERVIEW)</span>
                                    <Tag color="blue" style={{ borderRadius: 4, fontSize: 10, fontWeight: 800, background: '#eff6ff', color: '#1d4ed8', border: 'none', padding: '2px 8px' }}>DRAFT UTAMA</Tag>
                                </div>}
                                headStyle={{ borderBottom: '1px solid #f1f5f9' }}
                                style={cardStyle}
                            >
                                <IncidentOverviewSection />
                            </Card>
                        </Col>
                        <Col xs={24} lg={7}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '32px 24px',
                                borderRadius: 16,
                                border: `2px dashed ${isDarkMode ? 'rgba(255,255,255,0.15)' : '#cbd5e1'}`,
                                background: isDarkMode ? 'transparent' : '#fff',
                                height: 'auto',
                                marginBottom: 24,
                                minHeight: 280,
                                justifyContent: 'center'
                            }}>
                                <span style={{
                                    fontSize: 10,
                                    fontWeight: 900,
                                    color: isDarkMode ? '#000000' : '#64748b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2px',
                                    marginBottom: 8
                                }}>
                                    POTENSI BAHAYA TINGGI
                                </span>
                                <h2 style={{
                                    fontSize: 48,
                                    fontWeight: 900,
                                    margin: '0 0 16px 0',
                                    color: isDarkMode ? '#fff' : '#0f172a',
                                    lineHeight: 1
                                }}>
                                    HPRI?
                                </h2>
                                <Space align="center" style={{ marginBottom: 20 }}>
                                    <Switch
                                        checked={isHpri}
                                        onChange={setIsHpri}
                                        size="large"
                                        style={{
                                            background: isHpri ? '#22c55e' : '#cbd5e1',
                                            transform: 'scale(1.2)'
                                        }}
                                    />
                                    <span style={{
                                        fontSize: 18,
                                        fontWeight: 900,
                                        color: isHpri ? '#22c55e' : '#000000',
                                        marginLeft: 12
                                    }}>
                                        {isHpri ? 'YA' : 'TIDAK'}
                                    </span>
                                </Space>
                                <p style={{
                                    fontSize: 10,
                                    color: '#000000',
                                    margin: 0,
                                    textAlign: 'center',
                                    lineHeight: 1.5,
                                    fontWeight: 600
                                }}>
                                    High Potential Risk Incident<br />
                                    classification as per IMS-14-001
                                </p>
                            </div>
                        </Col>
                    </Row>

                    {/* Baris 2: Severity Row */}
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Card title={<span style={{ fontSize: 11, color: '#000000', fontWeight: 800, letterSpacing: 0.5 }}>KEPARAHAN AKTUAL (ACTUAL SEVERITY)</span>} style={cardStyle} headStyle={{ borderBottom: '1px solid #f1f5f9' }}>
                                <SeveritySection
                                    prefix="actual"
                                    severity={severity}
                                    setSeverity={setSeverity}
                                    isDarkMode={isDarkMode}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} md={12}>
                            <Card title={<span style={{ fontSize: 11, color: '#000000', fontWeight: 800, letterSpacing: 0.5 }}>KEPARAHAN POTENSIAL (POTENTIAL SEVERITY)</span>} style={cardStyle} headStyle={{ borderBottom: '1px solid #f1f5f9' }}>
                                <SeveritySection
                                    prefix="potential"
                                    severity={severity}
                                    setSeverity={setSeverity}
                                    isDarkMode={isDarkMode}
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Baris 3: Chronology & Consequences */}
                    <Row gutter={24}>
                        <Col xs={24} lg={16}>
                            <Card title={<span style={{ fontSize: 11, color: '#000000', fontWeight: 800, letterSpacing: 0.5 }}>KRONOLOGI AWAL & FAKTA KEJADIAN</span>} style={cardStyle} headStyle={{ borderBottom: '1px solid #f1f5f9' }}>
                                <ChronologySection
                                    incidentFacts={incidentFacts}
                                    setIncidentFacts={setIncidentFacts}
                                    correctiveActions={correctiveActions}
                                    setCorrectiveActions={setCorrectiveActions}
                                    isDarkMode={isDarkMode}
                                />
                            </Card>
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card title={<span style={{ fontSize: 11, color: '#000000', fontWeight: 800, letterSpacing: 0.5 }}>AKIBAT KECELAKAAN (CONSEQUENCES)</span>} style={cardStyle} headStyle={{ borderBottom: '1px solid #f1f5f9' }}>
                                <ConsequenceSection />
                            </Card>
                        </Col>
                    </Row>

                    {/* Baris 4: Photos */}
                    <Card title={<span style={{ fontSize: 11, color: '#000000', fontWeight: 800, letterSpacing: 0.5 }}>LAMPIRAN MEDIA (PHOTOS)</span>} style={cardStyle} headStyle={{ borderBottom: '1px solid #f1f5f9' }}>
                        <MediaSection fileList={fileList} setFileList={setFileList} />
                    </Card>

                    {/* Baris 5: Otorisasi */}
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <div style={{
                                background: isDarkMode ? 'rgba(30, 58, 138, 0.15)' : '#eff6ff',
                                padding: '24px 32px',
                                borderRadius: 16,
                                border: `1px solid ${isDarkMode ? 'rgba(30, 58, 138, 0.3)' : '#dbeafe'}`,
                                marginBottom: 24
                            }}>
                                <ReporterSection type="reporter" />
                            </div>
                        </Col>
                        <Col xs={24} md={12}>
                            <div style={{
                                background: isDarkMode ? 'rgba(30, 58, 138, 0.15)' : '#eff6ff',
                                padding: '24px 32px',
                                borderRadius: 16,
                                border: `1px solid ${isDarkMode ? 'rgba(30, 58, 138, 0.3)' : '#dbeafe'}`,
                                marginBottom: 24
                            }}>
                                <ReporterSection type="approver" />
                            </div>
                        </Col>
                    </Row>

                    {/* Action Buttons */}
                    <div style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: 16,
                        paddingTop: 24,
                        marginBottom: 100
                    }}>
                        <Button
                            size="large"
                            onClick={() => handleSave(form, 'draft')}
                            loading={loading}
                            style={{
                                borderRadius: 8,
                                fontWeight: 600,
                                padding: '0 32px',
                                height: 42
                            }}
                        >
                            Save As Draft
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            onClick={() => handleSave(form, 'submitted')}
                            loading={loading}
                            style={{
                                background: "#2563eb",
                                border: "none",
                                fontWeight: 700,
                                borderRadius: 8,
                                padding: '0 48px',
                                height: 42,
                                boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.2)"
                            }}
                        >
                            Submit
                        </Button>
                    </div>

                </Form>
            </div>
        </DashboardLayout>
    );
}
