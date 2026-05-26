import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Table, Card, Button, Tag, Space, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import axios from 'axios';

const { Option } = Select;
const { TextArea } = Input;

export default function PicaIndex({ auth }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPica, setEditingPica] = useState(null);
    const [form] = Form.useForm();
    const [investigations, setInvestigations] = useState([]);

    useEffect(() => {
        fetchData();
        fetchInvestigations();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/pica');
            setData(response.data.data);
        } catch (error) {
            message.error('Gagal mengambil data PICA');
        } finally {
            setLoading(false);
        }
    };

    const fetchInvestigations = async () => {
        try {
            const response = await axios.get('/api/investigation-report');
            setInvestigations(response.data.data.data || []);
        } catch (error) {
            console.error('Error fetching investigations:', error);
        }
    };

    const handleAdd = () => {
        setEditingPica(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingPica(record);
        form.setFieldsValue({
            ...record,
            due_date: record.due_date ? dayjs(record.due_date) : null,
        });
        setIsModalVisible(true);
    };

    const handleDelete = async (id) => {
        Modal.confirm({
            title: 'Apakah Anda yakin ingin menghapus PICA ini?',
            onOk: async () => {
                try {
                    await axios.delete(`/api/pica/${id}`);
                    message.success('PICA berhasil dihapus');
                    fetchData();
                } catch (error) {
                    message.error('Gagal menghapus PICA');
                }
            }
        });
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                ...values,
                due_date: values.due_date ? values.due_date.format('YYYY-MM-DD') : null,
            };

            if (editingPica) {
                await axios.put(`/api/pica/${editingPica.id}`, payload);
                message.success('PICA berhasil diperbarui');
            } else {
                await axios.post('/api/pica', payload);
                message.success('PICA berhasil ditambahkan');
            }

            setIsModalVisible(false);
            fetchData();
        } catch (error) {
            message.error(error.response?.data?.message || 'Terjadi kesalahan');
        }
    };

    const columns = [
        {
            title: 'LPKS/LPKL',
            dataIndex: ['investigation_report', 'report_number'],
            key: 'report_number',
        },
        {
            title: 'Problem Identification',
            dataIndex: 'problem_identification',
            key: 'problem_identification',
        },
        {
            title: 'Corrective Action',
            dataIndex: 'corrective_action',
            key: 'corrective_action',
        },
        {
            title: 'PIC',
            dataIndex: 'pic',
            key: 'pic',
        },
        {
            title: 'Due Date',
            dataIndex: 'due_date',
            key: 'due_date',
            render: (text) => text ? dayjs(text).format('DD MMM YYYY') : '-',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = status === 'Closed' ? 'green' : (status === 'In Progress' ? 'blue' : 'orange');
                return <Tag color={color}>{status}</Tag>;
            }
        },
        {
            title: 'Aksi',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small" />
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} size="small" />
                </Space>
            ),
        },
    ];

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Problem Identification & Corrective Action (PICA)</h2>}>
            <Head title="PICA Module" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card 
                        title="Daftar PICA" 
                        extra={<Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>Tambah PICA</Button>}
                    >
                        <Table 
                            columns={columns} 
                            dataSource={data} 
                            rowKey="id" 
                            loading={loading}
                        />
                    </Card>
                </div>
            </div>

            <Modal
                title={editingPica ? "Edit PICA" : "Tambah PICA"}
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                onOk={() => form.submit()}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        name="analisa_kecelakaan_id"
                        label="Laporan Penyelidikan"
                        rules={[{ required: true, message: 'Harap pilih laporan penyelidikan!' }]}
                    >
                        <Select placeholder="Pilih Laporan">
                            {investigations.map(inv => (
                                <Option key={inv.id} value={inv.id}>{inv.report_number}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="problem_identification"
                        label="Identifikasi Masalah"
                        rules={[{ required: true, message: 'Harap isi identifikasi masalah!' }]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="corrective_action"
                        label="Tindakan Perbaikan (Corrective Action)"
                        rules={[{ required: true, message: 'Harap isi tindakan perbaikan!' }]}
                    >
                        <TextArea rows={3} />
                    </Form.Item>

                    <Form.Item
                        name="pic"
                        label="Person In Charge (PIC)"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="due_date"
                        label="Tenggat Waktu (Due Date)"
                    >
                        <DatePicker className="w-full" />
                    </Form.Item>

                    <Form.Item
                        name="status"
                        label="Status"
                        initialValue="Open"
                    >
                        <Select>
                            <Option value="Open">Open</Option>
                            <Option value="In Progress">In Progress</Option>
                            <Option value="Closed">Closed</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </AuthenticatedLayout>
    );
}
