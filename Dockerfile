FROM nginx

ENV UPSTREAM http://localhost
ENV USERS {}
ENV REAL_CLIENT_IP_HEADER X-Real-IP
ENV TRUSTED_IP 127.0.0.1

COPY nginx.conf /etc/nginx/
COPY default.conf.template /etc/nginx/templates/
COPY tailscale.js /etc/nginx/
