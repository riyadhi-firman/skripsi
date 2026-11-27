# Stage 1: Build Golang binary
FROM golang:1.22-alpine AS builder

WORKDIR /app
COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o ubj-nms-engine main.go

# Stage 2: Runtime container with ping and snmp capabilities
FROM alpine:3.20

RUN apk add --no-cache iputils ca-certificates tzdata

WORKDIR /app
COPY --from=builder /app/ubj-nms-engine /app/ubj-nms-engine

# Run engine
ENTRYPOINT ["/app/ubj-nms-engine"]
