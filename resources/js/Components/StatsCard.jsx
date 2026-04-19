import { Card, Statistic, Space } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

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
    return (
        <Card
            loading={loading}
            style={{
                borderRadius: 12,
                border: "1px solid #f0f0f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "default",
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(0,0,0,0.1)";
                e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.04)";
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
                            fontSize: 13,
                            color: "#8c8c8c",
                            marginBottom: 8,
                            fontWeight: 500,
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
                                fontWeight: 700,
                                color: "#1a1a1a",
                                lineHeight: 1.2,
                            }
                        }}
                    />
                    {change !== undefined && (
                        <div style={{ marginTop: 8 }}>
                            <span
                                style={{
                                    fontSize: 12,
                                    color:
                                        changeType === "increase"
                                            ? "#52c41a"
                                            : "#ff4d4f",
                                    fontWeight: 600,
                                }}
                            >
                                {changeType === "increase" ? (
                                    <ArrowUpOutlined />
                                ) : (
                                    <ArrowDownOutlined />
                                )}{" "}
                                {change}%
                            </span>
                            <span
                                style={{
                                    fontSize: 12,
                                    color: "#bfbfbf",
                                    marginLeft: 6,
                                }}
                            >
                                vs last month
                            </span>
                        </div>
                    )}
                </div>
                <div
                    style={{
                        width: 52,
                        height: 52,
                        borderRadius: 12,
                        background: `${color}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: 22,
                        color: color,
                    }}
                >
                    {icon}
                </div>
            </Space>
        </Card>
    );
}
