import React from "react";
import { Row, Col, Card, Select, Tag, Button, Table, Input, Divider } from "antd";
import { PlusOutlined, DeleteOutlined, FormOutlined, CarryOutOutlined, FileSearchOutlined } from "@ant-design/icons";
import PicaIntegration from "./PicaIntegration";

export default function RootCauseFactorsSection({
    disabled,
    isDarkMode,
    master = {},
    unsafeActions,
    setUnsafeActions,
    unsafeConditions,
    setUnsafeConditions,
    personalFactors,
    setPersonalFactors,
    jobFactors,
    setJobFactors,
    causeDetails,
    setCauseDetails,
    investigationChecklist,
    setInvestigationChecklist,
    correctiveActions = [],
    setCorrectiveActions
}) {
    const cardStyle = {
        borderRadius: 20,
        border: isDarkMode ? "1px solid #334155" : "1px solid #e2e8f0",
        background: isDarkMode ? "#1e293b" : "#ffffff",
        boxShadow: isDarkMode ? "0 4px 6px -1px rgba(0,0,0,0.2)" : "0 4px 6px -1px rgba(0,0,0,0.05)",
        marginBottom: 24,
    };

    const headerStyle = {
        borderBottom: isDarkMode ? "1px solid #334155" : "1px solid #f1f5f9",
        padding: "16px 24px",
    };

    const sectionTitleStyle = {
        fontWeight: 800,
        fontSize: "14px",
        color: isDarkMode ? "#38bdf8" : "#0284c7",
        marginBottom: 16,
        display: "flex",
        alignItems: "center",
        gap: 8,
    };

    // Helper to get selected factor details (for Cause Details dropdown)
    const getSelectedFactors = () => {
        const selected = [];
        
        unsafeActions.forEach(id => {
            const item = (master.unsafeActs || []).find(x => String(x.id) === String(id));
            if (item) selected.push({ id: item.id, code: item.code || `USA-${item.id}`, name: item.description });
        });

        unsafeConditions.forEach(id => {
            const item = (master.unsafeConditions || []).find(x => String(x.id) === String(id));
            if (item) selected.push({ id: item.id, code: item.code || `USC-${item.id}`, name: item.description });
        });

        personalFactors.forEach(id => {
            const item = (master.personalFactors || []).find(x => String(x.id) === String(id));
            if (item) selected.push({ id: item.id, code: item.code || `PF-${item.id}`, name: item.description });
        });

        jobFactors.forEach(id => {
            const item = (master.jobFactors || []).find(x => String(x.id) === String(id));
            if (item) selected.push({ id: item.id, code: item.code || `JF-${item.id}`, name: item.description });
        });

        return selected;
    };

    const selectedFactorsList = getSelectedFactors();

    // Cause Details table helpers
    const handleAddCauseRow = (factorCode) => {
        const factor = selectedFactorsList.find(f => f.code === factorCode);
        if (!factor) return;

        // Check if already added
        if (causeDetails.some(c => c.code === factor.code)) return;

        setCauseDetails([
            ...causeDetails,
            { code: factor.code, cause: factor.name, analysis_explanation: "" }
        ]);
    };

    const handleDeleteCauseRow = (index) => {
        const list = [...causeDetails];
        list.splice(index, 1);
        setCauseDetails(list);
    };

    const handleCauseFieldChange = (index, field, value) => {
        const list = [...causeDetails];
        list[index][field] = value;
        setCauseDetails(list);
    };

    // Checklist helper
    const handleChecklistChange = (qKey, value) => {
        setInvestigationChecklist({
            ...investigationChecklist,
            [qKey]: value
        });
    };

    const getCategoryByCode = (code) => {
        if (!code) return "";
        if (code.startsWith("USA")) return "Tindakan Tidak Aman (USA)";
        if (code.startsWith("USC")) return "Kondisi Tidak Aman (USC)";
        if (code.startsWith("PF")) return "Faktor Pribadi (PF)";
        if (code.startsWith("JF")) return "Faktor Pekerjaan (JF)";
        return "";
    };

    // Checklist questions
    const checklistQuestions = (master.investigationQuestions || []).map((q, idx) => ({
        key: q.key,
        text: `${idx + 1}. ${q.question_text}`
    }));

    React.useEffect(() => {
        if (disabled) return;

        const newActions = (causeDetails || []).map(cause => {
            const existing = (correctiveActions || []).find(action => action.cause_code === cause.code);
            return existing ? {
                ...existing,
                cause_text: cause.cause
            } : {
                cause_code: cause.code,
                cause_text: cause.cause,
                action: "",
                pic: "",
                target_date: "",
                status: "Open",
                recommendation_id: null
            };
        });

        const currentCodes = (correctiveActions || []).map(a => a.cause_code).join('|');
        const newCodes = newActions.map(a => a.cause_code).join('|');
        
        const currentTexts = (correctiveActions || []).map(a => a.cause_text).join('|');
        const newTexts = newActions.map(a => a.cause_text).join('|');

        if (
            (correctiveActions || []).length !== newActions.length ||
            currentCodes !== newCodes ||
            currentTexts !== newTexts
        ) {
            setCorrectiveActions(newActions);
        }
    }, [causeDetails, correctiveActions, setCorrectiveActions, disabled]);

    return (
        <div>
            {/* Card 1: Analisa Akar Masalah */}
            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center", justify: "space-between", width: "100%" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <FormOutlined style={{ color: "#ef4444", fontSize: 18 }} />
                            <span style={{ fontSize: 14, color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 800 }}>
                                ANALISA AKAR MASALAH (ROOT CAUSE)
                            </span>
                        </div>
                    </div>
                }
                style={cardStyle}
                styles={{ header: headerStyle, body: { padding: 24 } }}
            >
                <Row gutter={[24, 20]}>
                    {/* Unsafe Actions */}
                    <Col xs={24} md={12} lg={6}>
                        <div style={{ fontWeight: 800, fontSize: "11px", color: "#f97316", marginBottom: 8, letterSpacing: "0.05em" }}>
                            UNSAFE ACTIONS (USA)
                        </div>
                        <Select
                            mode="multiple"
                            placeholder="+ Add Action"
                            style={{ width: "100%" }}
                            value={unsafeActions ? unsafeActions.map(String) : []}
                            onChange={setUnsafeActions}
                            disabled={disabled}
                            options={(master.unsafeActs || []).map(x => ({
                                label: x.code ? `${x.code} - ${x.description}` : x.description,
                                value: String(x.id)
                            }))}
                            maxTagCount="responsive"
                            tagRender={({ label, closable, onClose }) => (
                                <Tag
                                    color="orange"
                                    closable={closable && !disabled}
                                    onClose={onClose}
                                    style={{ marginRight: 3, fontWeight: 700 }}
                                >
                                    {label}
                                </Tag>
                            )}
                        />
                    </Col>

                    {/* Unsafe Conditions */}
                    <Col xs={24} md={12} lg={6}>
                        <div style={{ fontWeight: 800, fontSize: "11px", color: "#ef4444", marginBottom: 8, letterSpacing: "0.05em" }}>
                            UNSAFE CONDITIONS (USC)
                        </div>
                        <Select
                            mode="multiple"
                            placeholder="+ Add Condition"
                            style={{ width: "100%" }}
                            value={unsafeConditions ? unsafeConditions.map(String) : []}
                            onChange={setUnsafeConditions}
                            disabled={disabled}
                            options={(master.unsafeConditions || []).map(x => ({
                                label: x.code ? `${x.code} - ${x.description}` : x.description,
                                value: String(x.id)
                            }))}
                            maxTagCount="responsive"
                            tagRender={({ label, closable, onClose }) => (
                                <Tag
                                    color="volcano"
                                    closable={closable && !disabled}
                                    onClose={onClose}
                                    style={{ marginRight: 3, fontWeight: 700 }}
                                >
                                    {label}
                                </Tag>
                            )}
                        />
                    </Col>

                    {/* Personal Factors */}
                    <Col xs={24} md={12} lg={6}>
                        <div style={{ fontWeight: 800, fontSize: "11px", color: "#ec4899", marginBottom: 8, letterSpacing: "0.05em" }}>
                            PERSONAL FACTORS (PF)
                        </div>
                        <Select
                            mode="multiple"
                            placeholder="+ Add Factor"
                            style={{ width: "100%" }}
                            value={personalFactors ? personalFactors.map(String) : []}
                            onChange={setPersonalFactors}
                            disabled={disabled}
                            options={(master.personalFactors || []).map(x => ({
                                label: x.code ? `${x.code} - ${x.description}` : x.description,
                                value: String(x.id)
                            }))}
                            maxTagCount="responsive"
                            tagRender={({ label, closable, onClose }) => (
                                <Tag
                                    color="magenta"
                                    closable={closable && !disabled}
                                    onClose={onClose}
                                    style={{ marginRight: 3, fontWeight: 700 }}
                                >
                                    {label}
                                </Tag>
                            )}
                        />
                    </Col>

                    {/* Job Factors */}
                    <Col xs={24} md={12} lg={6}>
                        <div style={{ fontWeight: 800, fontSize: "11px", color: "#3b82f6", marginBottom: 8, letterSpacing: "0.05em" }}>
                            JOB FACTORS (JF)
                        </div>
                        <Select
                            mode="multiple"
                            placeholder="+ Add Factor"
                            style={{ width: "100%" }}
                            value={jobFactors ? jobFactors.map(String) : []}
                            onChange={setJobFactors}
                            disabled={disabled}
                            options={(master.jobFactors || []).map(x => ({
                                label: x.code ? `${x.code} - ${x.description}` : x.description,
                                value: String(x.id)
                            }))}
                            maxTagCount="responsive"
                            tagRender={({ label, closable, onClose }) => (
                                <Tag
                                    color="blue"
                                    closable={closable && !disabled}
                                    onClose={onClose}
                                    style={{ marginRight: 3, fontWeight: 700 }}
                                >
                                    {label}
                                </Tag>
                            )}
                        />
                    </Col>
                </Row>

                <Divider style={{ margin: "24px 0" }} />

                {/* Detail Penyebab Kecelakaan */}
                <div style={sectionTitleStyle}>
                    <div style={{ width: 3, height: 14, background: "#0284c7", borderRadius: 1.5 }}></div>
                    <span>DETAIL PENYEBAB KECELAKAAN</span>
                </div>

                {!disabled && selectedFactorsList.length > 0 && (
                    <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
                        <span style={{ fontWeight: 600, fontSize: 13, color: isDarkMode ? "#cbd5e1" : "#475569" }}>
                            Pilih Faktor untuk Didetailkan:
                        </span>
                        <Select
                            placeholder="Pilih dari faktor yang aktif..."
                            style={{ width: 300 }}
                            onChange={(val) => {
                                handleAddCauseRow(val);
                            }}
                            value={null}
                            options={selectedFactorsList
                                .filter(f => !causeDetails.some(c => c.code === f.code))
                                .map(f => ({
                                    label: `${f.code} - ${f.name}`,
                                    value: f.code
                                }))}
                        />
                    </div>
                )}

                <Table
                    dataSource={causeDetails}
                    rowKey="code"
                    pagination={false}
                    bordered
                    size="middle"
                    columns={[
                        {
                            title: "No.",
                            key: "index",
                            width: 60,
                            align: "center",
                            render: (_, __, idx) => idx + 1
                        },
                        {
                            title: "Penyebab Kecelakaan",
                            key: "category",
                            width: 220,
                            render: (_, record) => getCategoryByCode(record.code)
                        },
                        {
                            title: "Kode",
                            dataIndex: "code",
                            key: "code",
                            width: 110,
                            render: (code) => {
                                let color = "";
                                if (code.startsWith("USA")) color = "#ffedd5"; // light orange
                                else if (code.startsWith("USC")) color = "#fef9c3"; // light yellow
                                else if (code.startsWith("PF")) color = "#fce7f3"; // light pink
                                else if (code.startsWith("JF")) color = "#dbeafe"; // light blue
                                return (
                                    <div style={{
                                        background: color,
                                        padding: "4px 8px",
                                        borderRadius: 4,
                                        fontWeight: 800,
                                        textAlign: "center",
                                        border: "1px solid rgba(0,0,0,0.05)",
                                        color: "#1e293b"
                                    }}>
                                        {code}
                                    </div>
                                );
                            }
                        },
                        {
                            title: "Jenis Penyebab Kecelakaan",
                            dataIndex: "cause",
                            key: "cause",
                            render: (text, record, idx) => {
                                let color = "";
                                if (record.code.startsWith("USA")) color = "#ffedd5";
                                else if (record.code.startsWith("USC")) color = "#fef9c3";
                                else if (record.code.startsWith("PF")) color = "#fce7f3";
                                else if (record.code.startsWith("JF")) color = "#dbeafe";
                                return (
                                    <Input
                                        value={text}
                                        onChange={(e) => handleCauseFieldChange(idx, "cause", e.target.value)}
                                        disabled={disabled}
                                        style={{
                                            background: color,
                                            fontWeight: 600,
                                            borderRadius: 6,
                                            border: "1px solid rgba(0,0,0,0.08)",
                                            color: "#1e293b"
                                        }}
                                    />
                                );
                            }
                        },
                        {
                            title: "Penjelasan Penyebab Kecelakaan",
                            dataIndex: "analysis_explanation",
                            key: "analysis_explanation",
                            render: (text, _, idx) => (
                                <Input.TextArea
                                    rows={1}
                                    value={text}
                                    onChange={(e) => handleCauseFieldChange(idx, "analysis_explanation", e.target.value)}
                                    placeholder="Masukkan penjelasan analisa..."
                                    disabled={disabled}
                                    autoSize={{ minRows: 1, maxRows: 3 }}
                                    style={{ borderRadius: 6 }}
                                />
                            )
                        },
                        ...(!disabled ? [{
                            title: "Aksi",
                            key: "action",
                            width: 70,
                            align: "center",
                            render: (_, __, idx) => (
                                <Button
                                    danger
                                    type="primary"
                                    shape="circle"
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteCauseRow(idx)}
                                />
                            )
                        }] : [])
                    ]}
                />
            </Card>

            {/* Card 1.5: Rekomendasi / Rencana Tindakan Perbaikan */}
            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <FormOutlined style={{ color: "#f59e0b", fontSize: 18 }} />
                        <span style={{ fontSize: 14, color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 800 }}>
                            REKOMENDASI / RENCANA TINDAKAN PERBAIKAN ( harus SMARTER : Specific, Measurable, Achieveble, Reasonable, Timely, Effective dan Reviewed)
                        </span>
                    </div>
                }
                style={cardStyle}
                styles={{ header: headerStyle, body: { padding: 24 } }}
            >
                <PicaIntegration
                    correctiveActions={correctiveActions}
                    setCorrectiveActions={setCorrectiveActions}
                    disabled={disabled}
                    isDarkMode={isDarkMode}
                    recommendations={master.recommendations || []}
                    causeDetails={causeDetails}
                />
            </Card>

            {/* Card 2: Checklist Keputusan Investigasi */}
            <Card
                title={
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <CarryOutOutlined style={{ color: "#10b981", fontSize: 18 }} />
                        <span style={{ fontSize: 14, color: isDarkMode ? "#f8fafc" : "#0f172a", fontWeight: 800 }}>
                            CHECKLIST KEPUTUSAN INVESTIGASI
                        </span>
                    </div>
                }
                style={cardStyle}
                styles={{ header: headerStyle, body: { padding: 24 } }}
            >
                <Row gutter={[24, 16]}>
                    {checklistQuestions.map((q) => {
                        const val = investigationChecklist[q.key]; // undefined, 0, 1, false, true
                        const isYes = val === true || val === 1 || val === "1";
                        const isNo = val === false || val === 0 || val === "0";

                        return (
                            <Col xs={24} md={12} key={q.key}>
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "12px 16px",
                                    borderRadius: 12,
                                    background: isDarkMode ? "#0f172a" : "#f8fafc",
                                    border: `1px solid ${isDarkMode ? "#334155" : "#e2e8f0"}`,
                                    height: "100%"
                                }}>
                                    <span style={{ fontSize: "13px", fontWeight: 600, color: isDarkMode ? "#cbd5e1" : "#334155", paddingRight: 12 }}>
                                        {q.text}
                                    </span>
                                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                        <Button
                                            type={isYes ? "primary" : "default"}
                                            disabled={disabled}
                                            style={{
                                                borderRadius: 20,
                                                fontWeight: 800,
                                                borderColor: isYes ? "#10b981" : undefined,
                                                background: isYes ? "#10b981" : undefined,
                                                color: isYes ? "#fff" : undefined,
                                                width: 60
                                            }}
                                            onClick={() => handleChecklistChange(q.key, true)}
                                        >
                                            YES
                                        </Button>
                                        <Button
                                            type={isNo ? "primary" : "default"}
                                            danger={isNo}
                                            disabled={disabled}
                                            style={{
                                                borderRadius: 20,
                                                fontWeight: 800,
                                                width: 60
                                            }}
                                            onClick={() => handleChecklistChange(q.key, false)}
                                        >
                                            NO
                                        </Button>
                                    </div>
                                </div>
                            </Col>
                        );
                    })}
                </Row>
            </Card>
        </div>
    );
}
