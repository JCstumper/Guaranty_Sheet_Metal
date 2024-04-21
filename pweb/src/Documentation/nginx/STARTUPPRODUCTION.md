# startupProduction.sh Documentation

## Overview

`startupProduction.sh` mirrors the functionality of `startup.sh` but is specifically tailored for production environments. It configures Nginx using the `nginx.conf.productionTemplate` in conjunction with environment settings from `docker-compose.production.yml`.

## Script Functions

- **Environment Substitution**: Substitutes `${HOST_NAME}` in the production template to generate a production-ready `nginx.conf`.
- **SSL Certificates**: Calls `generate-certs.sh` to ensure SSL certificates are correctly configured and up to date.
- **Starting Nginx**: Initiates Nginx to serve production traffic, with additional commands to ensure executable permissions for necessary scripts.

## Docker Integration

Designed as the entrypoint in the Docker container for the production environment, this script configures Nginx with `HOST_NAME` set to `gsminventory.com` and handles HTTPS on ports 80 and 443. It is part of a sequence that ensures dependencies like the frontend and API are ready before Nginx starts.

## Usage

This script is crucial for production deployment, ensuring Nginx is configured to handle real-world traffic as specified in the `docker-compose.production.yml`.

---

Explore the [Nginx deployment best practices](http://nginx.org/en/docs/) for advanced configurations and production strategies.
