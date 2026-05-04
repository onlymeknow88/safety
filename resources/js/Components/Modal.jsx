import React from 'react';
import { Modal as AntdModal } from 'antd';

export default function Modal({
    children,
    show = false,
    maxWidth = '2xl',
    closeable = true,
    onClose = () => {},
}) {
    const widthMap = {
        sm: 400,
        md: 500,
        lg: 600,
        xl: 800,
        '2xl': 1000,
    };

    return (
        <AntdModal
            open={show}
            onCancel={onClose}
            footer={null}
            closable={closeable}
            width={widthMap[maxWidth] || 600}
            destroyOnHidden
            centered
            styles={{
                body: {
                    padding: 0,
                }
            }}
        >
            {children}
        </AntdModal>
    );
}
