import { Button, Modal, Space, Spin } from 'antd';
import { CloseOutlined, DownloadOutlined, FilePdfOutlined, FullscreenOutlined } from '@ant-design/icons';
import React, { useState } from 'react';

import TokenManager from '@/Utils/TokenManager';

export default function PdfPreviewModal({ visible, onCancel, record, onDownload, isDarkMode }) {
    const [loading, setLoading] = useState(true);

    if (!record) return null;

    const token = TokenManager.getToken();
    const previewUrl = `/api/accident-notification/${record.id}/export-pdf?preview=true&token=${token}`;

    return (
        <Modal
            title={
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingRight: 32
                }}>
                    <Space size="middle">
                        <div style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: '#fef2f2',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <FilePdfOutlined style={{ color: '#dc2626', fontSize: 20 }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 16, fontWeight: 900, color: isDarkMode ? '#fff' : '#0f172a', lineHeight: 1.2 }}>
                                Preview PDF Notifikasi Kecelakaan
                            </div>
                            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>
                                {record.accident_number}
                            </div>
                        </div>
                    </Space>
                </div>
            }
            open={visible}
            onCancel={onCancel}
            width="95%"
            style={{ top: 20 }}
            styles={{
                body: {
                    padding: 0,
                    height: 'calc(100vh - 200px)',
                    overflow: 'hidden',
                    position: 'relative',
                    background: '#525659' // Common PDF viewer background
                },
                header: {
                    padding: '16px 24px',
                    borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f1f5f9'
                }
            }}
            footer={[
                <Button key="close" size="large" onClick={onCancel} style={{ borderRadius: 8 }}>
                    Tutup
                </Button>,
                <Button
                    key="download"
                    type="primary"
                    size="large"
                    icon={<DownloadOutlined />}
                    onClick={() => onDownload(record)}
                    style={{
                        background: '#dc2626',
                        borderColor: '#dc2626',
                        borderRadius: 8,
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(220, 38, 38, 0.2)'
                    }}
                >
                    UNDUH PDF
                </Button>
            ]}
            closeIcon={<CloseOutlined style={{ fontSize: 18 }} />}
        >
            {loading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    background: isDarkMode ? '#141414' : '#fff',
                    zIndex: 10
                }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16, color: '#64748b', fontWeight: 600 }}>
                        Menyiapkan Dokumen...
                    </div>
                </div>
            )}
            <iframe
                src={previewUrl}
                style={{ width: '100%', height: '100%', border: 'none' }}
                onLoad={() => setLoading(false)}
                title="PDF Preview"
            />
        </Modal>
    );
}
