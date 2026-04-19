import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import BodyPartHeader from "./Partials/BodyPartHeader";
import BodyPartModal from "./Partials/BodyPartModal";
import BodyPartTable from "./Partials/BodyPartTable";
import React from "react";
import useBodyPart from "./Hooks/useBodyPart";
import { useTheme } from "@/Contexts/ThemeContext";

export default function BodyPartIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useBodyPart();

    return (
        <DashboardLayout title="Master Data Bagian Tubuh">
            <Head title="Master Data Bagian Tubuh" />
            <div style={{ padding: "24px" }}>
                <BodyPartHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <BodyPartTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <BodyPartModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Bagian Tubuh" description={`Apakah Anda yakin ingin menghapus "${itemToDelete?.name}"?`} loading={loading} />
        </DashboardLayout>
    );
}
