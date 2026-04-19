import { Head } from "@inertiajs/react";
import {
    Row,
    Col,
    Card,
    Table,
    Tag,
    Avatar,
    Space,
    Button,
    Progress,
    List,
    Typography,
    Divider,
    Badge,
    theme,
} from "antd";
import {
    UserOutlined,
    ShoppingCartOutlined,
    DollarOutlined,
    RiseOutlined,
    EllipsisOutlined,
    ArrowRightOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
} from "@ant-design/icons";
import DashboardLayout from "@/Layouts/DashboardLayout";
import StatsCard from "@/Components/StatsCard";
import { useTheme } from "../../Contexts/ThemeContext";

const { Text, Title } = Typography;

// ── Dummy Data ──────────────────────────────────────────────────────────────

const recentOrders = [
    {
        key: "1",
        id: "#ORD-2401",
        customer: "Ahmad Rizki",
        avatar: "AR",
        product: "MacBook Pro M3",
        amount: "Rp 28.500.000",
        status: "completed",
        date: "15 Apr 2026",
    },
    {
        key: "2",
        id: "#ORD-2400",
        customer: "Siti Rahma",
        avatar: "SR",
        product: "iPhone 16 Pro",
        amount: "Rp 19.999.000",
        status: "processing",
        date: "14 Apr 2026",
    },
    {
        key: "3",
        id: "#ORD-2399",
        customer: "Budi Santoso",
        avatar: "BS",
        product: "iPad Air 6",
        amount: "Rp 9.499.000",
        status: "pending",
        date: "14 Apr 2026",
    },
    {
        key: "4",
        id: "#ORD-2398",
        customer: "Dewi Lestari",
        avatar: "DL",
        product: "AirPods Pro 3",
        amount: "Rp 4.299.000",
        status: "completed",
        date: "13 Apr 2026",
    },
    {
        key: "5",
        id: "#ORD-2397",
        customer: "Fajar Nugroho",
        avatar: "FN",
        product: "Apple Watch S10",
        amount: "Rp 7.800.000",
        status: "cancelled",
        date: "13 Apr 2026",
    },
];

const topProducts = [
    { name: "MacBook Pro M3", sales: 142, revenue: "Rp 4,0 M", percent: 85 },
    { name: "iPhone 16 Pro", sales: 318, revenue: "Rp 6,3 M", percent: 100 },
    { name: "iPad Air 6", sales: 97, revenue: "Rp 921 Jt", percent: 58 },
    { name: "AirPods Pro 3", sales: 265, revenue: "Rp 1,1 M", percent: 75 },
    { name: "Apple Watch S10", sales: 183, revenue: "Rp 1,4 M", percent: 64 },
];

const recentActivities = [
    {
        icon: <CheckCircleOutlined style={{ color: "#52c41a" }} />,
        text: "Order #ORD-2401 telah selesai",
        time: "2 menit lalu",
    },
    {
        icon: <UserOutlined style={{ color: "#1677ff" }} />,
        text: "User baru mendaftar: dewi@email.com",
        time: "15 menit lalu",
    },
    {
        icon: <ClockCircleOutlined style={{ color: "#faad14" }} />,
        text: "Order #ORD-2400 sedang diproses",
        time: "1 jam lalu",
    },
    {
        icon: <CloseCircleOutlined style={{ color: "#ff4d4f" }} />,
        text: "Order #ORD-2397 dibatalkan oleh customer",
        time: "3 jam lalu",
    },
    {
        icon: <DollarOutlined style={{ color: "#52c41a" }} />,
        text: "Pembayaran diterima: Rp 28.500.000",
        time: "5 jam lalu",
    },
];

// ── Status Tag Helper ────────────────────────────────────────────────────────

const statusConfig = {
    completed: { color: "success", label: "Selesai" },
    processing: { color: "processing", label: "Diproses" },
    pending: { color: "warning", label: "Menunggu" },
    cancelled: { color: "error", label: "Dibatalkan" },
};

// ── Table Columns ────────────────────────────────────────────────────────────

const orderColumns = [
    {
        title: "Order ID",
        dataIndex: "id",
        key: "id",
        render: (text) => <Text strong style={{ color: "#1677ff" }}>{text}</Text>,
    },
    {
        title: "Customer",
        key: "customer",
        render: (_, record) => (
            <Space>
                <Avatar
                    size={32}
                    style={{
                        background: "linear-gradient(135deg, #1677ff, #0958d9)",
                        fontSize: 11,
                        fontWeight: 700,
                    }}
                >
                    {record.avatar}
                </Avatar>
                <Text>{record.customer}</Text>
            </Space>
        ),
    },
    {
        title: "Produk",
        dataIndex: "product",
        key: "product",
    },
    {
        title: "Total",
        dataIndex: "amount",
        key: "amount",
        render: (text) => <Text strong>{text}</Text>,
    },
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => {
            const cfg = statusConfig[status] || {};
            return <Tag color={cfg.color}>{cfg.label}</Tag>;
        },
    },
    {
        title: "Tanggal",
        dataIndex: "date",
        key: "date",
        render: (text) => <Text type="secondary">{text}</Text>,
    },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function Dashboard({ stats = {} }) {
    const { token } = theme.useToken();
    const { isDarkMode } = useTheme();

    return (
        <DashboardLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Stats Row */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Total Revenue"
                        value={847500000}
                        prefix="Rp "
                        icon={<DollarOutlined />}
                        change={12.5}
                        changeType="increase"
                        color="#1677ff"
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Total Orders"
                        value={2847}
                        icon={<ShoppingCartOutlined />}
                        change={8.2}
                        changeType="increase"
                        color="#52c41a"
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Total Users"
                        value={12459}
                        icon={<UserOutlined />}
                        change={3.1}
                        changeType="increase"
                        color="#722ed1"
                    />
                </Col>
                <Col xs={24} sm={12} xl={6}>
                    <StatsCard
                        title="Growth Rate"
                        value={24.8}
                        suffix="%"
                        icon={<RiseOutlined />}
                        change={2.4}
                        changeType="decrease"
                        color="#fa8c16"
                    />
                </Col>
            </Row>

            {/* Middle Row */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                {/* Recent Orders Table */}
                <Col xs={24} xl={16}>
                    <Card
                        title={
                            <Space>
                                <ShoppingCartOutlined
                                    style={{ color: "#1677ff" }}
                                />
                                <span>Order Terbaru</span>
                            </Space>
                        }
                        extra={
                            <Button
                                type="link"
                                size="small"
                                icon={<ArrowRightOutlined />}
                                iconPosition="end"
                            >
                                Lihat Semua
                            </Button>
                        }
                        style={{
                            borderRadius: 12,
                            border: "1px solid #f0f0f0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                        styles={{ body: { padding: "0 0 8px" } }}
                    >
                        <Table
                            dataSource={recentOrders}
                            columns={orderColumns}
                            pagination={false}
                            size="middle"
                            style={{ borderRadius: 0 }}
                        />
                    </Card>
                </Col>

                {/* Activity Feed */}
                <Col xs={24} xl={8}>
                    <Card
                        title="Aktivitas Terbaru"
                        extra={
                            <Button type="text" icon={<EllipsisOutlined />} />
                        }
                        style={{
                            borderRadius: 12,
                            border: `1px solid ${token.colorBorderSecondary}`,
                            boxShadow: isDarkMode ? "none" : "0 2px 8px rgba(0,0,0,0.04)",
                            height: "100%",
                        }}
                    >
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {recentActivities.map((item, index) => (
                                <div key={index}>
                                    <div style={{ padding: "10px 0" }}>
                                        <Space align="start" size={12}>
                                            <div
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 8,
                                                    background: token.colorFillAlter,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    flexShrink: 0,
                                                    fontSize: 16,
                                                }}
                                            >
                                                {item.icon}
                                            </div>
                                            <div>
                                                <Text style={{ fontSize: 13, display: "block" }}>
                                                    {item.text}
                                                </Text>
                                                <Text
                                                    type="secondary"
                                                    style={{ fontSize: 11, marginTop: 2 }}
                                                >
                                                    {item.time}
                                                </Text>
                                            </div>
                                        </Space>
                                    </div>
                                    {index < recentActivities.length - 1 && (
                                        <Divider style={{ margin: 0 }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Bottom Row */}
            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                {/* Top Products */}
                <Col xs={24} lg={12}>
                    <Card
                        title="Produk Terlaris"
                        extra={
                            <Button
                                type="link"
                                size="small"
                                icon={<ArrowRightOutlined />}
                                iconPosition="end"
                            >
                                Detail
                            </Button>
                        }
                        style={{
                            borderRadius: 12,
                            border: "1px solid #f0f0f0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                    >
                        {topProducts.map((p, i) => (
                            <div key={i} style={{ marginBottom: i < topProducts.length - 1 ? 20 : 0 }}>
                                <Space
                                    style={{ width: "100%", justifyContent: "space-between", marginBottom: 6 }}
                                >
                                    <Text style={{ fontSize: 13 }} strong>{p.name}</Text>
                                    <Space size={16}>
                                        <Text type="secondary" style={{ fontSize: 12 }}>
                                            {p.sales} terjual
                                        </Text>
                                        <Text strong style={{ fontSize: 13, color: "#1677ff" }}>
                                            {p.revenue}
                                        </Text>
                                    </Space>
                                </Space>
                                <Progress
                                    percent={p.percent}
                                    showInfo={false}
                                    strokeColor={{
                                        from: "#1677ff",
                                        to: "#0958d9",
                                    }}
                                    trailColor={token.colorFillAlter}
                                    size={["100%", 6]}
                                />
                            </div>
                        ))}
                    </Card>
                </Col>

                {/* Quick Stats */}
                <Col xs={24} lg={12}>
                    <Card
                        title="Ringkasan Bulan Ini"
                        style={{
                            borderRadius: 12,
                            border: "1px solid #f0f0f0",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                        }}
                    >
                        <Row gutter={[16, 16]}>
                            {[
                                { label: "Order Selesai", value: "1,284", color: "#52c41a", percent: 72 },
                                { label: "Sedang Diproses", value: "342", color: "#1677ff", percent: 19 },
                                { label: "Menunggu", value: "156", color: "#faad14", percent: 9 },
                                { label: "Dibatalkan", value: "61", color: "#ff4d4f", percent: 3 },
                            ].map((item, i) => (
                                <Col span={12} key={i}>
                                    <div
                                        style={{
                                            padding: "16px",
                                            background: `${item.color}0e`,
                                            borderRadius: 10,
                                            border: `1px solid ${item.color}30`,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: "#8c8c8c",
                                                display: "block",
                                                marginBottom: 4,
                                            }}
                                        >
                                            {item.label}
                                        </Text>
                                        <Text
                                            strong
                                            style={{
                                                fontSize: 24,
                                                color: item.color,
                                                display: "block",
                                                lineHeight: 1.2,
                                            }}
                                        >
                                            {item.value}
                                        </Text>
                                        <Progress
                                            percent={item.percent}
                                            showInfo={false}
                                            strokeColor={item.color}
                                            trailColor={`${item.color}20`}
                                            size={["100%", 4]}
                                            style={{ marginTop: 8, marginBottom: 0 }}
                                        />
                                        <Text style={{ fontSize: 11, color: "#8c8c8c" }}>
                                            {item.percent}% dari total
                                        </Text>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </Card>
                </Col>
            </Row>
        </DashboardLayout>
    );
}
