import { Button, Card, Col, Input, Row, Space } from "antd";
import { PlusOutlined, ReloadOutlined, SearchOutlined } from "@ant-design/icons";

import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import React from "react";
import ShiftHeader from "./Partials/ShiftHeader";
import ShiftModal from "./Partials/ShiftModal";
import ShiftTable from "./Partials/ShiftTable";
import useShift from "./Hooks/useShift";
import { useTheme } from "@/Contexts/ThemeContext";

export default function ShiftIndex() {
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
        totalRows,
        fetchItems
    } = useShift();

    return (
        <DashboardLayout title="Master Data Shift">
            <Head title="Master Data Shift" />

                <ShiftHeader
                    searchText={searchText}
                    onSearchChange={handleSearchChange}
                    onAddClick={handleAdd}
                    isDarkMode={isDarkMode}
                    table={table}
                />

                <ShiftTable
                    table={table}
                    loading={loading}
                    totalRows={totalRows}
                    isDarkMode={isDarkMode}
                    onEdit={handleEdit}
                    onDelete={showDeleteModal}
                />

            <ShiftModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onFinish={handleOk}
                loading={loading}
                initialValues={editingItem}
            />

            <DeleteConfirmModal
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Shift"
                description={`Apakah Anda yakin ingin menghapus data Shift "${itemToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                loading={loading}
            />
        </DashboardLayout>
    );
}
