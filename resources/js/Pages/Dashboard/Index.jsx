import {
    AlertOutlined,
    CheckCircleOutlined,
    FileTextOutlined,
    WarningOutlined,
    UserOutlined,
    ClockCircleOutlined
} from "@ant-design/icons";
import { Col, Row, Typography } from "antd";
import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import StatsCard from "@/Components/StatsCard";
import { useTheme } from "../../Contexts/ThemeContext";

// Import modular chart components
import CostChart from "./Components/CostChart";
import IncidentTypeChart from "./Components/IncidentTypeChart";
import UnsafeConditionChart from "./Components/UnsafeConditionChart";
import UnsafeActChart from "./Components/UnsafeActChart";
import JobFactorChart from "./Components/JobFactorChart";
import PersonalFactorChart from "./Components/PersonalFactorChart";
import SourceChart from "./Components/SourceChart";
import MobileEquipmentChart from "./Components/MobileEquipmentChart";
import SpillChart from "./Components/SpillChart";
import InjuryConditionChart from "./Components/InjuryConditionChart";
import BodyPartChart from "./Components/BodyPartChart";
import IncidentTrendChart from "./Components/IncidentTrendChart";
import FrequencyRateChart from "./Components/FrequencyRateChart";
import SeverityRateChart from "./Components/SeverityRateChart";
import CompanyIncidentChart from "./Components/CompanyIncidentChart";
import DepartmentIncidentChart from "./Components/DepartmentIncidentChart";

// Chart.js registration in main scope to ensure Chart.js components load correctly
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title as ChartTitle,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
    RadialLinearScale
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    ChartTitle,
    Tooltip,
    Legend,
    ArcElement,
    Filler,
    RadialLinearScale
);

const { Text, Title } = Typography;

const PALETTE = [
    '#3b82f6', // Blue
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#8b5cf6', // Violet
    '#6366f1', // Indigo
    '#ec4899', // Pink
    '#0ea5e9', // Sky
    '#f97316', // Orange
    '#14b8a6', // Teal
    '#84cc16', // Lime
    '#a855f7', // Purple
];

export default function Dashboard({ stats = {}, chartData = {} }) {
    const { isDarkMode } = useTheme();
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";

    return (
        <DashboardLayout title="Safety Analytics Dashboard">
            <Head title="Safety Analytics Dashboard" />

            <div style={{ padding: "8px 0 24px 0" }}>
                <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                    <Col>
                        <Title level={2} style={{ margin: 0, fontWeight: 900, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                            Safety Analytics Dashboard
                        </Title>
                        <Text type="secondary" style={{ color: secondaryTextColor, fontWeight: 500, fontSize: 14 }}>
                            Kajian Analitik Keselamatan Kerja & Manajemen Insiden Terintegrasi
                        </Text>
                    </Col>
                </Row>

                {/* 1. OVERVIEW STATISTICS ROW */}
                <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                    <Col xs={24} sm={12} lg={8}>
                        <StatsCard
                            title="TOTAL TENAGA KERJA"
                            value={stats.total_workforce || 0}
                            suffix=" Org"
                            color="#0284c7"
                            icon={<UserOutlined />}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <StatsCard
                            title="TOTAL JAM KERJA (MAN-HOURS)"
                            value={new Intl.NumberFormat('id-ID').format(stats.total_man_hours || 0)}
                            suffix=" Jam"
                            color="#0d9488"
                            icon={<ClockCircleOutlined />}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <StatsCard
                            title="TOTAL NOTIFIKASI KECELAKAAN"
                            value={stats.total_notifications || 0}
                            color="#3b82f6"
                            icon={<AlertOutlined />}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <StatsCard
                            title="TOTAL INVESTIGASI (LPKS)"
                            value={stats.total_lpks || 0}
                            color="#10b981"
                            icon={<CheckCircleOutlined />}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <StatsCard
                            title="TOTAL INVESTIGASI (LPKL)"
                            value={stats.total_lpkl || 0}
                            color="#8b5cf6"
                            icon={<FileTextOutlined />}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
                        <StatsCard
                            title="PICA ITEMS (OPEN ACTIONS)"
                            value={stats.open_pica || 0}
                            color="#ef4444"
                            icon={<WarningOutlined />}
                        />
                    </Col>
                </Row>

                {/* 2. MAIN CHARTS GRID */}

                {/* ROW 1: Trend Frequency Rate (FR) & Trend Severity Rate (SR) */}
                <Row gutter={24}>
                    <Col xs={24} xl={12}>
                        <FrequencyRateChart data={chartData.fr_sr_trends} isDarkMode={isDarkMode} />
                    </Col>
                    <Col xs={24} xl={12}>
                        <SeverityRateChart data={chartData.fr_sr_trends} isDarkMode={isDarkMode} />
                    </Col>
                </Row>

                {/* ROW 2: Trend Insiden & Cost Chart */}
                <Row gutter={24}>
                    <Col xs={24} xl={12}>
                        <IncidentTrendChart data={chartData.incident_trends} isDarkMode={isDarkMode} />
                    </Col>
                    <Col xs={24} xl={12}>
                        <CostChart data={chartData.monthly_costs} isDarkMode={isDarkMode} />
                    </Col>
                </Row>

                {/* ROW 3: Top 10 Insiden Per Perusahaan */}
                <Row gutter={24}>
                    <Col xs={24}>
                        <CompanyIncidentChart data={chartData.company_incidents} isDarkMode={isDarkMode} />
                    </Col>
                </Row>

                {/* ROW 4: Top 10 Insiden Per Departemen */}
                <Row gutter={24}>
                    <Col xs={24}>
                        <DepartmentIncidentChart data={chartData.department_incidents} isDarkMode={isDarkMode} />
                    </Col>
                </Row>

                {/* ROW 5: Incident Type & Accident Source */}
                <Row gutter={24}>
                    <Col xs={24} xl={8}>
                        <IncidentTypeChart data={chartData.incident_types} isDarkMode={isDarkMode} palette={PALETTE} />
                    </Col>
                    <Col xs={24} xl={16}>
                        <SourceChart data={chartData.sources} isDarkMode={isDarkMode} palette={PALETTE} />
                    </Col>
                </Row>

                {/* ROW 6: Unsafe Conditions & Unsafe Acts */}
                <Row gutter={24}>
                    <Col xs={24} lg={12}>
                        <UnsafeConditionChart data={chartData.unsafe_conditions} isDarkMode={isDarkMode} palette={PALETTE} />
                    </Col>
                    <Col xs={24} lg={12}>
                        <UnsafeActChart data={chartData.unsafe_acts} isDarkMode={isDarkMode} palette={PALETTE} />
                    </Col>
                </Row>

                {/* ROW 7: Job Factors & Personal Factors */}
                <Row gutter={24}>
                    <Col xs={24} lg={12}>
                        <JobFactorChart data={chartData.job_factors} isDarkMode={isDarkMode} palette={PALETTE} />
                    </Col>
                    <Col xs={24} lg={12}>
                        <PersonalFactorChart data={chartData.personal_factors} isDarkMode={isDarkMode} palette={PALETTE} />
                    </Col>
                </Row>

                {/* ROW 8: Mobile Equipment & Spill Volume */}
                <Row gutter={24}>
                    <Col xs={24} xl={10}>
                        <MobileEquipmentChart data={chartData.mobile_equipments} isDarkMode={isDarkMode} palette={PALETTE} />
                    </Col>
                    <Col xs={24} xl={14}>
                        <SpillChart data={chartData.spills} isDarkMode={isDarkMode} palette={PALETTE} />
                    </Col>
                </Row>

                {/* ROW 9: Injury Condition & Body Parts */}
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <InjuryConditionChart data={chartData.injury_conditions} isDarkMode={isDarkMode} palette={PALETTE} />
                    </Col>
                    <Col xs={24} md={12}>
                        <BodyPartChart data={chartData.body_parts} isDarkMode={isDarkMode} palette={PALETTE} />
                    </Col>
                </Row>
            </div>
        </DashboardLayout>
    );
}
