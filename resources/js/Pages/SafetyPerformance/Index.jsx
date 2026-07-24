import React from "react";
import { Head } from "@inertiajs/react";
import { Tooltip, Spin, Button, InputNumber } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { useTheme } from "@/Contexts/ThemeContext";

// Hook & Partials
import useSafetyPerformance from "./Hooks/useSafetyPerformance";
import SafetyPerformanceHeader from "./Partials/SafetyPerformanceHeader";
import SafetyPerformanceCards from "./Partials/SafetyPerformanceCards";
import SafetyPerformanceChart from "./Partials/SafetyPerformanceChart";
import SafetyPerformanceTable from "./Partials/SafetyPerformanceTable";

// Chart.js Setup
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip as ChartTooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    ChartTooltip,
    Legend
);

export default function SafetyPerformanceIndex({ filters = {} }) {
    const { isDarkMode } = useTheme();

    const {
        fetching,
        syncing,
        updating,
        selectedYear,
        kpiData,
        lastSynced,
        handleYearChange,
        handleSync,
        handleUpdate,
        handleExport
    } = useSafetyPerformance(filters.tahun || new Date().getFullYear());

    const [editingKey, setEditingKey] = React.useState("");
    const [editForm, setEditForm] = React.useState({
        karyawan_amc: 0,
        karyawan_mitra: 0,
        manhour_amc: 0,
        manhour_mitra: 0
    });

    const startEdit = (record) => {
        setEditingKey(record.bulan);
        setEditForm({
            karyawan_amc: record.last_synced_at === null ? null : (record.karyawan_amc || 0),
            karyawan_mitra: record.last_synced_at === null ? null : (record.karyawan_mitra || 0),
            manhour_amc: record.last_synced_at === null ? null : (record.manhour_amc || 0),
            manhour_mitra: record.last_synced_at === null ? null : (record.manhour_mitra || 0)
        });
    };

    const cancelEdit = () => {
        setEditingKey("");
    };

    const handleFormChange = (key, value) => {
        setEditForm(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const saveEdit = async (bulan) => {
        const success = await handleUpdate(bulan, editForm);
        if (success) {
            setEditingKey("");
        }
    };

    // Months names for rendering
    const monthNames = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // Find the latest month that has data (non-zero manhours or last_synced_at)
    const activeMonths = kpiData.filter(row => row.last_synced_at !== null);
    const latestMonthData = activeMonths.length > 0 
        ? activeMonths[activeMonths.length - 1] 
        : kpiData[0] || {};

    // Calculate cumulative YTD stats
    const ytdAifr = latestMonthData.ytd_aifr || 0;
    const ytdLtiFr = latestMonthData.ytd_lti_fr || 0;
    const ytdLtiSr = latestMonthData.ytd_lti_sr || 0;
    const totalHariHilang = latestMonthData.hari_hilang_ytd || 0;
    const totalHpri = kpiData.reduce((acc, row) => acc + (row.hpri || 0), 0);

    // Styling constants
    const cardStyle = {
        borderRadius: 20,
        border: isDarkMode ? "1px solid #034561" : "1px solid #e2e8f0",
        background: isDarkMode ? "#02374e" : "#ffffff",
        boxShadow: isDarkMode ? "0 10px 15px -3px rgba(0,0,0,0.3)" : "0 10px 15px -3px rgba(0,0,0,0.05)"
    };

    // FR Chart Data config
    const frChartData = {
        labels: monthNames,
        datasets: [
            {
                label: "MTD AIFR",
                data: kpiData.map(row => row.last_synced_at === null ? 0 : (row.mtd_aifr || 0)),
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.3,
                fill: true,
            },
            {
                label: "YTD AIFR",
                data: kpiData.map(row => row.last_synced_at === null ? 0 : (row.ytd_aifr || 0)),
                borderColor: "#10b981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                tension: 0.3,
                fill: false,
                borderDash: [5, 5],
            },
            {
                label: "MTD LTI-FR",
                data: kpiData.map(row => row.last_synced_at === null ? 0 : (row.mtd_lti_fr || 0)),
                borderColor: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                tension: 0.3,
                fill: false,
            },
            {
                label: "YTD LTI-FR",
                data: kpiData.map(row => row.last_synced_at === null ? 0 : (row.ytd_lti_fr || 0)),
                borderColor: "#ef4444",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                tension: 0.3,
                fill: false,
                borderDash: [5, 5],
            }
        ]
    };

    const frChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: isDarkMode ? "#fff" : "#0f172a"
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            x: {
                grid: {
                    color: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                },
                ticks: {
                    color: isDarkMode ? "#94a3b8" : "#64748b"
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Frequency Rate (FR)',
                    color: isDarkMode ? "#94a3b8" : "#64748b"
                },
                grid: {
                    color: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                },
                ticks: {
                    color: isDarkMode ? "#94a3b8" : "#64748b"
                }
            }
        }
    };

    // SR Chart Data config
    const srChartData = {
        labels: monthNames,
        datasets: [
            {
                label: "MTD LTI-SR",
                data: kpiData.map(row => row.last_synced_at === null ? 0 : (row.mtd_lti_sr || 0)),
                borderColor: "#f59e0b",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                tension: 0.3,
                fill: true,
            },
            {
                label: "YTD LTI-SR",
                data: kpiData.map(row => row.last_synced_at === null ? 0 : (row.ytd_lti_sr || 0)),
                borderColor: "#f59e0b",
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                tension: 0.3,
                fill: false,
                borderDash: [5, 5],
            }
        ]
    };

    const srChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: isDarkMode ? "#fff" : "#0f172a"
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        scales: {
            x: {
                grid: {
                    color: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                },
                ticks: {
                    color: isDarkMode ? "#94a3b8" : "#64748b"
                }
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                title: {
                    display: true,
                    text: 'Severity Rate (SR)',
                    color: isDarkMode ? "#94a3b8" : "#64748b"
                },
                grid: {
                    color: isDarkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"
                },
                ticks: {
                    color: isDarkMode ? "#94a3b8" : "#64748b"
                }
            }
        }
    };

    // Columns config for Safety Performance Table
    const columns = [
        {
            title: "Bulan",
            dataIndex: "bulan",
            key: "bulan",
            fixed: "left",
            width: 120,
            render: (val) => <span style={{ fontWeight: 700 }}>{monthNames[val - 1]}</span>
        },
        {
            title: "Karyawan",
            children: [
                {
                    title: "AMC",
                    dataIndex: "karyawan_amc",
                    key: "karyawan_amc",
                    width: 120,
                    render: (val, record) => {
                        const isEditing = editingKey === record.bulan;
                        return isEditing ? (
                            <InputNumber
                                value={editForm.karyawan_amc}
                                onChange={(v) => handleFormChange("karyawan_amc", v)}
                                min={0}
                                style={{ width: "100%" }}
                            />
                        ) : (
                            record.last_synced_at === null ? "-" : (val || 0).toLocaleString()
                        );
                    }
                },
                {
                    title: "Mitra",
                    dataIndex: "karyawan_mitra",
                    key: "karyawan_mitra",
                    width: 120,
                    render: (val, record) => {
                        const isEditing = editingKey === record.bulan;
                        return isEditing ? (
                            <InputNumber
                                value={editForm.karyawan_mitra}
                                onChange={(v) => handleFormChange("karyawan_mitra", v)}
                                min={0}
                                style={{ width: "100%" }}
                            />
                        ) : (
                            record.last_synced_at === null ? "-" : (val || 0).toLocaleString()
                        );
                    }
                },
                {
                    title: "Total",
                    dataIndex: "total_karyawan",
                    key: "total_karyawan",
                    width: 90,
                    className: "font-semibold bg-gray-50 dark:bg-slate-800/40",
                    render: (val, record) => record.last_synced_at === null ? "-" : val.toLocaleString()
                }
            ]
        },
        {
            title: "Jam Kerja (Manhours)",
            children: [
                {
                    title: "AMC",
                    dataIndex: "manhour_amc",
                    key: "manhour_amc",
                    width: 140,
                    render: (val, record) => {
                        const isEditing = editingKey === record.bulan;
                        return isEditing ? (
                            <InputNumber
                                value={editForm.manhour_amc}
                                onChange={(v) => handleFormChange("manhour_amc", v)}
                                min={0}
                                style={{ width: "100%" }}
                            />
                        ) : (
                            record.last_synced_at === null ? "-" : Math.round(val || 0).toLocaleString()
                        );
                    }
                },
                {
                    title: "Mitra",
                    dataIndex: "manhour_mitra",
                    key: "manhour_mitra",
                    width: 140,
                    render: (val, record) => {
                        const isEditing = editingKey === record.bulan;
                        return isEditing ? (
                            <InputNumber
                                value={editForm.manhour_mitra}
                                onChange={(v) => handleFormChange("manhour_mitra", v)}
                                min={0}
                                style={{ width: "100%" }}
                            />
                        ) : (
                            record.last_synced_at === null ? "-" : Math.round(val || 0).toLocaleString()
                        );
                    }
                },
                {
                    title: "Bulanan",
                    dataIndex: "jam_kerja_bulanan",
                    key: "jam_kerja_bulanan",
                    width: 120,
                    className: "font-semibold bg-gray-50 dark:bg-slate-800/40",
                    render: (val, record) => record.last_synced_at === null ? "-" : Math.round(val).toLocaleString()
                },
                {
                    title: "Kumulatif (YTD)",
                    dataIndex: "jam_kerja_kumulatif",
                    key: "jam_kerja_kumulatif",
                    width: 130,
                    className: "font-semibold bg-gray-100 dark:bg-slate-700/40",
                    render: (val, record) => record.last_synced_at === null ? "-" : Math.round(val).toLocaleString()
                }
            ]
        },
        {
            title: "Insiden & Cedera",
            children: [
                {
                    title: "All Incident",
                    dataIndex: "count_all_incident",
                    key: "count_all_incident",
                    width: 100,
                    render: (val, record) => record.last_synced_at === null ? "-" : <span className={val > 0 ? "text-red-500 font-bold" : ""}>{val}</span>
                },
                {
                    title: "FAI",
                    dataIndex: "count_fai",
                    key: "count_fai",
                    width: 70,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "MTI",
                    dataIndex: "count_mti",
                    key: "count_mti",
                    width: 70,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "FAI+MTI",
                    dataIndex: "total_fai_mti",
                    key: "total_fai_mti",
                    width: 90,
                    className: "font-semibold",
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "Ringan",
                    dataIndex: "cidera_ringan",
                    key: "cidera_ringan",
                    width: 75,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "Berat",
                    dataIndex: "cidera_berat",
                    key: "cidera_berat",
                    width: 75,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "Mati",
                    dataIndex: "mati",
                    key: "mati",
                    width: 75,
                    render: (val, record) => record.last_synced_at === null ? "-" : <span className={val > 0 ? "text-red-600 font-extrabold" : ""}>{val}</span>
                },
                {
                    title: "Total LTI",
                    dataIndex: "total_kec_tambang",
                    key: "total_kec_tambang",
                    width: 90,
                    className: "font-bold bg-amber-50 dark:bg-amber-900/10",
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                }
            ]
        },
        {
            title: "Kerugian & Dampak",
            children: [
                {
                    title: "Hari Hilang",
                    dataIndex: "hari_hilang",
                    key: "hari_hilang",
                    width: 100,
                    render: (val, record) => record.last_synced_at === null ? "-" : (val > 0 ? <span className="text-amber-600 font-bold">{val}</span> : 0)
                },
                {
                    title: "Hari Hilang YTD",
                    dataIndex: "hari_hilang_ytd",
                    key: "hari_hilang_ytd",
                    width: 120,
                    className: "font-semibold",
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "HPRI",
                    dataIndex: "hpri",
                    key: "hpri",
                    width: 80,
                    render: (val, record) => record.last_synced_at === null ? "-" : (val > 0 ? <span className="text-red-500 font-bold">{val}</span> : 0)
                },
                {
                    title: "Non-HPRI",
                    dataIndex: "non_hpri",
                    key: "non_hpri",
                    width: 90,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                }
            ]
        },
        {
            title: "Pencemaran Lingkungan",
            children: [
                {
                    title: "Minor",
                    dataIndex: "lingkungan_minor",
                    key: "lingkungan_minor",
                    width: 75,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "Mayor",
                    dataIndex: "lingkungan_mayor",
                    key: "lingkungan_mayor",
                    width: 75,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "Kritikal",
                    dataIndex: "lingkungan_kritikal",
                    key: "lingkungan_kritikal",
                    width: 80,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                }
            ]
        },
        {
            title: "KPI Frequency & Severity Rates",
            children: [
                {
                    title: "MTD AIFR",
                    dataIndex: "mtd_aifr",
                    key: "mtd_aifr",
                    width: 100,
                    className: "bg-blue-50/50 dark:bg-blue-900/5",
                    render: (val, record) => record.last_synced_at === null ? "-" : <strong>{val}</strong>
                },
                {
                    title: "YTD AIFR",
                    dataIndex: "ytd_aifr",
                    key: "ytd_aifr",
                    width: 100,
                    className: "bg-blue-50 dark:bg-blue-900/10 font-bold",
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "MTD Injury FR",
                    dataIndex: "mtd_all_injury_fr",
                    key: "mtd_all_injury_fr",
                    width: 110,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "YTD Injury FR",
                    dataIndex: "ytd_all_injury_fr",
                    key: "ytd_all_injury_fr",
                    width: 110,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "MTD LTI-FR",
                    dataIndex: "mtd_lti_fr",
                    key: "mtd_lti_fr",
                    width: 100,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "YTD LTI-FR",
                    dataIndex: "ytd_lti_fr",
                    key: "ytd_lti_fr",
                    width: 100,
                    className: "font-bold",
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "MTD LTI-SR",
                    dataIndex: "mtd_lti_sr",
                    key: "mtd_lti_sr",
                    width: 100,
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                },
                {
                    title: "YTD LTI-SR",
                    dataIndex: "ytd_lti_sr",
                    key: "ytd_lti_sr",
                    width: 100,
                    className: "font-bold",
                    render: (val, record) => record.last_synced_at === null ? "-" : val
                }
            ]
        },
        {
            title: "Aksi",
            key: "action",
            fixed: "right",
            width: 150,
            className: "text-center",
            render: (_, record) => {
                const isEditing = editingKey === record.bulan;
                return isEditing ? (
                    <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                        <Button type="primary" size="small" onClick={() => saveEdit(record.bulan)}>
                            Simpan
                        </Button>
                        <Button size="small" onClick={cancelEdit}>
                            Batal
                        </Button>
                    </div>
                ) : (
                    <Button type="link" size="small" onClick={() => startEdit(record)}>
                        Edit
                    </Button>
                );
            }
        }
    ];

    // Build Yearly Total Row
    const totals = kpiData.reduce((acc, row) => {
        acc.karyawan_amc += row.karyawan_amc || 0;
        acc.karyawan_mitra += row.karyawan_mitra || 0;
        acc.total_karyawan += row.total_karyawan || 0;
        acc.manhour_amc += row.manhour_amc || 0;
        acc.manhour_mitra += row.manhour_mitra || 0;
        acc.jam_kerja_bulanan += row.jam_kerja_bulanan || 0;
        acc.count_all_incident += row.count_all_incident || 0;
        acc.count_fai += row.count_fai || 0;
        acc.count_mti += row.count_mti || 0;
        acc.total_fai_mti += row.total_fai_mti || 0;
        acc.cidera_ringan += row.cidera_ringan || 0;
        acc.cidera_berat += row.cidera_berat || 0;
        acc.mati += row.mati || 0;
        acc.total_kec_tambang += row.total_kec_tambang || 0;
        acc.hari_hilang += row.hari_hilang || 0;
        acc.hpri += row.hpri || 0;
        acc.non_hpri += row.non_hpri || 0;
        acc.lingkungan_minor += row.lingkungan_minor || 0;
        acc.lingkungan_mayor += row.lingkungan_mayor || 0;
        acc.lingkungan_kritikal += row.lingkungan_kritikal || 0;
        return acc;
    }, {
        karyawan_amc: 0, karyawan_mitra: 0, total_karyawan: 0,
        manhour_amc: 0, manhour_mitra: 0, jam_kerja_bulanan: 0,
        count_all_incident: 0, count_fai: 0, count_mti: 0, total_fai_mti: 0,
        cidera_ringan: 0, cidera_berat: 0, mati: 0, total_kec_tambang: 0,
        hari_hilang: 0, hpri: 0, non_hpri: 0, lingkungan_minor: 0,
        lingkungan_mayor: 0, lingkungan_kritikal: 0
    });

    const yearEndData = kpiData[kpiData.length - 1] || {};
    totals.ytd_aifr = yearEndData.ytd_aifr || 0;
    totals.ytd_all_injury_fr = yearEndData.ytd_all_injury_fr || 0;
    totals.ytd_lti_fr = yearEndData.ytd_lti_fr || 0;
    totals.ytd_lti_sr = yearEndData.ytd_lti_sr || 0;
    totals.hari_hilang_ytd = yearEndData.hari_hilang_ytd || 0;
    totals.jam_kerja_kumulatif = yearEndData.jam_kerja_kumulatif || 0;

    return (
        <DashboardLayout title="Safety Performance">
            <Head title={`Safety Performance - Tahun ${selectedYear}`} />

            <div style={{ padding: "24px" }}>
                <SafetyPerformanceHeader
                    selectedYear={selectedYear}
                    handleYearChange={handleYearChange}
                    handleSync={handleSync}
                    handleExport={handleExport}
                    syncing={syncing}
                    lastSynced={lastSynced}
                    isDarkMode={isDarkMode}
                />

                <Spin spinning={fetching || updating || syncing} size="large" tip="Memproses data...">
                    <SafetyPerformanceCards
                        ytdAifr={ytdAifr}
                        ytdLtiFr={ytdLtiFr}
                        ytdLtiSr={ytdLtiSr}
                        totalHpri={totalHpri}
                        totalHariHilang={totalHariHilang}
                        cardStyle={cardStyle}
                    />

                    <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))", 
                        gap: "24px", 
                        marginBottom: "32px" 
                    }}>
                        <SafetyPerformanceChart
                            title="Tren Frequency Rate (FR) Bulanan (MTD vs YTD)"
                            chartData={frChartData}
                            chartOptions={frChartOptions}
                            cardStyle={cardStyle}
                            isDarkMode={isDarkMode}
                        />

                        <SafetyPerformanceChart
                            title="Tren Severity Rate (SR) Bulanan (MTD vs YTD)"
                            chartData={srChartData}
                            chartOptions={srChartOptions}
                            cardStyle={cardStyle}
                            isDarkMode={isDarkMode}
                        />
                    </div>

                    <SafetyPerformanceTable
                        kpiData={kpiData}
                        columns={columns}
                        totals={totals}
                        lastSynced={lastSynced}
                        isDarkMode={isDarkMode}
                        cardStyle={cardStyle}
                    />
                </Spin>
            </div>
        </DashboardLayout>
    );
}
