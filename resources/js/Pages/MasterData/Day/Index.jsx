import { Button, Card, Col, Input, Row, Space } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import DayModal from "./Partials/DayModal";
import DayTable from "./Partials/DayTable";
import React from "react";
import useDay from "./Hooks/useDay";
import { useTheme } from "@/Contexts/ThemeContext";

export default function DayIndex() {
    const { isDarkMode } = useTheme();
    const {
        table, loading, searchText, handleSearchChange,
        isModalVisible, setIsModalVisible, handleAdd, handleEdit, handleOk,
        isDeleteModalVisible, setIsDeleteModalVisible, showDeleteModal, handleConfirmDelete,
        itemToDelete, editingItem, totalRows, fetchItems
    } = useDay();

    return (
        <DashboardLayout title="Master Data Hari">
            <Head title="Master Data Hari" />
            <div style={{ padding: "24px" }}>
                <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 24 }}>
                    <Col xs={24} md={12}>
                        <h2 style={{ margin: 0, fontWeight: 700, fontSize: "24px", color: isDarkMode ? "#fff" : "#1e293b" }}>Master Data Hari</h2>
                        <p style={{ margin: 0, color: "#64748b" }}>Kelola data Hari di dalam sistem.</p>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: "right" }}>
                        <Space>
                            <Button icon={<ReloadOutlined />} onClick={() => fetchItems()} loading={loading} />
                            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} className="premium-button">Tambah Hari</Button>
                        </Space>
                    </Col>
                </Row>
                <Card className="filter-card" style={{ background: isDarkMode ? "#1f1f1f" : "#fff" }}>
                    <Input
                        placeholder="Cari berdasarkan nama..."
                        prefix={<SearchOutlined style={{ color: "#94a3b8" }} />}
                        value={searchText}
                        onChange={handleSearchChange}
                        style={{ maxWidth: 400, borderRadius: 8 }}
                        allowClear
                    />
                </Card>
                <DayTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <DayModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Hari" description={`Apakah Anda yakin ingin menghapus data Hari "${itemToDelete?.name}"?`} loading={loading} />
        </DashboardLayout>
    );
}
