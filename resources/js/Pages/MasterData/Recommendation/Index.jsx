import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import RecommendationHeader from "./Partials/RecommendationHeader";
import RecommendationModal from "./Partials/RecommendationModal";
import RecommendationTable from "./Partials/RecommendationTable";
import React from "react";
import useRecommendation from "./Hooks/useRecommendation";
import { useTheme } from "@/Contexts/ThemeContext";

export default function RecommendationIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useRecommendation();

    return (
        <DashboardLayout title="Master Data Rekomendasi">
            <Head title="Master Data Rekomendasi" />
            <div style={{ padding: "24px" }}>
                <RecommendationHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <RecommendationTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <RecommendationModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Rekomendasi" description={`Apakah Anda yakin ingin menghapus "${itemToDelete?.name}"?`} loading={loading} />
        </DashboardLayout>
    );
}
