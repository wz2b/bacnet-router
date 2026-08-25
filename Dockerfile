FROM golang:1.24-bookworm AS builder

WORKDIR /src

COPY go.mod ./
COPY cmd ./cmd
COPY internal ./internal

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/router ./cmd/router

FROM debian:bookworm-slim

WORKDIR /app

COPY --from=builder /out/router /usr/local/bin/router

ENTRYPOINT ["/usr/local/bin/router"]

