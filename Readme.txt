About
This is a tool to detect when a specific agent gets disconnected from Finesse or is unable to communicate with the voice server, such in cases of Global Protect disconnects.
On disconnect the page will turn from green to red and play a sound every 10 seconds until connection is restored or application is quit.


Installation requirements

**Requires a Node.js installation to run.** (https://nodejs.org/)

1. Download this folder to local computer.
2. Start "FinesseWatcher.ps1" with Windows PowerShell

This will start the server and launch the web interface.

3. Choose agent and press select.
4. Application is now running. Server stating "Listening on 5000"

Select an unavailable agent to test the notification.
Sound can be muted by right clicking browser tab and choosing mute.


Bugs
-Set-ExecutionPolicy notice on server start, can be ignored
-Not tested in case of agent being busy in call

Todo
-Fail over to secondary voice server in case of outage

Node:
Requires libraries xml2js and express
