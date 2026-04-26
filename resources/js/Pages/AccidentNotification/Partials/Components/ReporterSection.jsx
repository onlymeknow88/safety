import React, { useState, useEffect } from "react";
import { Form, Input, Select, Spin } from "antd";
import axios from "axios";

export default function ReporterSection({ type = 'reporter' }) {
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const form = Form.useFormInstance();

    const isReporter = type === 'reporter';
    const title = isReporter ? "PELAPORAN OLEH (REPORTED BY)" : "DIKETAHUI OLEH (APPROVED BY)";
    const nameLabel = isReporter ? "NAMA PELAPOR" : "NAMA APPROVER";
    const posLabel = "JABATAN";
    const prefix = isReporter ? "reporter" : "approver";

    const fetchEmployees = async (query) => {
        if (!query || query.length < 2) return;
        setLoading(true);
        try {
            const url = isReporter ? `/employees/search?q=${query}` : `/employees/search?q=${query}&can_approve=1`;
            const response = await axios.get(url);
            const data = response.data.result.map(emp => ({
                label: `${emp.name} (${emp.nik})`,
                value: emp.name, // We store the name in the notification table as per current schema
                position: emp.jabatan?.name || 'N/A'
            }));
            setOptions(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (value, option) => {
        // Auto-fill the position field
        form.setFieldsValue({
            [`${prefix}_position`]: option.position
        });
    };

    return (
        <div>
            <div style={{ marginBottom: 16, fontWeight: 800, fontSize: 13, color: '#64748b', letterSpacing: 0.5 }}>
                {title}
            </div>
            <Form.Item
                name={`${prefix}_name`}
                label={<span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>{nameLabel}</span>}
                style={{ marginBottom: 12 }}
                rules={[{ required: true, message: 'Wajib diisi' }]}
            >
                <Select
                    showSearch
                    placeholder="Ketik nama atau NIK..."
                    defaultActiveFirstOption={false}
                    suffixIcon={null}
                    filterOption={false}
                    onSearch={fetchEmployees}
                    onSelect={handleSelect}
                    notFoundContent={loading ? <Spin size="small" /> : null}
                    options={options}
                    style={{ borderRadius: 6 }}
                />
            </Form.Item>
            <Form.Item
                name={`${prefix}_position`}
                label={<span style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>{posLabel}</span>}
                style={{ marginBottom: 0 }}
            >
                <Input placeholder="Jabatan akan terisi otomatis" style={{ borderRadius: 6, padding: '8px 12px' }} />
            </Form.Item>
        </div>
    );
}
