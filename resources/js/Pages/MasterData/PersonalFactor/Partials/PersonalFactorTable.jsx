import React from 'react';
import { Table, Pagination, Select, Space, Grid } from 'antd';
import { flexRender } from '@tanstack/react-table';

const { useBreakpoint } = Grid;

export default function PersonalFactorTable({
    table,
    loading,
    totalRows,
    isDarkMode
}) {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    // Mapping TanStack Columns to Ant Design Columns
    const antdColumns = table.getVisibleLeafColumns().map((column) => {
        const header = column.columnDef.header;
        const meta = column.columnDef.meta || {};

        return {
            title: typeof header === 'string' ? header : flexRender(header, {}),
            dataIndex: column.id,
            key: column.id,
            align: meta.align || 'left',
            render: (value, record) => {
                const row = table.getRowModel().flatRows.find(r => String(r.original.id) === String(record.id));
                const cell = row?.getVisibleCells().find(c => c.column.id === column.id);
                
                if (cell) {
                    return flexRender(cell.column.columnDef.cell, cell.getContext());
                }
                return value !== undefined ? value : null;
            }
        };
    });

    // Formatting data for Ant Design Table
    const dataSource = table.getRowModel().rows.map(row => ({
        ...row.original,
        key: row.original.id,
    }));

    return (
        <div style={{ 
            background: isDarkMode ? "#1e293b" : "#fff",
            borderRadius: "20px",
            padding: "1px",
            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            boxShadow: isDarkMode ? "none" : "0 4px 24px rgba(0,0,0,0.04)",
            overflow: "hidden"
        }}>
            <Table
                rowKey="key"
                columns={antdColumns}
                dataSource={dataSource}
                loading={loading}
                pagination={false} // Matikan pagination bawaan
                scroll={{ x: 600 }}
                className={`custom-antd-table ${isDarkMode ? 'dark-mode' : ''}`}
                style={{ borderRadius: "20px" }}
            />

            {/* Premium Pagination Bar (Identik dengan Menu) */}
            <div style={{
                padding: isMobile ? "16px" : "16px 24px",
                background: isDarkMode ? '#1e293b' : '#f8fafc',
                borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: isMobile ? 16 : 0,
            }}>
                {/* Left Side: Results Info + Page Size Selector */}
                <Space size="middle" direction={isMobile ? "vertical" : "horizontal"} style={{ alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
                    <span style={{ color: isDarkMode ? "#8c8c8c" : "#64748b", fontSize: '13px' }}>
                        Results: {totalRows > 0 ? (table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1) : 0} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, totalRows || 0)} of {totalRows || 0}
                    </span>
                    <Select
                        size="small"
                        value={table.getState().pagination.pageSize}
                        onChange={(value) => table.setPageSize(value)}
                        style={{ width: 70 }}
                        options={[
                            { value: 10, label: '10' },
                            { value: 20, label: '20' },
                            { value: 50, label: '50' },
                            { value: 100, label: '100' },
                        ]}
                    />
                </Space>

                {/* Right Side: Page Navigation */}
                <Pagination
                    current={table.getState().pagination.pageIndex + 1}
                    pageSize={table.getState().pagination.pageSize}
                    total={totalRows}
                    onChange={(page) => table.setPageIndex(page - 1)}
                    showSizeChanger={false}
                    size="small"
                />
            </div>

            <style>{`
                .custom-antd-table .ant-table {
                    background: transparent !important;
                }
                .custom-antd-table .ant-table-thead > tr > th {
                    background: ${isDarkMode ? "#1e293b" : "#f8fafc"} !important;
                    color: ${isDarkMode ? "#cbd5e1" : "#475569"} !important;
                    font-weight: 700 !important;
                    border-bottom: 2px solid ${isDarkMode ? "#334155" : "#e2e8f0"} !important;
                    padding: 16px !important;
                }
                .custom-antd-table .ant-table-tbody > tr > td {
                    padding: 16px !important;
                    border-bottom: 1px solid ${isDarkMode ? "#334155" : "#f1f5f9"} !important;
                    transition: all 0.2s;
                }
                .custom-antd-table .ant-table-tbody > tr:hover > td {
                    background: ${isDarkMode ? "#334155" : "#f0f9ff"} !important;
                }
            `}</style>
        </div>
    );
}
