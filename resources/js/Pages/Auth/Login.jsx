import { Alert, Button, Checkbox, ConfigProvider, Divider, Form, Input, Typography, Grid, theme as antdTheme } from "antd";
import { Head, useForm } from "@inertiajs/react";
import { LockOutlined, LoginOutlined, MoonOutlined, SafetyCertificateOutlined, SunOutlined, UserOutlined, WindowsOutlined } from "@ant-design/icons";

import TokenManager from "@/Utils/TokenManager";
import axios from "axios";
import { useTheme } from "../../Contexts/ThemeContext";

const { Title, Text, Link } = Typography;
const { useBreakpoint } = Grid;

export default function Login({ status, canResetPassword = true }) {
    const { isDarkMode, toggleTheme } = useTheme();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const handleSubmit = async () => {
        try {
            const response = await axios.post("/api/login", {
                email: data.email,
                password: data.password,
            });
            if (response.data?.authorisation?.token) {
                TokenManager.setToken(response.data.authorisation.token);
            }
        } catch (error) {
            console.error("Gagal mendapatkan JWT token:", error);
        }

        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
                token: {
                    colorPrimary: "#2563eb", // Consistent with user's last preference
                    borderRadius: 8,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
                },
                components: {
                    Input: {
                        controlHeightLG: 48,
                    },
                    Button: {
                        controlHeightLG: 48,
                    }
                }
            }}
        >
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                backgroundColor: isDarkMode ? "#000" : "#f0f2f5",
                transition: "background-color 0.3s ease"
            }}>
                <Head title="Login | OHS Monitoring Kecelakaan" />

                {/* Left Side: Branding & Context (Mining Theme) - Hidden on Mobile */}
                {!isMobile && (
                    <div style={{
                        flex: 1,
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        padding: "60px",
                        overflow: "hidden",
                        backgroundColor: "#001529",
                        backgroundImage: `linear-gradient(135deg, rgba(0, 21, 41, 0.8), rgba(0, 8, 16, 0.95)), url('/images/login_bg_wide.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        color: "#fff"
                    }}>
                        <div style={{ position: "relative", zIndex: 2 }}>
                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "24px",
                                backgroundColor: "rgba(37, 99, 235, 0.1)",
                                padding: "8px 16px",
                                borderRadius: "100px",
                                border: "1px solid rgba(37, 99, 235, 0.3)",
                                backdropFilter: "blur(10px)"
                            }}>
                                <SafetyCertificateOutlined style={{ color: "#3b82f6", fontSize: "18px" }} />
                                <Text style={{ color: "#3b82f6", fontWeight: 600, fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                    Monitoring Kecelakaan System
                                </Text>
                            </div>

                            <Title level={1} style={{ color: "#fff", margin: 0, fontSize: "42px", fontWeight: 800, lineHeight: 1.1 }}>
                                Keamanan Tambang <br />
                                <span style={{ color: "#3b82f6" }}>Prioritas Utama Kami</span>
                            </Title>

                            <Text style={{
                                color: "rgba(255,255,255,0.7)",
                                fontSize: "18px",
                                maxWidth: "540px",
                                display: "block",
                                marginTop: "16px",
                                lineHeight: "1.6"
                            }}>
                                Platform terintegrasi untuk pemantauan keselamatan real-time, manajemen risiko, dan kepatuhan K3LL di seluruh operasional pertambangan.
                            </Text>
                        </div>

                        <div style={{
                            position: "absolute",
                            bottom: 0,
                            right: 0,
                            padding: "40px",
                            textAlign: "right",
                            color: "rgba(255,255,255,0.05)",
                            fontSize: "80px",
                            fontWeight: 900,
                            lineHeight: 0.8,
                            userSelect: "none",
                            pointerEvents: "none"
                        }}>
                            OHS <br /> DEPARTMENT
                        </div>
                    </div>
                )}

                {/* Right Side: Login Form */}
                <div style={{
                    width: isMobile ? "100%" : "560px",
                    minHeight: isMobile ? "100vh" : "auto",
                    backgroundColor: isDarkMode ? "#141414" : "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: isMobile ? "40px 24px" : "80px",
                    position: "relative",
                    transition: "background-color 0.3s ease"
                }}>
                    {/* Theme Toggle Button */}
                    <Button
                        type="text"
                        icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                        onClick={toggleTheme}
                        style={{
                            position: "absolute",
                            top: 24,
                            right: 24,
                            zIndex: 10
                        }}
                    />

                    <div style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
                        <div style={{ marginBottom: "40px" }}>
                            {isMobile && (
                                <div style={{ marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                                    <SafetyCertificateOutlined style={{ color: "#2563eb", fontSize: "24px" }} />
                                    <Text style={{ color: "#2563eb", fontWeight: 800, fontSize: "18px", letterSpacing: "-0.5px" }}>OHS MONITORING</Text>
                                </div>
                            )}
                            <Title level={isMobile ? 3 : 2} style={{ marginBottom: "8px", fontWeight: 700 }}>Selamat Datang Kembali</Title>
                            <Text type="secondary" style={{ fontSize: isMobile ? "14px" : "16px" }}>
                                Masuk ke Portal Monitoring Kecelakaan System untuk akses dashboard keselamatan.
                            </Text>
                        </div>

                        {status && (
                            <Alert
                                message={status}
                                type="success"
                                showIcon
                                style={{ marginBottom: 24 }}
                            />
                        )}

                        <Form
                            layout="vertical"
                            onFinish={handleSubmit}
                            autoComplete="off"
                            size="large"
                        >
                            <Form.Item
                                label="Alamat Email"
                                validateStatus={errors.email ? "error" : ""}
                                help={errors.email}
                                style={{ marginBottom: 20 }}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: isDarkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }} />}
                                    placeholder="nama@perusahaan.com"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Kata Sandi"
                                validateStatus={errors.password ? "error" : ""}
                                help={errors.password}
                                style={{ marginBottom: 12 }}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: isDarkMode ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }} />}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                            </Form.Item>

                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
                                <Checkbox
                                    checked={data.remember}
                                    onChange={(e) => setData("remember", e.target.checked)}
                                >
                                    Ingat saya
                                </Checkbox>
                            </div>

                            <Form.Item style={{ marginBottom: 0 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={processing}
                                    icon={<LoginOutlined />}
                                    style={{
                                        fontWeight: 600,
                                        boxShadow: isDarkMode ? "none" : "0 4px 12px rgba(37, 99, 235, 0.25)",
                                        fontSize: "16px",
                                        height: "48px",
                                        borderRadius: "8px"
                                    }}
                                >
                                    {processing ? "Memproses..." : "Masuk ke Sistem"}
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ marginTop: "24px" }}>
                            <Divider plain style={{ margin: "16px 0", borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)" }}>
                                <Text type="secondary" style={{ fontSize: "12px" }}>Atau masuk dengan</Text>
                            </Divider>

                            <Button
                                block
                                size="large"
                                icon={<WindowsOutlined />}
                                onClick={() => window.location.href = route('azure.login')}
                                style={{
                                    height: "48px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: 500,
                                    borderRadius: "8px",
                                    borderColor: isDarkMode ? "#303030" : "#d9d9d9",
                                    backgroundColor: isDarkMode ? "transparent" : "#fff",
                                    boxShadow: "none"
                                }}
                            >
                                Sign in with Microsoft
                            </Button>
                        </div>

                        <div style={{ marginTop: "40px", textAlign: "center" }}>
                            <Text type="secondary" style={{ fontSize: "14px" }}>
                                Belum memiliki akun? <Link href="#" style={{ color: "#2563eb", fontWeight: 600 }}>Hubungi Admin</Link>
                            </Text>
                        </div>

                        <div style={{
                            marginTop: isMobile ? "40px" : "80px",
                            paddingTop: "24px",
                            borderTop: isDarkMode ? "1px solid #303030" : "1px solid #f0f0f0",
                            display: "flex",
                            justifyContent: "center",
                            gap: "16px"
                        }}>
                            <Text type="secondary" style={{ fontSize: "12px", textAlign: "center" }}>© {new Date().getFullYear()} Monitoring Kecelakaan System</Text>
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
}


