# nginx.conf.productionTemplate Documentation

## Overview

The `nginx.conf.productionTemplate` is designed for use in production environments, providing configurations that ensure secure, efficient, and reliable server operation. This template is structured similarly to the `nginx.conf.template` used in development, facilitating a seamless transition from development to production by maintaining consistency in handling HTTP and HTTPS traffic.

## Configuration Details

- **Event Module**: Manages worker connections, set to 1024, optimizing the server's capacity to handle multiple simultaneous connections efficiently.
- **HTTP Module**:
  - **Security and Encoding**: Server tokens are turned off to minimize data leakage about the server, and UTF-8 is set as the default charset for content.
  - **HTTP Server**:
    - Configured to listen on port 80 for HTTP traffic, automatically redirecting all requests to HTTPS to ensure secure data transmission.
  - **HTTPS Server**:
    - Listens on port 443 with SSL configuration enabled, handling secure HTTPS connections.
    - Utilizes SSL certificates specified at `/etc/nginx/ssl/` within the docker container to encrypt communications.

- **Proxy Configurations**:
  - **Root Location (`/`)** & **WebSocket Location (`/ws`)**: Proxies all HTTP and HTTPS requests to the frontend application running on port 3000, with headers configured to preserve the client's original IP address and the protocol used.
  - **API Location (`/api`)**: Proxies API requests to the backend service, with SSL verification disabled due to the use of self-signed certificates. Includes a rewrite rule to optionally strip the `/api` prefix, simplifying the request path.

## Usage in Docker

This template is implemented in the Docker production environment as outlined in the `docker-compose.production.yml`, utilizing environment substitution  via the `startupProduction.sh` script to dynamically set the `HOST_NAME`.

## Considerations

- **SSL/TLS Configuration**: Ensure the SSL paths are correctly set and the certificates are valid to prevent browser security warnings.
- **Proxy Settings**: Ensure that proxy settings are correctly configured to handle the intended traffic patterns and security requirements.

---

For further refinement and tuning of Nginx configurations, refer to the [Nginx Beginner's Guide](http://nginx.org/en/docs/beginners_guide.html) and the [Nginx Admin's Guide](http://nginx.org/en/docs/).
