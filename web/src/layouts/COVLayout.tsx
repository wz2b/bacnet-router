import {
    NavLink,
    Outlet,
} from "react-router-dom";

export default function COVLayout() {
    return (
        <div className="section-layout">
            <div className="section-header">
                <h1>COV Optimization</h1>
            </div>

            <nav className="section-tabs">
                <NavLink to="settings">
                    Settings
                </NavLink>

                <NavLink to="subscriptions">
                    Learned Subscriptions
                </NavLink>

                <NavLink to="activity">
                    Activity
                </NavLink>
            </nav>

            <div className="section-content">
                <Outlet />
            </div>
        </div>
    );
}