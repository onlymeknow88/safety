import DashboardLayout from "@/Layouts/DashboardLayout";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal";
import { Head } from "@inertiajs/react";
// Partials
import MenuHeader from "./Partials/MenuHeader";
import MenuModal from "./Partials/MenuModal";
import MenuTable from "./Partials/MenuTable";
import MenuTableAntd from "./Partials/MenuTableAntd";
import PermissionProtectedRoute from "@/Components/PermissionProtectedRoute";
import React from "react";
import { theme } from "antd";
// Local Hook
import useMenu from "./Hooks/useMenu.jsx";
import { useTheme } from "@/Contexts/ThemeContext";

export default function MenuIndex() {
    const { isDarkMode } = useTheme();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // Using the centralized logic hook
    const {
        searchText,
        setSearchText,
        handleSearchChange,
        filterStatus,
        setFilterStatus,
        isFilterVisible,
        setIsFilterVisible,
        showModal,
        table,
        loading,
        totalRows,
        handleReorder, // Ambil fungsi reorder
        columnsCount,
        isModalVisible,
        isDeleteModalVisible,
        setIsDeleteModalVisible,
        handleConfirmDelete,
        handleCancel,
        handleOk,
        form,
        editingItem,
        postFeedback,
        putFeedback,
        deleteFeedback
    } = useMenu(isDarkMode);

    return (
        <PermissionProtectedRoute
            roles={["admin"]}
            permissions={["menu-setting.view"]}
        >
            <DashboardLayout title="Menu Setting">
                <Head title="Menu Setting" />

                <div style={{ padding: "8px 32px 32px 32px" }}>
                    <MenuHeader
                        searchText={searchText}
                        onSearchChange={handleSearchChange}
                        onAddClick={() => showModal()}
                        isDarkMode={isDarkMode}
                        filterStatus={filterStatus}
                        setFilterStatus={setFilterStatus}
                        isFilterVisible={isFilterVisible}
                        setIsFilterVisible={setIsFilterVisible}
                        table={table}
                    />

                    <MenuTableAntd
                        table={table}
                        loading={loading}
                        totalRows={totalRows}
                        columnsCount={columnsCount}
                        filterStatus={filterStatus}
                        searchText={searchText}
                        isDarkMode={isDarkMode}
                        onFilterChange={({ status, search }) => {
                            if (status !== undefined) setFilterStatus(status);
                            if (search !== undefined) setSearchText(search);
                        }}
                        onReorder={handleReorder}
                    />

                    <MenuModal
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        onOk={handleOk}
                        form={form}
                        editingItem={editingItem}
                        loading={postFeedback.loading || putFeedback.loading}
                        potentialParents={table.getCoreRowModel().rows
                            .map(row => row.original)
                            .filter(item => !item.parent_id && item.id !== editingItem?.id)
                            .map(item => ({ id: item.id, name: item.name, slug: item.slug }))
                        }
                    />

                    <DeleteConfirmModal
                        visible={isDeleteModalVisible}
                        onCancel={() => setIsDeleteModalVisible(false)}
                        onConfirm={handleConfirmDelete}
                        loading={deleteFeedback.loading}
                    />

                    <style
                        dangerouslySetInnerHTML={{
                            __html: `
                        .row-hover:hover {
                            background: ${isDarkMode ? "#262626" : "#fafafa"} !important;
                        }
                    `,
                        }}
                    />
                </div>
            </DashboardLayout>
        </PermissionProtectedRoute>
    );
}
