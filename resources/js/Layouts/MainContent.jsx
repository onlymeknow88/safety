import { Layout } from "antd";

const { Content } = Layout;

export default function MainContent({ children, isMobile }) {
    return (
        <Content
            style={{
                margin: isMobile ? "12px" : "24px",
                minHeight: "calc(100vh - 64px - 70px)",
                overflow: "initial",
            }}
        >
            {children}
        </Content>
    );
}
