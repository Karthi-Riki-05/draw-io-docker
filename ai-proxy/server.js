/**
 * Draw.io AI Proxy Server
 * 
 * This server acts as a proxy between Draw.io and OpenAI/Anthropic APIs
 * to generate diagrams from natural language prompts.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: '*/*' }));

// Parse body that might come as string (from mxXmlRequest)
app.use((req, res, next) => {
    if (typeof req.body === 'string' && req.body.length > 0) {
        try {
            req.body = JSON.parse(req.body);
        } catch (e) {
            // Not JSON, leave as-is
        }
    }
    next();
});

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// System prompt for diagram generation - generates Draw.io native XML
const SYSTEM_PROMPT = `You are an expert Diagram Architect for Draw.io.
Your goal is to transform descriptions into professional, native mxGraph XML.

CRITICAL: Output ONLY valid <mxGraphModel> XML. No markdown code blocks, no text explanations.

DIAGRAM MODES & STYLES:
1. FLOWCHART: 
   - Process: "rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;"
   - Decision: "rhombus;whiteSpace=wrap;html=1;fillColor=#fff2cc;strokeColor=#d6b656;"
   - Start/End: "ellipse;whiteSpace=wrap;html=1;fillColor=#d5e8d4;strokeColor=#82b366;"
2. ARCHITECTURE/CLOUD:
   - Cloud/Service: "ellipse;shape=cloud;whiteSpace=wrap;html=1;fillColor=#f8cecc;strokeColor=#b85450;"
   - Database: "shape=cylinder3;whiteSpace=wrap;html=1;boundedLbl=1;backgroundOutline=1;size=15;fillColor=#f5f5f5;strokeColor=#666666;"
   - Server: "rounded=0;whiteSpace=wrap;html=1;fillColor=#e1d5e7;strokeColor=#9673a6;"
3. INTERFACE/UML:
   - User/Actor: "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;outlineConnect=0;"
   - Class: "swimlane;fontStyle=1;align=center;verticalAlign=top;childLayout=stackLayout;horizontal=1;startSize=26;horizontalStack=0;resizeParent=1;resizeParentMax=0;resizeLast=0;collapsible=1;marginBottom=0;whiteSpace=wrap;html=1;"

CONNECTOR STYLES:
- Arrow: "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;endArrow=classic;endFill=1;"
- Dashed: "edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;dashed=1;"
- Bidirectional: "edgeStyle=orthogonalEdgeStyle;rounded=0;html=1;endArrow=classic;startArrow=classic;startFill=1;endFill=1;"

LAYOUT RULES:
- Start x=200, y=50
- Vertical step: 100px between rows
- Horizontal step: 180px between columns
- Standard sizes: Rectangles (140x60), Diamonds (80x80), Clouds (120x80), Start/End (80x40)

XML STRUCTURE:
<mxGraphModel dx="1000" dy="600" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="850" pageHeight="1100">
  <root>
    <mxCell id="0"/>
    <mxCell id="1" parent="0"/>
    <!-- Vertex cells with parent="1" -->
    <mxCell id="node1" value="Label" style="..." vertex="1" parent="1">
      <mxGeometry x="200" y="50" width="140" height="60" as="geometry"/>
    </mxCell>
    <!-- Edge cells connecting vertices -->
    <mxCell id="edge1" value="" style="..." edge="1" parent="1" source="node1" target="node2">
      <mxGeometry relative="1" as="geometry"/>
    </mxCell>
  </root>
</mxGraphModel>

IMPORTANT:
- Use unique sequential IDs (node1, node2, edge1, edge2, etc.)
- Every edge MUST have source and target attributes pointing to valid vertex IDs
- All vertex cells need vertex="1" and all edge cells need edge="1"
- Include the full mxGraphModel wrapper with attributes`;

// AI Generation endpoint
app.post('/ai/generate', async (req, res) => {
    try {
        console.log('=== INCOMING REQUEST ===');
        let body = req.body;

        // 1. Parsing Logic for draw.io's various request formats
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch (e) { console.log('String body not JSON'); }
        }

        if (typeof body === 'object' && !body.prompt) {
            const keys = Object.keys(body);
            if (keys.length === 1 && keys[0].startsWith('{')) {
                try { body = JSON.parse(keys[0]); } catch (e) { }
            }
        }

        // Support both 'prompt' and 'text' keys (draw.io uses 'text' often)
        const prompt = body.prompt || body.text;
        const options = body.options || {};

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // 2. OpenAI API Call
        const completion = await openai.chat.completions.create({
            model: options?.model || 'gpt-4o-mini',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt }
            ],
            temperature: 0.3, // Lower temperature = more stable XML structure
            max_tokens: 4000
        });

        let result = completion.choices[0].message.content;

        // 3. Robust XML Extraction (Strips markdown backticks)
        let extractedXml = "";

        // Try to extract from code blocks first
        const codeBlockMatch = result.match(/```(?:xml)?\s*([\s\S]*?)\s*```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
            extractedXml = codeBlockMatch[1].trim();
        }
        // Then try to find mxGraphModel directly
        else {
            const modelMatch = result.match(/<mxGraphModel[\s\S]*<\/mxGraphModel>/);
            if (modelMatch) {
                extractedXml = modelMatch[0].trim();
            }
        }

        // Final fallback - use the whole result if it looks like XML
        if (!extractedXml && result && result.includes('<mxGraphModel')) {
            extractedXml = result.trim();
        }

        // If still no XML, return the raw result (might be an error message from AI)
        if (!extractedXml) {
            extractedXml = result || '';
        }

        console.log('Generated XML Preview:', extractedXml.substring(0, 200));

        // 4. Send response back to Draw.io
        // We return an object with a 'result' key because that's what your client-side expects
        res.json({ result: extractedXml });

    } catch (error) {
        console.error('AI Generation error:', error);
        res.status(500).json({
            error: error.message || 'Failed to generate diagram',
            message: 'Error ' + (error.status || 500)
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'drawio-ai-proxy' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Draw.io AI Proxy server running on http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log(`  POST /ai/generate - Generate diagram from prompt`);
    console.log(`  GET /health - Health check`);
});
