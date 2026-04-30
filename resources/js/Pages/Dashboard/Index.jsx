import {
    ArrowRightOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    DollarOutlined,
    EllipsisOutlined,
    RiseOutlined,
    ShoppingCartOutlined,
    UserOutlined,
} from "@ant-design/icons";
import {
    Avatar,
    Badge,
    Button,
    Card,
    Col,
    Divider,
    List,
    Progress,
    Row,
    Space,
    Table,
    Tag,
    Typography,
    theme,
} from "antd";

import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import StatsCard from "@/Components/StatsCard";
import { useTheme } from "../../Contexts/ThemeContext";

const { Text, Title } = Typography;

export default function Dashboard({ stats = {} }) {
    const { token } = theme.useToken();
    const { isDarkMode } = useTheme();

    return (
        <DashboardLayout title="Dashboard">
            <Head title="Dashboard" />

        </DashboardLayout>
    );
}
