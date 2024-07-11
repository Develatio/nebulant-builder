#!/bin/sh

set -e

npx playwright codegen --ignore-https-errors https://nebulant_builder
