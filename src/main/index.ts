import {
  app,
  shell,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  Menu,
} from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
// import icon from "../../resources/icon.png?asset";

process.on("uncaughtException", function (_err) {
  console.error(_err);
  app.quit();
});

if (!app.requestSingleInstanceLock()) {
  app.exit();
}

interface WinAppearence {
  backgroundColor: string;
  titlebarSymbolColor: string;
}

// 设置此值可以决定应用的主题模式
// nativeTheme.themeSource = "dark";
const getWinAppearence = (): WinAppearence => {
  if (nativeTheme.shouldUseDarkColors) {
    return { backgroundColor: "#181818", titlebarSymbolColor: "#eee" };
  }
  return { backgroundColor: "#ffffff", titlebarSymbolColor: "#000000" };
};

function createWindow(): void {
  const appr = getWinAppearence();
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: true,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: appr.backgroundColor,
    titleBarOverlay: {
      color: "#0000",
      symbolColor: appr.titlebarSymbolColor,
      height: 36,
    },
    transparent: false,
    backgroundMaterial: "none",
    trafficLightPosition: { x: 20, y: 20 },
    // ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
      nodeIntegration: true,
      transparent: true,
      defaultFontSize: 14,
      v8CacheOptions: "code",
    },
  });
  mainWindow.webContents.insertCSS(`
    .app-splash{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${appr.backgroundColor};
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
    const WM_INITMENU = 0x0116;
    // 去掉标题栏唤起的系统菜单
    mainWindow.hookWindowMessage(WM_INITMENU, () => {
      mainWindow.setEnabled(false);
      mainWindow.setEnabled(true);
    });
    mainWindow.on("maximize", () =>
      mainWindow.webContents.send("on-win-max", true),
    );
    mainWindow.on("unmaximize", () =>
      mainWindow.webContents.send("on-win-max", false),
    );
  }
  // 不能拦截这个事件，否则右键无法唤起自定义菜单
  // win.on('system-context-menu', (_evt, pt) => {
  //   win.webContents.send('on-system-menu', pt)
  // })

  nativeTheme.on("updated", () => {
    const ar = getWinAppearence();
    mainWindow.setBackgroundColor(ar.backgroundColor);
    if (process.platform === "win32") {
      mainWindow.setTitleBarOverlay({
        color: "#0000",
        symbolColor: ar.titlebarSymbolColor,
        height: 36,
      });
    }
    // 不需要，web 那边有其他方式可以监听系统颜色变化
    // mainWindow.webContents.send(
    //   "on-theme-updated",
    //   nativeTheme.shouldUseDarkColors,
    // );
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}

app.on("second-instance", () => {
  // Someone tried to run a second instance, we should focus our window.
  if (BrowserWindow.getAllWindows().length) {
    BrowserWindow.getAllWindows()[0].focus();
  }
});

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
    optimizer.registerFramelessWindowIpc();
  });

  createWindow();

  // IPC test
  ipcMain.on("ping", () => console.log("pong"));
  Menu.setApplicationMenu(null);

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("render-process-gone", (_, webContents, details) => {
  console.log(details.reason);
  if (details.reason !== "crashed") return;
  webContents.reload();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
