import { Avatar, Button, Col, Divider, Form, Input, Modal, Row, Space, Tabs, Typography, message, theme } from "antd";
import { MailOutlined, UserOutlined, LockOutlined, EditOutlined, SafetyCertificateOutlined, CloseOutlined, CameraOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { useTheme } from "@/Contexts/ThemeContext";
import useUser from "../Hooks/useUser";

const { Text, Title } = Typography;

export default function ProfileModal({ visible, onCancel }) {
    const { auth } = usePage().props;
    const { isDarkMode } = useTheme();
    const { token } = theme.useToken();
    const { loading, errors, updateProfile, updatePassword } = useUser();
    
    // Profile Info State
    const [profileData, setProfileData] = useState({
        name: auth.user.name,
        email: auth.user.email,
    });

    // Password State
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        if (visible) {
            setProfileData({
                name: auth.user.name,
                email: auth.user.email,
            });
            setPasswordData({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
        }
    }, [visible, auth.user]);

    const handleUpdateProfile = async () => {
        const result = await updateProfile(profileData);
        if (result.success) {
            // Update the Inertia page state if necessary, or just rely on the API success
            router.reload({ only: ['auth'] });
        }
    };

    const handleChangePassword = async () => {
        const result = await updatePassword(passwordData);
        if (result.success) {
            setPasswordData({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
        }
    };

    const modalStyles = {
        mask: {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
        },
        body: {
            padding: '0',
            overflow: 'hidden',
            borderRadius: '24px',
            background: isDarkMode ? '#1e293b' : '#fff',
        },
        content: {
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        }
    };

    const inputStyle = {
        borderRadius: '12px',
        padding: '10px 16px',
        fontSize: '14px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: `1.5px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
        background: isDarkMode ? '#0f172a' : '#f8fafc',
    };

    const getInitials = (name) => {
        if (!name) return "";
        const parts = name.split(" ");
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return parts[0][0].toUpperCase();
    };

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={580}
            styles={modalStyles}
            centered
            destroyOnHidden
            closeIcon={null}
        >
            <div style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Close Button */}
                <Button 
                    type="text" 
                    icon={<CloseOutlined style={{ color: '#fff' }} />} 
                    onClick={onCancel}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        zIndex: 100,
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        backdropFilter: 'blur(4px)',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                />

                {/* Header Section with Animated Gradient */}
                <div className="profile-header-gradient" style={{
                    height: '160px',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                    }} />
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: '20px'
                    }}>
                         <Title level={4} style={{ color: '#fff', margin: 0, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 4, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                            MY ACCOUNT
                        </Title>
                    </div>
                </div>
                
                {/* Profile Avatar Section */}
                <div style={{
                    marginTop: '-60px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            padding: '6px',
                            background: isDarkMode ? '#1e293b' : '#fff',
                            borderRadius: '50%',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        }}>
                            <Avatar 
                                size={120} 
                                style={{ 
                                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                                    fontSize: 44,
                                    border: 'none',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                                    fontWeight: 900,
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                {getInitials(auth.user.name)}
                            </Avatar>
                        </div>
                        <Button
                            size="small"
                            shape="circle"
                            icon={<CameraOutlined />}
                            style={{
                                position: 'absolute',
                                bottom: '8px',
                                right: '8px',
                                background: '#fff',
                                color: '#4f46e5',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            }}
                        />
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <Title level={3} style={{ margin: 0, color: isDarkMode ? '#fff' : '#1e293b', fontWeight: 800, letterSpacing: '-0.5px' }}>
                            {auth.user.name}
                        </Title>
                        <Text style={{ fontSize: '15px', color: isDarkMode ? '#94a3b8' : '#64748b', fontWeight: 500 }}>
                            {auth.user.email}
                        </Text>
                        <div style={{ marginTop: 12 }}>
                            <span style={{ 
                                padding: '6px 14px', 
                                borderRadius: '100px', 
                                background: isDarkMode ? 'rgba(34, 197, 94, 0.15)' : '#f0fdf4',
                                color: '#22c55e',
                                fontSize: '11px',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                border: `1px solid ${isDarkMode ? 'rgba(34, 197, 94, 0.3)' : '#bbf7d0'}`,
                                display: 'inline-flex',
                                alignItems: 'center'
                            }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', marginRight: 8, display: 'inline-block', boxShadow: '0 0 8px #22c55e' }} />
                                Account Verified
                            </span>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '32px', paddingTop: '16px' }}>
                    <Tabs
                        defaultActiveKey="1"
                        centered
                        className="premium-tabs"
                        items={[
                            {
                                key: '1',
                                label: <span style={{ fontSize: '14px', fontWeight: 700, padding: '0 8px' }}>GENERAL INFO</span>,
                                children: (
                                    <Form 
                                        layout="vertical" 
                                        onFinish={handleUpdateProfile} 
                                        style={{ marginTop: '24px' }}
                                        requiredMark={false}
                                    >
                                        <Form.Item 
                                            label={<span style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#475569' }}>DISPLAY NAME</span>}
                                            validateStatus={errors.name ? 'error' : ''} 
                                            help={errors.name}
                                        >
                                            <Input 
                                                className="premium-input"
                                                size="large"
                                                prefix={<UserOutlined style={{ color: '#6366f1', marginRight: 8 }} />} 
                                                value={profileData.name} 
                                                onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                                placeholder="What should we call you?"
                                                style={inputStyle}
                                            />
                                        </Form.Item>
                                        <Form.Item 
                                            label={<span style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#475569' }}>EMAIL ADDRESS</span>}
                                            validateStatus={errors.email ? 'error' : ''} 
                                            help={errors.email}
                                        >
                                            <Input 
                                                className="premium-input"
                                                size="large"
                                                prefix={<MailOutlined style={{ color: '#6366f1', marginRight: 8 }} />} 
                                                value={profileData.email} 
                                                onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                                placeholder="yourname@example.com"
                                                style={inputStyle}
                                            />
                                        </Form.Item>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={loading} 
                                            icon={<EditOutlined />} 
                                            block 
                                            size="large"
                                            style={{ 
                                                height: 52, 
                                                borderRadius: '16px', 
                                                fontWeight: 800, 
                                                marginTop: 16,
                                                background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)',
                                                border: 'none',
                                                boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
                                                fontSize: '15px'
                                            }}
                                        >
                                            UPDATE PROFILE
                                        </Button>
                                    </Form>
                                ),
                            },
                            {
                                key: '2',
                                label: <span style={{ fontSize: '14px', fontWeight: 700, padding: '0 8px' }}>SECURITY</span>,
                                children: (
                                    <Form 
                                        layout="vertical" 
                                        onFinish={handleChangePassword} 
                                        style={{ marginTop: '24px' }}
                                        requiredMark={false}
                                    >
                                        <Form.Item 
                                            label={<span style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#475569' }}>CURRENT PASSWORD</span>}
                                            validateStatus={errors.current_password ? 'error' : ''} 
                                            help={errors.current_password}
                                        >
                                            <Input.Password 
                                                className="premium-input"
                                                size="large"
                                                prefix={<LockOutlined style={{ color: '#f43f5e', marginRight: 8 }} />} 
                                                value={passwordData.current_password}
                                                onChange={e => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                                placeholder="Confirm current identity"
                                                style={inputStyle}
                                            />
                                        </Form.Item>
                                        <Row gutter={16}>
                                            <Col span={12}>
                                                <Form.Item 
                                                    label={<span style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#475569' }}>NEW PASSWORD</span>}
                                                    validateStatus={errors.password ? 'error' : ''} 
                                                    help={errors.password}
                                                >
                                                    <Input.Password 
                                                        className="premium-input"
                                                        size="large"
                                                        value={passwordData.password}
                                                        onChange={e => setPasswordData({ ...passwordData, password: e.target.value })}
                                                        placeholder="New password"
                                                        style={inputStyle}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={12}>
                                                <Form.Item 
                                                    label={<span style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#cbd5e1' : '#475569' }}>CONFIRM</span>}
                                                    validateStatus={errors.password_confirmation ? 'error' : ''} 
                                                    help={errors.password_confirmation}
                                                >
                                                    <Input.Password 
                                                        className="premium-input"
                                                        size="large"
                                                        value={passwordData.password_confirmation}
                                                        onChange={e => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                                        placeholder="Repeat new"
                                                        style={inputStyle}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={loading} 
                                            block 
                                            size="large"
                                            style={{ 
                                                height: 52, 
                                                borderRadius: '16px', 
                                                fontWeight: 800, 
                                                marginTop: 16,
                                                background: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 100%)',
                                                border: 'none',
                                                boxShadow: '0 10px 15px -3px rgba(244, 63, 94, 0.3)',
                                                fontSize: '15px'
                                            }}
                                        >
                                            CHANGE PASSWORD
                                        </Button>
                                    </Form>
                                ),
                            },
                        ]}
                    />
                </div>
            </div>
            
            <style>{`
                .premium-tabs .ant-tabs-nav::before {
                    border-bottom: 2.5px solid ${isDarkMode ? '#334155' : '#f1f5f9'};
                }
                .premium-tabs .ant-tabs-ink-bar {
                    height: 3px !important;
                    border-radius: 3px 3px 0 0;
                    background: linear-gradient(to right, #4f46e5, #06b6d4) !important;
                }
                .premium-tabs .ant-tabs-tab {
                    padding: 12px 0 !important;
                    transition: all 0.3s !important;
                }
                .premium-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
                    color: #4f46e5 !important;
                }
                .premium-input:focus, .premium-input-focused {
                    border-color: #6366f1 !important;
                    background: ${isDarkMode ? '#0f172a' : '#fff'} !important;
                    box-shadow: 0 0 0 4px ${isDarkMode ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)'} !important;
                }
                @keyframes pulse-ring {
                    0% { transform: scale(0.9); opacity: 0.5; }
                    50% { transform: scale(1); opacity: 0.8; }
                    100% { transform: scale(0.9); opacity: 0.5; }
                }
                .profile-header-gradient::after {
                    content: '';
                    position: absolute;
                    width: 200%;
                    height: 200%;
                    top: -50%;
                    left: -50%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                    animation: rotate 20s linear infinite;
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </Modal>
    );
}
