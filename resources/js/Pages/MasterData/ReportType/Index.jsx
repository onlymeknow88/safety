import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
import ReportTypeHeader from "./Partials/ReportTypeHeader";
import ReportTypeModal from "./Partials/ReportTypeModal";
import ReportTypeTable from "./Partials/ReportTypeTable";
import React from "react";
import useReportType from "./Hooks/useReportType";
import { useTheme } from "@/Contexts/ThemeContext";

export default function ReportTypeIndex() {
    const { isDarkMode } = useTheme();
    const { table, loading, searchText, handleSearchChange, isModalVisible, setIsModalVisible, handleAdd, handleOk, isDeleteModalVisible, setIsDeleteModalVisible, handleConfirmDelete, itemToDelete, editingItem, totalRows } = useReportType();

    return (
        <DashboardLayout title="Master Data Tipe Laporan">
            <Head title="Master Data Tipe Laporan" />
            <div style={{ padding: "24px" }}>
                <ReportTypeHeader searchText={searchText} onSearchChange={handleSearchChange} onAddClick={handleAdd} isDarkMode={isDarkMode} table={table} />
                <ReportTypeTable table={table} loading={loading} totalRows={totalRows} isDarkMode={isDarkMode} />
            </div>
            <ReportTypeModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onFinish={handleOk} loading={loading} initialValues={editingItem} />
            <DeleteConfirmModal visible={isDeleteModalVisible} onCancel={() => setIsDeleteModalVisible(false)} onConfirm={handleConfirmDelete} title="Hapus Tipe Laporan" description={`Yakin ingin menghapus "${itemToDelete?.code}"?`} loading={loading} />
        </DashboardLayout>
    );
}
