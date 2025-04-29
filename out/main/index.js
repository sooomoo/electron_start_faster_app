"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
const icon = path.join(__dirname, "../../resources/icon.png");
function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: true,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#0000",
      symbolColor: "#eee",
      height: 36
    },
    backgroundColor: "#121212",
    transparent: false,
    backgroundMaterial: "none",
    trafficLightPosition: {
      x: 20,
      y: 20
    },
    ...process.platform === "linux" ? { icon } : {},
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: true,
      transparent: true,
      defaultFontSize: 14
    }
  });
  mainWindow.webContents.insertCSS(`
    .app-splash{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #121212;
        color: #f00;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 100px;
        z-index: 9999;
      }
    `);
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  mainWindow.webContents.once("dom-ready", () => {
    mainWindow.setIgnoreMouseEvents(false);
  });
  mainWindow.show();
  mainWindow.webContents.setWindowOpenHandler((details) => {
    electron.shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  }
}
electron.app.requestSingleInstanceLock();
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
  });
  electron.ipcMain.on("ping", () => console.log("pong"));
  createWindow();
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
electron.app.on("second-instance", () => {
  if (electron.BrowserWindow.getAllWindows().length) {
    electron.BrowserWindow.getAllWindows()[0].focus();
  }
});
electron.app.on("render-process-gone", (_, webContents, details) => {
  console.log(details.reason);
  if (details.reason !== "crashed") return;
  webContents.reload();
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
