import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { 
    Card, Row, Col, Typography, Tag, Descriptions, 
    Button, Input, Space, Divider, Alert, Result,
    Modal, message
} from 'antd';
import { 
    CheckCircleOutlined, 
    RollbackOutlined, 
    SafetyCertificateOutlined,
    ClockCircleOutlined,
    ExclamationCircleOutlined,
    LockOutlined,
    UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export default function AccidentApproval({ accident }) {
    const [isVerified, setIsVerified] = useState(false);
    const [verifier, setVerifier] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [actionType, setActionType] = useState(null); // 'approve' or 'return'

    const { data, setData, post, processing, errors, reset } = useForm({
        verifier: '',
        comment: '',
    });

    const handleVerify = () => {
        if (!verifier) {
            message.error('Silakan masukkan NIK atau Email Anda');
            return;
        }
        setData('verifier', verifier);
        setIsVerified(true);
    };

    const submitAction = () => {
        const url = actionType === 'approve' 
            ? `/public/approve/${accident.uuid}` 
            : `/public/return/${accident.uuid}`;

        post(url, {
            onSuccess: () => {
                setShowConfirm(false);
                reset('comment');
                message.success(actionType === 'approve' ? 'Laporan disetujui' : 'Laporan dikembalikan');
            },
            onError: (err) => {
                if (err.verifier) {
                    setIsVerified(false);
                    message.error(err.verifier);
                }
            }
        });
    };

    const getStatusStyle = (status) => {
        const name = status?.name?.toLowerCase() || '';
        if (name.includes('approved')) return { color: 'success', icon: <CheckCircleOutlined /> };
        if (name.includes('submitted')) return { color: 'processing', icon: <ClockCircleOutlined /> };
        if (name.includes('return')) return { color: 'warning', icon: <RollbackOutlined /> };
        return { color: 'default', icon: <ClockCircleOutlined /> };
    };

    const statusStyle = getStatusStyle(accident.status);

    if (accident.status_id == 7 || accident.status_id == 8) {
        const isApproved = accident.status_id == 7;
        return (
            <div style={{ minHeight: '100vh', background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                <Head title={isApproved ? "Approval Selesai" : "Laporan Dikembalikan"} />
                <Card style={{ maxWidth: 600, width: '100%', borderRadius: 16, boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                    <Result
                        status={isApproved ? "success" : "warning"}
                        title={isApproved ? "Laporan Sudah Disetujui" : "Laporan Sudah Dikembalikan"}
                        subTitle={isApproved 
                            ? `Laporan ${accident.notification_number} telah disetujui sebelumnya.` 
                            : `Laporan ${accident.notification_number} telah dikembalikan untuk revisi.`
                        }
                        extra={[
                            <Button type="primary" key="close" onClick={() => window.close()} size="large" style={{ borderRadius: 8 }}>
                                Tutup Halaman
                            </Button>
                        ]}
                    />
                </Card>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px' }}>
            <Head title={`Approval - ${accident.notification_number}`} />
            
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ marginBottom: 32, textAlign: 'center' }}>
                    <SafetyCertificateOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
                    <Title level={2} style={{ margin: 0 }}>Approval Notifikasi Kecelakaan</Title>
                    <Text type="secondary">Silakan tinjau detail laporan di bawah ini sebelum memberikan keputusan.</Text>
                </div>

                <Row gutter={[24, 24]}>
                    {/* Left: Detail Section */}
                    <Col xs={24} lg={16}>
                        <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                                <div>
                                    <Text type="secondary" style={{ fontSize: 12, fontWeight: 700 }}>NOMOR NOTIFIKASI</Text>
                                    <Title level={4} style={{ margin: 0 }}>{accident.notification_number}</Title>
                                </div>
                                <Tag color={statusStyle.color} icon={statusStyle.icon} style={{ padding: '4px 12px', borderRadius: 20, fontWeight: 600 }}>
                                    {accident.status?.name?.toUpperCase()}
                                </Tag>
                            </div>

                            <Divider style={{ margin: '16px 0' }} />

                            <Descriptions column={{ xs: 1, sm: 2 }} bordered={false}>
                                <Descriptions.Item label="Tanggal Kejadian">
                                    {dayjs(accident.incident_date).format('DD MMM YYYY')}
                                </Descriptions.Item>
                                <Descriptions.Item label="Waktu">
                                    {accident.incident_time}
                                </Descriptions.Item>
                                <Descriptions.Item label="Lokasi">
                                    {accident.location?.name || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Departemen">
                                    {accident.department?.name || '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label="Tipe Insiden" span={2}>
                                    {accident.incident_type?.category || '-'}
                                </Descriptions.Item>
                            </Descriptions>

                            <Divider orientation="left" plain>KRONOLOGI SINGKAT</Divider>
                            <Paragraph style={{ background: '#f1f5f9', padding: 20, borderRadius: 12, minHeight: 100 }}>
                                {accident.chronology || 'Tidak ada uraian kronologi.'}
                            </Paragraph>

                            <Descriptions column={1}>
                                <Descriptions.Item label="Reporter">
                                    <Space>
                                        <Text strong>{accident.reporter_name}</Text>
                                        <Text type="secondary">({accident.reporter_position})</Text>
                                    </Space>
                                </Descriptions.Item>
                                <Descriptions.Item label="Approver">
                                    <Text strong>{accident.approver?.name || accident.approver_name}</Text>
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>

                    {/* Right: Action Section */}
                    <Col xs={24} lg={8}>
                        {!isVerified ? (
                            <Card 
                                title={<Space><LockOutlined /> Verifikasi Identitas</Space>}
                                style={{ borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0' }}
                            >
                                <Paragraph type="secondary" style={{ fontSize: 13 }}>
                                    Masukkan NIK atau Email Anda untuk memverifikasi hak akses approval.
                                </Paragraph>
                                <Space direction="vertical" style={{ width: '100%' }}>
                                    <Input 
                                        prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                                        placeholder="NIK atau Email" 
                                        size="large"
                                        value={verifier}
                                        onChange={e => setVerifier(e.target.value)}
                                        onPressEnter={handleVerify}
                                    />
                                    <Button type="primary" block size="large" onClick={handleVerify} style={{ borderRadius: 8, height: 45 }}>
                                        Verifikasi
                                    </Button>
                                </Space>
                            </Card>
                        ) : (
                            <Card 
                                title={<Space><CheckCircleOutlined /> Keputusan Approval</Space>}
                                style={{ borderRadius: 16, boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #1677ff' }}
                            >
                                <Paragraph type="secondary" style={{ fontSize: 13 }}>
                                    Anda memverifikasi sebagai: <br />
                                    <Text strong style={{ color: '#1677ff' }}>{verifier}</Text>
                                </Paragraph>
                                
                                <Divider style={{ margin: '12px 0' }} />

                                <Space direction="vertical" style={{ width: '100%' }} size="large">
                                    <div>
                                        <Text strong style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>CATATAN (OPSIONAL)</Text>
                                        <Input.TextArea 
                                            placeholder="Berikan alasan jika diperlukan..." 
                                            rows={4}
                                            value={data.comment}
                                            onChange={e => setData('comment', e.target.value)}
                                            style={{ borderRadius: 8 }}
                                        />
                                    </div>

                                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                        <Button 
                                            type="primary" 
                                            block 
                                            size="large" 
                                            icon={<CheckCircleOutlined />}
                                            onClick={() => { setActionType('approve'); setShowConfirm(true); }}
                                            style={{ height: 50, borderRadius: 10, background: '#10b981', border: 'none', fontWeight: 600 }}
                                        >
                                            SETUJUI LAPORAN
                                        </Button>
                                        <Button 
                                            block 
                                            size="large" 
                                            icon={<RollbackOutlined />}
                                            onClick={() => { setActionType('return'); setShowConfirm(true); }}
                                            style={{ height: 50, borderRadius: 10, fontWeight: 600 }}
                                            danger
                                        >
                                            KEMBALIKAN (REVISI)
                                        </Button>
                                    </Space>
                                    
                                    <Button type="link" block onClick={() => setIsVerified(false)} style={{ fontSize: 12 }}>
                                        Bukan saya? Verifikasi ulang
                                    </Button>
                                </Space>
                            </Card>
                        )}

                        <div style={{ marginTop: 24 }}>
                            <Alert
                                message="Penting"
                                description="Pastikan Anda telah memeriksa kebenaran data kronologi dan tipe insiden sebelum menyetujui."
                                type="info"
                                showIcon
                                style={{ borderRadius: 12 }}
                            />
                        </div>
                    </Col>
                </Row>
            </div>

            {/* Confirmation Modal */}
            <Modal
                title={actionType === 'approve' ? 'Konfirmasi Persetujuan' : 'Konfirmasi Pengembalian'}
                open={showConfirm}
                onOk={submitAction}
                confirmLoading={processing}
                onCancel={() => setShowConfirm(false)}
                okText="Ya, Lanjutkan"
                cancelText="Batal"
                okButtonProps={{ 
                    style: { borderRadius: 6, height: 40 },
                    danger: actionType === 'return' 
                }}
                cancelButtonProps={{ style: { borderRadius: 6, height: 40 } }}
            >
                <div style={{ padding: '10px 0' }}>
                    {actionType === 'approve' ? (
                        <p>Apakah Anda yakin ingin <strong>Menyetujui</strong> laporan kecelakaan ini?</p>
                    ) : (
                        <p>Apakah Anda yakin ingin <strong>Mengembalikan</strong> laporan ini untuk diperbaiki oleh pelapor?</p>
                    )}
                    {data.comment && (
                        <div style={{ marginTop: 12, background: '#f8fafc', padding: 12, borderRadius: 8 }}>
                            <Text type="secondary" style={{ fontSize: 12 }}>Catatan Anda:</Text>
                            <Paragraph style={{ margin: 0 }}>{data.comment}</Paragraph>
                        </div>
                    ) }
                </div>
            </Modal>
        </div>
    );
}
