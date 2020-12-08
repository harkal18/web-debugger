import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import arg from "arg";
import { table } from "table";
import express from 'express';
import path from 'path';
import { DebuggerServerHandler } from './DebuggerServerHandler';
import { ClientServerHandler } from './ClientServerHandler';
import { SessionsHandler } from './SessionsHandler';
import { LogsHandler } from './LogsHandler';

const { nickname, version } = require('../package.json');

// clear();
console.log(
    chalk.yellow(
        figlet.textSync(nickname, { horizontalLayout: 'full' })
    )
);

const args = arg({
    "--server-port": Number,
    "--debugger-port": Number,
    "--help": Boolean,
    "--version": Boolean,
    "-s": "--server-port",
    "-d": "--debugger-port",
    "-h": "--help",
    "-v": "--version",
});
const command = {
    directory: args._[0] || process.cwd(),
    serverPort: args["--server-port"] || 8080,
    debuggerPort: args["--debugger-port"] || 8888,
    help: args["--help"] || false,
    version: args["--version"] || false,
};

if (command.version) {
    clear();
    console.log(
        chalk.yellow(
            figlet.textSync(nickname, { horizontalLayout: 'full' })
        ),
        chalk.yellow(`v${version}`)
    );
} else {
    if (command.help) {
        // show help
    } else {
        const sessionsHandler: SessionsHandler = new SessionsHandler();
        const logsHandler: LogsHandler = new LogsHandler();
        new ClientServerHandler(command.directory, command.serverPort, sessionsHandler, logsHandler);
        new DebuggerServerHandler(command.debuggerPort, sessionsHandler, logsHandler);
        
        console.log(chalk.yellow(`Serving ${command.directory} at http://localhost:${command.serverPort}`));
        console.log(chalk.yellow(`Serving debugger at http://localhost:${command.debuggerPort}`));

    }
}
