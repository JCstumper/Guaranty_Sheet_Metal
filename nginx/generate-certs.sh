#!/bin/bash

# Define the directory to store SSL certificates within the nginx folder
NGINX_CERT_DIR="/etc/nginx/ssl"

# Create SSL directory within nginx folder if not exists
mkdir -p "$NGINX_CERT_DIR"

# Generate private key if not exists
if [ ! -f "$NGINX_CERT_DIR/privkey.pem" ]; then
    openssl genrsa -out "$NGINX_CERT_DIR/privkey.pem" 2048
fi

# Generate Certificate Signing Request (CSR) if not exists
if [ ! -f "$NGINX_CERT_DIR/csr.pem" ]; then
    openssl req -new -key "$NGINX_CERT_DIR/privkey.pem" -out "$NGINX_CERT_DIR/csr.pem" -subj "/CN=localhost"
fi

# Generate self-signed certificate if not exists
if [ ! -f "$NGINX_CERT_DIR/fullchain.pem" ]; then
    openssl x509 -req -in "$NGINX_CERT_DIR/csr.pem" -signkey "$NGINX_CERT_DIR/privkey.pem" -out "$NGINX_CERT_DIR/fullchain.pem" -days 365
fi
