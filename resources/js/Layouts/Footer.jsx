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
            ©{new Date().getFullYear()} — ALamtri Minerals Indonesia
        </AntFooter>
    );
}
