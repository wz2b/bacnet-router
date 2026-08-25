# bacnet-router

Minimal BACnet router project skeleton in Go.

## Project structure

```text
cmd/router/main.go
internal/
```

## Requirements

- Go 1.24+
- [Task](https://taskfile.dev/)

## Tasks

- `task build` - build the router for the host platform
- `task test` - run tests
- `task clean` - remove build artifacts
- `task ci` - run local CI checks

## Running

```bash
go run ./cmd/router
```

## Docker

Build the container image with:

```bash
docker build -t bacnet-router .
```

## CI

GitHub Actions runs tests and builds release artifacts for:

- Linux amd64
- Linux arm64
- Windows amd64
