import React from "react";
import { Card, Empty } from "antd";
import { ToolOutlined } from "@ant-design/icons";
import { Bar } from "react-chartjs-2";

export default function PersonalFactorChart({ data = [], isDarkMode, palette = [] }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";
    const gridColor = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
    const labelColor = isDarkMode ? "#f8fafc" : "#1e293b";

    // Limit to top 7 personal factors
    const displayData = data.slice(0, 7);

    const chartColor = '#f59e0b'; // Uniform Amber for Personal Factor

    const chartData = {
        labels: displayData.map(item => item.label.length > 25 ? item.label.substring(0, 22) + '...' : item.label),
        datasets: [{
            label: 'Jumlah Kasus',
            data: displayData.map(item => item.value),
            backgroundColor: chartColor,
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: 'bottom',
            barPercentage: 0.45,
            categoryPercentage: 0.8,
            hoverBackgroundColor: `${chartColor}ee`
        }]
    };

    const datalabelsPlugin = {
        id: 'datalabels',
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            ctx.save();
            ctx.font = 'bold 11px Inter';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';

            chart.data.datasets.forEach((dataset, i) => {
                const meta = chart.getDatasetMeta(i);
                meta.data.forEach((bar, index) => {
                    const val = dataset.data[index];
                    ctx.fillStyle = isDarkMode ? '#f8fafc' : '#1e293b';
                    ctx.fillText(val, bar.x, bar.y - 4);
                });
            });
            ctx.restore();
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                bottom: 20,
                top: 15
            }
        },
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
                padding: 10,
                cornerRadius: 8,
                titleFont: { family: 'Inter', weight: 'bold', size: 12 },
                bodyFont: { family: 'Inter', size: 12 },
                callbacks: {
                    title: function(context) {
                        const index = context[0].dataIndex;
                        return displayData[index].label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: {
                    color: secondaryTextColor,
                    font: { family: 'Inter', size: 9, weight: '600' },
                    maxRotation: 45,
                    minRotation: 45
                }
            },
            y: {
                grid: { 
                    color: gridColor,
                    drawBorder: false
                },
                border: { display: false },
                grace: '10%',
                ticks: {
                    color: secondaryTextColor,
                    font: { family: 'Inter', size: 10, weight: '500' },
                    precision: 0
                }
            }
        }
    };

    return (
        <Card
            title={
                <span style={{ fontWeight: 800, fontSize: 14, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <ToolOutlined style={{ marginRight: 8, color: '#f59e0b' }} />
                    Faktor Pribadi (Personal Factor)
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
            <div style={{ height: 320, position: 'relative' }}>
                {data.length > 0 ? (
                    <Bar data={chartData} options={options} plugins={[datalabelsPlugin]} />
                ) : (
                    <Empty description="Belum ada data faktor pribadi" style={{ paddingTop: 80 }} />
                )}
            </div>
        </Card>
    );
}
