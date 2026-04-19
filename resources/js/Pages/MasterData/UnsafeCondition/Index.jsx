import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import UnsafeConditionHeader from "./Partials/UnsafeConditionHeader";
import UnsafeConditionModal from "./Partials/UnsafeConditionModal";
import UnsafeConditionTable from "./Partials/UnsafeConditionTable";
import React from "react";
import useUnsafeCondition from "./Hooks/useUnsafeCondition";
import { useTheme } from "@/Contexts/ThemeContext";

export default function UnsafeConditionIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useUnsafeCondition();

    return (
        <DashboardLayout title="Master Data Unsafe Condition">
            <Head title="Master Data Unsafe Condition" />
            <div style={{ padding: "24px" }}>
                <UnsafeConditionHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <UnsafeConditionTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <UnsafeConditionModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Unsafe Condition" description={`Yakin ingin menghapus "${itemToDelete?.code}"?`} loading={loading} />
        </DashboardLayout>
    );
}
