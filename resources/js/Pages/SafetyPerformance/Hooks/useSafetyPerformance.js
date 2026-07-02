import { useState, useEffect, useCallback } from "react";
import { useGet, usePost } from "@/Helpers/useRequest";
import { message } from "antd";
import TokenManager from "@/Utils/TokenManager";

export default function useSafetyPerformance(initialYear = new Date().getFullYear()) {
    const [selectedYear, setSelectedYear] = useState(initialYear);
    const [kpiData, setKpiData] = useState([]);
    const [lastSynced, setLastSynced] = useState(null);

    const [getData, getFeedback] = useGet();
    const [postSync, postFeedback] = usePost("safety-performance/sync");
    const [postUpdate, updateFeedback] = usePost("safety-performance/update");

    const fetching = getFeedback.loading;
    const syncing = postFeedback.loading;
    const updating = updateFeedback.loading;

    const fetchKpiData = useCallback(async (year) => {
        try {
            const response = await getData({ tahun: year }, "safety-performance");
            if (response?.data?.meta?.status === "success") {
                setKpiData(response.data.result.kpiData || []);
                setLastSynced(response.data.result.lastSynced);
            }
        } catch (error) {
            message.error("Gagal mengambil data kinerja keselamatan.");
        }
    }, [getData]);

    useEffect(() => {
        fetchKpiData(selectedYear);
    }, [selectedYear, fetchKpiData]);

    const handleYearChange = (year) => {
        setSelectedYear(year);
    };

    const handleSync = async () => {
        try {
            const response = await postSync({ tahun: selectedYear });
            if (response?.data?.meta?.status === "success") {
                setKpiData(response.data.result.kpiData || []);
                setLastSynced(response.data.result.lastSynced);
                message.success("Sinkronisasi data kinerja keselamatan berhasil!");
            }
        } catch (error) {
            message.error("Gagal melakukan sinkronisasi data.");
        }
    };

    const handleUpdate = async (bulan, values) => {
        try {
            const response = await postUpdate({
                tahun: selectedYear,
                bulan,
                ...values
            });
            if (response?.data?.meta?.status === "success") {
                setKpiData(response.data.result.kpiData || []);
                setLastSynced(response.data.result.lastSynced);
                message.success("Data Kinerja Keselamatan berhasil diperbarui!");
                return true;
            }
        } catch (error) {
            message.error("Gagal memperbarui data.");
            return false;
        }
    };

    const handleExport = () => {
        // Direct browser file download using token
        const token = TokenManager.getToken();
        window.location.href = route('safety-performance.export', { tahun: selectedYear, token: token });
    };

    return {
        fetching,
        syncing,
        updating,
        selectedYear,
        kpiData,
        lastSynced,
        handleYearChange,
        handleSync,
        handleUpdate,
        handleExport
    };
}
