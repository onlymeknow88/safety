import { Layout } from "antd";

const { Footer: AntFooter } = Layout;

export default function Footer() {
    return (
        <AntFooter
            style={{
                textAlign: "center",
                color: "#8c8c8c",
                padding: "16px 24px",
                fontSize: 12,
            }}
        >
            AdminPanel ©{new Date().getFullYear()} — Built with Laravel + Inertia.js + Ant Design
        </AntFooter>
    );
}
