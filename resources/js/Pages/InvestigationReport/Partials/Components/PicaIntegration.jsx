import React from "react";
import { Input, DatePicker, Select, Table } from "antd";
import dayjs from "dayjs";

export default function PicaIntegration({ 
    correctiveActions = [], 
    setCorrectiveActions, 
    disabled, 
    isDarkMode, 
    recommendations = [],
    causeDetails = [] 
}) {
    // Only display actions that have a cause_code and match an actual identified cause
    const activeActions = React.useMemo(() => {
        return (correctiveActions || []).filter(action => 
            action.cause_code && (causeDetails || []).some(cause => cause.code === action.cause_code)
        );
    }, [correctiveActions, causeDetails]);

    const handleFieldChange = (causeCode, field, value) => {
        const list = (correctiveActions || []).map(action => {
            if (action.cause_code === causeCode) {
                return {
                    ...action,
                    [field]: value
                };
            }
            return action;
        });
        setCorrectiveActions(list);
    };

    const columns = [
        {
            title: "No.",
            key: "index",
            width: 50,
            align: "center",
            render: (_, __, index) => index + 1
        },
        {
            title: "Kode",
            dataIndex: "cause_code",
            key: "cause_code",
            width: 100,
            render: (code) => {
                if (!code) return "-";
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
            dataIndex: "cause_text",
            key: "cause_text",
            width: 250,
            render: (text, record) => {
                let color = "";
                const code = record.cause_code || "";
                if (code.startsWith("USA")) color = "#ffedd5";
                else if (code.startsWith("USC")) color = "#fef9c3";
                else if (code.startsWith("PF")) color = "#fce7f3";
                else if (code.startsWith("JF")) color = "#dbeafe";
                return (
                    <div style={{
                        background: color,
                        padding: "6px 12px",
                        borderRadius: 6,
                        fontWeight: 600,
                        border: "1px solid rgba(0,0,0,0.08)",
                        color: "#1e293b"
                    }}>
                        {text || "-"}
                    </div>
                );
            }
        },
        {
            title: "Jenis Rekomendasi",
            dataIndex: "recommendation_id",
            key: "recommendation_id",
            width: 200,
            render: (value, record) => (
                <Select
                    value={value ? String(value) : undefined}
                    onChange={(val) => handleFieldChange(record.cause_code, "recommendation_id", val)}
                    placeholder="Pilih rekomendasi..."
                    disabled={disabled}
                    style={{ width: "100%" }}
                    options={recommendations.map(r => ({
                        label: r.name,
                        value: String(r.id)
                    }))}
                />
            )
        },
        {
            title: "Tindakan Perbaikan",
            dataIndex: "action",
            key: "action",
            render: (text, record) => (
                <Input.TextArea
                    rows={1}
                    value={text}
                    onChange={(e) => handleFieldChange(record.cause_code, "action", e.target.value)}
                    placeholder="Masukkan detail tindakan perbaikan..."
                    disabled={disabled}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    style={{ borderRadius: 6 }}
                />
            )
        },
        {
            title: "Penanggung Jawab",
            dataIndex: "pic",
            key: "pic",
            width: 180,
            render: (text, record) => (
                <Input
                    value={text}
                    onChange={(e) => handleFieldChange(record.cause_code, "pic", e.target.value)}
                    placeholder="Nama PIC / Jabatan"
                    disabled={disabled}
                    style={{ borderRadius: 6 }}
                />
            )
        },
        {
            title: "Target penyelesaian",
            dataIndex: "target_date",
            key: "target_date",
            width: 150,
            render: (text, record) => (
                <DatePicker
                    value={text ? dayjs(text) : null}
                    onChange={(date) => handleFieldChange(record.cause_code, "target_date", date ? date.format("YYYY-MM-DD") : "")}
                    disabled={disabled}
                    style={{ width: "100%", borderRadius: 6 }}
                />
            )
        }
    ];

    return (
        <div>
            <Table
                dataSource={activeActions}
                columns={columns}
                rowKey="cause_code"
                pagination={false}
                bordered
                size="middle"
            />
        </div>
    );
}
