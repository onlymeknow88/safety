import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Button, Space, Card, Tag, Table, Row, Col, Statistic, Alert, Modal, Empty, Timeline } from "antd";
import { 
    ReloadOutlined, 
    FileTextOutlined, 
    FileSearchOutlined, 
    CheckCircleOutlined, 
    ClockCircleOutlined, 
    ExclamationCircleOutlined,
    PlusOutlined
} from "@ant-design/icons";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTheme } from "@/Contexts/ThemeContext";

export default function InvestigationReportIndex({ investigationReports = [], approvedNotifications = [] }) {
    const { isDarkMode } = useTheme();
    const [loading, setLoading] = useState(false);

    // Calculate metrics
    const totalLPKS = investigationReports.filter(r => r.report_type === 'LPKS').length;
    const totalLPKL = investigationReports.filter(r => r.report_type === 'LPKL').length;
    const totalPending = investigationReports.filter(r => r.investigation_status !== 'Completed').length;
    const totalCompleted = investigationReports.filter(r => r.investigation_status === 'Completed').length;

    // Define table columns
    const columns = [
        {
            title: "NOMOR LAPORAN",
            dataIndex: "report_number",
            key: "report_number",
            render: (text, record) => (
                <div style={{ fontWeight: 800 }}>
                    <FileTextOutlined style={{ marginRight: 8, color: record.report_type === 'LPKL' ? '#ef4444' : '#3b82f6' }} />
                    {text}
                </div>
            )
        },
        {
            title: "TIPE",
            dataIndex: "report_type",
            key: "report_type",
            render: (text) => (
                <Tag color={text === 'LPKL' ? 'red' : 'blue'} style={{ fontWeight: 700, padding: '2px 8px', borderRadius: 6 }}>
                    {text}
                </Tag>
            )
        },
        {
            title: "NOMOR NOTIFIKASI KECELAKAAN",
            dataIndex: ["accident_notification", "notification_number"],
            key: "notification_number",
            render: (text) => text || "-"
        },
        {
            title: "CCOW / PERUSAHAAN",
            key: "ccow_company",
            render: (_, record) => {
                const ccow = record.accident_notification?.ccow?.name || "-";
                const company = record.accident_notification?.company?.name || "-";
                return (
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{ccow}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{company}</div>
                    </div>
                );
            }
        },
        {
            title: "STATUS ALUR",
            dataIndex: "investigation_status",
            key: "investigation_status",
            render: (status) => {
                let color = "default";
                if (status === 'Completed') color = "green";
                else if (status === 'Returned') color = "orange";
                else if (status.startsWith('Waiting')) color = "processing";

                return (
                    <Tag color={color} style={{ fontWeight: 600 }}>
                        {status.toUpperCase()}
                    </Tag>
                );
            }
        },
        {
            title: "AKSI",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" ghost size="small" style={{ borderRadius: 6 }}>
                        Lihat Detail
                    </Button>
                </Space>
            )
        }
    ];

    return (
        <DashboardLayout title="Laporan Penyelidikan (LPKS/LPKL)">
            <Head title="Laporan Penyelidikan (LPKS/LPKL)" />

            <div style={{ padding: "24px" }}>
                {/* Header Title Section */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} md={12}>
                        <h2 style={{ 
                            margin: 0, 
                            fontWeight: 900, 
                            fontSize: "28px", 
                            color: isDarkMode ? "#fff" : "#0f172a",
                            letterSpacing: "-0.5px"
                        }}>
                            LAPORAN PENYELIDIKAN (LPKS/LPKL)
                        </h2>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: 500 }}>
                            Siklus Investigasi Lengkap (LPKS/LPKL) - Phase 1 Foundation Active.
                        </p>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: "right" }}>
                        <Space>
                            <Button 
                                size="large"
                                icon={<ReloadOutlined />} 
                                onClick={() => {
                                    setLoading(true);
                                    window.location.reload();
                                }}
                                loading={loading}
                                style={{ borderRadius: 10 }}
                            />
                            <Button 
                                type="primary"
                                size="large"
                                icon={<PlusOutlined />} 
                                style={{ borderRadius: 10, fontWeight: 700 }}
                                onClick={() => {
                                    Modal.info({
                                        title: 'Pendaftaran LPKS / LPKL (Phase 2)',
                                        content: (
                                            <div>
                                                <p>Sistem backend Phase 1 (Database Migrasi, Model, Relasi, JWT, dan API Controller) sudah siap dan aktif!</p>
                                                <p>Frontend Form & Integrasi dropdown auto-populate dari <strong>{approvedNotifications.length} Notifikasi Kecelakaan (Approved)</strong> akan diselesaikan pada Phase 2.</p>
                                            </div>
                                        ),
                                        onOk() {},
                                    });
                                }}
                            >
                                Buat Laporan Penyelidikan
                            </Button>
                        </Space>
                    </Col>
                </Row>

                <Alert
                    message="FONDASI SISTEM FASE 1 AKTIF"
                    description="Seluruh infrastruktur database (investigation_reports, approvals, documents), controllers, RESTful APIs, & routes baru untuk LPKS/LPKL telah berhasil dideploy dan diintegrasikan secara optimal dengan basis notifikasi kecelakaan."
                    type="success"
                    showIcon
                    icon={<CheckCircleOutlined />}
                    style={{ marginBottom: 24, borderRadius: 12 }}
                />

                {/* Metrics Cards */}
                <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ borderRadius: 12, background: isDarkMode ? '#1e293b' : '#ffffff' }}>
                            <Statistic 
                                title="TOTAL LPKS" 
                                value={totalLPKS} 
                                valueStyle={{ color: '#3b82f6', fontWeight: 800 }}
                                prefix={<FileSearchOutlined />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ borderRadius: 12, background: isDarkMode ? '#1e293b' : '#ffffff' }}>
                            <Statistic 
                                title="TOTAL LPKL" 
                                value={totalLPKL} 
                                valueStyle={{ color: '#ef4444', fontWeight: 800 }}
                                prefix={<FileSearchOutlined />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ borderRadius: 12, background: isDarkMode ? '#1e293b' : '#ffffff' }}>
                            <Statistic 
                                title="PENDING APPROVAL" 
                                value={totalPending} 
                                valueStyle={{ color: '#f59e0b', fontWeight: 800 }}
                                prefix={<ClockCircleOutlined />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ borderRadius: 12, background: isDarkMode ? '#1e293b' : '#ffffff' }}>
                            <Statistic 
                                title="SELESAI INVESTIGASI" 
                                value={totalCompleted} 
                                valueStyle={{ color: '#10b981', fontWeight: 800 }}
                                prefix={<CheckCircleOutlined />} 
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card 
                            title={
                                <span style={{ fontWeight: 800, fontSize: '16px' }}>
                                    DAFTAR LAPORAN PENYELIDIKAN
                                </span>
                            }
                            bordered={false} 
                            style={{ borderRadius: 12 }}
                        >
                            <Table 
                                dataSource={investigationReports} 
                                columns={columns} 
                                rowKey="id"
                                pagination={{ pageSize: 5 }}
                                locale={{
                                    emptyText: <Empty description="Belum ada Laporan Penyelidikan yang diinput." />
                                }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card 
                            title={
                                <span style={{ fontWeight: 800, fontSize: '16px' }}>
                                    DAFTAR ALUR APPROVAL (STEP)
                                </span>
                            }
                            bordered={false} 
                            style={{ borderRadius: 12 }}
                        >
                            <Timeline
                                mode="left"
                                items={[
                                    {
                                        label: 'Step 1',
                                        dot: <ClockCircleOutlined style={{ fontSize: '16px' }} />,
                                        color: 'blue',
                                        children: (
                                            <div>
                                                <h4 style={{ margin: 0, fontWeight: 700 }}>Pilih No Notifikasi</h4>
                                                <p style={{ color: '#64748b', fontSize: '12px' }}>
                                                    Data auto-populate dari {approvedNotifications.length} notifikasi berstatus Approved
                                                </p>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: 'Step 2',
                                        color: 'gray',
                                        children: (
                                            <div>
                                                <h4 style={{ margin: 0, fontWeight: 700 }}>Review oleh KTT</h4>
                                                <p style={{ color: '#64748b', fontSize: '12px' }}>
                                                    Memberikan comment + checklist approval
                                                </p>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: 'Step 3',
                                        color: 'gray',
                                        children: (
                                            <div>
                                                <h4 style={{ margin: 0, fontWeight: 700 }}>Review OHS D/H</h4>
                                                <p style={{ color: '#64748b', fontSize: '12px' }}>
                                                    Memberikan comment + checklist approval
                                                </p>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: 'Step 4',
                                        color: 'gray',
                                        children: (
                                            <div>
                                                <h4 style={{ margin: 0, fontWeight: 700 }}>ENV D/H (Conditional)</h4>
                                                <p style={{ color: '#64748b', fontSize: '12px' }}>
                                                    Wajib jika kategori Kecelakaan Lingkungan
                                                </p>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: 'Step 5',
                                        color: 'gray',
                                        children: (
                                            <div>
                                                <h4 style={{ margin: 0, fontWeight: 700 }}>PJA Approval</h4>
                                                <p style={{ color: '#64748b', fontSize: '12px' }}>
                                                    Persetujuan akhir alur LPKS/LPKL
                                                </p>
                                            </div>
                                        ),
                                    }
                                ]}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        </DashboardLayout>
    );
}
