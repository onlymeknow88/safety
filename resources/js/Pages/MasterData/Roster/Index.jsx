import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import RosterHeader from "./Partials/RosterHeader";
import RosterModal from "./Partials/RosterModal";
import RosterTable from "./Partials/RosterTable";
import React from "react";
import useRoster from "./Hooks/useRoster";
import { useTheme } from "@/Contexts/ThemeContext";

export default function RosterIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useRoster();

    return (
        <DashboardLayout title="Master Data Roster">
            <Head title="Master Data Roster" />
            <div style={{ padding: "24px" }}>
                <RosterHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <RosterTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <RosterModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Roster" description={`Apakah Anda yakin ingin menghapus data "${itemToDelete?.pattern}"?`} loading={loading} />
        </DashboardLayout>
    );
}
