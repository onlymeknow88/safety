import React from "react";
import { Card, Empty } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { Doughnut } from "react-chartjs-2";

export default function MobileEquipmentChart({ data = [], isDarkMode, palette = [] }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";

    const chartData = {
        labels: data.map(item => item.label),
        datasets: [{
            label: 'Frekuensi',
            data: data.map(item => item.value),
            backgroundColor: palette.slice(0, data.length),
            borderColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderWidth: 1.5,
            hoverBackgroundColor: palette.map(c => `${c}ee`).slice(0, data.length)
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: secondaryTextColor,
                    font: { family: 'Inter', size: 10, weight: '600' },
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 8
                }
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
                bodyFont: { family: 'Inter', size: 12 }
            }
        }
    };

    return (
        <Card
            title={
                <span style={{ fontWeight: 800, fontSize: 14, color: isDarkMode ? '#f8fafc' : '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <ToolOutlined style={{ marginRight: 8, color: '#0ea5e9' }} />
                    Jenis Mobile Equipment
                </span>
            }
            style={{
                background: cardBg,
                border: cardBorder,
                borderRadius: 16,
                boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)",
                marginBottom: 24,
                overflow: "hidden"
            }}
            styles={{ body: { padding: 24 } }}
        >
            <div style={{ height: 320, position: 'relative' }}>
                {data.length > 0 ? (
                    <Doughnut data={chartData} options={options} />
                ) : (
                    <Empty description="Belum ada data mobile equipment" style={{ paddingTop: 80 }} />
                )}
            </div>
        </Card>
    );
}
