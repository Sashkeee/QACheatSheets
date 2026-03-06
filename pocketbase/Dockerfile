# Dockerfile для PocketBase
# Скачивает официальный бинарник PocketBase с GitHub Releases
FROM alpine:3.19

ARG PB_VERSION=0.22.23

RUN apk add --no-cache wget unzip ca-certificates && \
    wget -q "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" \
         -O /tmp/pb.zip && \
    unzip /tmp/pb.zip -d /pb/ && \
    rm /tmp/pb.zip && \
    chmod +x /pb/pocketbase

EXPOSE 8090

# Данные хранятся в /pb/pb_data — mount volume сюда
VOLUME ["/pb/pb_data"]

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8090", "--dir=/pb/pb_data"]
