import {
    AlertOutlined,
    CheckCircleOutlined,
    FileTextOutlined,
    WarningOutlined,
    UserOutlined,
    ClockCircleOutlined,
    FilterOutlined
} from "@ant-design/icons";
import { Col, Row, Typography, Button, Spin } from "antd";
import React from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
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
import TopLocationsWidget from "./Components/TopLocationsWidget";
import IncidentCategoryDonut from "./Components/IncidentCategoryDonut";
import AccidentCausesPie from "./Components/AccidentCausesPie";
import TopTimesWidget from "./Components/TopTimesWidget";
import OpenOverdueTable from "./Components/OpenOverdueTable";

// Import Filter and Palette
import DashboardFilter from "./Components/DashboardFilter";
import { DASHBOARD_PALETTE } from "./constants/palette";

// Import Hook
import useDashboard from "./Hooks/useDashboard";

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

export default function Dashboard({ 
    filters = {}, 
    ccows = [], 
    companies = [],
    isPowerUser = false
}) {
    const { isDarkMode } = useTheme();
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";
    const [showDetails, setShowDetails] = React.useState(false);

    // Dynamic state loading via custom Hook
    const {
        loading,
        filters: activeFilters,
        data,
        handleFilterChange,
        handleReset
    } = useDashboard(filters);

    const {
        stats = {},
        chartData = {},
        topLocations = [],
        hpriData = {},
        topTimes = [],
        openOverdueIncidents = []
    } = data;

    return (
        <DashboardLayout title="Safety Analytics Dashboard">
            <Head title="Safety Analytics Dashboard" />

            <div style={{ padding: "8px 0 24px 0" }}>
                {/* Dashboard Title & Tagline */}
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

                {/* Global Filter Bar */}
                <DashboardFilter 
                    filters={activeFilters}
                    ccows={ccows}
                    companies={companies}
                    isPowerUser={isPowerUser}
                    onFilterChange={handleFilterChange}
                    onReset={handleReset}
                />

                {/* Loading Spin Wrapper for Stats and Charts */}
                <Spin spinning={loading} size="large" tip="Loading Dashboard Data...">
                    {/* 1. OVERVIEW STATISTICS ROW (LEVEL 1) */}
                    <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                        <Col xs={24} sm={12} lg={8}>
                            <div onClick={() => router.get('/master-data/employee')} style={{ height: '100%', cursor: 'pointer' }}>
                                <StatsCard
                                    title="TOTAL TENAGA KERJA"
                                    value={stats.total_workforce || 0}
                                    suffix=" Org"
                                    color="#0284c7"
                                    icon={<UserOutlined />}
                                    change={stats.workforce_trend}
                                    changeType={stats.workforce_trend >= 0 ? "increase" : "decrease"}
                                />
                            </div>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <div onClick={() => router.get('/master-data/shift')} style={{ height: '100%', cursor: 'pointer' }}>
                                <StatsCard
                                    title="TOTAL JAM KERJA (MAN-HOURS)"
                                    value={new Intl.NumberFormat('id-ID').format(stats.total_man_hours || 0)}
                                    suffix=" Jam"
                                    color="#0d9488"
                                    icon={<ClockCircleOutlined />}
                                    change={stats.manhours_trend}
                                    changeType={stats.manhours_trend >= 0 ? "increase" : "decrease"}
                                />
                            </div>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <div onClick={() => router.get('/accident-notification')} style={{ height: '100%', cursor: 'pointer' }}>
                                <StatsCard
                                    title="TOTAL NOTIFIKASI KECELAKAAN"
                                    value={stats.total_notifications || 0}
                                    color="#3b82f6"
                                    icon={<AlertOutlined />}
                                    change={stats.notifications_trend}
                                    changeType={stats.notifications_trend >= 0 ? "increase" : "decrease"}
                                />
                            </div>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <div onClick={() => router.get('/analisa-kecelakaan')} style={{ height: '100%', cursor: 'pointer' }}>
                                <StatsCard
                                    title="FREQUENCY RATE (FR)"
                                    value={stats.aktual_fr || 0}
                                    suffix={` vs Target: ${stats.target_fr || 0.5}`}
                                    color={(stats.aktual_fr || 0) <= (stats.target_fr || 0.5) ? "#10b981" : "#ef4444"}
                                    icon={<CheckCircleOutlined />}
                                    change={stats.fr_trend}
                                    changeType={stats.fr_trend >= 0 ? "increase" : "decrease"}
                                />
                            </div>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <div onClick={() => router.get('/analisa-kecelakaan')} style={{ height: '100%', cursor: 'pointer' }}>
                                <StatsCard
                                    title="SEVERITY RATE (SR)"
                                    value={stats.aktual_sr || 0}
                                    suffix={` vs Target: ${stats.target_sr || 50}`}
                                    color={(stats.aktual_sr || 0) <= (stats.target_sr || 50) ? "#10b981" : "#ef4444"}
                                    icon={<FileTextOutlined />}
                                    change={stats.sr_trend}
                                    changeType={stats.sr_trend >= 0 ? "increase" : "decrease"}
                                />
                            </div>
                        </Col>
                        <Col xs={24} sm={12} lg={8}>
                            <div onClick={() => router.get('/pica')} style={{ height: '100%', cursor: 'pointer' }}>
                                <StatsCard
                                    title="PICA ITEMS (OPEN ACTIONS)"
                                    value={stats.open_pica || 0}
                                    color={stats.open_pica > 0 ? "#ef4444" : "#10b981"}
                                    icon={<WarningOutlined />}
                                />
                            </div>
                        </Col>
                    </Row>

                    {/* 2. MAIN CHARTS GRID (LEVEL 2) */}

                    {/* ROW 1: Trend Frequency Rate (FR) & Trend Severity Rate (SR) */}
                    <Row gutter={24}>
                        <Col xs={24} xl={12}>
                            <div onClick={() => router.get('/analisa-kecelakaan')} style={{ cursor: 'pointer' }}>
                                <FrequencyRateChart data={chartData.fr_sr_trends || []} isDarkMode={isDarkMode} />
                            </div>
                        </Col>
                        <Col xs={24} xl={12}>
                            <div onClick={() => router.get('/analisa-kecelakaan')} style={{ cursor: 'pointer' }}>
                                <SeverityRateChart data={chartData.fr_sr_trends || []} isDarkMode={isDarkMode} />
                            </div>
                        </Col>
                    </Row>

                    {/* ROW 2: Trend Insiden & Cost Chart */}
                    <Row gutter={24}>
                        <Col xs={24} xl={12}>
                            <div onClick={() => router.get('/accident-notification')} style={{ cursor: 'pointer' }}>
                                <IncidentTrendChart data={chartData.incident_trends || []} isDarkMode={isDarkMode} />
                            </div>
                        </Col>
                        <Col xs={24} xl={12}>
                            <div onClick={() => router.get('/accident-notification')} style={{ cursor: 'pointer' }}>
                                <CostChart data={chartData.monthly_costs || []} isDarkMode={isDarkMode} />
                            </div>
                        </Col>
                    </Row>

                    {/* ROW 2.5: TOP 5 Locations, Incident Category Donut, Accident Causes Pie, and TOP 5 Times */}
                    <Row gutter={24}>
                        <Col xs={24} md={12} xl={6}>
                            <TopLocationsWidget data={topLocations} isDarkMode={isDarkMode} />
                        </Col>
                        <Col xs={24} md={12} xl={6}>
                            <IncidentCategoryDonut data={hpriData} isDarkMode={isDarkMode} />
                        </Col>
                        <Col xs={24} md={12} xl={6}>
                            <AccidentCausesPie data={chartData.accident_causes || {}} isDarkMode={isDarkMode} />
                        </Col>
                        <Col xs={24} md={12} xl={6}>
                            <TopTimesWidget data={topTimes} isDarkMode={isDarkMode} />
                        </Col>
                    </Row>

                    {/* ROW 3: Top 10 Insiden Per Perusahaan */}
                    <Row gutter={24}>
                        <Col xs={24}>
                            <div onClick={() => router.get('/accident-notification')} style={{ cursor: 'pointer' }}>
                                <CompanyIncidentChart data={chartData.company_incidents || []} isDarkMode={isDarkMode} />
                            </div>
                        </Col>
                    </Row>

                    {/* ROW 4: Top 10 Insiden Per Departemen */}
                    <Row gutter={24}>
                        <Col xs={24}>
                            <div onClick={() => router.get('/accident-notification')} style={{ cursor: 'pointer' }}>
                                <DepartmentIncidentChart data={chartData.department_incidents || []} isDarkMode={isDarkMode} />
                            </div>
                        </Col>
                    </Row>

                    {/* ROW 4.5: Open and Overdue Incidents Breakdown Table */}
                    <Row gutter={24}>
                        <Col xs={24}>
                            <OpenOverdueTable data={openOverdueIncidents} isDarkMode={isDarkMode} />
                        </Col>
                    </Row>

                    {/* COLLAPSIBLE LEVEL 3: DETAIL CATEGORICAL CHARTS */}
                    <Row justify="center" style={{ margin: "24px 0" }}>
                        <Col>
                            <Button
                                type="primary"
                                size="large"
                                icon={<FilterOutlined />}
                                onClick={() => setShowDetails(!showDetails)}
                                style={{
                                    borderRadius: "12px",
                                    padding: "0 32px",
                                    height: "48px",
                                    fontSize: "15px",
                                    fontWeight: 700,
                                    backgroundColor: showDetails ? '#ef4444' : '#2563eb',
                                    borderColor: showDetails ? '#ef4444' : '#2563eb',
                                    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {showDetails ? "Sembunyikan Analisis Kategori Detail" : "Tampilkan Analisis Kategori Detail"}
                            </Button>
                        </Col>
                    </Row>

                    {showDetails && (
                        <div style={{ transition: 'all 0.5s ease' }}>
                            {/* ROW 5: Incident Type & Accident Source */}
                            <Row gutter={24}>
                                <Col xs={24} xl={8}>
                                    <div onClick={() => router.get('/accident-notification')} style={{ cursor: 'pointer' }}>
                                        <IncidentTypeChart data={chartData.incident_types || []} isDarkMode={isDarkMode} palette={DASHBOARD_PALETTE} />
                                    </div>
                                </Col>
                                <Col xs={24} xl={16}>
                                    <div onClick={() => router.get('/analisa-kecelakaan')} style={{ cursor: 'pointer' }}>
                                        <SourceChart data={chartData.sources || []} isDarkMode={isDarkMode} palette={DASHBOARD_PALETTE} />
                                    </div>
                                </Col>
                            </Row>

                            {/* ROW 6: Unsafe Conditions & Unsafe Acts */}
                            <Row gutter={24}>
                                <Col xs={24} lg={12}>
                                    <div onClick={() => router.get('/analisa-kecelakaan')} style={{ cursor: 'pointer' }}>
                                        <UnsafeConditionChart data={chartData.unsafe_conditions || []} isDarkMode={isDarkMode} palette={DASHBOARD_PALETTE} />
                                    </div>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <div onClick={() => router.get('/analisa-kecelakaan')} style={{ cursor: 'pointer' }}>
                                        <UnsafeActChart data={chartData.unsafe_acts || []} isDarkMode={isDarkMode} palette={DASHBOARD_PALETTE} />
                                    </div>
                                </Col>
                            </Row>

                            {/* ROW 7: Job Factors & Personal Factors */}
                            <Row gutter={24}>
                                <Col xs={24} lg={12}>
                                    <div onClick={() => router.get('/analisa-kecelakaan')} style={{ cursor: 'pointer' }}>
                                        <JobFactorChart data={chartData.job_factors || []} isDarkMode={isDarkMode} palette={DASHBOARD_PALETTE} />
                                    </div>
                                </Col>
                                <Col xs={24} lg={12}>
                                    <div onClick={() => router.get('/analisa-kecelakaan')} style={{ cursor: 'pointer' }}>
                                        <PersonalFactorChart data={chartData.personal_factors || []} isDarkMode={isDarkMode} palette={DASHBOARD_PALETTE} />
                                    </div>
                                </Col>
                            </Row>

                            {/* ROW 8: Mobile Equipment & Spill Volume */}
                            <Row gutter={24}>
                                <Col xs={24} xl={10}>
                                    <div onClick={() => router.get('/analisa-kecelakaan')} style={{ cursor: 'pointer' }}>
                                        <MobileEquipmentChart data={chartData.mobile_equipments || []} isDarkMode={isDarkMode} palette={DASHBOARD_PALETTE} />
                                    </div>
                                </Col>
                                <Col xs={24} xl={14}>
                                    <div onClick={() => router.get('/analisa-kecelakaan')} style={{ cursor: 'pointer' }}>
                                        <SpillChart data={chartData.spills || []} isDarkMode={isDarkMode} palette={DASHBOARD_PALETTE} />
                                    </div>
                                </Col>
                            </Row>

                            {/* ROW 9: Injury Condition & Body Parts */}
                            <Row gutter={24}>
                                <Col xs={24} md={12}>
                                    <div onClick={() => router.get('/analisa-kecelakaan')} style={{ cursor: 'pointer' }}>
                                        <InjuryConditionChart data={chartData.injury_conditions || []} isDarkMode={isDarkMode} palette={DASHBOARD_PALETTE} />
                                    </div>
                                </Col>
                                <Col xs={24} md={12}>
                                    <div onClick={() => router.get('/analisa-kecelakaan')} style={{ cursor: 'pointer' }}>
                                        <BodyPartChart data={chartData.body_parts || []} isDarkMode={isDarkMode} palette={DASHBOARD_PALETTE} />
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    )}
                </Spin>
            </div>
        </DashboardLayout>
    );
}
