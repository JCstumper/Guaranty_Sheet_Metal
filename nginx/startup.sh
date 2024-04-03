#!/bin/bash

# Substitute environment variables
envsubst '${HOST_NAME}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Generate certificates
/etc/nginx/generate-certs.sh

# Start nginx
nginx -g 'daemon off;'
