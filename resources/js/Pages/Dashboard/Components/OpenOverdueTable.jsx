import React from "react";
import { Card, Table, Tag, Empty } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import { router } from "@inertiajs/react";

export default function OpenOverdueTable({ data = [], isDarkMode }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const labelColor = isDarkMode ? "#f8fafc" : "#1e293b";
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";
    
    const columns = [
        {
            title: "NO NOTIFIKASI",
            dataIndex: "notification_number",
            key: "notification_number",
            render: (text, record) => (
                <span 
                    onClick={() => router.get('/accident-notification')}
                    style={{ 
                        color: "#2563eb", 
                        fontWeight: 800, 
                        cursor: 'pointer',
                        textDecoration: 'underline'
                    }}
                >
                    {text}
                </span>
            )
        },
        {
            title: "TANGGAL",
            dataIndex: "incident_date",
            key: "incident_date",
            render: (text) => (
                <span style={{ fontWeight: 600, color: labelColor }}>
                    {text}
                </span>
            )
        },
        {
            title: "TIPE",
            dataIndex: "tipe",
            key: "tipe",
            render: (tipe) => {
                let color = "blue";
                if (tipe === "CRITICAL") color = "red";
                if (tipe === "STANDARD") color = "green";
                
                return (
                    <Tag 
                        color={color} 
                        style={{ 
                            fontWeight: 800, 
                            borderRadius: 6,
                            padding: "2px 10px",
                            fontSize: "11px"
                        }}
                    >
                        {tipe}
                    </Tag>
                );
            }
        },
        {
            title: "KATEGORI",
            dataIndex: "kategori",
            key: "kategori",
            render: (text) => (
                <span style={{ fontWeight: 600, color: labelColor }}>
                    {text}
                </span>
            )
        },
        {
            title: "DUE DATE",
            dataIndex: "due_date",
            key: "due_date",
            render: (text, record) => {
                const color = record.is_overdue ? "#ef4444" : labelColor;
                return (
                    <span style={{ fontWeight: 700, color }}>
                        {text} {record.is_overdue && <span style={{ fontSize: "11px", fontWeight: 800 }}> (Overdue)</span>}
                    </span>
                );
            }
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            render: (status, record) => {
                const isOverdue = record.is_overdue || status === "OVERDUE";
                const dotColor = isOverdue ? "#ef4444" : "#2563eb";
                const textColor = isOverdue ? "#ef4444" : "#2563eb";
                
                return (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor }} />
                        <span style={{ fontWeight: 800, fontSize: "12px", color: textColor }}>
                            {isOverdue ? "OVERDUE" : "OPEN"}
                        </span>
                    </div>
                );
            }
        }
    ];

    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <span style={{ fontWeight: 800, fontSize: 15, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <UnorderedListOutlined style={{ marginRight: 8, color: '#3b82f6' }} />
                        BREAKDOWN INSIDEN YANG MASIH OPEN DAN OVERDUE
                    </span>
                    <span 
                        onClick={() => router.get('/accident-notification')}
                        style={{ 
                            fontSize: "12px", 
                            fontWeight: 800, 
                            color: "#2563eb", 
                            cursor: 'pointer',
                            letterSpacing: '0.05em',
                            transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#1d4ed8'}
                        onMouseLeave={(e) => e.target.style.color = '#2563eb'}
                    >
                        LIHAT SEMUA LAPORAN
                    </span>
                </div>
            }
            style={{
                background: cardBg,
                border: cardBorder,
                borderRadius: 20,
                boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)",
                marginBottom: 24,
                overflow: "hidden"
            }}
            styles={{ body: { padding: 0 } }}
        >
            {data.length > 0 ? (
                <div style={{ padding: "0px" }}>
                    <Table
                        dataSource={data.map((item, idx) => ({ ...item, key: idx }))}
                        columns={columns}
                        pagination={false}
                        rowClassName={() => `premium-table-row`}
                        style={{ background: 'transparent' }}
                    />
                    <style>{`
                        .ant-table {
                            background: transparent !important;
                        }
                        .ant-table-thead > tr > th {
                            background: ${isDarkMode ? "#262631" : "#f8fafc"} !important;
                            color: ${isDarkMode ? "#94a3b8" : "#64748b"} !important;
                            font-size: 11px !important;
                            font-weight: 800 !important;
                            text-transform: uppercase !important;
                            letter-spacing: 0.1em !important;
                            border-bottom: 2px solid ${isDarkMode ? "#334155" : "#e2e8f0"} !important;
                            padding: 16px 24px !important;
                        }
                        .ant-table-tbody > tr > td {
                            padding: 18px 24px !important;
                            border-bottom: 1px solid ${isDarkMode ? "#334155" : "#f1f5f9"} !important;
                            background: transparent !important;
                        }
                        .premium-table-row:hover > td {
                            background: ${isDarkMode ? "#2d3748" : "#f0f9ff"} !important;
                        }
                    `}</style>
                </div>
            ) : (
                <div style={{ padding: 40 }}>
                    <Empty description="Tidak ada insiden berstatus Open atau Overdue" />
                </div>
            )}
        </Card>
    );
}
