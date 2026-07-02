import React from "react";
import { Card, Empty } from "antd";
import { PieChartOutlined } from "@ant-design/icons";
import { Doughnut } from "react-chartjs-2";

export default function IncidentCategoryDonut({ data = {}, isDarkMode }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const labelColor = isDarkMode ? "#f8fafc" : "#1e293b";
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";

    const hpri = data.hpri || 0;
    const nonHpri = data.non_hpri || 0;
    const total = hpri + nonHpri;

    const hpriPct = total > 0 ? Math.round((hpri / total) * 100) : 0;
    const nonHpriPct = total > 0 ? Math.round((nonHpri / total) * 100) : 0;

    const chartData = {
        labels: ["HPRI", "NON HPRI"],
        datasets: [{
            data: [hpri, nonHpri],
            backgroundColor: ["#2563eb", "#10b981"], // Blue and Green
            borderColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderWidth: 2,
            hoverOffset: 4,
            cutout: '75%' // Thin donut
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // We will render a custom legend matching the screenshot
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                titleColor: isDarkMode ? '#f8fafc' : '#0f172a',
                bodyColor: isDarkMode ? '#cbd5e1' : '#334155',
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const val = context.raw || 0;
                        const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                        return ` ${label}: ${val} (${pct}%)`;
                    }
                }
            }
        }
    };

    return (
        <Card
            title={
                <span style={{ fontWeight: 800, fontSize: 14, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <PieChartOutlined style={{ marginRight: 8, color: '#10b981' }} />
                    KATEGORI INSIDEN
                </span>
            }
            style={{
                background: cardBg,
                border: cardBorder,
                borderRadius: 20,
                boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)",
                marginBottom: 24,
                height: 420
            }}
            styles={{ body: { padding: 24 } }}
        >
            {total > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Donut Container with Absolute Centered Text */}
                    <div style={{ position: 'relative', width: 200, height: 200, margin: '10px auto' }}>
                        <Doughnut data={chartData} options={options} />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            pointerEvents: 'none'
                        }}>
                            <div style={{ fontSize: 32, fontWeight: 900, color: labelColor, lineHeight: 1 }}>
                                {total}
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 800, color: secondaryTextColor, letterSpacing: '0.1em', marginTop: 4 }}>
                                TOTAL CASE
                            </div>
                        </div>
                    </div>

                    {/* Custom Legend matching the screenshot */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-around',
                        width: '100%',
                        marginTop: 20,
                        padding: '0 10px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#2563eb', marginTop: 4 }} />
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: labelColor }}>
                                    HPRI {hpri}
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: secondaryTextColor }}>
                                    ({hpriPct}%)
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', marginTop: 4 }} />
                            <div>
                                <div style={{ fontSize: 12, fontWeight: 700, color: labelColor }}>
                                    NON HPRI {nonHpri}
                                </div>
                                <div style={{ fontSize: 11, fontWeight: 600, color: secondaryTextColor }}>
                                    ({nonHpriPct}%)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Empty description="Belum ada data kategori insiden" style={{ paddingTop: 80 }} />
            )}
        </Card>
    );
}
