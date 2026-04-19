import { Pagination, Select, Space, Table } from 'antd';
import React from 'react';
import { flexRender } from '@tanstack/react-table';

export default function ReportTypeTable({ table, loading, totalRows, isDarkMode }) {
    const antdColumns = table.getVisibleLeafColumns().map((column) => {
        const header = column.columnDef.header;
        return {
            title: typeof header === 'string' ? header : flexRender(header, {}),
            dataIndex: column.id,
            key: column.id,
            render: (value, record) => {
                const row = table.getRowModel().flatRows.find(r => String(r.original.id) === String(record.id));
                const cell = row?.getVisibleCells().find(c => c.column.id === column.id);
                return cell ? flexRender(cell.column.columnDef.cell, cell.getContext()) : value;
            }
        };
    });

    return (
        <div style={{ background: isDarkMode ? "#141414" : "#fff", borderRadius: "16px", padding: "1px", boxShadow: isDarkMode ? "none" : "0 4px 24px rgba(0,0,0,0.04)", overflow: "hidden" }}>
            <Table rowKey="id" columns={antdColumns} dataSource={table.getRowModel().rows.map(r => r.original)} loading={loading} pagination={false} scroll={{ x: 600 }} className={`custom-antd-table ${isDarkMode ? 'dark-mode' : ''}`} style={{ borderRadius: "16px" }} />
            <div style={{ padding: "16px 24px", borderTop: isDarkMode ? "1px solid #303030" : "1px solid #f0f0f0", display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space size="middle">
                    <span style={{ color: isDarkMode ? "#8c8c8c" : "#64748b", fontSize: '13px' }}>
                        Results: {totalRows > 0 ? (table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1) : 0} - {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, totalRows || 0)} of {totalRows || 0}
                    </span>
                    <Select size="small" value={table.getState().pagination.pageSize} onChange={v => table.setPageSize(v)} style={{ width: 70 }} options={[{value: 10, label: '10'}, {value: 20, label: '20'}, {value: 50, label: '50'}]} />
                </Space>
                <Pagination current={table.getState().pagination.pageIndex + 1} total={totalRows} onChange={p => table.setPageIndex(p - 1)} showSizeChanger={false} size="small" />
            </div>
            <style>{`.custom-antd-table .ant-table { background: transparent !important; } .custom-antd-table .ant-table-thead > tr > th { background: ${isDarkMode ? "#1d1d1d" : "#fafafa"} !important; color: ${isDarkMode ? "#d9d9d9" : "#475569"} !important; font-weight: 700 !important; border-bottom: 2px solid ${isDarkMode ? "#303030" : "#f1f5f9"} !important; padding: 16px !important; } .custom-antd-table .ant-table-tbody > tr > td { padding: 16px !important; border-bottom: 1px solid ${isDarkMode ? "#303030" : "#f1f5f9"} !important; transition: all 0.2s; } .custom-antd-table .ant-table-tbody > tr:hover > td { background: ${isDarkMode ? "#1f1f1f" : "#f8fafc"} !important; }`}</style>
        </div>
    );
}
