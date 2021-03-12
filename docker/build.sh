#!/bin/bash

docker build --no-cache -t commpost:arm64 .
docker tag commpost:arm64 sosomasox/commpost:arm64
docker push sosomasox/commpost:arm64

exit 0
