import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, Upload, Typography, Space, Divider, Dropdown, Menu, message } from 'antd';
import { SendOutlined, PaperClipOutlined, FilePdfOutlined, EyeOutlined, UsergroupAddOutlined, DownOutlined } from '@ant-design/icons';
import TokenManager from '@/Utils/TokenManager';
import axios from 'axios';
import { EMAIL_GROUPS as FALLBACK_GROUPS, ALL_RECIPIENTS } from './MasterEmails';

const { Text } = Typography;

export default function SendNotificationModal({ visible, onCancel, onSend, loading, record, isDarkMode }) {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [dbGroups, setDbGroups] = useState([]);

    const defaultBody = `Semangat Pagi,
Bapak/Ibu,

Berikut kami kirimkan 1x Notifikasi Insiden PT Maruwai Coal.
Mohon untuk dikomunikasikan kepada rekan kerja dan mitra kerja di bawah perusahaan dan departemen masing-masing.

Terimakasih,
Salam,
Kepala Teknik Tambang (KTT)`;

    useEffect(() => {
        if (visible) {
            fetchEmailGroups();
        }
    }, [visible]);

    const fetchEmailGroups = async () => {
        try {
            const token = TokenManager.getToken();
            const response = await axios.get('/api/email-groups', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setDbGroups(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch email groups:', error);
            // Fallback will be used if dbGroups is empty
        }
    };

    useEffect(() => {
        if (visible && record) {
            form.setFieldsValue({
                subject: `Notifikasi Insiden: ${record.incident_title || record.accident_number}`,
                body: defaultBody,
                to: [],
                cc: [],
                bcc: []
            });
            setFileList([]);
        }
    }, [visible, record]);

    const handleAddGroup = (groupName, fieldName) => {
        // Try finding in DB groups first, then fallback
        let emails = [];
        const dbGroup = dbGroups.find(g => g.name === groupName);
        
        if (dbGroup) {
            emails = dbGroup.recipients.map(r => r.email);
        } else {
            emails = FALLBACK_GROUPS[groupName] || [];
        }

        const currentValues = form.getFieldValue(fieldName) || [];
        const updatedValues = [...new Set([...currentValues, ...emails])];
        form.setFieldsValue({ [fieldName]: updatedValues });
        message.success(`Berhasil menambahkan ${emails.length} email dari grup ${groupName}`);
    };

    const handlePaste = (e, fieldName) => {
        const pastedText = e.clipboardData.getData('text');
        const emailRegex = /<([^>]+)>|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
        let matches;
        const newEmails = [];
        
        while ((matches = emailRegex.exec(pastedText)) !== null) {
            const email = (matches[1] || matches[2]).trim();
            if (email && !newEmails.includes(email)) {
                newEmails.push(email);
            }
        }

        if (newEmails.length > 0) {
            e.preventDefault();
            const currentValues = form.getFieldValue(fieldName) || [];
            const updatedValues = [...new Set([...currentValues, ...newEmails])];
            form.setFieldsValue({ [fieldName]: updatedValues });
        }
    };

    const handleSend = async () => {
        try {
            const values = await form.validateFields();
            onSend({ ...values, attachments: fileList });
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    const handlePreviewPdf = () => {
        if (!record) return;
        const token = TokenManager.getToken();
        const url = `/api/accident-notification/${record.id}/export-pdf?preview=true&token=${token}`;
        window.open(url, '_blank');
    };

    const labelStyle = { 
        fontSize: 12, 
        fontWeight: 700, 
        color: isDarkMode ? '#94a3b8' : '#64748b',
        marginBottom: 4,
        display: 'block'
    };

    const inputStyle = {
        borderRadius: 8
    };

    const renderGroupMenu = (fieldName) => {
        const groupsToDisplay = dbGroups.length > 0 
            ? dbGroups.map(g => g.name) 
            : Object.keys(FALLBACK_GROUPS);

        return (
            <Menu onClick={({ key }) => handleAddGroup(key, fieldName)}>
                {groupsToDisplay.map(group => (
                    <Menu.Item key={group} icon={<UsergroupAddOutlined />}>
                        Add {group}
                    </Menu.Item>
                ))}
            </Menu>
        );
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px' }}>
                    <div style={{ background: '#3b82f6', padding: 8, borderRadius: 10, display: 'flex' }}>
                        <SendOutlined style={{ color: '#fff', fontSize: 20 }} />
                    </div>
                    <span style={{ fontSize: 18, fontWeight: 900, color: isDarkMode ? '#f8fafc' : '#1e293b' }}>
                        KIRIM NOTIFIKASI EMAIL
                    </span>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel} style={{ borderRadius: 8 }}>
                    Batal
                </Button>,
                <Button 
                    key="send" 
                    type="primary" 
                    icon={<SendOutlined />} 
                    loading={loading}
                    onClick={handleSend}
                    style={{ borderRadius: 8, background: '#3b82f6', padding: '0 24px' }}
                >
                    Kirim Sekarang
                </Button>
            ]}
            width={700}
            centered
            styles={{ 
                header: { padding: 0, borderBottom: `1px solid ${isDarkMode ? '#334155' : '#f1f5f9'}` },
                body: { padding: '24px' }
            }}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label={
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <Space size="middle">
                                <span style={labelStyle}>KEPADA (TO)</span>
                                <Dropdown overlay={renderGroupMenu('to')} trigger={['click']}>
                                    <Button size="small" type="dashed" style={{ fontSize: 10, height: 22, borderRadius: 4 }}>
                                        Quick Add Group <DownOutlined />
                                    </Button>
                                </Dropdown>
                            </Space>
                            <Button 
                                type="link" 
                                size="small" 
                                danger 
                                onClick={() => form.setFieldsValue({ to: [] })}
                                style={{ fontSize: 11, height: 'auto', padding: 0 }}
                            >
                                Clear All
                            </Button>
                        </div>
                    }
                    name="to"
                    rules={[{ required: true, message: 'Masukkan minimal satu email' }]}
                >
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Ketik email atau pilih grup..."
                        tokenSeparators={[',', ';', ' ']}
                        open={undefined} // Let it open for autocomplete
                        onPaste={(e) => handlePaste(e, 'to')}
                        allowClear
                        options={ALL_RECIPIENTS.map(email => ({ label: email, value: email }))}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <Space size="middle">
                                <span style={labelStyle}>CC</span>
                                <Dropdown overlay={renderGroupMenu('cc')} trigger={['click']}>
                                    <Button size="small" type="dashed" style={{ fontSize: 10, height: 22, borderRadius: 4 }}>
                                        Quick Add Group <DownOutlined />
                                    </Button>
                                </Dropdown>
                            </Space>
                            <Button 
                                type="link" 
                                size="small" 
                                danger 
                                onClick={() => form.setFieldsValue({ cc: [] })}
                                style={{ fontSize: 11, height: 'auto', padding: 0 }}
                            >
                                Clear All
                            </Button>
                        </div>
                    }
                    name="cc"
                    style={{ marginBottom: 24 }}
                >
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Email CC..."
                        tokenSeparators={[',', ';', ' ']}
                        onPaste={(e) => handlePaste(e, 'cc')}
                        allowClear
                        options={ALL_RECIPIENTS.map(email => ({ label: email, value: email }))}
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                            <Space size="middle">
                                <span style={labelStyle}>BCC</span>
                                <Dropdown overlay={renderGroupMenu('bcc')} trigger={['click']}>
                                    <Button size="small" type="dashed" style={{ fontSize: 10, height: 22, borderRadius: 4 }}>
                                        Quick Add Group <DownOutlined />
                                    </Button>
                                </Dropdown>
                            </Space>
                            <Button 
                                type="link" 
                                size="small" 
                                danger 
                                onClick={() => form.setFieldsValue({ bcc: [] })}
                                style={{ fontSize: 11, height: 'auto', padding: 0 }}
                            >
                                Clear All
                            </Button>
                        </div>
                    }
                    name="bcc"
                    style={{ marginBottom: 24 }}
                >
                    <Select
                        mode="tags"
                        style={{ width: '100%' }}
                        placeholder="Email BCC..."
                        tokenSeparators={[',', ';', ' ']}
                        onPaste={(e) => handlePaste(e, 'bcc')}
                        allowClear
                        options={ALL_RECIPIENTS.map(email => ({ label: email, value: email }))}
                    />
                </Form.Item>

                <Form.Item
                    name="subject"
                    label={<span style={labelStyle}>SUBJEK</span>}
                    rules={[{ required: true, message: 'Subjek wajib diisi' }]}
                >
                    <Input style={inputStyle} />
                </Form.Item>

                <Form.Item
                    name="body"
                    label={<span style={labelStyle}>ISI PESAN</span>}
                    rules={[{ required: true, message: 'Isi pesan wajib diisi' }]}
                >
                    <Input.TextArea rows={6} style={inputStyle} />
                </Form.Item>

                <Divider style={{ margin: '16px 0' }} />

                <div style={{ marginBottom: 16 }}>
                    <span style={labelStyle}>LAMPIRAN (ATTACHMENTS)</span>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div style={{ 
                            padding: '12px 16px', 
                            background: isDarkMode ? '#1e293b' : '#f8fafc', 
                            borderRadius: 8, 
                            border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Space>
                                <FilePdfOutlined style={{ color: '#ef4444', fontSize: 18 }} />
                                <div>
                                    <div style={{ fontSize: 13, fontWeight: 600 }}>Laporan Notifikasi Insiden.pdf</div>
                                    <div style={{ fontSize: 11, color: '#64748b' }}>Otomatis Terlampir</div>
                                </div>
                            </Space>
                            <Button 
                                type="primary" 
                                size="small" 
                                icon={<EyeOutlined />} 
                                onClick={handlePreviewPdf}
                                style={{ borderRadius: 6, fontSize: 12, background: '#3b82f6' }}
                            >
                                Preview Laporan
                            </Button>
                        </div>

                        <Upload
                            multiple
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            beforeUpload={() => false}
                        >
                            <Button icon={<PaperClipOutlined />} style={{ borderRadius: 8 }}>
                                Tambah Lampiran Lainnya
                            </Button>
                        </Upload>
                    </Space>
                </div>
            </Form>
        </Modal>
    );
}
