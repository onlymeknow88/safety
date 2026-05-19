import React from "react";
import { Button, Input, DatePicker, Select, Table, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function PicaIntegration({ correctiveActions, setCorrectiveActions, disabled, isDarkMode }) {
    const handleAddRow = () => {
        setCorrectiveActions([
            ...correctiveActions,
            { action: "", pic: "", target_date: "", status: "Open" }
        ]);
    };

    const handleDeleteRow = (index) => {
        const list = [...correctiveActions];
        list.splice(index, 1);
        setCorrectiveActions(list);
    };

    const handleFieldChange = (index, field, value) => {
        const list = [...correctiveActions];
        list[index][field] = value;
        setCorrectiveActions(list);
    };

    const columns = [
        {
            title: "#",
            key: "index",
            width: 50,
            render: (_, __, index) => index + 1
        },
        {
            title: "RENCANA TINDAKAN PERBAIKAN (ACTION PLAN)",
            dataIndex: "action",
            key: "action",
            render: (text, _, index) => (
                <Input.TextArea
                    rows={1}
                    value={text}
                    onChange={(e) => handleFieldChange(index, "action", e.target.value)}
                    placeholder="Masukkan detail tindakan perbaikan..."
                    disabled={disabled}
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    style={{ borderRadius: 6 }}
                />
            )
        },
        {
            title: "PIC (PENANGGUNG JAWAB)",
            dataIndex: "pic",
            key: "pic",
            width: 220,
            render: (text, _, index) => (
                <Input
                    value={text}
                    onChange={(e) => handleFieldChange(index, "pic", e.target.value)}
                    placeholder="Nama PIC / Jabatan"
                    disabled={disabled}
                    style={{ borderRadius: 6 }}
                />
            )
        },
        {
            title: "TARGET DATE",
            dataIndex: "target_date",
            key: "target_date",
            width: 180,
            render: (text, _, index) => (
                <DatePicker
                    value={text ? dayjs(text) : null}
                    onChange={(date) => handleFieldChange(index, "target_date", date ? date.format("YYYY-MM-DD") : "")}
                    disabled={disabled}
                    style={{ width: "100%", borderRadius: 6 }}
                />
            )
        },
        {
            title: "STATUS",
            dataIndex: "status",
            key: "status",
            width: 140,
            render: (text, _, index) => (
                <Select
                    value={text || "Open"}
                    onChange={(value) => handleFieldChange(index, "status", value)}
                    disabled={disabled}
                    style={{ width: "100%" }}
                    options={[
                        { label: "OPEN", value: "Open" },
                        { label: "CLOSED", value: "Closed" }
                    ]}
                />
            )
        },
        {
            title: "AKSI",
            key: "delete",
            width: 70,
            render: (_, __, index) => (
                <Button
                    danger
                    type="primary"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteRow(index)}
                    disabled={disabled}
                />
            )
        }
    ];

    // Filter columns for view-only/disabled mode (hide action column if disabled)
    const filteredColumns = disabled ? columns.filter(c => c.key !== "delete") : columns;

    return (
        <div>
            <Table
                dataSource={correctiveActions}
                columns={filteredColumns}
                rowKey={(_, index) => index}
                pagination={false}
                bordered
                size="middle"
                style={{ marginBottom: 16 }}
            />
            {!disabled && (
                <Button
                    type="dashed"
                    onClick={handleAddRow}
                    block
                    icon={<PlusOutlined />}
                    style={{
                        borderRadius: 8,
                        height: 40,
                        borderStyle: "dashed",
                        borderColor: isDarkMode ? "#3b82f6" : "#2563eb",
                        color: isDarkMode ? "#3b82f6" : "#2563eb",
                        fontWeight: 700
                    }}
                >
                    Tambah Rencana Tindakan Perbaikan (PICA)
                </Button>
            )}
        </div>
    );
}
