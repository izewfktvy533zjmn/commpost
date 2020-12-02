#!/bin/bash

docker build --no-cache -t commpost:arm64 .
docker tag commpost:arm64 izewfktvy533zjmn/commpost:arm64
docker push izewfktvy533zjmn/commpost:arm64

exit 0
