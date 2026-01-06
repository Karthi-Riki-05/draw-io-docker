/**
 * Custom Button for Draw.io Toolbar
 * 
 * FILE TO EDIT: drawio-src/src/main/webapp/js/diagramly/App.js
 * 
 * Find the App.prototype.init function (around line 1000-1500) and add this code
 * AFTER the toolbar is created, typically after you see code like:
 *   this.toolbar = ...
 *   or
 *   this.menus = new Menus(this);
 * 
 * Search for "EditorUi.prototype.init.apply" and add the code AFTER that block.
 */

// ============================================================
// ADD THIS CODE SNIPPET TO App.js inside App.prototype.init
// ============================================================

// Add custom button to toolbar
if (this.toolbar != null && this.toolbar.container != null) {
    var customBtn = document.createElement('button');
    customBtn.className = 'geBtn';
    customBtn.style.cssText = 'margin-left: 10px; padding: 4px 12px; cursor: pointer;';
    customBtn.innerHTML = 'Custom';
    customBtn.title = 'My Custom Button';

    // Button click handler
    customBtn.addEventListener('click', function () {
        // Example: Show an alert
        alert('Custom button clicked!');

        // Or access the editor:
        // var graph = ui.editor.graph;
        // console.log('Selected cells:', graph.getSelectionCells());
    });

    // Find the toolbar and append the button
    var toolbar = document.querySelector('.geToolbar');
    if (toolbar) {
        toolbar.appendChild(customBtn);
    }
    else {
        // Fallback: append to menubar
        var menubar = document.querySelector('.geMenubar');
        if (menubar) {
            menubar.appendChild(customBtn);
        }
    }
}

// ============================================================
// ALTERNATIVE: Add as a proper toolbar item using the Actions API
// ============================================================

/*
// Add this in App.prototype.init after: EditorUi.prototype.init.apply(this, arguments);

this.actions.addAction('customAction', function()
{
    var ui = this;
    var graph = ui.editor.graph;
    
    // Your custom logic here
    ui.showDialog(new ErrorDialog(ui, 'Custom Dialog', 
        'This is a custom action!', 'OK').container, 
        340, 100, true, false);
    
}, null, null, 'Ctrl+Shift+K');

// Then add the button visually in the toolbar
*/
