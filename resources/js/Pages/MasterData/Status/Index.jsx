import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import StatusHeader from "./Partials/StatusHeader";
import StatusModal from "./Partials/StatusModal";
import StatusTable from "./Partials/StatusTable";
import React from "react";
import useStatus from "./Hooks/useStatus";
import { useTheme } from "@/Contexts/ThemeContext";

export default function StatusIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useStatus();

    return (
        <DashboardLayout title="Master Data Status">
            <Head title="Master Data Status" />
            <div style={{ padding: "24px" }}>
                <StatusHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <StatusTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <StatusModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Status" description={`Apakah Anda yakin ingin menghapus data "${itemToDelete?.name}"?`} loading={loading} />
        </DashboardLayout>
    );
}
