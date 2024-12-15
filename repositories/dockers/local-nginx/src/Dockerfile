FROM ubuntu:24.04

RUN apt update -y

RUN (echo 5; echo 68) | apt install -y vim net-tools

RUN apt install -y libnss3-tools curl

RUN mkdir /cert

RUN apt install -y nginx

COPY ./vhost.conf /etc/nginx/conf.d/vhost.conf
COPY ./cert-files /cert

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]