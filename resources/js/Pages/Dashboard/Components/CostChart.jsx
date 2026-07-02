import React from "react";
import { Card, Empty } from "antd";
import { DollarOutlined } from "@ant-design/icons";
import { Line } from "react-chartjs-2";

export default function CostChart({ data = [], isDarkMode }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";
    const gridColor = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

    const chartData = {
        labels: data.map(c => c.month),
        datasets: [
            {
                label: 'Kerugian Langsung (Direct)',
                data: data.map(c => c.direct),
                backgroundColor: 'rgba(59, 130, 246, 0.15)',
                borderColor: '#3b82f6',
                borderWidth: 3,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                pointRadius: 4,
            },
            {
                label: 'Kerugian Tidak Langsung (Indirect)',
                data: data.map(c => c.indirect),
                backgroundColor: 'rgba(168, 85, 247, 0.08)',
                borderColor: '#a855f7',
                borderWidth: 3,
                tension: 0.3,
                fill: true,
                pointBackgroundColor: '#a855f7',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 1.5,
                pointRadius: 4,
            }
        ]
    };

    const costOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: secondaryTextColor,
                    font: { family: 'Inter', size: 12, weight: '600' }
                }
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                titleColor: isDarkMode ? '#f8fafc' : '#0f172a',
                bodyColor: isDarkMode ? '#cbd5e1' : '#334155',
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { color: gridColor },
                ticks: { color: secondaryTextColor, font: { family: 'Inter', size: 10, weight: '600' } }
            },
            y: {
                grid: { color: gridColor },
                ticks: {
                    color: secondaryTextColor,
                    font: { family: 'Inter', size: 10, weight: '600' },
                    callback: function (value) {
                        return '$' + new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value);
                    }
                }
            }
        }
    };

    return (
        <Card
            title={
                <span style={{ fontWeight: 800, fontSize: 14, color: isDarkMode ? '#f8fafc' : '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <DollarOutlined style={{ marginRight: 8, color: '#3b82f6' }} />
                    Kerugian Langsung VS Tidak Langsung
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
                    <Line data={chartData} options={costOptions} />
                ) : (
                    <Empty description="Belum ada data biaya insiden" style={{ paddingTop: 80 }} />
                )}
            </div>
        </Card>
    );
}
