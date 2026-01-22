# Docker Hub images for docker-draw

Prebuilt images are available on Docker Hub under the `kart008` account.

Pull the versioned image:

```powershell
docker pull kart008/drawio-custom:v1.0.0
```

Start using the images with Docker Compose (this `docker-compose.yml` references the versioned images):

```powershell
docker compose pull
docker compose up -d
```

Or run the container directly:

```powershell
docker run -d --name drawio -p 8080:8080 -p 8443:8443 kart008/drawio-custom:v1.0.0
```

Notes:
- Replace `v1.0.0` with the desired tag if newer versions are available.
- Ensure Docker is logged in (`docker login`) if pushing or pulling private images.

## Check Docker Hub login

Quick local check (PowerShell):

```powershell
docker info | Select-String 'Username'
```

If this prints your Docker Hub username you are logged in. If nothing is printed, run:

```powershell
docker login
```

Non-interactive login (PowerShell example using an environment variable):

```powershell
#$env:DOCKER_PASSWORD should be set securely before running
$env:DOCKER_PASSWORD | docker login --username your-username --password-stdin
```

## Make a repository private

Web UI (recommended):

1. Sign in at https://hub.docker.com
2. Go to `Repositories` → select `kart008/drawio-custom`
3. Open `Settings` and toggle `Repository visibility` to **Private**, then save

Note: Private repositories may require a paid Docker Hub plan.

API (automation):

1. Request a token (replace credentials):

```bash
curl -s -H "Content-Type: application/json" -X POST -d '{"username":"YOUR_USER","password":"YOUR_PASS"}' https://hub.docker.com/v2/users/login/ | jq -r .token
```

2. Patch the repository to private (replace `YOUR_TOKEN`):

```bash
curl -s -H "Authorization: JWT YOUR_TOKEN" -H "Content-Type: application/json" \
	-X PATCH -d '{"is_private": true}' \
	https://hub.docker.com/v2/repositories/kart008/drawio-custom/
```

## Verify repository visibility

Using the API:

```bash
curl -s https://hub.docker.com/v2/repositories/kart008/drawio-custom/ | jq '.is_private'
```

If the output is `true` the repository is private.
