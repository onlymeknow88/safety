import { usePage } from "@inertiajs/react";
import React from "react";

/**
 * PermissionGuard component to conditionally render children based on roles/permissions
 * 
 * @param {Object} props
 * @param {string|string[]} props.roles - Required role(s)
 * @param {string|string[]} props.permissions - Required permission(s)
 * @param {boolean} props.all - If true, user must have ALL roles/permissions. If false, user must have AT LEAST ONE.
 * @param {React.ReactNode} props.fallback - Component to render if user doesn't have required permission
 * @param {React.ReactNode} props.children - Component to render if user HAS permission
 */
export default function PermissionGuard({ 
    roles = [], 
    permissions = [], 
    all = false, 
    fallback = null, 
    children 
}) {
    const { auth } = usePage().props;
    const user = auth?.user;

    if (!user) return fallback;

    // Convert to arrays if they are strings
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    const requiredPermissions = Array.isArray(permissions) ? permissions : [permissions];

    // Get user's roles and permissions from shared props
    // Assuming auth.user has roles and permissions arrays
    const userRoles = user.roles || [];
    const userPermissions = user.permissions || [];

    let hasRole = true;
    let hasPermission = true;

    if (requiredRoles.length > 0) {
        if (all) {
            hasRole = requiredRoles.every(role => userRoles.includes(role));
        } else {
            hasRole = requiredRoles.some(role => userRoles.includes(role));
        }
    }

    if (requiredPermissions.length > 0) {
        if (all) {
            hasPermission = requiredPermissions.every(permission => userPermissions.includes(permission));
        } else {
            hasPermission = requiredPermissions.some(permission => userPermissions.includes(permission));
        }
    }

    const isAuthorized = hasRole && hasPermission;

    if (!isAuthorized) {
        return fallback;
    }

    return <>{children}</>;
}

/**
 * Custom hook to check permissions programmatically
 */
export function usePermission() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const hasRole = (role) => {
        if (!user || !user.roles) return false;
        if (Array.isArray(role)) {
            return role.some(r => user.roles.includes(r));
        }
        return user.roles.includes(role);
    };

    const hasPermission = (permission) => {
        if (!user || !user.permissions) return false;
        if (Array.isArray(permission)) {
            return permission.some(p => user.permissions.includes(p));
        }
        return user.permissions.includes(permission);
    };

    return { hasRole, hasPermission, user };
}
