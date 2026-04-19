import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import IncidentTypeHeader from "./Partials/IncidentTypeHeader";
import IncidentTypeModal from "./Partials/IncidentTypeModal";
import IncidentTypeTable from "./Partials/IncidentTypeTable";
import React from "react";
import useIncidentType from "./Hooks/useIncidentType";
import { useTheme } from "@/Contexts/ThemeContext";

export default function IncidentTypeIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useIncidentType();

    return (
        <DashboardLayout title="Master Data Tipe Insiden">
            <Head title="Master Data Tipe Insiden" />
            <div style={{ padding: "24px" }}>
                <IncidentTypeHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <IncidentTypeTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <IncidentTypeModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Tipe Insiden" description={`Apakah Anda yakin ingin menghapus "${itemToDelete?.category}"?`} loading={loading} />
        </DashboardLayout>
    );
}
