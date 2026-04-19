import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import PermissionProtectedRoute from "@/Components/PermissionProtectedRoute";
import React from "react";
// Partials
import UserHeader from "./Partials/UserHeader";
import UserModal from "./Partials/UserModal";
import UserTable from "./Partials/UserTable";
import DeleteConfirmModal from "@/Components/DeleteConfirmModal"; // Tambahkan ini
import { theme } from "antd";
import { useTheme } from "@/Contexts/ThemeContext";
// Local Hook
import useUserManagement from "./Hooks/useUserManagement.jsx";

export default function UserIndex() {
    const { isDarkMode } = useTheme();
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    // Using the centralized logic hook
    const {
        searchText,
        handleSearchChange,
        showModal,
        table,
        usersFeedback,
        columnsCount,
        isModalVisible,
        isDeleteModalVisible, // Tambahkan ini
        handleConfirmDelete, // Tambahkan ini
        handleCancel,
        handleOk,
        form,
        editingUser,
        itemToDelete, // Tambahkan ini
        rolesList,
        postFeedback,
        putFeedback,
        deleteFeedback // Tambahkan ini
    } = useUserManagement(isDarkMode);

    return (
        <PermissionProtectedRoute
            roles={["admin"]}
            permissions={["user-setting.view"]}
        >
            <DashboardLayout title="User Management">
                <Head title="User Management" />

                <div style={{ padding: "8px 32px 32px 32px" }}>
                    <UserHeader
                        searchText={searchText}
                        onSearchChange={handleSearchChange}
                        onAddClick={() => showModal()}
                        isDarkMode={isDarkMode}
                    />

                    <UserTable
                        table={table}
                        loading={usersFeedback.loading}
                        columnsCount={columnsCount}
                        isDarkMode={isDarkMode}
                    />

                    <UserModal
                        visible={isModalVisible}
                        onCancel={handleCancel}
                        onOk={handleOk}
                        form={form}
                        editingUser={editingUser}
                        rolesList={rolesList}
                        loading={postFeedback.loading || putFeedback.loading}
                    />

                    <DeleteConfirmModal
                        visible={isDeleteModalVisible}
                        onCancel={handleCancel}
                        onConfirm={handleConfirmDelete}
                        title="Delete User"
                        description={`Are you sure you want to delete user "${itemToDelete?.name}"? This action cannot be undone.`}
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
