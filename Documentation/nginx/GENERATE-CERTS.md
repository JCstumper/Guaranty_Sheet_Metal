# generate-certs.sh Documentation

## Overview

The `generate-certs.sh` script is responsible for creating SSL certificates for the hostname entered during setup. This script ensures that Nginx can serve HTTPS requests with valid certificates.

## Script Execution

The script performs the following operations:

- **SSL Certificate Directory**: Establishes a directory at `/etc/nginx/ssl` to store all SSL certificates.
- **Default Hostname**: Sets the hostname to `localhost` if no hostname is specified.
- **Directory Creation**: Ensures the SSL directory exists within the Nginx folder.
- **Private Key Generation**: Generates a private key if one does not already exist.
- **Certificate Signing Request (CSR)**: Creates a CSR if it does not already exist.
- **Self-Signed Certificate**: Generates a self-signed certificate if none exists.

## Usage

The script can be invoked directly or used as part of container startup scripts to automate SSL certificate management for Nginx.

---

For more details on managing SSL certificates or troubleshooting, refer to the [official OpenSSL documentation](https://www.openssl.org/docs/).
