import React from "react";
import { Card } from "antd";
import { LineChartOutlined } from "@ant-design/icons";
import { Line } from "react-chartjs-2";

export default function SafetyPerformanceChart({
    chartData,
    chartOptions,
    cardStyle,
    isDarkMode
}) {
    return (
        <Card 
            title={
                <span style={{ fontWeight: 800, color: isDarkMode ? "#fff" : "#1e293b" }} className="flex items-center gap-2">
                    <LineChartOutlined style={{ color: "#3b82f6" }} />
                    Tren Kinerja Keselamatan Bulanan (MTD vs YTD)
                </span>
            } 
            style={{ ...cardStyle, marginBottom: 32 }}
        >
            <div style={{ height: 320 }}>
                <Line data={chartData} options={chartOptions} />
            </div>
        </Card>
    );
}
