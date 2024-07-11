#!/bin/sh

set -e

case $1 in
    run-esbuild)
        exec yarn run start
        ;;
    *)
        exec "$@"
        ;;
esac
