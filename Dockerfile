# Use the official image as base
FROM jgraph/drawio:latest

# Standard tomcat location
WORKDIR /usr/local/tomcat/webapps/draw

# Copy custom entrypoint that preserves user's config files
COPY --chmod=755 custom-entrypoint.sh /custom-entrypoint.sh

# Override the default entrypoint
ENTRYPOINT ["/custom-entrypoint.sh"]

