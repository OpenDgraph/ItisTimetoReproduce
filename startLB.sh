#!/bin/sh

./traefik --entryPoints.web.address=":80" \
--providers.file.filename=dynamic_conf.yml \
--api.insecure=true \
--accesslog=true \
--api.dashboard=true