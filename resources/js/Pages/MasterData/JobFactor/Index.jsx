import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import JobFactorHeader from "./Partials/JobFactorHeader";
import JobFactorModal from "./Partials/JobFactorModal";
import JobFactorTable from "./Partials/JobFactorTable";
import React from "react";
import useJobFactor from "./Hooks/useJobFactor";
import { useTheme } from "@/Contexts/ThemeContext";

export default function JobFactorIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useJobFactor();

    return (
        <DashboardLayout title="Master Data Job Factor">
            <Head title="Master Data Job Factor" />
            <div style={{ padding: "24px" }}>
                <JobFactorHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <JobFactorTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <JobFactorModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Job Factor" description={`Yakin ingin menghapus "${itemToDelete?.code}"?`} loading={loading} />
        </DashboardLayout>
    );
}
