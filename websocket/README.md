---
title: Remote Procedure Call via WebSocket
---

#WebSocket Protocol

The WebSocket protocol provides a mean to establish a connection to One Platform and send multiple RPC requests in the same session. It matches the calls defined in the JSON RPC API [RPC](../rpc/README.md) with the addition of subscribe and unsubscribe which are detailed here. 

Also authentication differs from the JSON RPC API [RPC](../rpc/README.md). In the WebSocket implementation, we do authentication only once per session, but can issue multiple RPC calls asynchronous during the session.

##First Step: Establishing a Connection

You have to establish WebSocket connection to `ws://m2.exosite.com/ws`.  The first step is to do authentication with One Platform where you have to send an authentication JSON object [authentication](../rpc/README.md#authentication).  The following is an example.

```
{
  "auth": {
    "cik": "bef3c7f91ac3562e6a2212345678901234567890"
  }
}
```

If the authentication is successful, One Platform's response is as follows:

```
{
  "status": "ok"
}
```

##Second Step: Issuing RPC Calls

Once a client pass the authentication, she can start sending requests to One Platform.  All the requests to One Platform via WebSocket are asynchronous.  A response corresponding to a request is bound to the given `id`.  The client has to pair the request and response by providing an unique `id` per request.  These requests will only include the `calls` part of the JSON RPC call as the following - skipping the `auth` part as authentication is already done.

```
{"calls": 
  [{
    "id": 1, 
      "procedure": "read", 
      "arguments": [
        <ResourceID>,
        {
          "starttime":1376709504,
          "endtime":1376709527,
          "limit":1,
          "sort":"desc",
          "selection":"all"
        }
      ]
  }]
}
```

Response:

```
{
  "status": "ok",
  "result": [[1376709527,64.2]],
  "id": 1
}
```

##Subscribe

`subscribe` is a new WebSocket specific API call which allows a client to listen to new incoming data on a data resource. It's unique difference is that one request can have multiple responses happening asynchronous.

The request body is defined as follows:

```
{
  "calls":
  [{
    "id": <id>, 
    "procedure": "subscribe", 
    "arguments": [
      <RID/Alias>,
      {
        "since": <timestamp>,
        "timeout": <milliseconds>,
        ("subs_id": <subs_id>)
      }
    ]
  }]
}
```

Response:

```
[{
  "id": <id>,
  "status": "ok"
}]
```

This response acknowledges the successful creation of a subscription.

* `since` allows a client to read all data from the given <timestamp> and continuously receive new data updated.

* `timeout` allows a client to specify a timeout value that after the specified time, the client will never receive new data updated. The default value is `never`.

* All updated values will be sent to the client with the same `id` as the one in the `subscribe` request. The `subs_id` is optional to specify a subscription id that is different from the calls `id`.

Asynchronous data update:

```
[{
  "id": <id|subs_id>,
  "status": "ok",
  "result": [[1376709527, 64.2]]
}]
```

These data updates can happen anytime while the subscription is active. If a `subs_id` has been provided in the initial subscribe call the `id` value will correspond to the `subs_id`, otherwise it will correspond to the `id` of the initial subscribe call.

##Unsubscribe

`unsubscribe` corresponds to the `subscribe` call and allows cancellation of a subscription. The request body is defined as follows:

```
[{
    "id": <id>
    "procedure": "unsubscribe", 
    "arguments": [
        <RID/Alias>,
        {"subs_id": <id|subs_id>}
    ]
}]
```

* `<RID/Alias>` is used to specify the unsubscribing resource.  If a client doesn't give this field, `unsubscribe` call will unsubscribe all resources subscribed to `<subs_id>`.

* `<id|subs_id>` is the subscription `id` that is to be cancelled. If the initial `subscribe` call had specified a `subs_id` this value is to be used - otherwise that initials `id` value should be referenced here.
