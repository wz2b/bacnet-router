package main

import (
	"encoding/json"
	"log/slog"
	"net/http"
)

func NewServer(
	address string,
	webDir string,
	logger *slog.Logger,
) *http.Server {
	mux := http.NewServeMux()

	mux.HandleFunc(
		"/api/health",
		handleHealth,
	)

	mux.HandleFunc(
		"/api/auth/me",
		handleAuthMe,
	)

	mux.HandleFunc(
		"/api/auth/login",
		handleLogin,
	)

	mux.HandleFunc(
		"/api/auth/logout",
		handleLogout,
	)

	mux.Handle(
		"/",
		NewSPAHandler(
			webDir,
			logger,
		),
	)

	return &http.Server{
		Addr:    address,
		Handler: mux,
	}
}

func handleHealth(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		map[string]any{
			"status": "ok",
		},
	)
}

func handleAuthMe(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	slog.Info(
		"auth me",
		"cookies", r.Cookies(),
	)

	cookie, err := r.Cookie("superrouter_session")

	slog.Info(
		"session lookup",
		"cookie", cookie,
		"error", err,
	)

	if err != nil {
		writeJSON(
			w,
			http.StatusUnauthorized,
			map[string]any{
				"error": "not authenticated",
			},
		)
		return
	}

	writeJSON(
		w,
		http.StatusOK,
		map[string]any{
			"id":          cookie.Value,
			"username":    cookie.Value,
			"displayName": cookie.Value,
			"roles":       []string{"admin"},
		},
	)
}

func handleLogin(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	if err := r.ParseForm(); err != nil {
		http.Error(
			w,
			"invalid form",
			http.StatusBadRequest,
		)
		return
	}

	username := r.FormValue("username")
	password := r.FormValue("password")
	returnTo := r.FormValue("returnTo")

	if username == "" || password == "" {
		http.Redirect(
			w,
			r,
			"/login?error=invalid-credentials",
			http.StatusSeeOther,
		)
		return
	}

	http.SetCookie(
		w,
		&http.Cookie{
			Name:     "superrouter_session",
			Value:    username,
			Path:     "/",
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
		},
	)
	slog.Info(
		"login succeeded",
		"username", username,
	)
	if returnTo == "" {
		returnTo = "/"
	}

	http.Redirect(
		w,
		r,
		returnTo,
		http.StatusSeeOther,
	)
}

func handleLogout(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	/*
		TODO:

		Delete server-side session and expire cookie.
	*/

	w.WriteHeader(http.StatusNoContent)
}

func writeJSON(
	w http.ResponseWriter,
	status int,
	value any,
) {
	w.Header().Set(
		"Content-Type",
		"application/json",
	)

	w.WriteHeader(status)

	if err := json.NewEncoder(w).Encode(value); err != nil {
		slog.Error(
			"failed to encode response",
			"error", err,
		)
	}
}
