#!/bin/bash
# Custom entrypoint that preserves user's PreConfig.js and PostConfig.js

DRAW_DIR="$CATALINA_HOME/webapps/draw"

# Increase max header size in Tomcat server.xml to prevent "Request header is too large" errors
TOMCAT_CONF="$CATALINA_HOME/conf/server.xml"
if [ -f "$TOMCAT_CONF" ]; then
    echo "Increasing Tomcat max header size..."
    # Add maxHttpHeaderSize after port="8080" (handles multi-line format)
    sed -i 's/port="8080"/port="8080" maxHttpHeaderSize="65536"/g' "$TOMCAT_CONF"
    sed -i 's/port="8443"/port="8443" maxHttpHeaderSize="65536"/g' "$TOMCAT_CONF"
fi

# Backup user's custom config files BEFORE the original entrypoint overwrites them
echo "Backing up custom config files..."
if [ -f "$DRAW_DIR/js/PreConfig.js" ]; then
    cp "$DRAW_DIR/js/PreConfig.js" /tmp/PreConfig.js.backup
    echo "  - PreConfig.js backed up"
fi
if [ -f "$DRAW_DIR/js/PostConfig.js" ]; then
    cp "$DRAW_DIR/js/PostConfig.js" /tmp/PostConfig.js.backup
    echo "  - PostConfig.js backed up"
fi

# Run the original entrypoint (this will overwrite the config files)
echo "Running original entrypoint..."
source /docker-entrypoint.sh

# Restore user's custom config files
echo "Restoring custom config files..."
if [ -f /tmp/PreConfig.js.backup ]; then
    cp /tmp/PreConfig.js.backup "$DRAW_DIR/js/PreConfig.js"
    echo "  - PreConfig.js restored!"
fi
if [ -f /tmp/PostConfig.js.backup ]; then
    cp /tmp/PostConfig.js.backup "$DRAW_DIR/js/PostConfig.js"
    echo "  - PostConfig.js restored!"
fi

# Start Tomcat
exec catalina.sh run
