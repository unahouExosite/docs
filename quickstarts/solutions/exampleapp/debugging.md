---
title: Debugging with wscat
template: default
---

# Debugging with wscat

The example app defines a websocket API, `/debug/`, that may be used to experiment with service calls. Here's how to use it.

To connect to the endpoint, install [wscat](https://www.npmjs.com/package/wscat).

```
$ sudo npm install -g wscat
```

Here's an example of using a wscat session to debug a solution.

```
$ wscat -c https://my-solution.apps.exosite.io/debug
> User.listUsers()
  < [{"creation_date":1.467062795e+09,"email":"danweaver+test123@exosite.com","id":12,"name":"danweaver+test123@exosite.com","status":1}]
> Keystore.list()
  < {"keys":["sn_0004","sn_0003","sn_0001","sn_0002","sn_000a"],"quota":500}
> Keystore.set({"key":"foo","value":"bar"})
  < ""
> Keystore.get({"key":"foo"})
  < {"value":"bar"}
> Keystore.list()
  < {"keys":["sn_0003","sn_0004","sn_0001","sn_0002","sn_000a","foo"],"quota":500}
> to_json({"foo":"bar"})
  < "{\"foo\":\"bar\"}"
> from_json("{\"foo\":\"bar\"}")
  < {"foo":"bar"}
``` 

Notice a few things about this debugger:

- Commands may be one of: 
    - Murano service identifier (e.g. `User`, `Keystore`, `Timeseries`, `Device`, `Websocket`, `Twilio`, `Timer`, `Webservice`, `Email`)
    - Lua built-in global (e.g. `from_json()`, `to_json()`).
- arguments must be valid JSON syntax (`{"key":"foo"}`), not Lua (`{key="foo"}`)
- if you need shortcuts you can define them in the debug() module (see modules/debug.lua). For example, 
- the debugger provides full access to data, so the `/debug` and `/debug-command` endpoints should be removed for production
