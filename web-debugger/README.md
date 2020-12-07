# Debuggr Server

Web Debugger enables develoepers to debug any browser from any desktop in [Node.js](https://nodejs.org/) environment over LAN

  - NPM package
  - use through CLI

# Features

  - Debug  as many clients at once
  - Debug UI in real time

### Installation

Web Debugger requires [Node.js](https://nodejs.org/) to run.

Install the [Web Debugger](https://www.npmjs.com/package/web-debugger) CLI from npm

```sh
$ npm install web-debugger -g
```

Debug your website [It's so simple]

```sh
$ web-debugger path/to/website/ 
# OUTPUT : 
# Website server url => http://localhost:8080
# Debugger Dashboard url => http://localhost:8888
```


### Optional CLI arguments

You can configure how the CLI handle website and debugger 

| Argument | Use |
| ------ | ------ |
| -s or --server-port | port number at which the website will be served |
| -d or --debugger-port | port number at which the debugger dashboard will be served |
| -h or --help | Get help |


### Todos

 - Mimic Chrome web debugging tools

License
----

MIT


**Free Software?, Forever...**
