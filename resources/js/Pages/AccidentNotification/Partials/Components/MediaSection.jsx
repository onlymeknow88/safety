import React, { useState } from "react";
import { Upload, Modal, Image } from "antd";
import { PlusOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";

export default function MediaSection({ fileList, setFileList }) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

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
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 13C9 14.6569 10.3431 16 12 16C13.6569 16 15 14.6569 15 13C15 11.3431 13.6569 10 12 10C10.3431 10 9 11.3431 9 13Z" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 9C3 7.89543 3.89543 7 5 7H7L8.41421 5.58579C8.78929 5.21071 9.29799 5 9.82843 5H14.1716C14.702 5 15.2107 5.21071 15.5858 5.58579L17 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V9Z" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M18 4V8M16 6H20" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span style={{
                fontSize: 12,
                fontWeight: 800,
                color: '#475569',
                textTransform: 'uppercase',
                letterSpacing: 1
            }}>
                Tambah Foto
            </span>
        </div>
    );

    return (
        <div className={`custom-upload-section ${fileList.length >= 4 ? 'hide-upload' : ''}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .hide-upload .ant-upload.ant-upload-select {
                    display: none !important;
                }
                .custom-upload-section .ant-upload-list-picture-card {
                    display: flex !important;
                    flex-wrap: wrap !important;
                    gap: 16px !important;
                }
                .custom-upload-section .ant-upload-list-item-container {
                    width: 280px !important;
                    height: 200px !important;
                    margin: 0 !important;
                }
                .custom-upload-section .ant-upload.ant-upload-select {
                    width: 280px !important;
                    height: 200px !important;
                    background: #f8fafc !important;
                    border: 2px dashed #cbd5e1 !important;
                    border-radius: 16px !important;
                    transition: all 0.3s ease;
                    margin: 0 !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }
                .custom-upload-section .ant-upload.ant-upload-select:hover {
                    border-color: #3b82f6 !important;
                    background: #eff6ff !important;
                }
                .custom-upload-section .ant-upload-list-item {
                    width: 280px !important;
                    height: 200px !important;
                    border-radius: 16px !important;
                    padding: 0 !important;
                    border: 1px solid #e2e8f0 !important;
                    overflow: hidden !important;
                    position: relative !important;
                    margin: 0 !important;
                }
                .custom-upload-section .ant-upload-list-item::before {
                    display: none !important; /* Hide default Ant Design overlay */
                }
                .custom-upload-section .ant-upload-list-item-info {
                    border-radius: 16px !important;
                    width: 100% !important;
                    height: 100% !important;
                    padding: 0 !important;
                }
                .custom-upload-section .ant-upload-list-item-thumbnail {
                    width: 100% !important;
                    height: 100% !important;
                    position: relative !important;
                    display: block !important;
                }
                .custom-upload-section .ant-upload-list-item-thumbnail img {
                    object-fit: cover !important;
                    width: 100% !important;
                    height: 100% !important;
                    display: block !important;
                }
                .custom-upload-section .ant-upload-list-item-actions {
                    position: absolute !important;
                    inset: 0 !important; /* Forces to fill entire parent */
                    width: 100% !important;
                    height: 100% !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    background: rgba(15, 23, 42, 0.6) !important;
                    gap: 20px !important;
                    opacity: 0 !important;
                    transition: all 0.3s ease !important;
                    border-radius: 16px !important;
                    z-index: 10 !important;
                }
                .custom-upload-section .ant-upload-list-item:hover .ant-upload-list-item-actions {
                    opacity: 1 !important;
                }
                .custom-upload-section .ant-upload-list-item-actions .anticon {
                    font-size: 24px !important;
                    color: #fff !important;
                    cursor: pointer !important;
                    transition: transform 0.2s ease !important;
                }
                .custom-upload-section .ant-upload-list-item-actions .anticon:hover {
                    transform: scale(1.2) !important;
                }
                .custom-upload-section .ant-upload-list-item-progress {
                    bottom: 0 !important;
                    width: 100% !important;
                    padding: 0 10px !important;
                }
            `}} />

            <div style={{ marginBottom: 16, fontSize: 13, fontWeight: 800, color: '#3b82f6', letterSpacing: 0.5 }}>
                FOTO KEJADIAN (PHOTOS)
            </div>

            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={() => false}
                maxCount={4}
            >
                {fileList.length >= 4 ? null : uploadButton}
            </Upload>

            <div style={{ marginTop: 12, fontSize: 12, color: '#475569', fontWeight: 600 }}>
                * Maksimal 4 foto (Format: JPG, PNG)
            </div>

            <Modal
                open={previewOpen}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
                centered
            >
                <img alt="preview" style={{ width: '100%', borderRadius: 8 }} src={previewImage} />
            </Modal>
        </div>
    );
}

