import React from 'react';
import { Table, Pagination, Select, Space, Grid } from 'antd';
import { flexRender } from '@tanstack/react-table';

const { useBreakpoint } = Grid;

export default function InvestigationReportTable({
    table,
    loading,
    totalRows,
    isDarkMode
}) {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    // Recursive function to map TanStack Header Groups to Ant Design Columns
    const mapHeaderToAntd = (header) => {
        const column = header.column;
        const columnDef = column.columnDef;
        const meta = columnDef.meta || {};

        const antdColumn = {
            title: typeof columnDef.header === 'string' ? columnDef.header : flexRender(columnDef.header, header.getContext()),
            dataIndex: column.id,
            key: column.id,
            align: meta.align || 'left',
            width: meta.width,
            onCell: () => ({
                style: { whiteSpace: meta.nowrap === false ? 'normal' : 'nowrap' }
            }),
            onHeaderCell: () => ({
                style: { whiteSpace: 'nowrap' }
            })
        };

        if (columnDef.columns && columnDef.columns.length > 0) {
            // This is a group column
            antdColumn.children = header.subHeaders.map(subHeader => mapHeaderToAntd(subHeader));
            // Group headers don't have dataIndex usually
            delete antdColumn.dataIndex;
        } else {
            // This is a leaf column
            antdColumn.render = (value, record) => {
                const row = table.getRowModel().rows.find(r => String(r.original.id) === String(record.id));
                const cell = row?.getVisibleCells().find(c => c.column.id === column.id);
                
                if (cell) {
                    return flexRender(cell.column.columnDef.cell, cell.getContext());
                }
                return value !== undefined ? value : null;
            };
        }

        return antdColumn;
    };

    // Get the top-level header groups
    const headerGroups = table.getHeaderGroups();
    // We only take the first header group's headers and map them recursively
    const antdColumns = headerGroups[0].headers.map(header => mapHeaderToAntd(header));

    // Formatting data for Ant Design Table
    const dataSource = table.getRowModel().rows.map(row => ({
        ...row.original,
        key: row.original.id,
    }));

    return (
        <div style={{ 
            background: isDarkMode ? "#1e293b" : "#ffffff",
            borderRadius: "20px",
            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            boxShadow: isDarkMode ? "0 10px 15px -3px rgba(0, 0, 0, 0.2)" : "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
            overflow: "hidden"
        }}>
            <Table
                rowKey="key"
                columns={antdColumns}
                dataSource={dataSource}
                loading={loading}
                pagination={false}
                scroll={{ x: 'max-content' }}
                className={`premium-table ${isDarkMode ? 'dark' : ''}`}
            />

            {/* Pagination Bar */}
            <div style={{
                padding: isMobile ? "20px" : "16px 32px",
                background: isDarkMode ? "#1e293b" : "#f8fafc",
                borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: isMobile ? 20 : 0,
            }}>
                <Space size="large" direction={isMobile ? "vertical" : "horizontal"} style={{ alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: isDarkMode ? "#94a3b8" : "#64748b", fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Show
                        </span>
                        <Select
                            size="small"
                            variant="filled"
                            value={table.getState().pagination.pageSize}
                            onChange={(value) => table.setPageSize(value)}
                            style={{ width: 80 }}
                            className="premium-select"
                            options={[
                                { value: 10, label: '10' },
                                { value: 20, label: '20' },
                                { value: 50, label: '50' },
                                { value: 100, label: '100' },
                            ]}
                        />
                    </div>
                    <span style={{ color: isDarkMode ? "#64748b" : "#94a3b8", fontSize: '13px', fontWeight: 600 }}>
                        Showing <span style={{ color: isDarkMode ? "#3b82f6" : "#2563eb" }}>{totalRows > 0 ? (table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1) : 0}</span> to <span style={{ color: isDarkMode ? "#3b82f6" : "#2563eb" }}>{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, totalRows || 0)}</span> of <span style={{ color: isDarkMode ? "#3b82f6" : "#2563eb" }}>{totalRows || 0}</span> entries
                    </span>
                </Space>

                <Pagination
                    current={table.getState().pagination.pageIndex + 1}
                    pageSize={table.getState().pagination.pageSize}
                    total={totalRows}
                    onChange={(page) => table.setPageIndex(page - 1)}
                    showSizeChanger={false}
                    size={isMobile ? "default" : "small"}
                    className="premium-pagination"
                />
            </div>

            <style>{`
                .premium-table .ant-table {
                    background: transparent !important;
                }
                .premium-table .ant-table-thead > tr > th {
                    background: ${isDarkMode ? "#1e293b" : "#f8fafc"} !important;
                    color: ${isDarkMode ? "#cbd5e1" : "#475569"} !important;
                    font-size: 11px !important;
                    font-weight: 800 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.1em !important;
                    border-bottom: 2px solid ${isDarkMode ? "#334155" : "#e2e8f0"} !important;
                    padding: 18px 16px !important;
                    transition: all 0.3s ease;
                }
                .premium-table .ant-table-tbody > tr > td {
                    padding: 16px !important;
                    border-bottom: 1px solid ${isDarkMode ? "#334155" : "#f1f5f9"} !important;
                    color: ${isDarkMode ? "#f8fafc" : "#1e293b"} !important;
                    font-size: 13px !important;
                    font-weight: 500 !important;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .premium-table .ant-table-tbody > tr:hover > td {
                    background: ${isDarkMode ? "#334155" : "#f0f9ff"} !important;
                    color: ${isDarkMode ? "#ffffff" : "#1e293b"} !important;
                }
                .premium-table .ant-table-column-sorter {
                    color: ${isDarkMode ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.25)"} !important;
                }
                .premium-table .ant-table-column-sorter-up.active, 
                .premium-table .ant-table-column-sorter-down.active {
                    color: ${isDarkMode ? "#ffffff" : "#2563eb"} !important;
                }
                .premium-table .ant-table-thead th.ant-table-column-has-sorters:hover {
                    background: ${isDarkMode ? "#334155" : "#f1f5f9"} !important;
                }
                .premium-table .ant-checkbox-inner {
                    border-radius: 4px !important;
                    border-color: ${isDarkMode ? "#334155" : "#cbd5e1"} !important;
                }
                .premium-table .ant-table-thead .ant-checkbox-inner {
                    border-color: ${isDarkMode ? "rgba(255, 255, 255, 0.5)" : "#cbd5e1"} !important;
                    background: transparent !important;
                }
                .premium-table .ant-table-thead .ant-checkbox-checked .ant-checkbox-inner {
                    background-color: ${isDarkMode ? "#ffffff" : "#2563eb"} !important;
                    border-color: ${isDarkMode ? "#ffffff" : "#2563eb"} !important;
                }
                .premium-table .ant-table-thead .ant-checkbox-checked .ant-checkbox-inner::after {
                    border-color: #ffffff !important;
                }
                .premium-table .ant-checkbox-checked .ant-checkbox-inner {
                    background-color: ${isDarkMode ? "#3b82f6" : "#2563eb"} !important;
                    border-color: ${isDarkMode ? "#3b82f6" : "#2563eb"} !important;
                }
                .premium-pagination .ant-pagination-item {
                    border-radius: 10px !important;
                    border: none !important;
                    background: transparent !important;
                    font-weight: 700 !important;
                }
                .premium-pagination .ant-pagination-item-active {
                    background: #3b82f6 !important;
                    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
                }
                .premium-pagination .ant-pagination-item-active a {
                    color: ${isDarkMode ? "#ffffff" : "#2563eb"} !important;
                }
                .premium-pagination .ant-pagination-prev .ant-pagination-item-link,
                .premium-pagination .ant-pagination-next .ant-pagination-item-link {
                    border-radius: 10px !important;
                    border: none !important;
                    background: ${isDarkMode ? "#334155" : "#ffffff"} !important;
                }
            `}</style>
        </div>
    );
}
