#!/bin/sh
set -e

if [ "$1" = 'nginx-daemon' ]; then
    echo "Starting NGINX"
    exec nginx -g "daemon off;";
fi

exec "$@"
