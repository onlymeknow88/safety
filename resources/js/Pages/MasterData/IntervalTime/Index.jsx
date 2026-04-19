import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import IntervalTimeHeader from "./Partials/IntervalTimeHeader";
import IntervalTimeModal from "./Partials/IntervalTimeModal";
import IntervalTimeTable from "./Partials/IntervalTimeTable";
import React from "react";
import useIntervalTime from "./Hooks/useIntervalTime";
import { useTheme } from "@/Contexts/ThemeContext";

export default function IntervalTimeIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useIntervalTime();

    return (
        <DashboardLayout title="Master Data Interval Waktu">
            <Head title="Master Data Interval Waktu" />
            <div style={{ padding: "24px" }}>
                <IntervalTimeHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <IntervalTimeTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <IntervalTimeModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Interval Waktu" description={`Apakah Anda yakin ingin menghapus data "${itemToDelete?.label}"?`} loading={loading} />
        </DashboardLayout>
    );
}
