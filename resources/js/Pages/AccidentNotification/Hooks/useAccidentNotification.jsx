import { useState } from "react";
import { usePost, usePut } from "@/Helpers/useRequest";
import { App } from "antd";
import { router } from "@inertiajs/react";

export default function useAccidentNotification(initialData = null) {
    const { notification } = App.useApp();
    const [postRequest, postFeedback] = usePost("accident-notification");
    const [putRequest, putFeedback] = usePut("accident-notification");

    const [isHpri, setIsHpri] = useState(initialData?.is_hpri ?? false);
    const [severity, setSeverity] = useState({
        actual_k3: initialData?.actual_k3 ?? 1,
        actual_kk: initialData?.actual_kk ?? 1,
        actual_lh: initialData?.actual_lh ?? 1,
        potential_k3: initialData?.potential_k3 ?? 1,
        potential_kk: initialData?.potential_kk ?? 1,
        potential_lh: initialData?.potential_lh ?? 1,
    });
    const [incidentFacts, setIncidentFacts]         = useState(initialData?.incident_facts ?? ['']);
    const [correctiveActions, setCorrectiveActions] = useState(initialData?.corrective_actions ?? ['']);
    const [fileList, setFileList] = useState([]);

    const buildFormData = (values, status) => {
        const fd = new FormData();
        fd.append('status', status);
        fd.append('is_hpri', isHpri ? 1 : 0);
        
        // Severity
        Object.entries(severity).forEach(([k, v]) => fd.append(k, v));
        
        // Dynamic lists
        incidentFacts.filter(f => f.trim() !== '').forEach((f, i) => fd.append(`incident_facts[${i}]`, f));
        correctiveActions.filter(a => a.trim() !== '').forEach((a, i) => fd.append(`corrective_actions[${i}]`, a));
        
        // Files
        fileList.forEach((file) => {
            if (file.originFileObj) {
                fd.append('photos[]', file.originFileObj);
            }
        });

        // Other values from Ant Design Form
        Object.entries(values).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
                if (v instanceof Date) {
                    fd.append(k, v.toISOString().split('T')[0]);
                } else if (typeof v === 'object' && v?.format) {
                    // Moment/Dayjs objects
                    if (k.includes('time')) {
                        fd.append(k, v.format('HH:mm:ss'));
                    } else {
                        fd.append(k, v.format('YYYY-MM-DD'));
                    }
                } else {
                    fd.append(k, v);
                }
            }
        });
        
        return fd;
    };

    const handleSave = async (form, status) => {
        try {
            const values = await form.validateFields();
            const fd = buildFormData(values, status);
            const isEditing = !!initialData;
            
            // Note: Put request with FormData usually requires _method override in Laravel
            // But since I'm using usePost/usePut helpers, I should check how they work.
            // Usually we use POST with fd.append('_method', 'PUT') for multipart/form-data PUTs.
            
            let response;
            if (isEditing) {
                // To handle file uploads in PUT, we often use POST with _method=PUT
                fd.append('_method', 'PUT');
                response = await postRequest(fd, initialData.id);
            } else {
                response = await postRequest(fd);
            }

            if (response.data?.meta?.status === 'success') {
                notification.success({
                    message: status === 'draft' ? 'Draft Disimpan' : 'Berhasil Disubmit',
                    description: response.data?.meta?.message,
                });
                router.visit(route('accident-notification.index'));
            }
        } catch (error) {
            if (error?.errorFields) return; // Ant Design validation error
            
            notification.error({
                message: "Gagal",
                description: error.response?.data?.meta?.message || "Terjadi kesalahan pada server",
            });
        }
    };

    return {
        isHpri, setIsHpri,
        severity, setSeverity,
        incidentFacts, setIncidentFacts,
        correctiveActions, setCorrectiveActions,
        fileList, setFileList,
        handleSave,
        loading: postFeedback.loading || putFeedback.loading,
    };
}
