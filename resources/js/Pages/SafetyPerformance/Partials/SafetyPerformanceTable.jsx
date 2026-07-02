import React from "react";
import { Card, Table } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";

export default function SafetyPerformanceTable({
    kpiData,
    columns,
    totals,
    lastSynced,
    isDarkMode,
    cardStyle
}) {
    return (
        <Card 
            title={
                <div className="flex justify-between items-center w-full">
                    <span style={{ fontWeight: 800, color: isDarkMode ? "#fff" : "#1e293b" }}>
                        Tabel Rincian Data Kinerja Keselamatan 12 Bulan
                    </span>
                    {lastSynced && (
                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                            <ClockCircleOutlined /> Last Synced: {lastSynced}
                        </span>
                    )}
                </div>
            }
            style={cardStyle}
        >
            <Table
                columns={columns}
                dataSource={kpiData}
                rowKey="bulan"
                pagination={false}
                scroll={{ x: 1800 }}
                bordered
                summary={() => (
                    <Table.Summary fixed>
                        <Table.Summary.Row className="bg-slate-100 dark:bg-slate-800/80 font-bold">
                            <Table.Summary.Cell index={0} fixed="left">Total / Akhir</Table.Summary.Cell>
                            <Table.Summary.Cell index={1}>{totals.karyawan_amc.toLocaleString()}</Table.Summary.Cell>
                            <Table.Summary.Cell index={2}>{totals.karyawan_mitra.toLocaleString()}</Table.Summary.Cell>
                            <Table.Summary.Cell index={3}>{totals.total_karyawan.toLocaleString()}</Table.Summary.Cell>
                            <Table.Summary.Cell index={4}>{Math.round(totals.manhour_amc).toLocaleString()}</Table.Summary.Cell>
                            <Table.Summary.Cell index={5}>{Math.round(totals.manhour_mitra).toLocaleString()}</Table.Summary.Cell>
                            <Table.Summary.Cell index={6}>{Math.round(totals.jam_kerja_bulanan).toLocaleString()}</Table.Summary.Cell>
                            <Table.Summary.Cell index={7}>{Math.round(totals.jam_kerja_kumulatif).toLocaleString()}</Table.Summary.Cell>
                            <Table.Summary.Cell index={8} className="text-red-500">{totals.count_all_incident}</Table.Summary.Cell>
                            <Table.Summary.Cell index={9}>{totals.count_fai}</Table.Summary.Cell>
                            <Table.Summary.Cell index={10}>{totals.count_mti}</Table.Summary.Cell>
                            <Table.Summary.Cell index={11}>{totals.total_fai_mti}</Table.Summary.Cell>
                            <Table.Summary.Cell index={12}>{totals.cidera_ringan}</Table.Summary.Cell>
                            <Table.Summary.Cell index={13}>{totals.cidera_berat}</Table.Summary.Cell>
                            <Table.Summary.Cell index={14}>{totals.mati}</Table.Summary.Cell>
                            <Table.Summary.Cell index={15}>{totals.total_kec_tambang}</Table.Summary.Cell>
                            <Table.Summary.Cell index={16}>{totals.hari_hilang}</Table.Summary.Cell>
                            <Table.Summary.Cell index={17}>{totals.hari_hilang_ytd}</Table.Summary.Cell>
                            <Table.Summary.Cell index={18}>{totals.hpri}</Table.Summary.Cell>
                            <Table.Summary.Cell index={19}>{totals.non_hpri}</Table.Summary.Cell>
                            <Table.Summary.Cell index={20}>{totals.lingkungan_minor}</Table.Summary.Cell>
                            <Table.Summary.Cell index={21}>{totals.lingkungan_mayor}</Table.Summary.Cell>
                            <Table.Summary.Cell index={22}>{totals.lingkungan_kritikal}</Table.Summary.Cell>
                            
                            {/* rates: render YTD values or averages */}
                            <Table.Summary.Cell index={23}>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={24} className="text-blue-600">{totals.ytd_aifr}</Table.Summary.Cell>
                            <Table.Summary.Cell index={25}>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={26}>{totals.ytd_all_injury_fr}</Table.Summary.Cell>
                            <Table.Summary.Cell index={27}>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={28}>{totals.ytd_lti_fr}</Table.Summary.Cell>
                            <Table.Summary.Cell index={29}>-</Table.Summary.Cell>
                            <Table.Summary.Cell index={30}>{totals.ytd_lti_sr}</Table.Summary.Cell>
                        </Table.Summary.Row>
                    </Table.Summary>
                )}
            />
        </Card>
    );
}
