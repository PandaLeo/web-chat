
import { ContextMenu, MenuItem } from "react-contextmenu";
import wfc from './wfc/client/wfc'

export function isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}

// 后两个参数是针对web的
export function popMenu(templates, data, menuId) {
    if (isElectron()) {
        let menu;
        menu = new remote.Menu.buildFromTemplate(templates);
        menu.popup(remote.getCurrentWindow());
    } else {
        return showBrowserMenu(templates, data, menuId);
    }
}

export function showBrowserMenu(menuTemplates = [], data, menuId) {
    let items = menuTemplates.map((template) => {
        return (
            <MenuItem data={{ data: data }} onClick={template.click}>
                {template.label}
            </MenuItem>
        );
    });
    return (
        <ContextMenu id={menuId} >
            {
                items
            }
        </ContextMenu>
    );
}

export function connect(userId, token) {
    wfc.connect(userId, token);
}

export function voipEventEmit(webContents, event, args) {
    if (isElectron()) {
        if (webContents) {
            // renderer/main to renderer
            webContents.send(event, args);
        } else {
            // renderer to main
            ipcRenderer.send(event, args);
        }
    } else {
        // wfc.eventEmitter.emit(event, args);
    }
}

export function voipEventOn(event, listener) {
    if (isElectron()) {
        // renderer
        if ((process && process.type === 'renderer')) {
            ipcRenderer.on(event, listener);
        } else {
            ipcMain.on(event, listener);
        }
    } else {
        // wfc.eventEmitter.on(event, listener);
    }
}

export function voipEventRemoveAllListeners(events) {
    if (isElectron()) {
        // renderer
        if ((process && process.type === 'renderer')) {
            ipcRenderer.removeAllListeners(events);
        } else {
            ipcMain.removeAllListeners(events);
        }
    } else {

    }
}

export const remote = null;
export const ipcRenderer = null;
export const ipcMain = null;
export const fs = null;
//export const BrowserWindow = require('electron').remote.BrowserWindow;
export const BrowserWindow = null;
export const ContextMenuTrigger = require("react-contextmenu").ContextMenuTrigger;
export const hideMenu = require("react-contextmenu").hideMenu;
