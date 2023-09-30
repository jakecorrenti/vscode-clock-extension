# clock README

This project uses TypeScript and Microsoft Visual Studio Code's Extension API to
add a real-time clock to the status bar. When clicked on, the extension allows
the user to input a specified time and it will start a timer. After the first timer
is started, the values of the inputs will be persisted and become the default for
the next use case.

To use the extension, open the project in Visual Studio Code, press F5 or go to
Run > Start Debugging. This will bring up the Extension Development Host window.
There, on the bottom left you will see the real-time clock on the status bar. When
you want to start a timer, click it, input your desired time in hh:mm:ss format,
then when the timer is up and alert will be displayed and the original clock will
be presented again.

Resources:
https://code.visualstudio.com/api/get-started/your-first-extension
https://github.com/microsoft/vscode-extension-samples/tree/main/statusbar-sample
