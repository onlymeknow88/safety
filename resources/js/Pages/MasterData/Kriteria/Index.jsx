import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import KriteriaHeader from "./Partials/KriteriaHeader";
import KriteriaModal from "./Partials/KriteriaModal";
import KriteriaTable from "./Partials/KriteriaTable";
import React from "react";
import useKriteria from "./Hooks/useKriteria";
import { useTheme } from "@/Contexts/ThemeContext";

export default function KriteriaIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useKriteria();

    return (
        <DashboardLayout title="Master Data Kriteria">
            <Head title="Master Data Kriteria" />
            <div style={{ padding: "24px" }}>
                <KriteriaHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <KriteriaTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <KriteriaModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Kriteria" description={`Apakah Anda yakin ingin menghapus data "${itemToDelete?.name}"?`} loading={loading} />
        </DashboardLayout>
    );
}
