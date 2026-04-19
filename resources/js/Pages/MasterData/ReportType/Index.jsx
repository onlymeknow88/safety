import { Button, Col, Row, Space, Grid } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import ReportTypeHeader from "./Partials/ReportTypeHeader";
import ReportTypeModal from "./Partials/ReportTypeModal";
import ReportTypeTable from "./Partials/ReportTypeTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import React from "react";
import useReportType from "./Hooks/useReportType";
import { useTheme } from "@/Contexts/ThemeContext";

const { useBreakpoint } = Grid;

export default function ReportTypeIndex() {
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
        handleAdd,
        handleOk,
        isDeleteModalVisible,
        setIsDeleteModalVisible,
        handleConfirmDelete,
        itemToDelete,
        editingItem,
        totalRows,
        fetchItems
    } = useReportType();

    return (
        <DashboardLayout title="Master Data Jenis Laporan">
            <Head title="Master Data Jenis Laporan" />

            <div style={{ padding: isMobile ? "0" : "24px" }}>
                {/* Header Section */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} md={12}>
                        <h2 style={{ margin: 0, fontWeight: 700, fontSize: isMobile ? "20px" : "24px", color: isDarkMode ? "#fff" : "#1e293b" }}>
                            Master Data Jenis Laporan
                        </h2>
                        <p style={{ margin: 0, color: "#64748b", fontSize: isMobile ? "13px" : "14px" }}>
                            Konfigurasi jenis-jenis laporan keselamatan.
                        </p>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: isMobile ? "left" : "right" }}>
                        <Space>
                            <Button 
                                icon={<ReloadOutlined />} 
                                onClick={() => fetchItems()}
                                loading={loading}
                            />
                        </Space>
                    </Col>
                </Row>

                {/* Filter & Action Section */}
                <ReportTypeHeader 
                    searchText={searchText}
                    onSearchChange={handleSearchChange}
                    onAddClick={handleAdd}
                    isDarkMode={isDarkMode}
                    table={table}
                />

                {/* Table Section */}
                <ReportTypeTable 
                    table={table} 
                    loading={loading}
                    totalRows={totalRows}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Modal Form */}
            <ReportTypeModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onFinish={handleOk}
                loading={loading}
                initialValues={editingItem}
            />

            {/* Delete Modal */}
            <DeleteConfirmModal
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Jenis Laporan"
                description={`Apakah Anda yakin ingin menghapus jenis laporan "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                loading={loading}
            />
        </DashboardLayout>
    );
}
