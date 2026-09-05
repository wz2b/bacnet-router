import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAuth } from "./AuthContext";

export function RequireAuth() {
    const {
        user,
        loading,
    } = useAuth();

    const location = useLocation();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user === null) {
        const returnTo =
            location.pathname +
            location.search +
            location.hash;

        return (
            <Navigate
                to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
                replace
            />
        );
    }

    return <Outlet />;
}