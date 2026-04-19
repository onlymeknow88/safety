import React from "react";
import { Modal, Button, Typography, Space } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const { Text, Title } = Typography;

export default function DeleteConfirmModal({ 
    visible, 
    onCancel, 
    onConfirm, 
    title = "Confirm Delete", 
    message = "Are you sure you want to delete this item? This action cannot be undone.",
    loading = false 
}) {
    return (
        <Modal
            open={visible}
            onCancel={onCancel}
            footer={null}
            centered
            width={400}
            styles={{
                content: { borderRadius: "16px", padding: "24px" }
            }}
            closable={false}
        >
            <div style={{ textAlign: "center" }}>
                <ExclamationCircleFilled style={{ fontSize: 48, color: "#ff4d4f", marginBottom: 16 }} />
                <Title level={4} style={{ marginBottom: 8 }}>{title}</Title>
                <Text type="secondary" style={{ display: "block", marginBottom: 24 }}>
                    {message}
                </Text>
                
                <Space size="middle" style={{ width: "100%", justifyContent: "center" }}>
                    <Button 
                        onClick={onCancel} 
                        style={{ borderRadius: 8, height: 40, padding: "0 24px" }}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button 
                        danger 
                        type="primary" 
                        onClick={onConfirm} 
                        loading={loading}
                        style={{ borderRadius: 8, height: 40, padding: "0 24px" }}
                    >
                        Yes, Delete
                    </Button>
                </Space>
            </div>
        </Modal>
    );
}
