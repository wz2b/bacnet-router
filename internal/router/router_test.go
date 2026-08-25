package router

import "testing"

func TestStartupMessage(t *testing.T) {
	if got, want := StartupMessage(), "bacnet-router starting"; got != want {
		t.Fatalf("StartupMessage() = %q, want %q", got, want)
	}
}
