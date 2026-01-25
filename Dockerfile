# Use the official image as base
ARG BASE_IMAGE=kart008/drawio-custom:v1.0.0
FROM ${BASE_IMAGE}

# Standard tomcat location
WORKDIR /usr/local/tomcat/webapps/draw

# Copy your customized webapp files into the image
COPY drawio-src/src/main/webapp /usr/local/tomcat/webapps/draw

# Copy custom entrypoint that preserves user's config files
COPY --chmod=755 custom-entrypoint.sh /custom-entrypoint.sh

# Override the default entrypoint
ENTRYPOINT ["/custom-entrypoint.sh"]

