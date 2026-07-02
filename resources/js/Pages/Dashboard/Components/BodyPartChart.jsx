import React from "react";
import { Card, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Bar } from "react-chartjs-2";

export default function BodyPartChart({ data = [], isDarkMode, palette = [] }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";
    const gridColor = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";

    // Limit to top 6 body parts
    const displayData = data.slice(0, 6);

    const chartColor = '#ec4899'; // Uniform Pink for Body Part

    const chartData = {
        labels: displayData.map(item => item.label),
        datasets: [{
            label: 'Frekuensi',
            data: displayData.map(item => item.value),
            backgroundColor: chartColor,
            borderWidth: 0,
            borderRadius: 6,
            borderSkipped: 'left',
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
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            chart.data.datasets.forEach((dataset, i) => {
                const meta = chart.getDatasetMeta(i);
                meta.data.forEach((bar, index) => {
                    const val = dataset.data[index];
                    ctx.fillStyle = isDarkMode ? '#f8fafc' : '#1e293b';
                    ctx.fillText(val, bar.x + 6, bar.y);
                });
            });
            ctx.restore();
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
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
                bodyFont: { family: 'Inter', size: 12 }
            }
        },
        scales: {
            x: {
                grid: { 
                    color: gridColor,
                    drawBorder: false
                },
                border: { display: false },
                grace: '10%',
                ticks: {
                    color: secondaryTextColor,
                    font: { family: 'Inter', size: 10, weight: '500' }
                }
            },
            y: {
                grid: { display: false },
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
                <span style={{ fontWeight: 800, fontSize: 14, color: isDarkMode ? '#f8fafc' : '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <UserOutlined style={{ marginRight: 8, color: '#ec4899' }} />
                    Bagian Tubuh Terluka
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
            <div style={{ height: 280, position: 'relative' }}>
                {data.length > 0 ? (
                    <Bar data={chartData} options={options} plugins={[datalabelsPlugin]} />
                ) : (
                    <Empty description="Belum ada data bagian tubuh" style={{ paddingTop: 60 }} />
                )}
            </div>
        </Card>
    );
}
