import React from "react";
import { Card, Empty } from "antd";
import { Bar } from "react-chartjs-2";

export default function SeverityRateChart({ data = [], isDarkMode }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const textColor = isDarkMode ? "#cbd5e1" : "#1e293b";
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#8c8c8c";

    const labels = data.map(item => item.month);
    const values = data.map(item => item.sr);

    const chartData = {
        labels,
        datasets: [{
            label: 'SR',
            data: values,
            backgroundColor: '#15803d', // Clean solid green
            borderRadius: 8,
            borderSkipped: 'bottom',
            barPercentage: 0.4,
        }]
    };

    // Custom plugin to draw labels on top of the bars
    const datalabelsPlugin = {
        id: 'datalabels',
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            ctx.save();
            chart.data.datasets.forEach((dataset, i) => {
                chart.getDatasetMeta(i).data.forEach((bar, index) => {
                    const value = dataset.data[index];
                    if (value > 0) {
                        ctx.font = 'bold 12px Inter, sans-serif';
                        ctx.fillStyle = isDarkMode ? '#cbd5e1' : '#1e293b';
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'bottom';
                        ctx.fillText(value.toFixed(1), bar.x, bar.y - 6);
                    }
                });
            });
            ctx.restore();
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                titleColor: isDarkMode ? '#f8fafc' : '#0f172a',
                bodyColor: isDarkMode ? '#cbd5e1' : '#334155',
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                borderWidth: 1,
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                border: {
                    display: false
                },
                ticks: {
                    color: secondaryTextColor,
                    font: { family: 'Inter', size: 11, weight: 'bold' }
                }
            },
            y: {
                display: false,
                grid: {
                    display: false
                },
                suggestedMax: Math.max(...values, 0) * 1.15 || 10,
            }
        }
    };

    return (
        <Card
            style={{
                background: cardBg,
                border: cardBorder,
                borderRadius: 20,
                boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)",
                marginBottom: 24,
                overflow: "hidden"
            }}
            styles={{ body: { padding: "28px 24px" } }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: textColor, fontFamily: 'Inter' }}>
                        Trend Severity Rate (SR)
                    </h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: 12, color: secondaryTextColor, fontFamily: 'Inter', fontWeight: 500 }}>
                        Tingkat keparahan kecelakaan
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#15803d', display: 'inline-block' }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: secondaryTextColor, fontFamily: 'Inter' }}>
                        YTD 2026
                    </span>
                </div>
            </div>
            <div style={{ height: 260, position: 'relative' }}>
                {data.length > 0 ? (
                    <Bar data={chartData} options={options} plugins={[datalabelsPlugin]} />
                ) : (
                    <Empty description="No data" style={{ paddingTop: 60 }} />
                )}
            </div>
        </Card>
    );
}
