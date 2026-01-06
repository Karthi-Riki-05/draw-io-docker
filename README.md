# Draw.io Local Development Setup

## Step 1: Clone the draw.io source code

Run this command in your `docker-draw` folder:

```powershell
git clone https://github.com/jgraph/drawio.git drawio-src
```

This creates:
```
docker-draw/
├── docker-compose.yml
├── docker-compose.override.yml
└── drawio-src/              # ← cloned repo
    └── src/
        └── main/
            └── webapp/      # ← this gets mounted to /usr/local/tomcat/webapps/draw
```

## Step 2: Start the container

```powershell
docker-compose up -d
```

## Step 3: Access draw.io in DEV MODE

Open your browser to:
```
http://localhost:8080/?dev=1
```

**The `?dev=1` query parameter is critical** - it tells draw.io to load unminified JavaScript files, so your edits take effect immediately without rebuilding.

## Step 4: Edit files and refresh

1. Edit files in `drawio-src/src/main/webapp/js/diagramly/`
2. Save the file
3. Refresh your browser (Ctrl+F5 for hard refresh)

## Troubleshooting

- **Changes not appearing?** Make sure you're using `?dev=1` in the URL
- **404 errors?** Check the volume mount path is correct
- **Permission issues?** On Windows, ensure Docker has access to the folder

## File to edit for toolbar customization

The main toolbar is configured in:
```
drawio-src/src/main/webapp/js/diagramly/App.js
```

Look for the `App.prototype.init` function or toolbar initialization code.
