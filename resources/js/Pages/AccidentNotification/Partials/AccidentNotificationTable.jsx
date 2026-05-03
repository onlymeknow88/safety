import React from 'react';
import { Table, Pagination, Select, Space, Grid } from 'antd';
import { flexRender } from '@tanstack/react-table';

const { useBreakpoint } = Grid;

export default function AccidentNotificationTable({
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
            background: isDarkMode ? "#141414" : "#fff",
            borderRadius: "16px",
            padding: "1px",
            boxShadow: isDarkMode ? "none" : "0 4px 24px rgba(0,0,0,0.04)",
            overflow: "hidden"
        }}>
            <Table
                rowKey="key"
                columns={antdColumns}
                dataSource={dataSource}
                loading={loading}
                pagination={false}
                scroll={{ x: 3500 }}
                className={`custom-antd-table ${isDarkMode ? 'dark-mode' : ''}`}
                style={{ borderRadius: "16px" }}
            />

            {/* Pagination Bar */}
            <div style={{
                padding: isMobile ? "16px" : "16px 24px",
                borderTop: isDarkMode ? "1px solid #303030" : "1px solid #f0f0f0",
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: isMobile ? 16 : 0,
            }}>
                <Space size="middle" direction={isMobile ? "vertical" : "horizontal"} style={{ alignItems: 'center', width: isMobile ? '100%' : 'auto' }}>
                    <span style={{ color: isDarkMode ? "#8c8c8c" : "#64748b", fontSize: '13px' }}>
                        Menampilkan {totalRows > 0 ? (table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1) : 0} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, totalRows || 0)} dari {totalRows || 0} data
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
                    background: ${isDarkMode ? "#172554" : "#1e3a8a"} !important;
                    color: #ffffff !important;
                    font-weight: 700 !important;
                    border-bottom: 1px solid ${isDarkMode ? "#0f172a" : "#1e40af"} !important;
                    padding: 16px !important;
                }
                .custom-antd-table .ant-table-tbody > tr > td {
                    padding: 16px !important;
                    border-bottom: 1px solid ${isDarkMode ? "#303030" : "#f1f5f9"} !important;
                    transition: all 0.2s;
                }
                .custom-antd-table .ant-table-tbody > tr:hover > td {
                    background: ${isDarkMode ? "#1f1f1f" : "#f8fafc"} !important;
                }
                .custom-antd-table .ant-table-thead > tr > th .ant-table-column-sorter {
                    color: #ffffff !important;
                }
                .custom-antd-table .ant-table-thead > tr > th .ant-table-filter-trigger {
                    color: #ffffff !important;
                }
            `}</style>
        </div>
    );
}
