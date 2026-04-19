import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import LocationDetailHeader from "./Partials/LocationDetailHeader";
import LocationDetailModal from "./Partials/LocationDetailModal";
import LocationDetailTable from "./Partials/LocationDetailTable";
import React from "react";
import useLocationDetail from "./Hooks/useLocationDetail";
import { useTheme } from "@/Contexts/ThemeContext";

export default function LocationDetailIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useLocationDetail();

    return (
        <DashboardLayout title="Master Data Detail Lokasi">
            <Head title="Master Data Detail Lokasi" />
            <div style={{ padding: "24px" }}>
                <LocationDetailHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <LocationDetailTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <LocationDetailModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Detail Lokasi" description={`Apakah Anda yakin ingin menghapus detail lokasi "${itemToDelete?.name}"?`} loading={loading} />
        </DashboardLayout>
    );
}
