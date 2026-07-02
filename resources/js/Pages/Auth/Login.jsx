import { Alert, Button, Checkbox, ConfigProvider, Divider, Form, Input, Typography, Grid, theme as antdTheme } from "antd";
import { Head, useForm } from "@inertiajs/react";
import { LockOutlined, LoginOutlined, MoonOutlined, SunOutlined, UserOutlined, WindowsOutlined } from "@ant-design/icons";

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
                    colorPrimary: "#0F828A",
                    borderRadius: 10,
                    fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
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
                backgroundColor: isDarkMode ? "#012b3d" : "#f8fafc",
                transition: "background-color 0.3s ease"
            }}>
                <Head title="Login | AlamTri AIM-SAFE" />
                {/* Left Side: Branding & Context (AlamTri Theme) - Hidden on Mobile */}
                {!isMobile && (
                    <div style={{
                        flex: 1,
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        padding: "60px",
                        overflow: "hidden",
                        backgroundColor: "#013B52",
                        backgroundImage: `linear-gradient(135deg, #013B52 0%, #0c5766 50%, #0F828A 100%)`,
                        color: "#fff"
                    }}>


                        <div style={{ position: "relative", zIndex: 2 }}>
                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "12px",
                                marginBottom: "24px",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                padding: "8px 18px",
                                borderRadius: "100px",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                backdropFilter: "blur(10px)"
                            }}>
                                {/* Logogram: Leaf / Diamond Shape */}
                                <div style={{
                                    width: 14,
                                    height: 14,
                                    background: "linear-gradient(135deg, #E3E37A 0%, #ABD096 100%)",
                                    transform: "rotate(45deg) scale(0.8)",
                                    borderRadius: "2px"
                                }} />
                                <Text style={{ color: "#ffffff", fontWeight: 700, fontSize: "13px", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                                    AlamTri Safety Portal
                                </Text>
                            </div>

                            <Title level={1} style={{ color: "#fff", margin: 0, fontSize: "40px", fontWeight: 900, lineHeight: 1.15, letterSpacing: "-0.03em" }}>
                                AIM-SAFE System <br />
                                <span style={{ color: "#E3E37A" }}>Sustainable & Safe Future</span>
                            </Title>

                            <Text style={{
                                color: "rgba(255,255,255,0.85)",
                                fontSize: "16px",
                                maxWidth: "500px",
                                display: "block",
                                marginTop: "16px",
                                lineHeight: "1.6",
                                fontWeight: 500
                            }}>
                                Platform terintegrasi pemantauan keselamatan real-time, mitigasi risiko, dan kepatuhan K3LL untuk masa depan operasional yang berkelanjutan.
                            </Text>
                        </div>


                    </div>
                )}


                {/* Right Side: Login Form */}
                <div style={{
                    width: isMobile ? "100%" : "560px",
                    minHeight: isMobile ? "100vh" : "auto",
                    backgroundColor: isDarkMode ? "#02374e" : "#fff",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: isMobile ? "40px 24px" : "80px",
                    position: "relative",
                    transition: "background-color 0.3s ease",
                    borderLeft: isDarkMode ? "1px solid #034561" : "1px solid #e2e8f0"
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
                            zIndex: 10,
                            color: isDarkMode ? "#E3E37A" : "#0F828A"
                        }}
                    />

                    <div style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
                        <div style={{ marginBottom: "40px" }}>
                            {/* Brand Header */}
                            <div style={{ marginBottom: "28px", display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{
                                    width: 20,
                                    height: 20,
                                    background: "linear-gradient(135deg, #0F828A 0%, #005C96 100%)",
                                    transform: "rotate(45deg)",
                                    borderRadius: "3px",
                                    flexShrink: 0
                                }} />
                                <span style={{
                                    color: isDarkMode ? "#ffffff" : "#013B52",
                                    fontWeight: 900,
                                    fontSize: "22px",
                                    letterSpacing: "-0.5px"
                                }}>
                                    Alam<span style={{ color: "#0F828A" }}>Tri</span>
                                </span>
                            </div>
                            <Title level={isMobile ? 3 : 2} style={{ marginBottom: "8px", fontWeight: 800, color: isDarkMode ? "#fff" : "#013B52", letterSpacing: "-0.02em" }}>
                                Selamat Datang Kembali
                            </Title>
                            <Text type="secondary" style={{ fontSize: isMobile ? "14px" : "15px", color: isDarkMode ? "#7EA7B2" : "#475569" }}>
                                Masuk ke Portal AIM-SAFE untuk mengakses dashboard keselamatan kerja.
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
                                label={<span style={{ fontWeight: 700, color: isDarkMode ? "#cbd5e1" : "#013B52" }}>Alamat Email</span>}
                                validateStatus={errors.email ? "error" : ""}
                                help={errors.email}
                                style={{ marginBottom: 20 }}
                            >
                                <Input
                                    prefix={<UserOutlined style={{ color: isDarkMode ? "#7EA7B2" : "#94a3b8" }} />}
                                    placeholder="nama@perusahaan.com"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    style={{ borderRadius: 10, background: isDarkMode ? "#012535" : "#ffffff" }}
                                />
                            </Form.Item>

                            <Form.Item
                                label={<span style={{ fontWeight: 700, color: isDarkMode ? "#cbd5e1" : "#013B52" }}>Kata Sandi</span>}
                                validateStatus={errors.password ? "error" : ""}
                                help={errors.password}
                                style={{ marginBottom: 12 }}
                            >
                                <Input.Password
                                    prefix={<LockOutlined style={{ color: isDarkMode ? "#7EA7B2" : "#94a3b8" }} />}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    style={{ borderRadius: 10, background: isDarkMode ? "#012535" : "#ffffff" }}
                                />
                            </Form.Item>

                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "32px" }}>
                                <Checkbox
                                    checked={data.remember}
                                    onChange={(e) => setData("remember", e.target.checked)}
                                    style={{ color: isDarkMode ? "#cbd5e1" : "#475569" }}
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
                                        fontWeight: 700,
                                        background: "linear-gradient(135deg, #0F828A 0%, #005C96 100%)",
                                        border: "none",
                                        boxShadow: "0 4px 12px rgba(15, 130, 138, 0.3)",
                                        fontSize: "16px",
                                        height: "48px",
                                        borderRadius: "10px"
                                    }}
                                >
                                    {processing ? "Memproses..." : "Masuk ke Sistem"}
                                </Button>
                            </Form.Item>
                        </Form>

                        <div style={{ marginTop: "24px" }}>
                            <Divider plain style={{ margin: "16px 0", borderColor: isDarkMode ? "#034561" : "rgba(0,0,0,0.06)" }}>
                                <Text type="secondary" style={{ fontSize: "12px", color: isDarkMode ? "#7EA7B2" : "#64748b" }}>Atau masuk dengan</Text>
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
                                    fontWeight: 600,
                                    borderRadius: "10px",
                                    borderColor: isDarkMode ? "#034561" : "#d9d9d9",
                                    backgroundColor: isDarkMode ? "transparent" : "#fff",
                                    color: isDarkMode ? "#f8fafc" : "#013B52",
                                    boxShadow: "none"
                                }}
                            >
                                Sign in with Microsoft
                            </Button>
                        </div>

                        <div style={{ marginTop: "40px", textAlign: "center" }}>
                            <Text type="secondary" style={{ fontSize: "14px", color: isDarkMode ? "#7EA7B2" : "#64748b" }}>
                                Belum memiliki akun? <Link href="#" style={{ color: "#0F828A", fontWeight: 700 }}>Hubungi Admin</Link>
                            </Text>
                        </div>

                        <div style={{
                            marginTop: isMobile ? "40px" : "80px",
                            paddingTop: "24px",
                            borderTop: isDarkMode ? "1px solid #034561" : "1px solid #f0f0f0",
                            display: "flex",
                            justifyContent: "center",
                            gap: "16px"
                        }}>
                            <Text type="secondary" style={{ fontSize: "12px", textAlign: "center", color: isDarkMode ? "#7EA7B2" : "#94a3b8" }}>© {new Date().getFullYear()} AlamTri AIM-SAFE System</Text>
                        </div>
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
}


