import React from "react";
import { Upload, Modal, App } from "antd";
import { PlusOutlined } from "@ant-design/icons";

export default function MediaSection({ fileList, setFileList }) {
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            gap: 12
        }}>
            {/* Custom SVG Camera Icon like the sketch */}
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 13C9 14.6569 10.3431 16 12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13Z" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 9C3 7.89543 3.89543 7 5 7H7L8.41421 5.58579C8.78929 5.21071 9.29799 5 9.82843 5H14.1716C14.702 5 15.2107 5.21071 15.5858 5.58579L17 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V9Z" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 4V8M16 6H20" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span style={{
                fontSize: 14,
                fontWeight: 900,
                color: '#94a3b8',
                textTransform: 'uppercase',
                letterSpacing: 1
            }}>
                Upload Foto
            </span>
        </div>
    );

    return (
        <div className="custom-upload-section">
            <style dangerouslySetInnerHTML={{
                __html: `
                .custom-upload-section .ant-upload.ant-upload-select {
                    width: 280px !important;
                    height: 200px !important;
                    background: transparent !important;
                    border: 2px dashed #cbd5e1 !important;
                    border-radius: 20px !important;
                    transition: all 0.3s ease;
                    margin: 0 !important;
                }
                .custom-upload-section .ant-upload.ant-upload-select:hover {
                    border-color: #2563eb !important;
                    background: #f8fafc !important;
                }
                .custom-upload-section .ant-upload-list-item {
                    width: 280px !important;
                    height: 200px !important;
                    border-radius: 20px !important;
                }
            `}} />

            <div style={{ marginBottom: 16, fontSize: 13, fontWeight: 800, color: '#3b82f6', letterSpacing: 0.5 }}>
                FOTO KEJADIAN (PHOTOS)
            </div>

            <Upload
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                beforeUpload={() => false}
                maxCount={3}
            >
                {fileList.length >= 3 ? null : uploadButton}
            </Upload>

            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                * Maksimal 2 foto (Format: JPG, PNG)
            </div>
        </div>
    );
}
