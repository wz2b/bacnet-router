import { ReactNode, useCallback, useEffect, useState } from "react";

import { AuthContext } from "./AuthContext";
import { AuthUser } from "./types";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
                                 children,
                             }: AuthProviderProps) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshAuth = useCallback(async () => {
        try {
            const response = await fetch("/api/auth/me", {
                credentials: "include",
            });

            if (response.status === 401) {
                setUser(null);
                return;
            }

            if (!response.ok) {
                throw new Error(
                    `Authentication check failed: ${response.status}`,
                );
            }

            const authenticatedUser: AuthUser = await response.json();
            setUser(authenticatedUser);
        } catch (error) {
            console.error("Unable to determine authentication state:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include",
            });
        } finally {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        void refreshAuth();
    }, [refreshAuth]);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                refreshAuth,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}