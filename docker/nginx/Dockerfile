FROM nginx:1.19-alpine

RUN rm /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/
COPY certs/* /etc/nginx/
COPY entrypoint.sh /
COPY sites/* /etc/nginx/conf.d/

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx-daemon"]