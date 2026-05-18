import { Button, Col, Row, Space, Grid } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import IncidentTypeHeader from "./Partials/IncidentTypeHeader";
import IncidentTypeModal from "./Partials/IncidentTypeModal";
import IncidentTypeTable from "./Partials/IncidentTypeTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import React from "react";
import useIncidentType from "./Hooks/useIncidentType";
import { useTheme } from "@/Contexts/ThemeContext";

const { useBreakpoint } = Grid;

export default function IncidentTypeIndex() {
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
    } = useIncidentType();

    return (
        <DashboardLayout title="Master Data Jenis Insiden">
            <Head title="Master Data Jenis Insiden" />

            <div style={{ padding: isMobile ? "0" : "24px" }}>
                {/* Header Section */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} md={12}>
                        <h2 style={{ margin: 0, fontWeight: 700, fontSize: isMobile ? "20px" : "24px", color: isDarkMode ? "#fff" : "#1e293b" }}>
                            Master Data Jenis Insiden
                        </h2>
                        <p style={{ margin: 0, color: "#64748b", fontSize: isMobile ? "13px" : "14px" }}>
                            Klasifikasi jenis-jenis insiden di lapangan.
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
                <IncidentTypeHeader
                    searchText={searchText}
                    onSearchChange={handleSearchChange}
                    onAddClick={handleAdd}
                    isDarkMode={isDarkMode}
                    table={table}
                />

                {/* Table Section */}
                <IncidentTypeTable
                    table={table}
                    loading={loading}
                    totalRows={totalRows}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Modal Form */}
            <IncidentTypeModal
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
                title="Hapus Jenis Insiden"
                description={`Apakah Anda yakin ingin menghapus jenis insiden "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                loading={loading}
            />
        </DashboardLayout>
    );
}
