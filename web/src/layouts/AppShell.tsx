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

                        <NavLink to="/interfaces">
                            Interfaces
                        </NavLink>
                    </div>

                    <div className="nav-group">
                        <div className="nav-group-title">
                            BBMDs
                        </div>

                        {bbmds.map((bbmd) => (
                            <NavLink
                                key={bbmd.id}
                                className="nav-object"
                                to={`/bbmds/${bbmd.id}/settings`}
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