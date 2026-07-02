import React from "react";
import { Row, Col, Card, Statistic, Tooltip } from "antd";
import { InfoCircleOutlined, WarningOutlined } from "@ant-design/icons";

export default function SafetyPerformanceCards({
    ytdAifr,
    ytdLtiFr,
    ytdLtiSr,
    totalHpri,
    totalHariHilang,
    cardStyle
}) {
    return (
        <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} lg={4.8} style={{ width: "20%" }} className="w-full sm:w-1/2 lg:w-1/5">
                <Card bordered={false} style={cardStyle} styles={{ body: { padding: 24 } }}>
                    <Statistic
                        title={
                            <span style={{ fontWeight: 700, color: "#64748b" }} className="flex items-center gap-2">
                                YTD AIFR
                                <Tooltip title="All Incident Frequency Rate: Kumulatif Tingkat Keseringan Kecelakaan per 1 Juta Jam Kerja"><InfoCircleOutlined /></Tooltip>
                            </span>
                        }
                        value={ytdAifr}
                        valueStyle={{ color: '#3b82f6', fontWeight: 900, fontSize: 28 }}
                        precision={2}
                        suffix={<span style={{ fontSize: 14, color: "#94a3b8" }}>/1M Mh</span>}
                    />
                </Card>
            </Col>
            
            <Col xs={24} sm={12} lg={4.8} style={{ width: "20%" }} className="w-full sm:w-1/2 lg:w-1/5">
                <Card bordered={false} style={cardStyle} styles={{ body: { padding: 24 } }}>
                    <Statistic
                        title={
                            <span style={{ fontWeight: 700, color: "#64748b" }} className="flex items-center gap-2">
                                YTD LTI-FR
                                <Tooltip title="Lost Time Incident Frequency Rate: Tingkat Keseringan Kecelakaan Tambang (Cidera Ringan/Berat/Mati)"><InfoCircleOutlined /></Tooltip>
                            </span>
                        }
                        value={ytdLtiFr}
                        valueStyle={{ color: '#ef4444', fontWeight: 900, fontSize: 28 }}
                        precision={2}
                        suffix={<span style={{ fontSize: 14, color: "#94a3b8" }}>/1M Mh</span>}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={4.8} style={{ width: "20%" }} className="w-full sm:w-1/2 lg:w-1/5">
                <Card bordered={false} style={cardStyle} styles={{ body: { padding: 24 } }}>
                    <Statistic
                        title={
                            <span style={{ fontWeight: 700, color: "#64748b" }} className="flex items-center gap-2">
                                YTD LTI-SR
                                <Tooltip title="Lost Time Incident Severity Rate: Tingkat Keparahan Hari Hilang per 1 Juta Jam Kerja"><InfoCircleOutlined /></Tooltip>
                            </span>
                        }
                        value={ytdLtiSr}
                        valueStyle={{ color: '#f59e0b', fontWeight: 900, fontSize: 28 }}
                        precision={2}
                        suffix={<span style={{ fontSize: 14, color: "#94a3b8" }}>/1M Mh</span>}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={4.8} style={{ width: "20%" }} className="w-full sm:w-1/2 lg:w-1/5">
                <Card bordered={false} style={cardStyle} styles={{ body: { padding: 24 } }}>
                    <Statistic
                        title={<span style={{ fontWeight: 700, color: "#64748b" }}>TOTAL HPRI YTD</span>}
                        value={totalHpri}
                        valueStyle={{ color: '#ec4899', fontWeight: 900, fontSize: 28 }}
                        prefix={<WarningOutlined className="mr-1" />}
                    />
                </Card>
            </Col>

            <Col xs={24} sm={12} lg={4.8} style={{ width: "20%" }} className="w-full sm:w-1/2 lg:w-1/5">
                <Card bordered={false} style={cardStyle} styles={{ body: { padding: 24 } }}>
                    <Statistic
                        title={<span style={{ fontWeight: 700, color: "#64748b" }}>HARI HILANG YTD</span>}
                        value={totalHariHilang}
                        valueStyle={{ color: '#10b981', fontWeight: 900, fontSize: 28 }}
                        suffix={<span style={{ fontSize: 14, color: "#94a3b8" }}> Hari</span>}
                    />
                </Card>
            </Col>
        </Row>
    );
}
