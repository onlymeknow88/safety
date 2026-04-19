import { Layout } from "antd";

const { Content } = Layout;

export default function MainContent({ children }) {
    return (
        <Content
            style={{
                margin: "24px",
                minHeight: "calc(100vh - 64px - 70px)",
            }}
        >
            {children}
        </Content>
    );
}
