import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import GenderHeader from "./Partials/GenderHeader";
import GenderModal from "./Partials/GenderModal";
import GenderTable from "./Partials/GenderTable";
import { Head } from "@inertiajs/react";
import React from "react";
import useGender from "./Hooks/useGender";
import { useTheme } from "@/Contexts/ThemeContext";

export default function GenderIndex() {
    const { isDarkMode } = useTheme();
    const {
        table,
        loading,
        searchText,
        handleSearchChange,
        isModalVisible,
        setIsModalVisible,
        handleAdd,
        handleOk,
        isDeleteModalVisible,
        setIsDeleteModalVisible,
        showDeleteModal,
        handleConfirmDelete,
        itemToDelete,
        editingItem,
        totalRows,
    } = useGender();

    return (
        <DashboardLayout title="Master Data Jenis Kelamin">
            <Head title="Master Data Jenis Kelamin" />
            <div style={{ padding: "24px" }}>
                <GenderHeader
                    searchText={searchText}
                    onSearchChange={handleSearchChange}
                    onAddClick={handleAdd}
                    isDarkMode={isDarkMode}
                    table={table}
                />
                <GenderTable
                    table={table}
                    loading={loading}
                    totalRows={totalRows}
                    isDarkMode={isDarkMode}
                />
            </div>
            <GenderModal
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onFinish={handleOk}
                loading={loading}
                initialValues={editingItem}
            />
            <DeleteConfirmModal
                visible={isDeleteModalVisible}
                onCancel={() => setIsDeleteModalVisible(false)}
                onConfirm={handleConfirmDelete}
                title="Hapus Jenis Kelamin"
                description={`Apakah Anda yakin ingin menghapus data "${itemToDelete?.name}"?`}
                loading={loading}
            />
        </DashboardLayout>
    );
}
