import React, { useEffect } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { Result, Button } from "antd";
import DashboardLayout from "@/Layouts/DashboardLayout";
import TokenManager from "@/Utils/TokenManager";

/**
 * PermissionProtectedRoute
 * Used to protect entire pages or large sections.
 * Shows an "Unauthorized" Result component from Ant Design if check fails.
 */
export default function PermissionProtectedRoute({
    children,
    roles = [],
    permissions = [],
    all = false,
    useLayout = true // Whether to wrap the error in DashboardLayout
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Check JWT Expiration on mount
    useEffect(() => {
        if (TokenManager.isTokenExpired()) {
            console.log("JWT Expired. Logging out...");
            TokenManager.logout();
        }
    }, []);

    // Check if user exists
    if (!user) {
        return (
            <UnauthorizedContent
                status="403"
                title="403"
                subTitle="Maaf, anda harus login untuk mengakses halaman ini."
                useLayout={useLayout}
            />
        );
    }

    const requiredRoles = Array.isArray(roles) ? roles : roles ? [roles] : [];
    const requiredPermissions = Array.isArray(permissions) ? permissions : permissions ? [permissions] : [];

    const userRoles = user.roles || [];
    const userPermissions = user.permissions || [];

    let isAuthorized = true;

    // 1. Roles Check
    if (requiredRoles.length > 0) {
        if (all) {
            isAuthorized = requiredRoles.every(role => userRoles.includes(role));
        } else {
            isAuthorized = requiredRoles.some(role => userRoles.includes(role));
        }
    }

    // 2. Superadmin Bypass: If user has 'admin' role, they bypass permission checks
    const isSuperAdmin = userRoles.includes('admin');

    // 3. Permissions Check (only if not a superadmin, still authorized, and there are required permissions)
    if (!isSuperAdmin && isAuthorized && requiredPermissions.length > 0) {
        if (all) {
            isAuthorized = requiredPermissions.every(permission => userPermissions.includes(permission));
        } else {
            isAuthorized = requiredPermissions.some(permission => userPermissions.includes(permission));
        }
    }

    if (!isAuthorized) {
        return (
            <UnauthorizedContent
                status="403"
                title="403"
                subTitle="Maaf, anda tidak punya izin untuk mengakses halaman ini."
                useLayout={useLayout}
            />
        );
    }

    return <>{children}</>;
}

function UnauthorizedContent({ status, title, subTitle, useLayout }) {
    const content = (
        <div style={{ padding: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
            <Result
                status={status}
                title={title}
                subTitle={subTitle}
                extra={
                    <Button type="primary">
                        <Link href="/dashboard" style={{ color: 'white' }}>Kembali ke Dashboard</Link>
                    </Button>
                }
            />
        </div>
    );

    if (useLayout) {
        return (
            <DashboardLayout title="Unauthorized">
                {content}
            </DashboardLayout>
        );
    }

    return content;
}
