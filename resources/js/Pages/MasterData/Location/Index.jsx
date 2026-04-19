import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import LocationHeader from "./Partials/LocationHeader";
import LocationModal from "./Partials/LocationModal";
import LocationTable from "./Partials/LocationTable";
import React from "react";
import useLocation from "./Hooks/useLocation";
import { useTheme } from "@/Contexts/ThemeContext";

export default function LocationIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useLocation();

    return (
        <DashboardLayout title="Master Data Lokasi">
            <Head title="Master Data Lokasi" />
            <div style={{ padding: "24px" }}>
                <LocationHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <LocationTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <LocationModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Lokasi" description={`Yakin ingin menghapus "${itemToDelete?.name}"?`} loading={loading} />
        </DashboardLayout>
    );
}
