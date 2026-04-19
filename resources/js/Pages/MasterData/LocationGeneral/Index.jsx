import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import LocationGeneralHeader from "./Partials/LocationGeneralHeader";
import LocationGeneralModal from "./Partials/LocationGeneralModal";
import LocationGeneralTable from "./Partials/LocationGeneralTable";
import React from "react";
import useLocationGeneral from "./Hooks/useLocationGeneral";
import { useTheme } from "@/Contexts/ThemeContext";

export default function LocationGeneralIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useLocationGeneral();

    return (
        <DashboardLayout title="Master Data Lokasi (General)">
            <Head title="Master Data Lokasi (General)" />
            <div style={{ padding: "24px" }}>
                <LocationGeneralHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <LocationGeneralTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <LocationGeneralModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Lokasi" description={`Apakah Anda yakin ingin menghapus "${itemToDelete?.name}"?`} loading={loading} />
        </DashboardLayout>
    );
}
