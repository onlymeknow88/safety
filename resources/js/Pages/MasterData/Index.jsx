import { Card, Col, Row, Typography } from "antd";
import { 
    AppstoreOutlined, 
    EnvironmentOutlined, 
    FieldTimeOutlined, 
    UserOutlined, 
    WarningOutlined,
    FileTextOutlined,
    SafetyCertificateOutlined,
    MedicineBoxOutlined,
    TeamOutlined
} from "@ant-design/icons";

import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, Link } from "@inertiajs/react";
import React from "react";
import { useTheme } from "@/Contexts/ThemeContext";

const { Title, Text } = Typography;

export default function MasterDataIndex() {
    const { isDarkMode } = useTheme();

    const modules = [
        {
            title: "Organisasi & Lokasi",
            icon: <EnvironmentOutlined style={{ fontSize: 24, color: "#1890ff" }} />,
            items: [
                { name: "CCOW", href: "/master-data/ccow" },
                { name: "Company", href: "/master-data/company" },
                { name: "Department", href: "/master-data/department" },
                { name: "Jabatan", href: "/master-data/jabatan" },
                { name: "Lokasi", href: "/master-data/location" },
            ]
        },
        {
            title: "Waktu & Shift",
            icon: <FieldTimeOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
            items: [
                { name: "Shift", href: "/master-data/shift" },
                { name: "Hari", href: "/master-data/day" },
                { name: "Roster", href: "/master-data/roster" },
                { name: "Interval Waktu", href: "/master-data/interval-time" },
            ]
        },
        {
            title: "Demografi & Karyawan",
            icon: <TeamOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
            items: [
                { name: "Gender", href: "/master-data/gender" },
                { name: "Interval Usia", href: "/master-data/interval-age" },
                { name: "Interval Pengalaman", href: "/master-data/interval-experience" },
            ]
        },
        {
            title: "Tipe & Laporan",
            icon: <FileTextOutlined style={{ fontSize: 24, color: "#faad14" }} />,
            items: [
                { name: "Tipe Insiden", href: "/master-data/incident-type" },
                { name: "Tipe Laporan", href: "/master-data/report-type" },
                { name: "Kriteria", href: "/master-data/kriteria" },
                { name: "Status", href: "/master-data/status" },
            ]
        },
        {
            title: "Kesehatan & Cedera",
            icon: <MedicineBoxOutlined style={{ fontSize: 24, color: "#ff4d4f" }} />,
            items: [
                { name: "Kondisi Cedera", href: "/master-data/injury-condition" },
                { name: "Bagian Tubuh", href: "/master-data/body-part" },
            ]
        },
        {
            title: "Faktor & Investigasi",
            icon: <WarningOutlined style={{ fontSize: 24, color: "#eb2f96" }} />,
            items: [
                { name: "Sumber (Source)", href: "/master-data/source" },
                { name: "Unsafe Act", href: "/master-data/unsafe-act" },
                { name: "Unsafe Condition", href: "/master-data/unsafe-condition" },
                { name: "Personal Factor", href: "/master-data/personal-factor" },
                { name: "Job Factor", href: "/master-data/job-factor" },
                { name: "Rekomendasi", href: "/master-data/recommendation" },
            ]
        }
    ];

    return (
        <DashboardLayout title="Master Data Central">
            <Head title="Master Data Central" />
            <div style={{ padding: "40px" }}>
                <div style={{ marginBottom: 40 }}>
                    <Title level={2}>Master Data Center</Title>
                    <Text type="secondary">Kelola semua data master aplikasi dalam satu tempat yang terpusat.</Text>
                </div>

                <Row gutter={[24, 24]}>
                    {modules.map((group, idx) => (
                        <Col xs={24} md={12} lg={8} key={idx}>
                            <Card 
                                title={<div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{group.icon} <span>{group.title}</span></div>}
                                style={{ 
                                    borderRadius: 16, 
                                    background: isDarkMode ? "#1f1f1f" : "#fff",
                                    border: isDarkMode ? "1px solid #303030" : "1px solid #f0f0f0",
                                    height: '100%'
                                }}
                                headStyle={{ borderBottom: isDarkMode ? "1px solid #303030" : "1px solid #f0f0f0", padding: "16px 24px" }}
                                bodyStyle={{ padding: "24px" }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    {group.items.map((item, i) => (
                                        <Link 
                                            key={i} 
                                            href={item.href}
                                            style={{ 
                                                display: 'block', 
                                                padding: '12px 16px', 
                                                borderRadius: 10,
                                                background: isDarkMode ? "#141414" : "#f8fafc",
                                                color: isDarkMode ? "#d1d5db" : "#334155",
                                                transition: 'all 0.3s'
                                            }}
                                            className="hover-card-item"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </div>

            <style>{`
                .hover-card-item:hover {
                    background: #1890ff !important;
                    color: white !important;
                    transform: translateX(5px);
                }
            `}</style>
        </DashboardLayout>
    );
}
