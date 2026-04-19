import { Alert, Button, Checkbox, ConfigProvider, Form, Input, Typography, theme as antdTheme } from "antd";
import { Head, useForm } from "@inertiajs/react";
import { LockOutlined, LoginOutlined, MoonOutlined, SafetyCertificateOutlined, SunOutlined, UserOutlined } from "@ant-design/icons";

import TokenManager from "@/Utils/TokenManager";
import axios from "axios";
import { useTheme } from "@/Contexts/ThemeContext";

const { Title, Text, Link } = Typography;

export default function Login({ status, canResetPassword = true }) {
    const { isDarkMode, toggleTheme } = useTheme();
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
                backgroundColor: isDarkMode ? "#000" : "#f0f2f5",
                transition: "background-color 0.3s ease"
            }}>
                <Head title="Login | OHS Monitoring Kecelakaan" />

                {/* Left Side: Branding & Context (Mining Theme) */}
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

                        {/* <div style={{ marginTop: "48px", display: "flex", gap: "24px" }}>
                            <div>
                                <Text style={{ color: "#fff", fontWeight: 700, fontSize: "20px", display: "block" }}>ZERO</Text>
                                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", textTransform: "uppercase" }}>Harm Goal</Text>
                            </div>
                            <div style={{ width: "1px", backgroundColor: "rgba(255,255,255,0.1)" }} />
                            <div>
                                <Text style={{ color: "#fff", fontWeight: 700, fontSize: "20px", display: "block" }}>LIVE</Text>
                                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", textTransform: "uppercase" }}>Data Feed</Text>
                            </div>
                        </div> */}
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

                {/* Right Side: Login Form */}
                <div style={{
                    width: "560px",
                    backgroundColor: isDarkMode ? "#141414" : "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "80px",
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
                            <Title level={2} style={{ marginBottom: "8px", fontWeight: 700 }}>Selamat Datang Kembali</Title>
                            <Text type="secondary" style={{ fontSize: "16px" }}>
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

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    loading={processing}
                                    icon={<LoginOutlined />}
                                    style={{
                                        fontWeight: 600,
                                        boxShadow: isDarkMode ? "none" : "0 4px 12px rgba(37, 99, 235, 0.25)",
                                        fontSize: "16px"
                                    }}
                                >
                                    {processing ? "Memproses..." : "Masuk ke Sistem"}
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ marginTop: "40px", textAlign: "center" }}>
                            <Text type="secondary" style={{ fontSize: "14px" }}>
                                Belum memiliki akun? <Link href="#" style={{ color: "#2563eb", fontWeight: 600 }}>Hubungi Admin</Link>
                            </Text>
                        </div>

                        <div style={{
                            marginTop: "80px",
                            paddingTop: "24px",
                            borderTop: isDarkMode ? "1px solid #303030" : "1px solid #f0f0f0",
                            display: "flex",
                            justifyContent: "space-between",
                            gap: "16px"
                        }}>
                            <Text type="secondary" style={{ fontSize: "12px" }}>© {new Date().getFullYear()} Monitoring Kecelakaan System</Text>
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
}


