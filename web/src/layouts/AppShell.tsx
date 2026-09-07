import {
    NavLink,
    Outlet,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

interface BBMDNavItem {
    id: number;
    name: string;
}

interface InterfaceNavItem {
    id: number;
    name: string;
}

const bbmds: BBMDNavItem[] = [
    {
        id: 1,
        name: "BBMD 1",
    },
    {
        id: 2,
        name: "BBMD 2",
    },
];

const interfaces: InterfaceNavItem[] = [
    {
        id: 1,
        name: "BACnet Primary",
    },
    {
        id: 2,
        name: "BACnet Secondary",
    },
];

export default function AppShell() {
    const {
        user,
        logout,
    } = useAuth();

    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();

        navigate(
            "/login",
            {
                replace: true,
            },
        );
    };

    return (
        <div className="app-shell">
            <header className="app-header">
                <div className="app-title">
                    SuperRouter
                </div>

                <div className="app-version">
                    v0.1.0
                </div>

                <div className="app-user">
                    <span className="app-username">
                        {user?.displayName ?? user?.username}
                    </span>

                    <button
                        type="button"
                        onClick={handleLogout}
                    >
                        Sign out
                    </button>
                </div>
            </header>

            <div className="app-body">
                <nav className="sidebar">
                    <div className="nav-group">
                        <div className="nav-group-title">
                            Router
                        </div>

                        <NavLink
                            to="/"
                            end
                        >
                            Dashboard
                        </NavLink>
                    </div>

                    <div className="nav-group">
                        <div className="nav-group-title">
                            Interfaces
                        </div>

                        <NavLink
                            to="/interfaces"
                            end
                        >
                            All Interfaces
                        </NavLink>

                        {interfaces.map((iface) => (
                            <NavLink
                                key={iface.id}
                                className="nav-object"
                                to={`/interfaces/${iface.id}`}
                            >
                                {iface.name}
                            </NavLink>
                        ))}
                    </div>

                    <div className="nav-group">
                        <div className="nav-group-title">
                            BBMDs
                        </div>

                        <NavLink
                            to="/bbmds"
                            end
                        >
                            All BBMDs
                        </NavLink>

                        {bbmds.map((bbmd) => (
                            <NavLink
                                key={bbmd.id}
                                className="nav-object"
                                to={`/bbmds/${bbmd.id}`}
                            >
                                {bbmd.name}
                            </NavLink>
                        ))}
                    </div>

                    <div className="nav-group">
                        <div className="nav-group-title">
                            Foreign Devices
                        </div>

                        <NavLink to="/foreign-devices">
                            Registrations
                        </NavLink>
                    </div>
                </nav>

                <main className="app-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}