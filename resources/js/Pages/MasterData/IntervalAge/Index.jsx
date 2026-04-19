import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import IntervalAgeHeader from "./Partials/IntervalAgeHeader";
import IntervalAgeModal from "./Partials/IntervalAgeModal";
import IntervalAgeTable from "./Partials/IntervalAgeTable";
import React from "react";
import useIntervalAge from "./Hooks/useIntervalAge";
import { useTheme } from "@/Contexts/ThemeContext";

export default function IntervalAgeIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useIntervalAge();

    return (
        <DashboardLayout title="Master Data Interval Usia">
            <Head title="Master Data Interval Usia" />
            <div style={{ padding: "24px" }}>
                <IntervalAgeHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <IntervalAgeTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <IntervalAgeModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Interval Usia" description={`Apakah Anda yakin ingin menghapus data "${itemToDelete?.label}"?`} loading={loading} />
        </DashboardLayout>
    );
}
