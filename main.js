'use strict';
const electron = require('electron');

const config = require('/boot/appData/config.js');

// Module to control application life.
const app = electron.app;
app.commandLine.appendSwitch('--enable-viewport-meta', 'true');

// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');

global.appRoot = path.resolve(__dirname);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  var size = electron.screen.getPrimaryDisplay().size;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    //fullscreen:true,
    width: size.width,
    height: size.height,
    frame: false,

    kiosk: true,
    scrollBounce: false,
    title: 'Finish!',
    backgroundColor: '#000',
  });

  mainWindow.maximize();

  mainWindow.setMenu(null);

  var mainAddress = config.address;

  // and load the index.html of the app.
  mainWindow.loadURL(mainAddress);

  // Open the DevTools.
  if (config.showDevTools) mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-fail-load', function () {
    if (mainWindow && mainWindow.loadUrl) mainWindow.loadUrl(mainAddress);
  });

  function baseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }

  mainWindow.webContents.on('did-finish-load', function () {
   	mainWindow.webContents.insertCSS('html,body{ cursor: none; !important;}');
    //mainWindow.webContents.executeJavaScript(`document.querySelector("#outer").textContent = ${size.width}`);

    mainWindow.webContents.setZoomLevel(baseLog(1.2, size.width / 1920));
  });

  mainWindow.webContents.session.clearCache(function () {
    //some callback.
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
