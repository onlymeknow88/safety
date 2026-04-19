import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import UnsafeActHeader from "./Partials/UnsafeActHeader";
import UnsafeActModal from "./Partials/UnsafeActModal";
import UnsafeActTable from "./Partials/UnsafeActTable";
import React from "react";
import useUnsafeAct from "./Hooks/useUnsafeAct";
import { useTheme } from "@/Contexts/ThemeContext";

export default function UnsafeActIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useUnsafeAct();

    return (
        <DashboardLayout title="Master Data Unsafe Act">
            <Head title="Master Data Unsafe Act" />
            <div style={{ padding: "24px" }}>
                <UnsafeActHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <UnsafeActTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <UnsafeActModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Unsafe Act" description={`Yakin ingin menghapus "${itemToDelete?.code}"?`} loading={loading} />
        </DashboardLayout>
    );
}
