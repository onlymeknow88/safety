import React from "react";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, Table, Tag, Space, App } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTheme } from "@/Contexts/ThemeContext";
import dayjs from "dayjs";

export default function AccidentNotificationIndex({ accidentNotifications = [] }) {
    const { isDarkMode } = useTheme();

    const columns = [
        {
            title: 'No. Notifikasi',
            dataIndex: 'notification_number',
            key: 'notification_number',
            render: (text) => <span style={{ fontWeight: 700, color: '#2563eb' }}>{text}</span>
        },
        {
            title: 'Tanggal',
            dataIndex: 'incident_date',
            key: 'incident_date',
            render: (date) => dayjs(date).format('DD MMM YYYY')
        },
        {
            title: 'Lokasi',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'submitted' ? 'green' : 'orange'} style={{ borderRadius: 6, fontWeight: 600 }}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'HPRI',
            dataIndex: 'is_hpri',
            key: 'is_hpri',
            render: (isHpri) => isHpri ? <Tag color="error">YA</Tag> : <Tag>TIDAK</Tag>
        },
        {
            title: 'Aksi',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={route('accident-notification.edit', record.id)}>
                        <Button type="text" icon={<EditOutlined />} />
                    </Link>
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Space>
            ),
        },
    ];

    return (
        <DashboardLayout title="List Pemberitahuan Kecelakaan">
            <Head title="List Pemberitahuan Kecelakaan" />
            
            <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h2 style={{ margin: 0, fontWeight: 700, color: isDarkMode ? '#fff' : '#1e293b' }}>
                        Pemberitahuan Kecelakaan
                    </h2>
                    <Link href={route('accident-notification.create')}>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            size="large"
                            style={{ 
                                borderRadius: 8, 
                                fontWeight: 600,
                                background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                                border: 'none'
                            }}
                        >
                            Buat Baru
                        </Button>
                    </Link>
                </div>

                <Card 
                    style={{ 
                        borderRadius: 16, 
                        border: 'none', 
                        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        background: isDarkMode ? '#1f1f1f' : '#fff'
                    }}
                    bodyStyle={{ padding: 0 }}
                >
                    <Table 
                        columns={columns} 
                        dataSource={accidentNotifications} 
                        rowKey="id"
                        pagination={{ pageSize: 10 }}
                    />
                </Card>
            </div>
        </DashboardLayout>
    );
}
