"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
let statusBarItem;
let timerDate;
let persistedTimerInput;
let isTimer = false;
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "clock" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('clock.Timer', async function () {
        // The code you place here will be executed every time your command is executed
        // need to load the persisted value if it exists
        const resp = await vscode.window.showInputBox({
            value: getPersistedTimerInput(),
            placeHolder: 'Enter value for timer (hh:mm:ss)'
        });
        if (resp !== undefined && resp !== null) {
            persistedTimerInput = resp;
            let inputAsSeconds = getUserInputAsSeconds(resp);
            if (inputAsSeconds === 0) {
                return;
            }
            let futureDate = new Date();
            futureDate.setSeconds(new Date().getSeconds() + inputAsSeconds);
            timerDate = futureDate;
            isTimer = true;
            writeTimerValue();
        }
        if (isTimer) {
            setInterval(setTimerTime, 1000);
        }
    });
    context.subscriptions.push(disposable);
    // create a new status bar
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'clock.Timer';
    context.subscriptions.push(statusBarItem);
    setInterval(setClockTime, 1000);
}
exports.activate = activate;
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function getPersistedTimerInput() {
    return fs.existsSync('./timer-value.txt') ? fs.readFileSync('./timer-value.txt', 'utf-8') : '';
}
function writeTimerValue() {
    fs.writeFileSync('./timer-value.txt', persistedTimerInput);
}
function setTimerTime() {
    if (isTimer) {
        let current = new Date();
        let hourDiff = timerDate.getHours() - current.getHours();
        let minDiff = timerDate.getMinutes() - current.getMinutes();
        let secDiff = timerDate.getSeconds() - current.getSeconds();
        if (hourDiff === 0 && minDiff === 0 && secDiff === 0) {
            statusBarItem.text = '0h 0m 0s';
            vscode.window.showInformationMessage("Alert! Your timer is up!");
            isTimer = false;
        }
        else {
            statusBarItem.text = `${Math.abs(hourDiff)}h ${Math.abs(minDiff)}m ${Math.abs(secDiff)}s`;
        }
        statusBarItem.show();
    }
}
function setClockTime() {
    if (!isTimer) {
        let time = new Date().toLocaleTimeString();
        statusBarItem.text = time;
        statusBarItem.show();
    }
}
function getUserInputAsSeconds(input) {
    let regexp = new RegExp('[0-9]+:[0-5][0-9]:[0-5][0-9]');
    if (!regexp.test(input)) {
        vscode.window.showWarningMessage('Input is not in a valid format of hh:mm:ss');
        return 0;
    }
    let hours = input.substring(0, input.indexOf(':'));
    let minutes = input.substring(input.indexOf(':') + 1, input.lastIndexOf(':'));
    let seconds = input.substring(input.lastIndexOf(':') + 1, input.length);
    return Number(seconds) + (Number(minutes) * 60) + (Number(hours) * 3600);
}
//# sourceMappingURL=extension.js.map