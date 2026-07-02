import React from "react";
import { Card, Empty } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

export default function TopTimesWidget({ data = [], isDarkMode }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const labelColor = isDarkMode ? "#f8fafc" : "#1e293b";
    const countColor = isDarkMode ? "#10b981" : "#059669";
    const barBg = isDarkMode ? "#334155" : "#e2e8f0";
    const barFillColor = "#10b981"; // Premium Green

    // Find the maximum value to calculate relative widths
    const maxVal = data.length > 0 ? Math.max(...data.map(item => item.value)) : 1;

    return (
        <Card
            title={
                <span style={{ fontWeight: 800, fontSize: 14, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <ClockCircleOutlined style={{ marginRight: 8, color: '#10b981' }} />
                    TOP 5 WAKTU INSIDEN
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
            {data.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {data.map((item, idx) => {
                        const pct = (item.value / maxVal) * 100;
                        return (
                            <div key={idx} style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                                    <span style={{ fontWeight: 700, fontSize: 13, color: labelColor }}>
                                        {item.label}
                                    </span>
                                    <span style={{ fontWeight: 800, fontSize: 13, color: countColor }}>
                                        {item.value} Kejadian
                                    </span>
                                </div>
                                <div style={{
                                    width: '100%',
                                    height: 10,
                                    background: barBg,
                                    borderRadius: 5,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: `${pct}%`,
                                        height: '100%',
                                        background: `linear-gradient(90deg, #34d399 0%, ${barFillColor} 100%)`,
                                        borderRadius: 5,
                                        transition: 'width 1s ease-in-out'
                                    }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <Empty description="Belum ada data waktu" style={{ paddingTop: 80 }} />
            )}
        </Card>
    );
}
