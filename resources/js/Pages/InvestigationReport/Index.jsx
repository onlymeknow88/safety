import { Button, Card, Col, Row, Space, Statistic } from "antd";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    FileSearchOutlined,
    ReloadOutlined
} from "@ant-design/icons";

import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import InvestigationReportHeader from "./Partials/InvestigationReportHeader";
import InvestigationReportModal from "./Partials/InvestigationReportModal";
import InvestigationReportTable from "./Partials/InvestigationReportTable";
import React from "react";
import useInvestigationReport from "./Hooks/useInvestigationReport";
import { useTheme } from "@/Contexts/ThemeContext";

export default function InvestigationReportIndex({ investigationReports = [], master = {} }) {
    const { isDarkMode } = useTheme();

    // Connect hook
    const hook = useInvestigationReport(investigationReports);

    const {
        table,
        data,
        loading,
        searchText,
        handleSearchChange,
        isModalVisible,
        setIsModalVisible,
        modalMode,
        canCreate,
        handleAdd,
        handleSave,
        isDeleteModalVisible,
        setIsDeleteModalVisible,
        handleConfirmDelete,
        itemToDelete,
        editingItem,
        totalRows,
        handleApprove,
        handleReturn,
        approvedNotifications,
    } = hook;

    // Calculate metrics
    const totalLPKS = data.filter(r => r.report_type === 'LPKS').length;
    const totalLPKL = data.filter(r => r.report_type === 'LPKL').length;
    const totalPending = data.filter(r => r.investigation_status !== 'Completed').length;
    const totalCompleted = data.filter(r => r.investigation_status === 'Completed').length;

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const notificationId = urlParams.get("accident_notification_id");
        if (notificationId && approvedNotifications.length > 0) {
            const notif = approvedNotifications.find(n => String(n.id) === String(notificationId));
            if (notif) {
                // Clear the query parameter from URL without reloading
                const newUrl = window.location.pathname;
                window.history.replaceState({}, document.title, newUrl);

                // Open the modal
                handleAdd(notif);
            }
        }
    }, [approvedNotifications, handleAdd]);

    // Form submission wrapper
    const onModalFinish = async (form, statusIntent) => {
        const success = await handleSave(form, statusIntent);
        if (success) {
            setIsModalVisible(false);
        }
    };

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
                            LAPORAN ANALISA KECELAKAAN KERJA
                        </h2>
                        <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: 500, marginTop: 4 }}>
                            Analisa Faktor Spesifik & Akar Masalah
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
                        </Space>
                    </Col>
                </Row>

                {/* Metrics Cards */}
                {/* <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
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
                </Row> */}

                <Row gutter={[24, 24]}>
                    {/* Main Table Section */}
                    <Col span={24}>
                        {/* Filter & Action Section */}
                        <InvestigationReportHeader
                            searchText={searchText}
                            onSearchChange={handleSearchChange}
                            onAddClick={handleAdd}
                            canCreate={canCreate}
                            isDarkMode={isDarkMode}
                            table={table}
                        />

                        {/* Table Section */}
                        <InvestigationReportTable
                            table={table}
                            loading={loading}
                            totalRows={totalRows}
                            isDarkMode={isDarkMode}
                        />
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
                    master={master}
                />

                {/* Delete Confirmation */}
                <DeleteConfirmModal
                    visible={isDeleteModalVisible}
                    onCancel={() => setIsDeleteModalVisible(false)}
                    onConfirm={handleConfirmDelete}
                    title="Hapus Laporan Penyelidikan"
                    message={
                        itemToDelete?.report_number
                            ? `Apakah Anda yakin ingin menghapus laporan penyelidikan "${itemToDelete.report_number}" secara permanen? Tindakan ini tidak dapat dibatalkan.`
                            : "Apakah Anda yakin ingin menghapus laporan penyelidikan ini secara permanen? Tindakan ini tidak dapat dibatalkan."
                    }
                    loading={loading}
                />
            </div>
        </DashboardLayout>
    );
}
