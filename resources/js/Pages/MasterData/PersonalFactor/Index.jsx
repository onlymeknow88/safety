import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import PersonalFactorHeader from "./Partials/PersonalFactorHeader";
import PersonalFactorModal from "./Partials/PersonalFactorModal";
import PersonalFactorTable from "./Partials/PersonalFactorTable";
import React from "react";
import usePersonalFactor from "./Hooks/usePersonalFactor";
import { useTheme } from "@/Contexts/ThemeContext";

export default function PersonalFactorIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = usePersonalFactor();

    return (
        <DashboardLayout title="Master Data Personal Factor">
            <Head title="Master Data Personal Factor" />
            <div style={{ padding: "24px" }}>
                <PersonalFactorHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <PersonalFactorTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <PersonalFactorModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Personal Factor" description={`Yakin ingin menghapus "${itemToDelete?.code}"?`} loading={loading} />
        </DashboardLayout>
    );
}
