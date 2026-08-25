FROM golang:1.24-bookworm AS builder

WORKDIR /src

ARG TARGETOS=linux
ARG TARGETARCH=amd64

COPY go.mod ./
RUN go mod download

COPY cmd ./cmd
COPY internal ./internal

RUN mkdir -p /out && \
    CGO_ENABLED=0 GOOS=${TARGETOS} GOARCH=${TARGETARCH} go build -o /out/router ./cmd/router

FROM debian:bookworm-slim

WORKDIR /app

COPY --from=builder /out/router /usr/local/bin/router

ENTRYPOINT ["/usr/local/bin/router"]
