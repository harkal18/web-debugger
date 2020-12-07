# Web Debugger

Web Debugger enables develoepers to debug any browser from any desktop in [Node.js](https://nodejs.org/) environment over LAN

### Features

 - Debug multiple clients at the same time
 - Real time console debugging
 
### Repositories

Web debugger has three major parts [directories]

* [Debugger Client](https://github.com/harkal18/web-debugger/tree/master/debugger-client) - This is an npm package which is compiled and sent with the target website. this package communicates with the server and makes it possible to debug a website
* [Debugger Dashboard](https://github.com/harkal18/web-debugger/tree/master/debugger-dashboard) - This is an angular app which lets the developer to have a look at all the connected clients and debug them all at once
* [Web Debugger](https://github.com/harkal18/web-debugger/tree/master/web-debugger) - This is npm CLI packge which makes things easier. it basically creates server and sends the client script with the website and also creates bridge between dashboard and client.

 
# Steps [SIMPLE]

  - Make sure your desktop and the mobile client are connected to the same netowork.
  - Install [Web Debugger CLI](https://www.npmjs.com/package/web-debugger)
  - Then follow Web Debugger CLI guidelines

# Story

> I have a ubuntu desktop,  an iphone and an ipad but not a mac
> And i have so many websites running which run well on chrome
> but not in safari[webkit] and there is no easy way to debug safari
> using non-mac desktop. So i came up with the idea of writing this utility
> which might also help other developers who have the same story
> _
> For debugging safari on ipone and ipad i use my android hotspot as a bridge
> i connect my iphone and ipad to android hotspot and then i port forward
> all incoming requests from wlan0 interface to my desktop IP 
> and rest is handled by this utility





### Todos

 - Real time UI debugging soon
 - Baically i ll be mimicing chrome dev tools 😎

License
----

MIT

**Free Software, Off course!**




