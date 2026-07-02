import { Card, Statistic, Space } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import { useTheme } from "@/Contexts/ThemeContext";

export default function StatsCard({
    title,
    value,
    prefix,
    suffix,
    icon,
    change,
    changeType = "increase", // 'increase' | 'decrease'
    color = "#1677ff",
    loading = false,
}) {
    const { isDarkMode } = useTheme();

    return (
        <Card
            loading={loading}
            style={{
                borderRadius: 16,
                background: isDarkMode ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                boxShadow: isDarkMode 
                    ? "0 4px 20px rgba(0, 0, 0, 0.3)" 
                    : "0 4px 20px rgba(0, 0, 0, 0.03)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = isDarkMode
                    ? "0 8px 30px rgba(0, 0, 0, 0.5)"
                    : "0 8px 30px rgba(0, 0, 0, 0.08)";
                e.currentTarget.style.transform = "translateY(-4px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = isDarkMode
                    ? "0 4px 20px rgba(0, 0, 0, 0.3)"
                    : "0 4px 20px rgba(0, 0, 0, 0.03)";
                e.currentTarget.style.transform = "translateY(0)";
            }}
            styles={{ body: { padding: "20px 24px" } }}
        >
            <Space
                style={{ width: "100%", justifyContent: "space-between" }}
                align="start"
            >
                <div>
                    <div
                        style={{
                            fontSize: 12,
                            color: isDarkMode ? "#94a3b8" : "#64748b",
                            marginBottom: 8,
                            fontWeight: 600,
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}
                    >
                        {title}
                    </div>
                    <Statistic
                        value={value}
                        prefix={prefix}
                        suffix={suffix}
                        styles={{
                            content: {
                                fontSize: 28,
                                fontWeight: 800,
                                color: isDarkMode ? "#f8fafc" : "#0f172a",
                                lineHeight: 1.2,
                                letterSpacing: '-0.02em'
                            }
                        }}
                    />
                    {change !== undefined && (
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span
                                style={{
                                    fontSize: 13,
                                    color:
                                        changeType === "increase"
                                            ? "#10b981"
                                            : "#ef4444",
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3
                                }}
                            >
                                {changeType === "increase" ? (
                                    <ArrowUpOutlined style={{ fontSize: 11 }} />
                                ) : (
                                    <ArrowDownOutlined style={{ fontSize: 11 }} />
                                )}{" "}
                                {Math.abs(change)}%
                            </span>
                            <span
                                style={{
                                    fontSize: 12,
                                    color: isDarkMode ? "#64748b" : "#94a3b8",
                                    fontWeight: 500
                                }}
                            >
                                vs last month
                            </span>
                        </div>
                    )}
                </div>
                <div
                    style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: `${color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 20,
                        color: color,
                        border: `1px solid ${color}30`
                    }}
                >
                    {icon}
                </div>
            </Space>
        </Card>
    );
}
