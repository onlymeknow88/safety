import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

export default function Footer() {
    return (
        <AntFooter
            style={{
                textAlign: "center",
                color: "#94a3b8",
                padding: "24px 24px",
                fontSize: 12,
                flexShrink: 0,
                background: "transparent",
            }}
        >
            ©{new Date().getFullYear()} — AIM-SAFE Enterprise Safety Management System
        </AntFooter>
    );
}
