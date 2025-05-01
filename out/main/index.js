"use strict";
const electron = require("electron");
const path = require("path");
const utils = require("@electron-toolkit/utils");
process.on("uncaughtException", function(_err) {
  console.error(_err);
  electron.app.quit();
});
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.exit();
}
const getWinAppearence = () => {
  if (electron.nativeTheme.shouldUseDarkColors) {
    return { titlebarSymbolColor: "#eee" };
  }
  return { titlebarSymbolColor: "#000000" };
};
function createWindow() {
  const appr = getWinAppearence();
  const mainWindow = new electron.BrowserWindow({
    width: 900,
    height: 670,
    show: true,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: "hidden",
    // 设置了backgroundMaterial之后，最大化会有问题。但是启动时体验不错
    // 并且窗口的阴影会被保留
    backgroundMaterial: "mica",
    backgroundColor: "#0000",
    vibrancy: "hud",
    // 仅在 macOS 上可用
    titleBarOverlay: {
      color: "#0000",
      symbolColor: appr.titlebarSymbolColor,
      height: 36
    },
    trafficLightPosition: { x: 10, y: 10 },
    // ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: true,
      transparent: true,
      defaultFontSize: 14,
      v8CacheOptions: "code",
      disableHtmlFullscreenWindowResize: true,
      defaultFontFamily: {
        standard: "MiSans",
        serif: "serif",
        sansSerif: "sans-serif"
      }
    }
  });
  mainWindow.webContents.insertCSS(`
    .app-splash{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #0000;
        color: #f00;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 100px;
        z-index: 9999;
      }
    `);
  mainWindow.setIgnoreMouseEvents(true, { forward: true });
  mainWindow.show();
  mainWindow.webContents.once("dom-ready", () => {
    mainWindow.setIgnoreMouseEvents(false);
  });
  if (process.platform === "win32") {
    const WM_INITMENU = 278;
    mainWindow.hookWindowMessage(WM_INITMENU, () => {
      mainWindow.setEnabled(false);
      mainWindow.setEnabled(true);
    });
    mainWindow.on(
      "maximize",
      () => mainWindow.webContents.send("on-win-max", true)
    );
    mainWindow.on(
      "unmaximize",
      () => mainWindow.webContents.send("on-win-max", false)
    );
  }
  electron.nativeTheme.on("updated", () => {
    const ar = getWinAppearence();
    if (process.platform === "win32") {
      mainWindow.setTitleBarOverlay({
        color: "#0000",
        symbolColor: ar.titlebarSymbolColor,
        height: 36
      });
    }
  });
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
electron.app.on("second-instance", () => {
  if (electron.BrowserWindow.getAllWindows().length) {
    electron.BrowserWindow.getAllWindows()[0].focus();
  }
});
electron.app.whenReady().then(() => {
  utils.electronApp.setAppUserModelId("com.electron");
  electron.app.on("browser-window-created", (_, window) => {
    utils.optimizer.watchWindowShortcuts(window);
    utils.optimizer.registerFramelessWindowIpc();
  });
  createWindow();
  electron.ipcMain.on("ping", () => console.log("pong"));
  electron.Menu.setApplicationMenu(null);
  electron.app.on("activate", function() {
    if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
  });
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
