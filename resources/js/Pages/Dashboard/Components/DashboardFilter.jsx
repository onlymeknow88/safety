import React from "react";
import { Card, Row, Col, Select, DatePicker, Button, Space } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useTheme } from "@/Contexts/ThemeContext";

const { RangePicker } = DatePicker;

export default function DashboardFilter({
    filters = {},
    ccows = [],
    companies = [],
    isPowerUser = false,
    onFilterChange,
    onReset
}) {
    const { isDarkMode } = useTheme();

    const handleFilterChange = (key, value) => {
        if (onFilterChange) {
            onFilterChange(key, value);
        }
    };

    const handleReset = () => {
        if (onReset) {
            onReset();
        }
    };

    return (
        <Card
            style={{
                borderRadius: 20,
                marginBottom: 24,
                background: isDarkMode ? "rgba(30, 41, 59, 0.7)" : "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)",
                border: `1px solid ${isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
                boxShadow: isDarkMode ? "0 4px 20px rgba(0, 0, 0, 0.3)" : "0 4px 20px rgba(0, 0, 0, 0.02)",
            }}
            styles={{ body: { padding: "16px 20px" } }}
        >
            <Row gutter={[16, 16]} align="middle">
                {/* 1. PERIODE (DATE RANGE) */}
                <Col xs={24} md={8} lg={6}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? "#94a3b8" : "#64748b", marginBottom: 6 }}>
                        Periode Tanggal
                    </div>
                    <RangePicker
                        value={[
                            filters.start_date ? dayjs(filters.start_date) : null,
                            filters.end_date ? dayjs(filters.end_date) : null,
                        ]}
                        format="DD MMM YYYY"
                        onChange={(dates) => handleFilterChange("date_range", dates)}
                        style={{ width: "100%" }}
                        allowClear={false}
                    />
                </Col>

                {/* 2. CCOW */}
                <Col xs={24} sm={12} md={6} lg={6}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? "#94a3b8" : "#64748b", marginBottom: 6 }}>
                        CCOW (Wilayah/Kontrak)
                    </div>
                    <Select
                        placeholder="Pilih CCOW"
                        style={{ width: "100%" }}
                        disabled={!isPowerUser}
                        value={filters.ccow_id ? Number(filters.ccow_id) : undefined}
                        onChange={(val) => handleFilterChange("ccow_id", val)}
                        allowClear
                        options={[
                            { value: "", label: "Semua CCOW" },
                            ...ccows.map((c) => ({ value: c.id, label: c.name })),
                        ]}
                    />
                </Col>

                {/* 3. PERUSAHAAN (COMPANY) */}
                <Col xs={24} sm={12} md={6} lg={6}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? "#94a3b8" : "#64748b", marginBottom: 6 }}>
                        Perusahaan
                    </div>
                    <Select
                        placeholder="Pilih Perusahaan"
                        style={{ width: "100%" }}
                        disabled={!isPowerUser}
                        value={filters.company_id ? Number(filters.company_id) : undefined}
                        onChange={(val) => handleFilterChange("company_id", val)}
                        allowClear
                        options={[
                            { value: "", label: "Semua Perusahaan" },
                            ...companies.map((c) => ({ value: c.id, label: c.name })),
                        ]}
                    />
                </Col>

                {/* 4. ACTIONS */}
                <Col xs={24} md={4} lg={6} style={{ display: "flex", justifyContent: "flex-end", alignSelf: "end" }}>
                    <Space>
                        <Button
                            type="default"
                            icon={<ReloadOutlined />}
                            onClick={handleReset}
                            style={{
                                borderRadius: 8,
                                fontWeight: 500,
                            }}
                        >
                            Reset
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
}
