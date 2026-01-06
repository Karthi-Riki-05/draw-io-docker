/**
 * mermaid2drawio.js - Mermaid to Draw.io bridge
 * This file provides the bridge between Mermaid.js and Draw.io canvas
 */

// Path to mermaid folder
window.mxMermaidPath = window.mxMermaidPath || '/js/mermaid';

// Mermaid to Draw.io conversion function
window.mxMermaidToDrawio = window.mxMermaidToDrawio || function (mermaidCode, callback, errorCallback) {
    if (typeof mermaid !== 'undefined') {
        try {
            // Generate unique ID for the SVG
            var id = 'mermaid-svg-' + Math.random().toString(36).substr(2, 9);

            mermaid.render(id, mermaidCode).then(function (result) {
                if (callback) {
                    callback(result.svg);
                }
            }).catch(function (error) {
                console.error('Mermaid rendering error:', error);
                if (errorCallback) {
                    errorCallback(error);
                }
            });
        } catch (e) {
            console.error('Mermaid error:', e);
            if (errorCallback) {
                errorCallback(e);
            }
        }
    } else {
        var error = new Error('Mermaid.min.js is not loaded yet.');
        console.error(error.message);
        if (errorCallback) {
            errorCallback(error);
        }
    }
};

// Initialize mermaid with default config if not already initialized
if (typeof mermaid !== 'undefined' && !window.mermaidInitialized) {
    try {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true
            }
        });
        window.mermaidInitialized = true;
    } catch (e) {
        console.warn('Mermaid initialization warning:', e);
    }
}
