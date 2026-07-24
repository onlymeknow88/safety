import React from "react";
import { Row, Col, Card, Select, Tag, Button, Table, Input, Divider, Empty, Typography } from "antd";
import { DeleteOutlined, FormOutlined, CarryOutOutlined, NodeIndexOutlined, PlusCircleOutlined } from "@ant-design/icons";
import PicaIntegration from "./PicaIntegration";

const { Text } = Typography;

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

    // Factor group config
    const factorGroups = [
        {
            key: 'usa', label: 'Unsafe Actions', code: 'USA',
            color: '#f97316', tagColor: 'orange', bg: '#fff7ed',
            border: '#fed7aa', value: unsafeActions, setter: setUnsafeActions,
            options: (master.unsafeActs || []).map(x => ({ label: x.code ? `${x.code} - ${x.description}` : x.description, value: String(x.id) }))
        },
        {
            key: 'usc', label: 'Unsafe Conditions', code: 'USC',
            color: '#ef4444', tagColor: 'volcano', bg: '#fff5f5',
            border: '#fecaca', value: unsafeConditions, setter: setUnsafeConditions,
            options: (master.unsafeConditions || []).map(x => ({ label: x.code ? `${x.code} - ${x.description}` : x.description, value: String(x.id) }))
        },
        {
            key: 'pf', label: 'Personal Factors', code: 'PF',
            color: '#ec4899', tagColor: 'magenta', bg: '#fdf4ff',
            border: '#f5d0fe', value: personalFactors, setter: setPersonalFactors,
            options: (master.personalFactors || []).map(x => ({ label: x.code ? `${x.code} - ${x.description}` : x.description, value: String(x.id) }))
        },
        {
            key: 'jf', label: 'Job Factors', code: 'JF',
            color: '#3b82f6', tagColor: 'blue', bg: '#eff6ff',
            border: '#bfdbfe', value: jobFactors, setter: setJobFactors,
            options: (master.jobFactors || []).map(x => ({ label: x.code ? `${x.code} - ${x.description}` : x.description, value: String(x.id) }))
        },
    ];

    const getCodeBg = (code) => {
        if (!code) return '#f1f5f9';
        if (code.startsWith('USA')) return '#ffedd5';
        if (code.startsWith('USC')) return '#fef9c3';
        if (code.startsWith('PF'))  return '#fce7f3';
        if (code.startsWith('JF'))  return '#dbeafe';
        return '#f1f5f9';
    };

    return (
        <div>
            {/* Card 1: Analisa Akar Masalah */}
            <Card
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <NodeIndexOutlined style={{ color: '#ef4444', fontSize: 18 }} />
                        <span style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800 }}>
                            ANALISA AKAR MASALAH (ROOT CAUSE ANALYSIS)
                        </span>
                    </div>
                }
                style={cardStyle}
                styles={{ header: headerStyle, body: { padding: 24 } }}
            >
                {/* Factor Selectors — 2x2 grid */}
                <Row gutter={[16, 16]}>
                    {factorGroups.map(group => (
                        <Col xs={24} md={12} key={group.key}>
                            <div style={{
                                borderRadius: 12,
                                border: `1.5px solid ${isDarkMode ? '#334155' : group.border}`,
                                background: isDarkMode ? '#0f172a' : group.bg,
                                padding: '14px 16px',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: group.color, flexShrink: 0 }} />
                                    <span style={{ fontWeight: 800, fontSize: 12, color: group.color, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                        {group.label} ({group.code})
                                    </span>
                                    {(group.value || []).length > 0 && (
                                        <Tag color={group.tagColor} style={{ marginLeft: 'auto', fontWeight: 800, fontSize: 11 }}>
                                            {(group.value || []).length} dipilih
                                        </Tag>
                                    )}
                                </div>
                                <Select
                                    mode="multiple"
                                    placeholder={`Pilih ${group.label}...`}
                                    style={{ width: '100%' }}
                                    value={(group.value || []).map(String)}
                                    onChange={group.setter}
                                    disabled={disabled}
                                    options={group.options}
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    tagRender={({ label, closable, onClose }) => (
                                        <Tag
                                            color={group.tagColor}
                                            closable={closable && !disabled}
                                            onClose={onClose}
                                            style={{ marginRight: 3, fontWeight: 700, fontSize: 11 }}
                                        >
                                            {label}
                                        </Tag>
                                    )}
                                />
                            </div>
                        </Col>
                    ))}
                </Row>

                <Divider style={{ margin: '20px 0' }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: '#64748b' }}>DETAIL PENYEBAB KECELAKAAN</span>
                </Divider>

                {/* Add cause row selector */}
                {!disabled && selectedFactorsList.length > 0 && (
                    <div style={{
                        marginBottom: 16,
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px',
                        borderRadius: 10,
                        background: isDarkMode ? '#0f172a' : '#f0f9ff',
                        border: `1px dashed ${isDarkMode ? '#334155' : '#bae6fd'}`,
                    }}>
                        <PlusCircleOutlined style={{ color: '#0284c7', fontSize: 16 }} />
                        <span style={{ fontWeight: 600, fontSize: 13, color: isDarkMode ? '#94a3b8' : '#0369a1', flexShrink: 0 }}>
                            Tambah Detail:
                        </span>
                        <Select
                            placeholder="Pilih faktor untuk didetailkan..."
                            style={{ flex: 1 }}
                            onChange={handleAddCauseRow}
                            value={null}
                            options={selectedFactorsList
                                .filter(f => !causeDetails.some(c => c.code === f.code))
                                .map(f => ({ label: `${f.code} — ${f.name}`, value: f.code }))}
                        />
                    </div>
                )}

                {causeDetails.length === 0 ? (
                    <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                            <Text style={{ color: '#94a3b8', fontWeight: 600, fontSize: 13 }}>
                                {selectedFactorsList.length === 0
                                    ? 'Pilih faktor di atas terlebih dahulu, kemudian tambahkan detail penyebab.'
                                    : 'Klik "Tambah Detail" untuk menambahkan detail penyebab dari faktor yang dipilih.'}
                            </Text>
                        }
                        style={{ padding: '24px 0' }}
                    />
                ) : (
                    <Table
                        dataSource={causeDetails}
                        rowKey="code"
                        pagination={false}
                        bordered
                        size="middle"
                        rowClassName={(_, idx) => idx % 2 === 0 ? '' : 'ant-table-row-alt'}
                        columns={[
                            {
                                title: 'No.',
                                key: 'index',
                                width: 50,
                                align: 'center',
                                render: (_, __, idx) => (
                                    <span style={{ fontWeight: 700, color: '#64748b' }}>{idx + 1}</span>
                                )
                            },
                            {
                                title: 'Kode',
                                dataIndex: 'code',
                                key: 'code',
                                width: 100,
                                render: (code) => (
                                    <div style={{
                                        background: getCodeBg(code),
                                        padding: '4px 8px', borderRadius: 6,
                                        fontWeight: 800, textAlign: 'center',
                                        fontSize: 12, color: '#1e293b',
                                        border: '1px solid rgba(0,0,0,0.06)',
                                    }}>
                                        {code}
                                    </div>
                                )
                            },
                            {
                                title: 'Kategori',
                                key: 'category',
                                width: 180,
                                render: (_, record) => (
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                                        {getCategoryByCode(record.code)}
                                    </span>
                                )
                            },
                            {
                                title: 'Jenis Penyebab',
                                dataIndex: 'cause',
                                key: 'cause',
                                render: (text, record, idx) => (
                                    <Input
                                        value={text}
                                        onChange={(e) => handleCauseFieldChange(idx, 'cause', e.target.value)}
                                        disabled={disabled}
                                        style={{
                                            background: getCodeBg(record.code),
                                            fontWeight: 600, borderRadius: 6,
                                            border: '1px solid rgba(0,0,0,0.08)', color: '#1e293b',
                                        }}
                                    />
                                )
                            },
                            {
                                title: 'Penjelasan Analisa',
                                dataIndex: 'analysis_explanation',
                                key: 'analysis_explanation',
                                render: (text, _, idx) => (
                                    <Input.TextArea
                                        rows={1}
                                        value={text}
                                        onChange={(e) => handleCauseFieldChange(idx, 'analysis_explanation', e.target.value)}
                                        placeholder="Tuliskan penjelasan analisa..."
                                        disabled={disabled}
                                        autoSize={{ minRows: 1, maxRows: 3 }}
                                        style={{ borderRadius: 6 }}
                                    />
                                )
                            },
                            ...(!disabled ? [{
                                title: '',
                                key: 'action',
                                width: 50,
                                align: 'center',
                                render: (_, __, idx) => (
                                    <Button
                                        danger ghost
                                        size="small"
                                        shape="circle"
                                        icon={<DeleteOutlined />}
                                        onClick={() => handleDeleteCauseRow(idx)}
                                    />
                                )
                            }] : [])
                        ]}
                    />
                )}
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
