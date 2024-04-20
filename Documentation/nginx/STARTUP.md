# startup.sh Documentation

## Overview

The `startup.sh` script is used to configure the Nginx server at container startup for development environments. It dynamically substitutes environment variables into the `nginx.conf` based on the `nginx.conf.template`.

## Operations

- **Environment Substitution**: Uses `envsubst` to replace `${HOST_NAME}` in `nginx.conf.template` to generate `nginx.conf`.
- **SSL Certificate Generation**: Executes the `generate-certs.sh` script to manage SSL certificates.
- **Nginx Start**: Launches Nginx in the foreground to serve traffic immediately upon container start.

## Docker Integration

This script is executed as the entrypoint in the Docker container for the development environment, ensuring Nginx is correctly configured with the hostname set to `localhost` and listening on ports 80 and 443 for HTTP and HTTPS traffic, respectively.

## Usage

This script is vital for the Docker container's startup process, setting up Nginx based on the development environment settings detailed in the `docker-compose.yml`.

---

Refer to the [Docker and Nginx documentation](https://www.docker.com/) for more details on container management.
