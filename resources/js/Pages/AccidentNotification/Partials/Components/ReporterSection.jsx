import React, { useState, useEffect, useCallback, useRef } from "react";
import { Form, Input, Select, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import TokenManager from "@/Utils/TokenManager";
import { useTheme } from "@/Contexts/ThemeContext";

export default function ReporterSection({ type = 'reporter', disabled = false }) {
    const form = Form.useFormInstance();
    const { isDarkMode } = useTheme();

    const isReporter = type === 'reporter';
    const title = isReporter ? "PELAPORAN OLEH (REPORTED BY)" : "DIKETAHUI OLEH (APPROVED BY)";
    const nameLabel = isReporter ? "NAMA PELAPOR" : "NAMA APPROVER";
    const posLabel = "JABATAN";
    const prefix = isReporter ? "reporter" : "approver";

    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const timeoutRef = useRef(null);

    const searchEmployees = useCallback(async (searchText) => {
        if (isReporter) return;
        setLoading(true);
        try {
            const token = localStorage.getItem("jwt_token");
            const response = await axios.get('/employees/search', {
                params: { q: searchText || "", can_approve: 1 },
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            if (response.data?.success || response.data?.meta?.status === 'success') {
                const emps = response.data.data || response.data.result || [];
                setOptions(emps.map(emp => ({
                    value: emp.name,
                    label: emp.name,
                    employee: emp,
                    key: emp.id
                })));
            }
        } catch (error) {
            console.error("Employee search error:", error);
        } finally {
            setLoading(false);
        }
    }, [isReporter]);

    useEffect(() => {
        if (!isReporter) {
            searchEmployees("");
        }
    }, [isReporter, searchEmployees]);

    const handleSearch = (value) => {
        if (isReporter) return;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            searchEmployees(value);
        }, 300);
    };

    const handleChange = (val, option) => {
        if (isReporter) return;
        if (!val) {
            form.setFieldsValue({
                [`${prefix}_position`]: '',
                [`${prefix}_id`]: null
            });
            return;
        }

        if (option?.employee) {
            const emp = option.employee;
            form.setFieldsValue({
                [`${prefix}_position`]: emp.jabatan?.name || emp.position || '',
                [`${prefix}_id`]: emp.id
            });
        } else {
            form.setFieldsValue({
                [`${prefix}_id`]: null
            });
        }
    };

    const labelStyle = { 
        fontSize: 11, 
        fontWeight: 800, 
        color: isDarkMode ? '#94a3b8' : '#64748b', 
        textTransform: 'uppercase', 
        letterSpacing: '0.05em' 
    };

    const inputStyle = {
        height: 40,
        borderRadius: 8
    };

    return (
        <div>
            <div style={{ 
                ...labelStyle, 
                color: '#3b82f6', 
                marginBottom: 20, 
                fontSize: 12, 
                borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
                paddingBottom: 8 
            }}>
                {title}
            </div>

            {isReporter ? (
                <Form.Item
                    name={`${prefix}_name`}
                    label={<span style={labelStyle}>{nameLabel}</span>}
                    style={{ marginBottom: 24 }}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <Input 
                        placeholder={`Ketik ${nameLabel.toLowerCase()}...`} 
                        style={inputStyle} 
                        disabled={disabled} 
                    />
                </Form.Item>
            ) : (
                <Form.Item
                    name={`${prefix}_name`}
                    label={<span style={labelStyle}>{nameLabel}</span>}
                    style={{ marginBottom: 24 }}
                    rules={[{ required: true, message: 'Wajib diisi' }]}
                >
                    <Select
                        placeholder={`Cari dari DB Karyawan...`}
                        style={{ width: '100%' }}
                        disabled={disabled}
                        showSearch
                        allowClear
                        filterOption={false}
                        onSearch={handleSearch}
                        onChange={handleChange}
                        onFocus={() => {
                            if (options.length === 0) searchEmployees("");
                        }}
                        loading={loading}
                        options={options}
                        suffixIcon={<SearchOutlined style={{ color: isDarkMode ? '#64748b' : '#94a3b8' }} />}
                        optionRender={(option) => {
                            const emp = option.data.employee;
                            if (!emp) return option.data.label;
                            return (
                                <div style={{ padding: '4px 0' }}>
                                    <div style={{ fontWeight: 700, color: isDarkMode ? '#f8fafc' : '#1e293b', fontSize: 13 }}>
                                        {emp.name}
                                    </div>
                                    <div style={{ fontSize: 11, color: isDarkMode ? '#94a3b8' : '#64748b', marginTop: 2, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                        {emp.nik && (
                                            <span style={{ 
                                                background: isDarkMode ? '#334155' : '#f1f5f9', 
                                                padding: '1px 6px', 
                                                borderRadius: 4, 
                                                fontWeight: 600,
                                                color: isDarkMode ? '#e2e8f0' : '#475569'
                                            }}>
                                                {emp.nik}
                                            </span>
                                        )}
                                        {emp.jabatan?.name && <span style={{ fontWeight: 600 }}>{emp.jabatan.name}</span>}
                                        {emp.department?.name && <span style={{ color: '#3b82f6' }}>• {emp.department.name}</span>}
                                    </div>
                                </div>
                            );
                        }}
                    />
                </Form.Item>
            )}

            <Form.Item
                name={`${prefix}_position`}
                label={<span style={labelStyle}>{posLabel}</span>}
                style={{ marginBottom: 0 }}
            >
                <Input 
                    placeholder={`Ketik ${posLabel.toLowerCase()}...`} 
                    style={inputStyle} 
                    disabled={disabled} 
                />
            </Form.Item>
            
            {/* Clear/store the ID for exact relation linking */}
            <Form.Item name={`${prefix}_id`} noStyle>
                <Input type="hidden" />
            </Form.Item>
        </div>
    );
}
