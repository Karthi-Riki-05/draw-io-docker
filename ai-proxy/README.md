# Draw.io AI Proxy Server

This server provides a self-hosted AI endpoint for Draw.io diagram generation.

## Setup

1. **Get an OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key

2. **Configure the server**
   ```bash
   cd ai-proxy
   cp .env.example .env
   # Edit .env and add your OPENAI_API_KEY
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the server**
   ```bash
   npm start
   ```

The server will run on http://localhost:3001

## Using with Docker

The AI proxy is included in docker-compose.yml. Just set your API key:

```bash
# Create .env file in the root docker-draw folder
echo "OPENAI_API_KEY=sk-your-api-key-here" > .env

# Start everything
docker-compose up -d
```

## API

### POST /ai/generate

Generate a diagram from a natural language prompt.

**Request:**
```json
{
  "prompt": "Create a flowchart for user authentication",
  "options": {
    "model": "gpt-4o-mini"
  }
}
```

**Response:**
```json
{
  "result": "flowchart TD\n    A[User] --> B{Authenticated?}\n    ..."
}
```

## Supported Models

- `gpt-4o-mini` (default, fast and cheap)
- `gpt-4o` (more capable)
- `gpt-4-turbo` (best quality)
