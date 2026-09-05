import {
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { RequireAuth } from "../auth/RequireAuth";

import AppShell from "../layouts/AppShell";
import BBMDLayout from "../layouts/BBMDLayout";

import DashboardPage from "../pages/DashboardPage";
import ForeignDevicesPage from "../pages/ForeignDevicesPage";
import InterfacesPage from "../pages/InterfacesPage";
import LoginPage from "../pages/LoginPage";

import BBMDDiagnosticsPage from "../pages/BBMDDiagnosticsPage";
import BBMDRoutesPage from "../pages/BBMDRoutesPage";
import BBMDSettingsPage from "../pages/BBMDSettingsPage";

export default function AppRouter() {
    return (
        <Routes>
            <Route
                path="/login"
                element={<LoginPage />}
            />

            <Route element={<RequireAuth />}>
                <Route element={<AppShell />}>
                    <Route
                        index
                        element={<DashboardPage />}
                    />

                    <Route
                        path="interfaces"
                        element={<InterfacesPage />}
                    />

                    <Route
                        path="bbmds/:bbmdId"
                        element={<BBMDLayout />}
                    >
                        <Route
                            index
                            element={
                                <Navigate
                                    to="settings"
                                    replace
                                />
                            }
                        />

                        <Route
                            path="settings"
                            element={<BBMDSettingsPage />}
                        />

                        <Route
                            path="routes"
                            element={<BBMDRoutesPage />}
                        />

                        <Route
                            path="diagnostics"
                            element={<BBMDDiagnosticsPage />}
                        />
                    </Route>

                    <Route
                        path="foreign-devices"
                        element={<ForeignDevicesPage />}
                    />
                </Route>
            </Route>

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />
        </Routes>
    );
}