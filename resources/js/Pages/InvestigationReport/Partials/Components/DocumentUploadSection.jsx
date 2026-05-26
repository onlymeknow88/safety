import React from "react";
import { Upload, message, Button } from "antd";
import { InboxOutlined, DeleteOutlined } from "@ant-design/icons";

export default function DocumentUploadSection({ fileList, setFileList, disabled, isDarkMode }) {
    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) {
                message.error(`${file.name} melebihi batas ukuran 5MB!`);
                return Upload.LIST_IGNORE;
            }

            const allowedTypes = [
                "image/jpeg",
                "image/png",
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            ];

            // Check by extension too for safety
            const ext = file.name.split('.').pop().toLowerCase();
            const allowedExts = ["jpg", "jpeg", "png", "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx"];

            if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
                message.error(`${file.name} tipe berkas tidak didukung!`);
                return Upload.LIST_IGNORE;
            }

            if (fileList.length >= 10) {
                message.warning("Maksimal unggah 10 dokumen pendukung!");
                return Upload.LIST_IGNORE;
            }

            setFileList([...fileList, file]);
            return false; // prevent auto upload
        },
        fileList,
        multiple: true,
        maxCount: 10,
        disabled: disabled,
    };

    return (
        <div style={{ padding: "8px 0" }}>
            {!disabled && (
                <Upload.Dragger {...props} style={{ borderRadius: 12, background: isDarkMode ? "#0f172a" : "#f8fafc" }}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ color: isDarkMode ? "#3b82f6" : "#2563eb" }} />
                    </p>
                    <p className="ant-upload-text" style={{ fontWeight: 700, fontSize: 16, color: isDarkMode ? "#f8fafc" : "#0f172a" }}>
                        Klik atau Drag file ke area ini untuk mengunggah dokumen
                    </p>
                    <p className="ant-upload-hint" style={{ fontSize: 12, color: "#64748b" }}>
                        Mendukung dokumen PDF atau Gambar (JPG/PNG). Batas ukuran maksimal 5MB per file (Maks 10 berkas).
                    </p>
                </Upload.Dragger>
            )}

            {disabled && fileList.length === 0 && (
                <div style={{ color: "#64748b", fontStyle: "italic", textAlign: "center", padding: "16px 0" }}>
                    Tidak ada dokumen pendukung yang diunggah.
                </div>
            )}
        </div>
    );
}
