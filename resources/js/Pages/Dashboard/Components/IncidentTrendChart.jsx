import React from "react";
import { Card, Empty } from "antd";
import { LineChartOutlined } from "@ant-design/icons";
import { Line } from "react-chartjs-2";

export default function IncidentTrendChart({ data = [], isDarkMode }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";
    const gridColor = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

    const chartData = {
        labels: data.map(c => c.month),
        datasets: [
            {
                label: 'Jumlah Insiden',
                data: data.map(c => c.count),
                backgroundColor: 'rgba(249, 115, 22, 0.15)', // Orange glow fill
                borderColor: '#f97316', // Orange line
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                pointBackgroundColor: '#f97316',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                titleColor: isDarkMode ? '#f8fafc' : '#0f172a',
                bodyColor: isDarkMode ? '#cbd5e1' : '#334155',
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                titleFont: { family: 'Inter', weight: 'bold', size: 12 },
                bodyFont: { family: 'Inter', size: 12 }
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
                    precision: 0,
                    stepSize: 1
                }
            }
        }
    };

    return (
        <Card
            title={
                <span style={{ fontWeight: 800, fontSize: 14, color: isDarkMode ? '#f8fafc' : '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <LineChartOutlined style={{ marginRight: 8, color: '#f97316' }} />
                    Trend Insiden (Incident Trend)
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
                    <Line data={chartData} options={options} />
                ) : (
                    <Empty description="Belum ada data tren insiden" style={{ paddingTop: 80 }} />
                )}
            </div>
        </Card>
    );
}
