import React from "react";
import { Card, Empty } from "antd";
import { Chart as ChartJS } from "chart.js";
import { Chart } from "react-chartjs-2";

export default function CompanyIncidentChart({ data = [], isDarkMode }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const textColor = isDarkMode ? "#cbd5e1" : "#1e293b";
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#8c8c8c";

    // Sort data in descending order by count just to be safe
    const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 10);

    const labels = sortedData.map(item => {
        // Break long company names into array to make them wrap nicely
        const name = item.name || 'N/A';
        if (name.length > 20) {
            return name.split(' ');
        }
        return name;
    });
    
    const quantities = sortedData.map(item => item.count);
    const percentages = sortedData.map(item => item.percentage);

    const chartData = {
        labels,
        datasets: [
            {
                type: 'bar',
                label: 'QUANTITY',
                data: quantities,
                backgroundColor: '#f97316', // Vibrant orange
                borderRadius: 4,
                barPercentage: 0.4,
                yAxisID: 'y',
                order: 2,
            },
            {
                type: 'line',
                label: 'PERSENTASE',
                data: percentages,
                borderColor: '#2563eb', // Dash blue line
                borderWidth: 2,
                borderDash: [5, 5],
                pointBackgroundColor: '#2563eb',
                pointRadius: 4,
                yAxisID: 'y1',
                order: 1,
            }
        ]
    };

    // Custom plugin to draw the percentage labels inside black badge boxes
    const percentageBadgesPlugin = {
        id: 'percentageBadges',
        afterDatasetsDraw(chart) {
            const { ctx } = chart;
            ctx.save();
            
            // Find the line dataset (which has order: 1, index 1 usually)
            const lineDatasetIndex = chart.data.datasets.findIndex(d => d.type === 'line');
            if (lineDatasetIndex !== -1) {
                const meta = chart.getDatasetMeta(lineDatasetIndex);
                if (!meta.hidden) {
                    meta.data.forEach((point, index) => {
                        const value = chart.data.datasets[lineDatasetIndex].data[index];
                        if (value > 0) {
                            const text = `${value.toFixed(0)}%`;
                            ctx.font = 'bold 9px Inter, sans-serif';
                            
                            const textWidth = ctx.measureText(text).width;
                            const paddingX = 5;
                            const paddingY = 3;
                            const boxWidth = textWidth + paddingX * 2;
                            const boxHeight = 15;
                            
                            const x = point.x - boxWidth / 2;
                            const y = point.y - 17; // Position above the dot (closer)
                            
                            // Draw badge background (black/dark slate)
                            ctx.fillStyle = '#0f172a';
                            ctx.beginPath();
                            if (ctx.roundRect) {
                                ctx.roundRect(x, y, boxWidth, boxHeight, 3);
                            } else {
                                ctx.rect(x, y, boxWidth, boxHeight);
                            }
                            ctx.fill();
                            
                            // Draw white text
                            ctx.fillStyle = '#ffffff';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(text, point.x, y + boxHeight / 2);
                        }
                    });
                }
            }
            ctx.restore();
        }
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Custom legend in card header
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
                    font: { family: 'Inter', size: 9, weight: 'bold' },
                    maxRotation: 0,
                    minRotation: 0,
                }
            },
            y: {
                type: 'linear',
                position: 'left',
                beginAtZero: true,
                grace: '20%',
                border: {
                    display: false
                },
                grid: {
                    color: isDarkMode ? '#334155' : '#f1f5f9',
                },
                ticks: {
                    color: secondaryTextColor,
                    font: { family: 'Inter', size: 10 },
                    stepSize: 10,
                }
            },
            y1: {
                type: 'linear',
                position: 'right',
                beginAtZero: true,
                grace: '20%',
                border: {
                    display: false
                },
                grid: {
                    drawOnChartArea: false, // only show grid lines for left axis
                },
                ticks: {
                    color: secondaryTextColor,
                    font: { family: 'Inter', size: 10 },
                    callback: function(value) {
                        return value + '%';
                    }
                }
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
                    <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: textColor, fontFamily: 'Inter', textTransform: 'uppercase' }}>
                        Top 10 Insiden Per Perusahaan
                    </h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: 12, color: secondaryTextColor, fontFamily: 'Inter', fontWeight: 500 }}>
                        PT Maruwai Coal & PT Lahai Coal
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 24, height: 12, borderRadius: 2, backgroundColor: '#f97316', display: 'inline-block' }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: secondaryTextColor, fontFamily: 'Inter' }}>
                            QUANTITY
                        </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 24, height: 2, borderBottom: '2px dashed #2563eb', display: 'inline-block' }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: secondaryTextColor, fontFamily: 'Inter' }}>
                            PERSENTASE
                        </span>
                    </div>
                </div>
            </div>
            <div style={{ height: 350, position: 'relative' }}>
                {sortedData.length > 0 ? (
                    <Chart type="bar" data={chartData} options={options} plugins={[percentageBadgesPlugin]} />
                ) : (
                    <Empty description="No data" style={{ paddingTop: 100 }} />
                )}
            </div>
        </Card>
    );
}
