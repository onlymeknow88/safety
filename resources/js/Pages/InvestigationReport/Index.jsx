import React from "react";
import { Head, usePage } from "@inertiajs/react";
import { 
    Button, Space, Card, Tag, Table, Row, Col, Statistic, Alert, 
    Input, Tooltip, Popconfirm, Empty, Timeline, Typography 
} from "antd";
import { 
    ReloadOutlined, 
    FileTextOutlined, 
    FileSearchOutlined, 
    CheckCircleOutlined, 
    ClockCircleOutlined, 
    ExclamationCircleOutlined,
    PlusOutlined,
    EditOutlined,
    EyeOutlined,
    DeleteOutlined,
    SearchOutlined
} from "@ant-design/icons";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTheme } from "@/Contexts/ThemeContext";
import useInvestigationReport from "./Hooks/useInvestigationReport";
import InvestigationReportModal from "./Partials/InvestigationReportModal";

const { Text } = Typography;

export default function InvestigationReportIndex({ investigationReports = [], approvedNotifications = [] }) {
    const { isDarkMode } = useTheme();
    const { auth } = usePage().props;
    const userRoles = (auth?.user?.roles || []).map(r => r.toLowerCase());
    const isAdministrator = auth?.user?.is_administrator || false;
    const isCrs = userRoles.includes("crs") || userRoles.includes("admin") || isAdministrator;

    // Connect hook
    const hook = useInvestigationReport(investigationReports);

    const {
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
        showDeleteModal,
        handleConfirmDelete,
        itemToDelete,
        editingItem,
        handleApprove,
        handleReturn
    } = hook;

    // Calculate metrics
    const totalLPKS = data.filter(r => r.report_type === 'LPKS').length;
    const totalLPKL = data.filter(r => r.report_type === 'LPKL').length;
    const totalPending = data.filter(r => r.investigation_status !== 'Completed').length;
    const totalCompleted = data.filter(r => r.investigation_status === 'Completed').length;

    // Form submission wrapper
    const onModalFinish = async (form, statusIntent) => {
        const success = await handleSave(form, statusIntent);
        if (success) {
            setIsModalVisible(false);
        }
    };

    // Columns
    const columns = [
        {
            title: "NO",
            key: "index",
            width: 60,
            align: "center",
            render: (_, __, index) => index + 1
        },
        {
            title: "NOMOR LAPORAN",
            dataIndex: "report_number",
            key: "report_number",
            render: (text, record) => (
                <div style={{ fontWeight: 800, color: isDarkMode ? "#38bdf8" : "#0284c7" }}>
                    <FileTextOutlined style={{ marginRight: 8, color: record.report_type === 'LPKL' ? '#ef4444' : '#3b82f6' }} />
                    {text || "DRAFT REPORT"}
                </div>
            )
        },
        {
            title: "TIPE",
            dataIndex: "report_type",
            key: "report_type",
            align: "center",
            width: 100,
            render: (text) => (
                <Tag color={text === 'LPKL' ? 'red' : 'blue'} style={{ fontWeight: 800, padding: '2px 10px', borderRadius: 6 }}>
                    {text}
                </Tag>
            )
        },
        {
            title: "NOMOR NOTIFIKASI",
            dataIndex: ["accident_notification", "notification_number"],
            key: "notification_number",
            render: (text, record) => (
                <Text strong style={{ color: isDarkMode ? "#cbd5e1" : "#1e293b" }}>
                    {text || record.accident_notification?.notification_number || "-"}
                </Text>
            )
        },
        {
            title: "JUDUL INSIDEN",
            dataIndex: ["accident_notification", "incident_title"],
            key: "incident_title",
            render: (text, record) => (
                <div style={{ maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {text || record.accident_notification?.incident_title || "-"}
                </div>
            )
        },
        {
            title: "CCOW & DEPARTEMEN",
            key: "ccow_dept",
            render: (_, record) => {
                const ccow = record.accident_notification?.ccow?.name || "-";
                const dept = record.accident_notification?.department?.name || "-";
                return (
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: isDarkMode ? "#cbd5e1" : "#334155" }}>{ccow}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>{dept}</div>
                    </div>
                );
            }
        },
        {
            title: "STATUS APPROVAL",
            dataIndex: "investigation_status",
            key: "investigation_status",
            align: "center",
            render: (status, record) => {
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
                    // Clean up "Waiting KTT", "Waiting OHS_DH"
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
            }
        },
        {
            title: "AKSI",
            key: "action",
            align: "center",
            width: 160,
            render: (_, record) => {
                const isDraft = record.investigation_status === "Draft";
                const isReturned = record.investigation_status === "Returned";
                
                // Allow edit if it's draft or returned, and user has edit permissions
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
                                <Popconfirm
                                    title="Hapus Laporan?"
                                    description="Apakah Anda yakin ingin menghapus laporan penyelidikan ini secara permanen?"
                                    onConfirm={() => {
                                        hook.setItemToDelete(record);
                                        hook.handleConfirmDelete();
                                    }}
                                    okText="Ya, Hapus"
                                    cancelText="Batal"
                                    okButtonProps={{ danger: true }}
                                >
                                    <Button 
                                        type="text"
                                        shape="circle"
                                        icon={<DeleteOutlined style={{ color: "#ef4444" }} />}
                                    />
                                </Popconfirm>
                            </Tooltip>
                        )}
                    </Space>
                );
            }
        }
    ];

    const cardStyle = {
        borderRadius: 20,
        border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
        background: isDarkMode ? "#1e293b" : "#ffffff",
        boxShadow: isDarkMode ? "0 10px 15px -3px rgba(0,0,0,0.3)" : "0 10px 15px -3px rgba(0,0,0,0.05)"
    };

    return (
        <DashboardLayout title="Laporan Penyelidikan (LPKS/LPKL)">
            <Head title="Laporan Penyelidikan (LPKS/LPKL)" />

            <div style={{ padding: "24px" }}>
                {/* Header Title Section */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 32 }}>
                    <Col xs={24} md={12}>
                        <h2 style={{ 
                            margin: 0, 
                            fontWeight: 900, 
                            fontSize: "30px", 
                            color: isDarkMode ? "#fff" : "#0f172a",
                            letterSpacing: "-0.02em"
                        }}>
                            LAPORAN PENYELIDIKAN KECELAKAAN
                        </h2>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: 500, marginTop: 4 }}>
                            Kelola pelaporan investigasi detail sederhana (LPKS) dan lengkap (LPKL) beserta workflow persetujuan terintegrasi.
                        </p>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: "right" }}>
                        <Space size="middle">
                            <Button 
                                size="large"
                                icon={<ReloadOutlined />} 
                                onClick={() => window.location.reload()}
                                style={{ borderRadius: 12, height: 44, width: 44 }}
                            />
                            {canCreate && (
                                <Button 
                                    type="primary"
                                    size="large"
                                    icon={<PlusOutlined />} 
                                    onClick={handleAdd}
                                    style={{ 
                                        borderRadius: 12, 
                                        fontWeight: 800, 
                                        height: 44,
                                        background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                        border: "none",
                                        padding: "0 24px",
                                        boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.25)"
                                    }}
                                >
                                    Buat Laporan LPKS/LPKL
                                </Button>
                            )}
                        </Space>
                    </Col>
                </Row>

                {/* Metrics Cards */}
                <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ ...cardStyle, background: isDarkMode ? '#1e293b' : '#ffffff' }} styles={{ body: { padding: 24 } }}>
                            <Statistic 
                                title={<span style={{ fontWeight: 700, color: "#64748b" }}>TOTAL LPKS</span>}
                                value={totalLPKS} 
                                valueStyle={{ color: '#3b82f6', fontWeight: 900, fontSize: 32 }}
                                prefix={<FileSearchOutlined style={{ marginRight: 8 }} />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ ...cardStyle, background: isDarkMode ? '#1e293b' : '#ffffff' }} styles={{ body: { padding: 24 } }}>
                            <Statistic 
                                title={<span style={{ fontWeight: 700, color: "#64748b" }}>TOTAL LPKL</span>}
                                value={totalLPKL} 
                                valueStyle={{ color: '#ef4444', fontWeight: 900, fontSize: 32 }}
                                prefix={<FileSearchOutlined style={{ marginRight: 8 }} />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ ...cardStyle, background: isDarkMode ? '#1e293b' : '#ffffff' }} styles={{ body: { padding: 24 } }}>
                            <Statistic 
                                title={<span style={{ fontWeight: 700, color: "#64748b" }}>BELUM SELESAI</span>}
                                value={totalPending} 
                                valueStyle={{ color: '#f59e0b', fontWeight: 900, fontSize: 32 }}
                                prefix={<ClockCircleOutlined style={{ marginRight: 8 }} />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={12} sm={6}>
                        <Card bordered={false} style={{ ...cardStyle, background: isDarkMode ? '#1e293b' : '#ffffff' }} styles={{ body: { padding: 24 } }}>
                            <Statistic 
                                title={<span style={{ fontWeight: 700, color: "#64748b" }}>INVESTIGASI SELESAI</span>}
                                value={totalCompleted} 
                                valueStyle={{ color: '#10b981', fontWeight: 900, fontSize: 32 }}
                                prefix={<CheckCircleOutlined style={{ marginRight: 8 }} />} 
                            />
                        </Card>
                    </Col>
                </Row>

                <Row gutter={[24, 24]}>
                    {/* Main Table Card */}
                    <Col xs={24} lg={17}>
                        <Card 
                            title={
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: 8 }}>
                                    <span style={{ fontWeight: 900, fontSize: '16px', color: isDarkMode ? "#f8fafc" : "#0f172a" }}>
                                        DAFTAR LAPORAN PENYELIDIKAN KECELAKAAN
                                    </span>
                                    <Input
                                        placeholder="Cari No. Laporan atau No. Notifikasi..."
                                        value={searchText}
                                        onChange={handleSearchChange}
                                        prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                                        style={{ width: 280, borderRadius: 10 }}
                                    />
                                </div>
                            }
                            bordered={false} 
                            style={cardStyle}
                            styles={{ 
                                header: { borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9", padding: "0 24px" },
                                body: { padding: "0" }
                            }}
                        >
                            <Table 
                                dataSource={data} 
                                columns={columns} 
                                rowKey="id"
                                loading={loading}
                                pagination={{ pageSize: 8, showSizeChanger: true }}
                                locale={{
                                    emptyText: <Empty description="Belum ada Laporan Penyelidikan yang diinput." />
                                }}
                            />
                        </Card>
                    </Col>

                    {/* Step Timeline Guide */}
                    <Col xs={24} lg={7}>
                        <Card 
                            title={
                                <span style={{ fontWeight: 900, fontSize: '16px', color: isDarkMode ? "#f8fafc" : "#0f172a" }}>
                                    ALUR PROSES INVESTIGASI & APPROVAL
                                </span>
                            }
                            bordered={false} 
                            style={cardStyle}
                            styles={{ 
                                header: { borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9", padding: "0 24px" },
                                body: { padding: "24px" }
                            }}
                        >
                            <Timeline
                                mode="left"
                                items={[
                                    {
                                        label: 'STEP 1',
                                        dot: <ClockCircleOutlined style={{ fontSize: '16px', color: "#3b82f6" }} />,
                                        color: 'blue',
                                        children: (
                                            <div style={{ marginBottom: 12 }}>
                                                <h4 style={{ margin: 0, fontWeight: 800, color: isDarkMode ? "#f8fafc" : "#0f172a" }}>PILIH NOTIFIKASI KECELAKAAN</h4>
                                                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5, marginTop: 4 }}>
                                                    Pilih dari daftar notifikasi kecelakaan yang disetujui (Approved). Data teknis akan otomatis terisi (Auto-populate).
                                                </p>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: 'STEP 2',
                                        color: 'gray',
                                        children: (
                                            <div style={{ marginBottom: 12 }}>
                                                <h4 style={{ margin: 0, fontWeight: 800, color: isDarkMode ? "#cbd5e1" : "#475569" }}>KTT APPROVAL</h4>
                                                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5, marginTop: 4 }}>
                                                    Kepala Teknik Tambang melakukan review awal, input catatan, dan verifikasi checklist.
                                                </p>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: 'STEP 3',
                                        color: 'gray',
                                        children: (
                                            <div style={{ marginBottom: 12 }}>
                                                <h4 style={{ margin: 0, fontWeight: 800, color: isDarkMode ? "#cbd5e1" : "#475569" }}>OHS D/H APPROVAL</h4>
                                                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5, marginTop: 4 }}>
                                                    OHS Department Head memverifikasi kesesuaian data PICA (Corrective/Preventive Action).
                                                </p>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: 'STEP 4',
                                        color: 'gray',
                                        children: (
                                            <div style={{ marginBottom: 12 }}>
                                                <h4 style={{ margin: 0, fontWeight: 800, color: isDarkMode ? "#cbd5e1" : "#475569" }}>ENV D/H APPROVAL</h4>
                                                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5, marginTop: 4 }}>
                                                    <em>(Kondisional)</em> Diperlukan jika kategori kecelakaan melibatkan Lingkungan Hidup.
                                                </p>
                                            </div>
                                        ),
                                    },
                                    {
                                        label: 'STEP 5',
                                        color: 'gray',
                                        children: (
                                            <div>
                                                <h4 style={{ margin: 0, fontWeight: 800, color: isDarkMode ? "#cbd5e1" : "#475569" }}>PJA APPROVAL (FINAL)</h4>
                                                <p style={{ color: '#64748b', fontSize: '12px', lineHeight: 1.5, marginTop: 4 }}>
                                                    Penanggung Jawab Area menyetujui seluruh rangkaian investigasi dan menutup laporan (Completed).
                                                </p>
                                            </div>
                                        ),
                                    }
                                ]}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Main Modal Form Integration */}
                <InvestigationReportModal
                    visible={isModalVisible}
                    onCancel={() => setIsModalVisible(false)}
                    onFinish={onModalFinish}
                    onApprove={handleApprove}
                    onReturn={handleReturn}
                    loading={loading}
                    initialValues={editingItem}
                    approvedNotifications={approvedNotifications}
                    mode={modalMode}
                    hook={hook}
                />

            </div>
        </DashboardLayout>
    );
}
