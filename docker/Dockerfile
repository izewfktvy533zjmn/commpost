FROM ubuntu:18.04

ENV ENDPOINT=
ENV PORT=

RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y git nodejs npm

RUN git clone https://github.com/izewfktvy533zjmn/commpost.git && \
    cd commpost && \
    npm install

WORKDIR commpost

ADD scripts/entrypoint.sh ./

CMD ["./entrypoint.sh"]
