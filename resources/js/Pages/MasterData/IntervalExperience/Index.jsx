import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import IntervalExperienceHeader from "./Partials/IntervalExperienceHeader";
import IntervalExperienceModal from "./Partials/IntervalExperienceModal";
import IntervalExperienceTable from "./Partials/IntervalExperienceTable";
import React from "react";
import useIntervalExperience from "./Hooks/useIntervalExperience";
import { useTheme } from "@/Contexts/ThemeContext";

export default function IntervalExperienceIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useIntervalExperience();

    return (
        <DashboardLayout title="Master Data Interval Pengalaman">
            <Head title="Master Data Interval Pengalaman" />
            <div style={{ padding: "24px" }}>
                <IntervalExperienceHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <IntervalExperienceTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <IntervalExperienceModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Interval Pengalaman" description={`Apakah Anda yakin ingin menghapus data "${itemToDelete?.label}"?`} loading={loading} />
        </DashboardLayout>
    );
}
