import { Button, Col, Row, Space, Grid } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import LocationHeader from "./Partials/LocationHeader";
import LocationModal from "./Partials/LocationModal";
import LocationTable from "./Partials/LocationTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import React from "react";
import useLocation from "./Hooks/useLocation";
import { useTheme } from "@/Contexts/ThemeContext";

const { useBreakpoint } = Grid;

export default function LocationIndex() {
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
    } = useLocation();

    return (
        <DashboardLayout title="Master Data Lokasi">
            <Head title="Master Data Lokasi" />

            <div style={{ padding: isMobile ? "0" : "24px" }}>
                {/* Header Section */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} md={12}>
                        <h2 style={{ margin: 0, fontWeight: 700, fontSize: isMobile ? "20px" : "24px", color: isDarkMode ? "#fff" : "#1e293b" }}>
                            Master Data Lokasi
                        </h2>
                        <p style={{ margin: 0, color: "#64748b", fontSize: isMobile ? "13px" : "14px" }}>
                            Kelola pusat data lokasi kerja dan unit.
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
                <LocationHeader
                    searchText={searchText}
                    onSearchChange={handleSearchChange}
                    onAddClick={handleAdd}
                    isDarkMode={isDarkMode}
                    table={table}
                />

                {/* Table Section */}
                <LocationTable
                    table={table}
                    loading={loading}
                    totalRows={totalRows}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Modal Form */}
            <LocationModal
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
                title="Hapus Lokasi"
                description={`Apakah Anda yakin ingin menghapus lokasi "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                loading={loading}
            />
        </DashboardLayout>
    );
}
