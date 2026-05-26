import React from "react";
import { Row, Col, Card, Select, Input, InputNumber } from "antd";
import { FileSearchOutlined, AlertOutlined } from "@ant-design/icons";

export default function IncidentSpecificFactorsSection({
    disabled,
    isDarkMode,
    master = {},
    incidentTypeId,
    setIncidentTypeId,
    sourceId,
    setSourceId,
    mobileEquipment,
    setMobileEquipment,
    workExperienceIntervalId,
    setWorkExperienceIntervalId,
    hourOfShift,
    setHourOfShift,
    injuryConditionId,
    setInjuryConditionId,
    bodyPartId,
    setBodyPartId,
    environmentalPollutionQty,
    setEnvironmentalPollutionQty,
    lostDays,
    setLostDays,
    actualCost,
    setActualCost,
    potentialCost,
    setPotentialCost
}) {
    const cardStyle = {
        borderRadius: 20,
        border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
        background: isDarkMode ? "#1e293b" : "#ffffff",
        boxShadow: isDarkMode ? "0 4px 6px -1px rgba(0,0,0,0.2)" : "0 4px 6px -1px rgba(0,0,0,0.05)",
        height: "100%",
    };

    const headerStyle = {
        borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9",
        padding: "16px 24px",
    };

    const labelStyle = {
        fontWeight: 700,
        fontSize: "12px",
        color: isDarkMode ? "#94a3b8" : "#64748b",
        display: "block",
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
    };

    // Common mobile equipment options
    const mobileEquipmentOptions = [
        { label: "Haul Truck - HD785", value: "Haul Truck - HD785" },
        { label: "Haul Truck - CAT 777", value: "Haul Truck - CAT 777" },
        { label: "Excavator - PC2000", value: "Excavator - PC2000" },
        { label: "Dozer - D8R", value: "Dozer - D8R" },
        { label: "Grader - GD825", value: "Grader - GD825" },
        { label: "Light Vehicle (LV)", value: "Light Vehicle (LV)" },
        { label: "Support Equipment", value: "Support Equipment" },
        { label: "None / N/A", value: "None / N/A" }
    ];

    // Hour of shift options
    const hourOfShiftOptions = [
        { label: "Hour 1", value: "Hour 1" },
        { label: "Hour 2", value: "Hour 2" },
        { label: "Hour 3", value: "Hour 3" },
        { label: "Hour 4", value: "Hour 4" },
        { label: "Hour 5", value: "Hour 5" },
        { label: "Hour 6 - Fatigue window", value: "Hour 6 - Fatigue window" },
        { label: "Hour 7", value: "Hour 7" },
        { label: "Hour 8", value: "Hour 8" },
        { label: "Hour 9", value: "Hour 9" },
        { label: "Hour 10", value: "Hour 10" },
        { label: "Hour 11", value: "Hour 11" },
        { label: "Hour 12", value: "Hour 12" }
    ];

    return (
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
            {/* Card 1: FAKTOR SPESIFIK INSIDEN */}
            <Col xs={24} lg={12}>
                <Card
                    title={
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <FileSearchOutlined style={{ color: "#3b82f6", fontSize: 18 }} />
                            <span style={{ fontSize: 14, color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 800 }}>
                                FAKTOR SPESIFIK INSIDEN
                            </span>
                        </div>
                    }
                    style={cardStyle}
                    styles={{ header: headerStyle, body: { padding: 24 } }}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <label style={labelStyle}>Tipe Insiden</label>
                            <Select
                                placeholder="Pilih Tipe Insiden..."
                                style={{ width: "100%" }}
                                value={incidentTypeId}
                                onChange={setIncidentTypeId}
                                disabled={disabled}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                                options={(master.incidentTypes || []).map(t => ({
                                    label: t.category,
                                    value: t.id
                                }))}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <label style={labelStyle}>Sumber Kecelakaan SK.1 - SK.26</label>
                            <Select
                                placeholder="Pilih Sumber..."
                                style={{ width: "100%" }}
                                value={sourceId}
                                onChange={setSourceId}
                                disabled={disabled}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                                options={(master.sources || []).map(s => ({
                                    label: s.code ? `${s.code} - ${s.description}` : s.description,
                                    value: s.id
                                }))}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <label style={labelStyle}>Jenis Mobile Equipment</label>
                            <Select
                                placeholder="Pilih/Masukkan Jenis Unit..."
                                style={{ width: "100%" }}
                                value={mobileEquipment}
                                onChange={setMobileEquipment}
                                disabled={disabled}
                                showSearch
                                options={mobileEquipmentOptions}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <label style={labelStyle}>Interval Pengalaman Bekerja</label>
                            <Select
                                placeholder="Pilih Interval..."
                                style={{ width: "100%" }}
                                value={workExperienceIntervalId}
                                onChange={setWorkExperienceIntervalId}
                                disabled={disabled}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                                options={(master.intervalExperiences || []).map(e => ({
                                    label: e.label,
                                    value: e.id
                                }))}
                            />
                        </Col>
                        <Col xs={24}>
                            <label style={labelStyle}>Hour of Shift</label>
                            <Select
                                placeholder="Pilih Jam Shift..."
                                style={{ width: "100%" }}
                                value={hourOfShift}
                                onChange={setHourOfShift}
                                disabled={disabled}
                                showSearch
                                options={hourOfShiftOptions}
                            />
                        </Col>
                    </Row>
                </Card>
            </Col>

            {/* Card 2: DAMPAK & KORBAN */}
            <Col xs={24} lg={12}>
                <Card
                    title={
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <AlertOutlined style={{ color: "#ef4444", fontSize: 18 }} />
                            <span style={{ fontSize: 14, color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 800 }}>
                                DAMPAK & KORBAN
                            </span>
                        </div>
                    }
                    style={cardStyle}
                    styles={{ header: headerStyle, body: { padding: 24 } }}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12}>
                            <label style={labelStyle}>Kondisi Cidera / Sakit</label>
                            <Select
                                placeholder="Pilih Kondisi Cidera..."
                                style={{ width: "100%" }}
                                value={injuryConditionId}
                                onChange={setInjuryConditionId}
                                disabled={disabled}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                                options={(master.injuryConditions || []).map(c => ({
                                    label: c.name,
                                    value: c.id
                                }))}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <label style={labelStyle}>Bagian Tubuh</label>
                            <Select
                                placeholder="Pilih Bagian Tubuh..."
                                style={{ width: "100%" }}
                                value={bodyPartId}
                                onChange={setBodyPartId}
                                disabled={disabled}
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                                }
                                options={(master.bodyParts || []).map(bp => ({
                                    label: bp.name,
                                    value: bp.id
                                }))}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <label style={labelStyle}>Jumlah Pencemaran Lingkungan</label>
                            <InputNumber
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="Jumlah ceceran/pencemaran..."
                                value={environmentalPollutionQty}
                                onChange={setEnvironmentalPollutionQty}
                                disabled={disabled}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <label style={labelStyle}>Hari Hilang (Hari)</label>
                            <InputNumber
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="Jumlah hari hilang..."
                                value={lostDays}
                                onChange={setLostDays}
                                disabled={disabled}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <label style={labelStyle}>Biaya Kerugian Aktual (IDR)</label>
                            <InputNumber
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="Biaya aktual..."
                                value={actualCost}
                                onChange={setActualCost}
                                disabled={disabled}
                                formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                parser={value => value.replace(/(Rp\s*)|(\.*)/g, "").replace(",", ".")}
                            />
                        </Col>
                        <Col xs={24} sm={12}>
                            <label style={labelStyle}>Biaya Kerugian Potensial (IDR)</label>
                            <InputNumber
                                min={0}
                                style={{ width: "100%" }}
                                placeholder="Biaya potensial..."
                                value={potentialCost}
                                onChange={setPotentialCost}
                                disabled={disabled}
                                formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                parser={value => value.replace(/(Rp\s*)|(\.*)/g, "").replace(",", ".")}
                            />
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
}
