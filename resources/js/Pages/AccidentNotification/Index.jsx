import React from "react";
import { Head } from "@inertiajs/react";
import { Button, Space, Modal, App, Grid, Row, Col } from "antd";
import { ReloadOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTheme } from "@/Contexts/ThemeContext";
import AccidentNotificationModal from "./Partials/AccidentNotificationModal";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import PdfPreviewModal from "./Partials/Components/PdfPreviewModal";

// Consolidated Hook
import useAccidentNotification from "./Hooks/useAccidentNotification";
import AccidentNotificationHeader from "./Partials/AccidentNotificationHeader";
import AccidentNotificationTable from "./Partials/AccidentNotificationTable";

const { useBreakpoint } = Grid;

export default function AccidentNotificationIndex({ master = {} }) {
    const { isDarkMode } = useTheme();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const {
        table,
        loading,
        searchText,
        handleSearchChange,
        isModalVisible,
        setIsModalVisible,
        modalMode,
        handleAdd,
        handleEdit,
        handleSave,
        isDeleteModalVisible,
        setIsDeleteModalVisible,
        handleConfirmDelete,
        itemToDelete,
        editingItem,
        totalRows,
        fetchItems,
        isHpri, setIsHpri,
        severity, setSeverity,
        incidentFacts, setIncidentFacts,
        correctiveActions, setCorrectiveActions,
        fileList, setFileList,
        isPreviewModalVisible, setIsPreviewModalVisible,
        previewRecord, handleDownloadPdf
    } = useAccidentNotification(master);

    return (
        <DashboardLayout title="Notifikasi Kecelakaan">
            <Head title="Notifikasi Kecelakaan" />

            <div style={{ padding: isMobile ? "0" : "24px" }}>
                {/* Header Title Section */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} md={12}>
                        <h2 style={{ 
                            margin: 0, 
                            fontWeight: 900, 
                            fontSize: isMobile ? "22px" : "28px", 
                            color: isDarkMode ? "#fff" : "#0f172a",
                            letterSpacing: "-0.5px"
                        }}>
                            NOTIFIKASI KECELAKAAN
                        </h2>
                        <p style={{ margin: 0, color: "#64748b", fontSize: isMobile ? "13px" : "14px", fontWeight: 500 }}>
                            Kelola dan pantau seluruh laporan insiden di area operasional.
                        </p>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: isMobile ? "left" : "right" }}>
                        <Space>
                            <Button 
                                size="large"
                                icon={<ReloadOutlined />} 
                                onClick={() => fetchItems()}
                                loading={loading}
                                style={{ borderRadius: 10 }}
                            />
                        </Space>
                    </Col>
                </Row>

                {/* Filter & Action Section */}
                <AccidentNotificationHeader 
                    searchText={searchText}
                    onSearchChange={handleSearchChange}
                    onAddClick={handleAdd}
                    isDarkMode={isDarkMode}
                    table={table}
                />

                {/* Table Section */}
                <AccidentNotificationTable 
                    table={table} 
                    loading={loading}
                    totalRows={totalRows}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Modal Form (Add/Edit) */}
            <AccidentNotificationModal 
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onFinish={handleSave}
                loading={loading}
                initialValues={editingItem}
                master={master}
                mode={modalMode}
                hook={ {
                    isHpri, setIsHpri,
                    severity, setSeverity,
                    incidentFacts, setIncidentFacts,
                    correctiveActions, setCorrectiveActions,
                    fileList, setFileList
                } }
            />

            {/* PDF Preview Modal */}
            <PdfPreviewModal
                visible={isPreviewModalVisible}
                onCancel={() => setIsPreviewModalVisible(false)}
                record={previewRecord}
                onDownload={handleDownloadPdf}
                isDarkMode={isDarkMode}
            />

            {/* Delete Confirmation */}
            <DeleteConfirmModal
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Notifikasi"
                description={`Apakah Anda yakin ingin menghapus notifikasi "${itemToDelete?.notification_number}"?`}
                loading={loading}
            />
        </DashboardLayout>
    );
}
