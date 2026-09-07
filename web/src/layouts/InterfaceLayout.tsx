import {
    NavLink,
    Outlet,
    useParams,
} from "react-router-dom";

export default function InterfaceLayout() {
    const { interfaceId } = useParams();

    return (
        <div className="section-layout">
            <div className="section-header">
                <h1>Interface {interfaceId}</h1>
            </div>

            <nav className="section-tabs">
                <NavLink to="settings">
                    Settings
                </NavLink>

                <NavLink to="diagnostics">
                    Diagnostics
                </NavLink>
            </nav>

            <div className="section-content">
                <Outlet />
            </div>
        </div>
    );
}