FROM ubuntu:18.04

ENV ENDPOINT=

EXPOSE 80

RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y git nodejs npm nginx

RUN git clone https://github.com/izewfktvy533zjmn/commpost.git && \
    cd commpost && \
    npm install

WORKDIR commpost

CMD ["./scripts/entrypoint.sh"]
