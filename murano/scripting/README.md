---
title: Murano Platform Scripting
---

# Lua Scripting API

Exosite's [Murano](../) can run Lua scripts on your behalf. These scripts have
a rich set of capabilities and may be used to offload processing from your
device.

If you're completely new to Exosite's APIs, you may want to read the [API overview](../get-started/) first.


## Overview

Scripts are written in Lua 5.1 scripting language. For general information
about Lua 5.1, please reference the [online Lua manual](http://www.lua.org/manual/5.1/).

Scripts may be added to an application either using the [Murano Portal](https://www.exosite.com/business/solutions), or by
using the [Exosite Client Tool](../exosite-cli/).


## Examples

Examples of Murano Lua scripts are made available in this repository:
[Example Platform Scripts Repository](https://github.com/exosite/murano-examples/tree/master/solutions/simple_graph)
[Example Of Home automation solution using Murano](https://github.com/exosite/home-automation-example)


## Script Execution

The Lua scripts are executed by Murano in reaction of a System event.
For example a [message is received from an Iot device](../services/device/#datapoint) or an Http request is made on your [Custom API endpoint](../services/webservice/#request).

The event will then trigger the execution of the related Lua script.

On the [Murano Portal](https://www.exosite.com/business/solutions) you can define event script under the solution *services* tab.
Or you can define the script in your project under the [event_handler folder](https://github.com/exosite/home-automation-example/tree/master/event_handler) of your project by using the service Alias as file name.

##### Event context arguments

Arguments are provided to the Lua script context depending on the event type. The arguments definition are available under the event section of each [Murano Services reference](../services/).


### Webservice API Routes

For convenience, you can directly define Lua scripts for each of your solution API routes.
The Murano Build-in Router will automatically parse and provide the [request data](../services/webservice/#request) in the Lua script.

You can then send back the response by using
```lua
response.headers = {} -- optinal
response.code = 200 -- optinal
response.message = "Hello world"
```
or
```lua
return "Hello world"
```
By default, the 200 Http status code is returned and any complex structure given as response, such as a Lua Table, will be converted in a JSON structure.


### Websocket API Routes

A websocket route is handle is a same manner as a webservice the incomming message information are available in the [websocketInfo argument](http://beta-docs.exosite.com/murano/services/websocket/#websocket_info)
The returned or response.message content will then be send back to the websocket channel.
```lua
response.message = "Hello world"
```
or
```lua
return "Hello world"
```

In addition you can also interact with the websocket channel with the following functions.
```lua
websocketInfo.send("Hello world") -- will send a message, useful to send back multiple messages.
websocketInfo.close() -- will close the websocket connection
```

### Libraries
Murano recommend the use of re-usable block of Lua code. For this purpose you can defined Lua modules from the [module folder](https://github.com/exosite/home-automation-example/tree/master/modules) of you project.


## The script environment

Scripts are completely isolated from one another, each running in its own,
secure environment, complete with direct access to all [Murano Services](../services/).

Scripts are scheduled to run with a limited number of 64000 instructions per execution.
Scripts also have memory usage limits of 1Mb, which if completely consumed
terminates the script with a 'not enough memory' error.  Please reference the
Lua 5.1 manual for how Lua manages memory. In particular:

- [Garbage Collection](http://www.lua.org/manual/5.1/manual.html#2.5)

- [Visibility Rules](http://www.lua.org/manual/5.1/manual.html#3.5)


### Lua tables and functions

The following global Lua tables and functions are available to Lua
scripts. They operate exactly as described in the Lua 5.1 reference manual.

* [`Basic Functions`](http://www.lua.org/manual/5.1/manual.html#5.1) (Note:
    the `dofile` function are not available to scripts.)

* [`string`](http://www.lua.org/manual/5.1/manual.html#5.4) (Note:
    the `string.dump` function are not available to scripts.)

* [`table`](http://www.lua.org/manual/5.1/manual.html#5.5)

* [`math`](http://www.lua.org/manual/5.1/manual.html#5.6)

* [`os`](http://www.lua.org/manual/5.1/manual.html#5.8) (Note:
    Only `os.difftime`, `os.date`, `os.time`, `os.clock` function are available to scripts.)


### Additional global tables, functions and properties

In addition to the Lua system resources the following global features are available to Lua scripts:

* *to_json()* To build a JSON string from a Lua table structure.
```lua
jsonString = to_json(luaTable)
```

* *from_json()* To build a Lua table from a JSON string.
```lua
luaTable = from_json(jsonString)
```
