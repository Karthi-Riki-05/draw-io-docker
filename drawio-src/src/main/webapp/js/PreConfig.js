(function () {
	try {
		var s = document.createElement('meta');
		// Added 'unsafe-eval' to script-src which is often needed for dev-mode hot reloading
		s.setAttribute('content', "default-src 'self'; script-src 'self' https://storage.googleapis.com https://apis.google.com https://docs.google.com https://code.jquery.com 'unsafe-inline' 'unsafe-eval'; connect-src 'self' http://localhost:3001 https://*.dropboxapi.com https://api.trello.com https://api.github.com https://raw.githubusercontent.com https://*.googleapis.com https://*.googleusercontent.com https://graph.microsoft.com https://*.1drv.com https://*.sharepoint.com https://gitlab.com https://*.google.com https://fonts.gstatic.com https://fonts.googleapis.com https://api.openai.com https://generativelanguage.googleapis.com https://api.anthropic.com; img-src * data:; media-src * data:; font-src * about:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; frame-src 'self' https://*.google.com;");
		s.setAttribute('http-equiv', 'Content-Security-Policy');
		var t = document.getElementsByTagName('meta')[0];
		t.parentNode.insertBefore(s, t);
	} catch (e) { }
})();

/** * DEVELOPMENT FLAGS 
 * These bypass app.min.js and force the app to load individual /js source files
 */
window.urlParams = window.urlParams || {};
urlParams['dev'] = '1';         // CRITICAL: Loads individual source files instead of app.min.js
urlParams['test'] = '1';        // Enables experimental features
urlParams['draw-dev'] = '1';    // Enables internal draw.io dev tools
urlParams['ui'] = 'sketch';     // AI tools are most prominent in the 'Sketch' theme
urlParams['ai'] = '1';          // Hard-force AI parameter
urlParams['analytics'] = '0';   // Disable tracking for dev

/** * PRO BRANDING & SYSTEM CONFIG 
 */
window.DRAWIO_CONFIG = {
	"brandName": "MyDevAI",
	"enableAi": true,           // Unlocks the "Sparkle" button logic
	"mermaid": true,            // Required for AI diagram generation
	"version": Date.now().toString(), // Forces a refresh of settings
	"override": true,           // Overrides user's previous browser settings
	"showStartScreen": false,   // Skips the "Open/Create" splash screen
	"defaultLibraries": "general;flowchart;basic;arrows2",
	"css": ".geItem[title*='About'], .geItem[title*='Help'] { display: none !important; }"
};

window.EXPORT_URL = '/service/0';
window.PLANT_URL = '/service/1';
window.DRAWIO_BASE_URL = window.location.origin;
window.DRAWIO_VIEW_URL = window.location.origin + '/js/viewer.min.js';

// Disable all external cloud storage for a clean dev workspace
urlParams['sync'] = 'manual';
urlParams['db'] = '0'; // Dropbox
urlParams['gh'] = '0'; // GitHub
urlParams['tr'] = '0'; // Trello
urlParams['gapi'] = '0'; // G-Drive
urlParams['od'] = '0'; // OneDrive

urlParams['gl'] = '0'; // GitLab

console.log("Max Dev Config Loaded. Current UI:", urlParams['ui']);