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
import InterfaceLayout from "../layouts/InterfaceLayout";
import InterfacesPage from "../pages/InterfacesPage";
import LoginPage from "../pages/LoginPage";

import BBMDsPage from "../pages/BBMDsPage";
import BBMDDiagnosticsPage from "../pages/BBMDDiagnosticsPage";
import BBMDRoutesPage from "../pages/BBMDRoutesPage";
import BBMDCovPage from "../pages/BBMDCovPage";
import BBMDTrafficPolicy from "../pages/BBMDTrafficPolicy";
import BBMDSettingsPage from "../pages/BBMDSettingsPage";
import InterfaceSettingsPage from "../pages/InterfaceSettingsPage";
import InterfaceDiagnosticsPage from "../pages/InterfaceDiagnosticsPage";

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
                        path="interfaces/:interfaceId"
                        element={<InterfaceLayout />}
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
                            element={<InterfaceSettingsPage />}
                        />

                        <Route
                            path="diagnostics"
                            element={<InterfaceDiagnosticsPage />}
                        />
                    </Route>

                    <Route
                        path="bbmds"
                        element={<BBMDsPage />}
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
                            path="cov"
                            element={<BBMDCovPage />}
                        />

                        <Route
                            path="traffic"
                            element={<BBMDTrafficPolicy />}
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