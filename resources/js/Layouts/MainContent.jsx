import { Layout } from "antd";

const { Content } = Layout;

export default function MainContent({ children, isMobile }) {
    return (
        <Content
            style={{
                margin: isMobile ? "12px" : "24px",
                display: "flex",
                flexDirection: "column",
                flex: "1 0 auto",
            }}
        >
            {children}
        </Content>
    );
}
