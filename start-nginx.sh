#!/bin/sh

# Set default backend URL if not provided
export BACKEND_URL=${BACKEND_URL:-"placeholder.com"}

echo "🔗 Configuring nginx with backend URL: $BACKEND_URL"

# Substitute environment variables in nginx config
envsubst '${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Validate nginx configuration
nginx -t

# Start nginx
exec nginx -g "daemon off;"
