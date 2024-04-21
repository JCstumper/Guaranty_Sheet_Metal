# nginx.conf.template Documentation

## Overview

This `nginx.conf.template` file is configured to set up Nginx for local development environments, providing basic settings for HTTP and HTTPS traffic handling on `localhost`.

## Configuration Details

- **Event Module**: Handles the number of worker connections, set to 1024, optimizing the server's ability to manage numerous simultaneous connections.
- **HTTP Module**:
  - **Security and Encoding**: Disables server tokens to minimize information leakage and sets UTF-8 as the default character set.
  - **HTTP Server**:
    - Listens on port 80, redirecting all HTTP traffic to HTTPS to enhance security.
  - **HTTPS Server**:
    - Listens on port 443, configured with SSL to secure the communication.
    - Utilizes SSL certificates located at `/etc/nginx/ssl/` within the docker container for encryption.
- **Proxy Configurations**:
    - **Root Location (`/`)** & **WebSocket Location (`/ws`)**: Proxies all HTTP and HTTPS requests to the frontend application running on port 3000, with headers configured to preserve the client's original IP address and the protocol used.
    - **API Location (`/api`)**: Proxies API requests to the backend service, with SSL verification disabled due to the use of self-signed certificates. Includes a rewrite rule to optionally strip the `/api` prefix, simplifying the request path.


## Usage in Docker

Configured as a template in Docker, this file uses environment substitution to set the `HOST_NAME` during container startup via the `startup.sh` script. This flexibility allows for dynamic configuration changes without modifying the core Nginx settings directly.

## Considerations

- **SSL/TLS Configuration**: Ensure the SSL paths are correctly set and the certificates are valid to prevent browser security warnings.
- **Proxy Settings**: Ensure that proxy settings are correctly configured to handle the intended traffic patterns and security requirements.

---

For detailed guidance on Nginx configuration, refer to the [Nginx Admin's Guide](http://nginx.org/en/docs/).
