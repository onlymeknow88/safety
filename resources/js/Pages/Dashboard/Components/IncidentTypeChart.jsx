import React from "react";
import { Card, Empty } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { Doughnut } from "react-chartjs-2";

export default function IncidentTypeChart({ data = [], isDarkMode, palette = [] }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const labelColor = isDarkMode ? "#f8fafc" : "#1e293b";
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";

    const total = data.reduce((sum, item) => sum + item.value, 0);

    const chartData = {
        labels: data.map(item => item.label),
        datasets: [{
            label: 'Jumlah',
            data: data.map(item => item.value),
            backgroundColor: palette.slice(0, data.length),
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
                titleFont: { family: 'Inter', weight: 'bold', size: 12 },
                bodyFont: { family: 'Inter', size: 12 },
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
                    <WarningOutlined style={{ marginRight: 8, color: '#f59e0b' }} />
                    Jenis Kecelakaan (Incident Classification)
                </span>
            }
            style={{
                background: cardBg,
                border: cardBorder,
                borderRadius: 20,
                boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)",
                marginBottom: 24,
                overflow: "hidden"
            }}
            styles={{ body: { padding: 24 } }}
        >
            <div style={{ height: 350, position: 'relative' }}>
                {data.length > 0 ? (
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

                        {/* Custom Legend */}
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '12px 16px',
                            width: '100%',
                            marginTop: 15,
                            maxHeight: 100,
                            overflowY: 'auto',
                            padding: '0 5px'
                        }}>
                            {data.map((item, index) => {
                                const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
                                const color = palette[index % palette.length];
                                return (
                                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: 6, minWidth: 100 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, marginTop: 5 }} />
                                        <div>
                                            <div style={{ fontSize: 11, fontWeight: 700, color: labelColor, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: 120 }}>
                                                {item.label} <span style={{ fontWeight: 800 }}>{item.value}</span>
                                            </div>
                                            <div style={{ fontSize: 10, fontWeight: 600, color: secondaryTextColor }}>
                                                ({pct}%)
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <Empty description="Belum ada data jenis kecelakaan" style={{ paddingTop: 80 }} />
                )}
            </div>
        </Card>
    );
}
