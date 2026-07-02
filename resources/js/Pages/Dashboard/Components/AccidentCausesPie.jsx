import React from "react";
import { Card, Empty } from "antd";
import { PieChartOutlined } from "@ant-design/icons";
import { Doughnut } from "react-chartjs-2";

export default function AccidentCausesPie({ data = {}, isDarkMode }) {
    const cardBg = isDarkMode ? "#1e293b" : "#ffffff";
    const cardBorder = isDarkMode ? "1px solid #334155" : "1px solid #f0f0f0";
    const labelColor = isDarkMode ? "#f8fafc" : "#1e293b";
    const secondaryTextColor = isDarkMode ? "#94a3b8" : "#64748b";

    const usa = data.unsafe_acts || 0;
    const jf = data.job_factors || 0;
    const usc = data.unsafe_conditions || 0;
    const pf = data.personal_factors || 0;
    const total = usa + jf + usc + pf;

    const usaPct = total > 0 ? Math.round((usa / total) * 100) : 0;
    const jfPct = total > 0 ? Math.round((jf / total) * 100) : 0;
    const uscPct = total > 0 ? Math.round((usc / total) * 100) : 0;
    const pfPct = total > 0 ? Math.round((pf / total) * 100) : 0;

    const chartData = {
        labels: [
            "Tindakan Tidak Aman (USA)",
            "Faktor Pekerjaan (JF)",
            "Kondisi Tidak Aman (USC)",
            "Faktor Pribadi (PF)"
        ],
        datasets: [{
            data: [usa, jf, usc, pf],
            backgroundColor: ["#ef4444", "#3b82f6", "#a855f7", "#10b981"],
            borderColor: isDarkMode ? '#1e293b' : '#ffffff',
            borderWidth: 2,
            hoverOffset: 6,
            cutout: '75%'
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: isDarkMode ? '#0f172a' : '#ffffff',
                titleColor: isDarkMode ? '#f8fafc' : '#0f172a',
                bodyColor: isDarkMode ? '#cbd5e1' : '#334155',
                borderColor: isDarkMode ? '#334155' : '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                cornerRadius: 8,
                callbacks: {
                    label: function (context) {
                        const label = context.label || '';
                        const val = context.raw || 0;
                        const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                        return ` ${label}: ${val} (${pct}%)`;
                    }
                }
            }
        }
    };

    return (
        <Card
            title={
                <span style={{ fontWeight: 800, fontSize: 14, color: labelColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <PieChartOutlined style={{ marginRight: 8, color: '#f59e0b' }} />
                    PENYEBAB KECELAKAAN
                </span>
            }
            style={{
                background: cardBg,
                border: cardBorder,
                borderRadius: 20,
                boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)",
                marginBottom: 24,
                height: 420
            }}
            styles={{ body: { padding: 24 } }}
        >
            {total > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ position: 'relative', width: 200, height: 200, margin: '10px auto' }}>
                        <Doughnut data={chartData} options={options} />
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            pointerEvents: 'none'
                        }}>
                            <div style={{ fontSize: 32, fontWeight: 900, color: labelColor, lineHeight: 1 }}>
                                {total}
                            </div>
                            <div style={{ fontSize: 10, fontWeight: 800, color: secondaryTextColor, letterSpacing: '0.1em', marginTop: 4 }}>
                                TOTAL
                            </div>
                        </div>
                    </div>

                    {/* Custom Legend */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 12,
                        width: '100%',
                        marginTop: 16,
                        padding: '0 4px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', marginTop: 5, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: labelColor, lineHeight: 1.2 }}>
                                    USA: {usa}
                                </div>
                                <div style={{ fontSize: 10, fontWeight: 600, color: secondaryTextColor }}>
                                    ({usaPct}%)
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', marginTop: 5, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: labelColor, lineHeight: 1.2 }}>
                                    JF: {jf}
                                </div>
                                <div style={{ fontSize: 10, fontWeight: 600, color: secondaryTextColor }}>
                                    ({jfPct}%)
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a855f7', marginTop: 5, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: labelColor, lineHeight: 1.2 }}>
                                    USC: {usc}
                                </div>
                                <div style={{ fontSize: 10, fontWeight: 600, color: secondaryTextColor }}>
                                    ({uscPct}%)
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', marginTop: 5, flexShrink: 0 }} />
                            <div>
                                <div style={{ fontSize: 11, fontWeight: 700, color: labelColor, lineHeight: 1.2 }}>
                                    PF: {pf}
                                </div>
                                <div style={{ fontSize: 10, fontWeight: 600, color: secondaryTextColor }}>
                                    ({pfPct}%)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Empty description="Belum ada data penyebab kecelakaan" style={{ paddingTop: 80 }} />
            )}
        </Card>
    );
}
