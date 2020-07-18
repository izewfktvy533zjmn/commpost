#!/bin/bash

/usr/sbin/nginx -c nginx/nginx.config &
node api/v1/index.js
tail -f /dev/null
