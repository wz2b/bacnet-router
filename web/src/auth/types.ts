export interface AuthUser {
    id: string;
    username: string;
    displayName?: string;
    roles: string[];
}

export interface AuthContextValue {
    user: AuthUser | null;
    loading: boolean;

    refreshAuth: () => Promise<void>;
    logout: () => Promise<void>;
}