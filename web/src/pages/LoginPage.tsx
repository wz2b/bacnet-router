import { useSearchParams } from "react-router-dom";

import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
    const {
        user,
        loading,
    } = useAuth();

    const [searchParams] = useSearchParams();

    const returnTo = searchParams.get("returnTo") ?? "/";
    const error = searchParams.get("error");

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user !== null) {
        window.location.replace(returnTo);
        return null;
    }

    return (
        <main>
            <h1>SuperRouter</h1>

            {error !== null && (
                <p>Login failed. Please try again.</p>
            )}

            <form
                method="post"
                action="/api/auth/login"
            >
                <input
                    type="hidden"
                    name="returnTo"
                    value={returnTo}
                />

                <div>
                    <label htmlFor="username">
                        Username
                    </label>

                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                    />
                </div>

                <button type="submit">
                    Sign in
                </button>
            </form>

            <hr />

            <a
                href={
                    "/api/auth/oidc/login?returnTo=" +
                    encodeURIComponent(returnTo)
                }
            >
                Sign in with organization account
            </a>
        </main>
    );
}