import React from "react";
import { Space, Spin, Typography, Button, theme } from "antd";
import { flexRender } from "@tanstack/react-table";

const { Text } = Typography;

export default function MenuTable({ table, loading, columnsCount, isDarkMode }) {
    return (
        <div
            style={{
                background: isDarkMode ? "#1f1f1f" : "#fff",
                borderRadius: 20,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                border: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
            }}
        >
            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                    }}
                    className="tanstack-table"
                >
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        style={{
                                            textAlign:
                                                header.column.columnDef.meta?.align === "right"
                                                    ? "right"
                                                    : "left",
                                            padding: "20px 24px",
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: "#bfbfbf",
                                            textTransform: "uppercase",
                                            letterSpacing: "0.5px",
                                            borderBottom: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                                        }}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={table.getVisibleLeafColumns().length}
                                    style={{
                                        textAlign: "center",
                                        padding: 40,
                                    }}
                                >
                                    <Spin size="large" />
                                </td>
                            </tr>
                        ) : table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    style={{
                                        borderBottom: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                                        transition: "background 0.2s",
                                    }}
                                    className="row-hover"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            style={{
                                                padding: "16px 24px",
                                                textAlign:
                                                    cell.column.columnDef.meta?.align === "right"
                                                        ? "right"
                                                        : "left",
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={table.getVisibleLeafColumns().length}
                                    style={{
                                        textAlign: "center",
                                        padding: 40,
                                    }}
                                >
                                    <Text type="secondary">No menus found.</Text>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div
                style={{
                    padding: "16px 24px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: `1px solid ${isDarkMode ? "#303030" : "#f0f0f0"}`,
                }}
            >
                <Text type="secondary" style={{ fontSize: 13 }}>
                    Showing {table.getRowModel().rows.length} records
                </Text>
                <Space>
                    <Button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        style={{ borderRadius: 8 }}
                    >
                        Previous
                    </Button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Text>Page</Text>
                        <Text strong>{table.getState().pagination.pageIndex + 1}</Text>
                        <Text>of {table.getPageCount()}</Text>
                    </div>
                    <Button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        style={{ borderRadius: 8 }}
                    >
                        Next
                    </Button>
                </Space>
            </div>
        </div>
    );
}
