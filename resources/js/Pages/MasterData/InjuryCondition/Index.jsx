import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import InjuryConditionHeader from "./Partials/InjuryConditionHeader";
import InjuryConditionModal from "./Partials/InjuryConditionModal";
import InjuryConditionTable from "./Partials/InjuryConditionTable";
import React from "react";
import useInjuryCondition from "./Hooks/useInjuryCondition";
import { useTheme } from "@/Contexts/ThemeContext";

export default function InjuryConditionIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useInjuryCondition();

    return (
        <DashboardLayout title="Master Data Kondisi Cedera">
            <Head title="Master Data Kondisi Cedera" />
            <div style={{ padding: "24px" }}>
                <InjuryConditionHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <InjuryConditionTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <InjuryConditionModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Kondisi Cedera" description={`Apakah Anda yakin ingin menghapus data "${itemToDelete?.name}"?`} loading={loading} />
        </DashboardLayout>
    );
}
