import { Button, Card, Col, Input, Row, Space } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import DepartmentModal from "./Partials/DepartmentModal";
import DepartmentTable from "./Partials/DepartmentTable";
import { Head } from "@inertiajs/react";
import React from "react";
import useDepartment from "./Hooks/useDepartment";
import { useTheme } from "@/Contexts/ThemeContext"; // Import theme context

export default function DepartmentIndex() {
    const { isDarkMode } = useTheme();
    const {
        table,
        loading,
        searchText,
        handleSearchChange,
        isModalVisible,
        setIsModalVisible,
        handleAdd,
        handleEdit,
        handleOk,
        isDeleteModalVisible,
        setIsDeleteModalVisible,
        showDeleteModal,
        handleConfirmDelete,
        itemToDelete,
        editingItem,
        totalRows, // Tambahkan ini
        fetchItems
    } = useDepartment();

    return (
        <DashboardLayout title="Master Data Department">
            <Head title="Master Data Department" />

            <div style={{ padding: "24px" }}>
                {/* Header Section */}
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} md={12}>
                        <h2 style={{ margin: 0, fontWeight: 700, fontSize: "24px", color: isDarkMode ? "#fff" : "#1e293b" }}>
                            Master Data Department
                        </h2>
                        <p style={{ margin: 0, color: "#64748b" }}>
                            Kelola data Central Control Office (Department) di dalam sistem.
                        </p>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: "right" }}>
                        <Space>
                            <Button
                                icon={<ReloadOutlined />}
                                onClick={() => fetchItems()}
                                loading={loading}
                            />
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={handleAdd}
                                style={{
                                    borderRadius: "8px",
                                    height: "40px",
                                    fontWeight: 600,
                                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                                    border: "none",
                                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
                                }}
                            >
                                Tambah Department Baru
                            </Button>
                        </Space>
                    </Col>
                </Row>

                {/* Filter Section */}
                <Card
                    styles={{ body: { padding: "16px" } }}
                    style={{
                        marginBottom: 24,
                        borderRadius: 12,
                        border: "none",
                        background: isDarkMode ? "#1f1f1f" : "#fff",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                    }}
                >
                    <Input
                        placeholder="Cari berdasarkan nama atau inisial..."
                        prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                        value={searchText}
                        onChange={handleSearchChange}
                        style={{ maxWidth: 400, borderRadius: 8 }}
                        allowClear
                    />
                </Card>

                {/* Table Section */}
                <DepartmentTable
                    table={table}
                    loading={loading}
                    totalRows={totalRows}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Modal Form */}
            <DepartmentModal
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
                title="Hapus Department"
                description={`Apakah Anda yakin ingin menghapus data Department "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                loading={loading}
            />
        </DashboardLayout>
    );
}
