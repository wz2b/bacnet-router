package main

import (
	"log/slog"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

// Single Page Application
type SPAHandler struct {
	webDir     string
	indexFile  string
	fileServer http.Handler
	logger     *slog.Logger
}

func NewSPAHandler(
	webDir string,
	logger *slog.Logger,
) *SPAHandler {
	return &SPAHandler{
		webDir:     webDir,
		indexFile:  filepath.Join(webDir, "index.html"),
		fileServer: http.FileServer(http.Dir(webDir)),
		logger:     logger,
	}
}

func (h *SPAHandler) ServeHTTP(
	w http.ResponseWriter,
	r *http.Request,
) {
	if r.Method != http.MethodGet &&
		r.Method != http.MethodHead {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	requestPath := path.Clean("/" + r.URL.Path)
	requestPath = strings.TrimPrefix(
		requestPath,
		"/",
	)

	if requestPath != "" {
		filename := filepath.Join(
			h.webDir,
			filepath.FromSlash(requestPath),
		)

		info, err := os.Stat(filename)

		if err == nil && !info.IsDir() {
			h.fileServer.ServeHTTP(w, r)
			return
		}
	}

	http.ServeFile(
		w,
		r,
		h.indexFile,
	)
}
