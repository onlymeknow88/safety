import { Layout } from "antd";

const { Content } = Layout;

export default function MainContent({ children, isMobile }) {
    return (
        <Content
            style={{
                padding: isMobile ? "16px" : "24px",
                margin: 0,
                display: "flex",
                flexDirection: "column",
                flex: "1 0 auto",
            }}
        >
            {children}
        </Content>
    );
}
