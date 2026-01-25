# Local build and internal registry instructions

This project no longer relies on Docker Hub for distributing images. Use the local build flow or an internal registry instead.

1) Build and run locally (recommended for development)

```powershell
docker compose build
docker compose up -d
```

2) Build with a specific base image (if you host a base image in an internal registry)

```bash
docker build --build-arg BASE_IMAGE=my-registry.example.com/jgraph/drawio:latest -t my-registry.example.com/kart008/drawio-custom:v1.0.0 .
docker push my-registry.example.com/kart008/drawio-custom:v1.0.0
```

3) Notes about `BASE_IMAGE`
- The repository `Dockerfile` accepts a build argument `BASE_IMAGE` (defaults to a local image `local/jgraph-drawio:latest`).
- To avoid any external registry pulls, build and tag the required base image locally under `local/jgraph-drawio:latest` before building the application image, or point `BASE_IMAGE` to an internal registry.

4) Remove Docker Hub credentials
- If you previously used Docker Hub credentials stored in CI or elsewhere, remove or rotate them in your CI provider and local environment.

5) Example: build base image locally and then app image

```bash
# build base image (example: produce a local base image named local/jgraph-drawio:latest)
docker build -t local/jgraph-drawio:latest ./path-to-base-image

# build app image using default build args
docker build -t drawio-app:local .
```

If you want this file rewritten into a short README for internal registry usage instead, let me know which registry hostname and conventions you prefer.
