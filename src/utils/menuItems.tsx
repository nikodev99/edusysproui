import {CircleUserRound, Cog, LayoutDashboard, ListTodo, LogOut, ShoppingCart} from "lucide-react";

export const menuItems = [
    {
        key: '1',
        icon: <LayoutDashboard />,
        label: <a href='/dashboard'>Dashboard</a>
    },
    {
        key: '2',
        icon: <ShoppingCart />,
        label: "Orders"
    },
    {
        key: '3',
        icon: <ListTodo />,
        label: "Todo"
    },
    {
        key: '4',
        icon: <CircleUserRound />,
        label: "Profile"
    },
    {
        key: '5',
        icon: <Cog />,
        label: "Setting"
    },
    {
        key: '6',
        icon: <LogOut />,
        label: "Logout"
    }
]