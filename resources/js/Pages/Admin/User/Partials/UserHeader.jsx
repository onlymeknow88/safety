import React from "react";
import { Space, Input, Button } from "antd";
import { SearchOutlined, FilterOutlined, PlusOutlined } from "@ant-design/icons";

export default function UserHeader({ 
    searchText, 
    onSearchChange, 
    onAddClick, 
    isDarkMode 
}) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
                background: isDarkMode ? "#1f1f1f" : "#fff",
                padding: "16px 24px",
                borderRadius: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
        >
            <Space size={16}>
                <Input
                    placeholder="Search user name or email..."
                    prefix={<SearchOutlined style={{ color: "#bfbfbf" }} />}
                    value={searchText}
                    onChange={onSearchChange}
                    style={{
                        width: 350,
                        borderRadius: 10,
                        background: isDarkMode ? "#141414" : "#f5f5f5",
                        border: "none",
                        height: 40,
                    }}
                />
                <Button
                    icon={<FilterOutlined />}
                    style={{
                        borderRadius: 10,
                        height: 40,
                        background: isDarkMode ? "#141414" : "#f5f5f5",
                        border: "none",
                    }}
                >
                    Filter
                </Button>
            </Space>

            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAddClick}
                style={{
                    height: 40,
                    borderRadius: 10,
                    padding: "0 24px",
                    fontWeight: 600,
                    background: "#1677ff",
                    boxShadow: "0 4px 12px rgba(22, 119, 255, 0.2)",
                }}
            >
                Add New User
            </Button>
        </div>
    );
}
