import { useState, useEffect, useCallback } from "react";
import { useGet } from "@/Helpers/useRequest";
import { message } from "antd";

export default function useDashboard(initialFilters = {}) {
    const [filters, setFilters] = useState({
        start_date: initialFilters.start_date || new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        end_date: initialFilters.end_date || new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
        ccow_id: initialFilters.ccow_id || "",
        company_id: initialFilters.company_id || ""
    });

    const [data, setData] = useState({
        stats: {},
        chartData: {},
        topLocations: [],
        hpriData: {},
        topTimes: [],
        openOverdueIncidents: []
    });

    const [getData, getFeedback] = useGet();
    const loading = getFeedback.loading;

    const fetchDashboardData = useCallback(async (currentFilters) => {
        try {
            // Clean empty values before sending
            const cleanParams = {};
            Object.keys(currentFilters).forEach(key => {
                if (currentFilters[key] !== undefined && currentFilters[key] !== null && currentFilters[key] !== "") {
                    cleanParams[key] = currentFilters[key];
                }
            });

            const response = await getData(cleanParams, "dashboard");
            if (response?.data?.meta?.status === "success") {
                setData({
                    stats: response.data.result.stats || {},
                    chartData: response.data.result.chartData || {},
                    topLocations: response.data.result.topLocations || [],
                    hpriData: response.data.result.hpriData || {},
                    topTimes: response.data.result.topTimes || [],
                    openOverdueIncidents: response.data.result.openOverdueIncidents || []
                });
            }
        } catch (error) {
            message.error("Gagal mengambil data dashboard.");
        }
    }, [getData]);

    useEffect(() => {
        fetchDashboardData(filters);
    }, [filters, fetchDashboardData]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => {
            const next = { ...prev };
            if (key === "date_range") {
                if (value && value[0] && value[1]) {
                    next.start_date = value[0].format("YYYY-MM-DD");
                    next.end_date = value[1].format("YYYY-MM-DD");
                } else {
                    next.start_date = "";
                    next.end_date = "";
                }
            } else {
                next[key] = value;
            }

            // Sync with browser URL search params
            const url = new URL(window.location.href);
            Object.keys(next).forEach(k => {
                if (next[k]) {
                    url.searchParams.set(k, next[k]);
                } else {
                    url.searchParams.delete(k);
                }
            });
            window.history.replaceState({}, "", url.toString());

            return next;
        });
    };

    const handleReset = () => {
        const resetFilters = {
            start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
            end_date: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
            ccow_id: "",
            company_id: ""
        };
        setFilters(resetFilters);

        // Sync with browser URL
        const url = new URL(window.location.href);
        Object.keys(resetFilters).forEach(k => {
            if (resetFilters[k]) {
                url.searchParams.set(k, resetFilters[k]);
            } else {
                url.searchParams.delete(k);
            }
        });
        window.history.replaceState({}, "", url.toString());
    };

    return {
        loading,
        filters,
        data,
        handleFilterChange,
        handleReset
    };
}
