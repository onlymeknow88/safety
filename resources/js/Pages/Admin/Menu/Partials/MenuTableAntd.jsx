import React from 'react';
import { Table, Tag, Space, Button, Tooltip, Switch, Pagination, Select, Input } from 'antd';
import { 
    EditOutlined, 
    DeleteOutlined, 
    EyeOutlined,
    MenuOutlined,
    SearchOutlined,
    HolderOutlined
} from '@ant-design/icons';
import { flexRender } from '@tanstack/react-table';
import { 
    DndContext, 
    PointerSensor, 
    useSensor, 
    useSensors, 
    closestCenter 
} from '@dnd-kit/core';
import { 
    arrayMove, 
    SortableContext, 
    useSortable, 
    verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

// Komponen Row yang bisa di-drag
const Row = ({ children, ...props }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: props['data-row-key'],
    });

    const style = {
        ...props.style,
        transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
        transition,
        ...(isDragging ? { position: 'relative', zIndex: 9999, background: '#f8fafc' } : {}),
    };

    return (
        <tr {...props} ref={setNodeRef} style={style} {...attributes}>
            {React.Children.map(children, (child) => {
                // Di Ant Design, key kolom drag-handle biasanya tersimpan di child.key
                if (child.key === 'drag-handle') {
                    return React.cloneElement(child, {
                        children: (
                            <div
                                ref={setActivatorNodeRef}
                                style={{ 
                                    cursor: 'grab', 
                                    color: '#8c8c8c', 
                                    display: 'flex', 
                                    justifyContent: 'center',
                                    padding: '16px' 
                                }}
                                {...listeners}
                            >
                                <HolderOutlined />
                            </div>
                        ),
                    });
                }
                return child;
            })}
        </tr>
    );
};

export default function MenuTableAntd({
    table,
    loading,
    totalRows,
    onEdit,
    onDelete,
    onFilterChange,
    onReorder,
    filterStatus,
    searchText,
    isDarkMode
}) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 1,
            },
        }),
    );

    const antdColumns = [
        {
            key: 'drag-handle',
            width: 50,
            align: 'center',
            render: () => null, // Placeholder saja
        },
        ...table.getVisibleLeafColumns().map((column) => {
            const header = column.columnDef.header;
            const meta = column.columnDef.meta || {};

            let filterProps = {};

            if (column.id === 'is_active') {
                filterProps = {
                    filters: [
                        { text: 'Active', value: 1 },
                        { text: 'Inactive', value: 0 },
                    ],
                    filterMultiple: false,
                    filteredValue: filterStatus !== 'all' ? [filterStatus] : null,
                };
            }

            if (column.id === 'name') {
                filterProps = {
                    filteredValue: searchText ? [searchText] : null,
                    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                            <Input
                                placeholder={`Search ${column.id}`}
                                value={selectedKeys[0]}
                                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                                onPressEnter={() => confirm()}
                                style={{ marginBottom: 8, display: 'block', width: 188 }}
                            />
                            <Space>
                                <Button
                                    type="primary"
                                    onClick={() => confirm()}
                                    icon={<SearchOutlined />}
                                    size="small"
                                    style={{ width: 90 }}
                                >
                                    Search
                                </Button>
                                <Button 
                                    onClick={() => { 
                                        clearFilters(); 
                                        confirm(); 
                                    }} 
                                    size="small" 
                                    style={{ width: 90 }}
                                >
                                    Reset
                                </Button>
                            </Space>
                        </div>
                    ),
                    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
                };
            }

            return {
                title: typeof header === 'function' ? flexRender(header, {}) : header,
                dataIndex: column.id,
                key: column.id,
                width: meta.width || 'auto',
                align: meta.align || 'left',
                ...filterProps,
                render: (value, record) => {
                    const row = table.getRowModel().flatRows.find(r => String(r.original.id) === String(record.id));
                    const cell = row?.getVisibleCells().find(c => c.column.id === column.id);
                    
                    if (cell) {
                        return flexRender(cell.column.columnDef.cell, cell.getContext());
                    }
                    return value !== undefined ? value : null;
                }
            };
        })
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        const statusValue = filters.is_active ? filters.is_active[0] : 'all';
        const nameSearch = filters.name ? filters.name[0] : '';
        if (typeof onFilterChange === 'function') {
            onFilterChange({ status: statusValue, search: nameSearch });
        }
    };

    const dataSource = table.getRowModel().rows.map(row => {
        const item = row.original;
        
        const formatChildren = (children) => {
            if (!children || children.length === 0) return undefined;
            return children.map(child => ({
                ...child,
                key: child.id,
                children: formatChildren(child.children)
            }));
        };

        return {
            ...item,
            key: item.id,
            children: formatChildren(item.children)
        };
    });

    // Helper untuk mengambil semua ID (flat) agar sistem DnD mengenali sub-menu
    const getFlatKeys = (items) => {
        let keys = [];
        items.forEach(item => {
            keys.push(item.key);
            if (item.children) {
                keys = [...keys, ...getFlatKeys(item.children)];
            }
        });
        return keys;
    };

    const flatKeys = getFlatKeys(dataSource);

    const onDragEnd = ({ active, over }) => {
        if (active.id !== over?.id && onReorder) {
            onReorder(Number(active.id), Number(over.id));
        }
    };

    return (
        <div style={{ 
            background: isDarkMode ? "#1e293b" : "#fff",
            borderRadius: "20px",
            padding: "1px",
            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
            boxShadow: isDarkMode ? "none" : "0 4px 24px rgba(0,0,0,0.04)",
            overflow: "hidden"
        }}>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={onDragEnd}
                modifiers={[restrictToVerticalAxis]}
            >
                <SortableContext 
                    items={flatKeys} 
                    strategy={verticalListSortingStrategy}
                >
                    <Table
                        rowKey="key"
                        columns={antdColumns}
                        dataSource={dataSource}
                        loading={loading}
                        pagination={false}
                        onChange={handleTableChange}
                        scroll={{ x: 1000 }}
                        components={{
                            body: {
                                row: Row,
                            },
                        }}
                        expandable={{
                            defaultExpandAllRows: false,
                            expandRowByClick: true,
                        }}
                        className={`custom-antd-table ${isDarkMode ? 'dark-mode' : ''}`}
                        style={{ borderRadius: "20px" }}
                    />
                </SortableContext>
            </DndContext>

            {/* Premium Pagination Bar using Antd Pagination + TanStack State */}
            <div style={{
                padding: "16px 24px",
                background: isDarkMode ? '#1e293b' : '#f8fafc',
                borderTop: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Left Side: Results Info + Page Size Selector */}
                <Space size="middle">
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
                    /* Background transparent dihapus agar footer tidak tembus pandang */
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
                
                /* Selection state override if needed */
                .custom-antd-table.dark-mode .ant-table-row-selected > td {
                    background: #111b26 !important;
                }
            `}</style>
        </div>
    );
}
