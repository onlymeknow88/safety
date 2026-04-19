import { Button, Col, Row, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import LocationDetailHeader from "./Partials/LocationDetailHeader";
import LocationDetailModal from "./Partials/LocationDetailModal";
import LocationDetailTable from "./Partials/LocationDetailTable";
import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import React from "react";
import useLocationDetail from "./Hooks/useLocationDetail";
import { useTheme } from "@/Contexts/ThemeContext";

export default function LocationDetailIndex() {
    const { isDarkMode } = useTheme();
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
    } = useLocationDetail();

    return (
        <DashboardLayout title="Master Data Detail Lokasi">
            <Head title="Master Data Detail Lokasi" />

            <div style={{ padding: "24px" }}>
                {/* Header Section */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} md={12}>
                        <h2 style={{ margin: 0, fontWeight: 700, fontSize: "24px", color: isDarkMode ? "#fff" : "#1e293b" }}>
                            Master Data Detail Lokasi
                        </h2>
                        <p style={{ margin: 0, color: "#64748b" }}>
                            Kelola detail spesifik dari setiap lokasi kerja.
                        </p>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: "right" }}>
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
                <LocationDetailHeader 
                    searchText={searchText}
                    onSearchChange={handleSearchChange}
                    onAddClick={handleAdd}
                    isDarkMode={isDarkMode}
                    table={table}
                />

                {/* Table Section */}
                <LocationDetailTable 
                    table={table} 
                    loading={loading}
                    totalRows={totalRows}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Modal Form */}
            <LocationDetailModal
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
                title="Hapus Detail Lokasi"
                description={`Apakah Anda yakin ingin menghapus detail lokasi "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                loading={loading}
            />
        </DashboardLayout>
    );
}
