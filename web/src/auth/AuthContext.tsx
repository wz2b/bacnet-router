import { createContext, useContext } from "react";

import { AuthContextValue } from "./types";

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used inside an AuthProvider");
    }

    return context;
}