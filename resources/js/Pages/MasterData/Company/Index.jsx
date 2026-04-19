import { Button, Col, Row, Space, Grid } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import CompanyHeader from "./Partials/CompanyHeader";
import CompanyModal from "./Partials/CompanyModal";
import CompanyTable from "./Partials/CompanyTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import React from "react";
import useCompany from "./Hooks/useCompany";
import { useTheme } from "@/Contexts/ThemeContext";

const { useBreakpoint } = Grid;

export default function CompanyIndex() {
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
    } = useCompany();

    return (
        <DashboardLayout title="Master Data Perusahaan">
            <Head title="Master Data Perusahaan" />

            <div style={{ padding: isMobile ? "16px" : "24px" }}>
                {/* Header Section */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} md={12}>
                        <h2 style={{ margin: 0, fontWeight: 700, fontSize: isMobile ? "20px" : "24px", color: isDarkMode ? "#fff" : "#1e293b" }}>
                            Master Data Perusahaan
                        </h2>
                        <p style={{ margin: 0, color: "#64748b", fontSize: isMobile ? "13px" : "14px" }}>
                            Kelola data perusahaan rekanan dan profilnya.
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
                <CompanyHeader 
                    searchText={searchText}
                    onSearchChange={handleSearchChange}
                    onAddClick={handleAdd}
                    isDarkMode={isDarkMode}
                    table={table}
                />

                {/* Table Section */}
                <CompanyTable 
                    table={table} 
                    loading={loading}
                    totalRows={totalRows}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Modal Form */}
            <CompanyModal
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
                title="Hapus Perusahaan"
                description={`Apakah Anda yakin ingin menghapus data perusahaan "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                loading={loading}
            />
        </DashboardLayout>
    );
}
