import React from "react";
import { Row, Col, Select, Space, Button, Tooltip, Spin } from "antd";
import { 
    BarChartOutlined, 
    CalendarOutlined, 
    ReloadOutlined, 
    DownloadOutlined 
} from "@ant-design/icons";

export default function SafetyPerformanceHeader({
    selectedYear,
    handleYearChange,
    handleSync,
    handleExport,
    syncing,
    lastSynced,
    isDarkMode
}) {
    return (
        <Row gutter={[16, 16]} align="middle" style={{ marginBottom: 32 }} className="justify-between">
            <Col xs={24} md={12}>
                <h2 style={{
                    margin: 0,
                    fontWeight: 900,
                    fontSize: "30px",
                    color: isDarkMode ? "#fff" : "#0f172a",
                    letterSpacing: "-0.02em"
                }} className="flex items-center gap-3">
                    <BarChartOutlined style={{ color: "#2563eb" }} />
                    SAFETY PERFORMANCE REPORT
                </h2>
                <p style={{ margin: 0, color: "#64748b", fontSize: "14px", fontWeight: 500, marginTop: 4 }}>
                    Dashboard Otomatis Key Performance Indicator (KPI) K3LH
                </p>
            </Col>
            
            <Col xs={24} md={12} className="md:text-right">
                <Space wrap size="middle" className="w-full md:justify-end">
                    <div className="flex items-center gap-2">
                        <CalendarOutlined style={{ color: "#64748b" }} />
                        <Select
                            value={selectedYear}
                            style={{ width: 120 }}
                            onChange={handleYearChange}
                            className="rounded-lg"
                        >
                            {[2024, 2025, 2026, 2027].map(y => (
                                <Select.Option key={y} value={y}>{y}</Select.Option>
                            ))}
                        </Select>
                    </div>

                    <Tooltip title={lastSynced ? `Sync terakhir: ${lastSynced}` : "Belum disinkronkan"}>
                        <Button
                            type="primary"
                            icon={syncing ? <Spin size="small" /> : <ReloadOutlined />}
                            onClick={handleSync}
                            disabled={syncing}
                            style={{ borderRadius: 12, height: 40 }}
                            className="bg-blue-600 hover:bg-blue-500 font-semibold"
                        >
                            Sync Data
                        </Button>
                    </Tooltip>

                    <Button
                        icon={<DownloadOutlined />}
                        onClick={handleExport}
                        style={{ borderRadius: 12, height: 40 }}
                        className="font-semibold border-slate-300 dark:border-slate-600"
                    >
                        Export Excel
                    </Button>
                </Space>
            </Col>
        </Row>
    );
}
