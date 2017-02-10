---
title: WebSocket
---

# Remote Procedure Call over WebSocket

## WebSocket Protocol

The WebSocket protocol provides a mean to establish a connection to One Platform and send multiple RPC requests in the same session. It matches the calls defined in the JSON RPC API [RPC](../portals/rpc/README.md) with the addition of [subscribe](#subscribe) and [unsubscribe](#unsubscribe) which are detailed here. 

Also authentication differs from the JSON RPC API [RPC](../portals/rpc/README.md). In the WebSocket implementation, we do authentication only once per session, but can issue multiple RPC calls asynchronous during the session.

## First Step: Establishing a Connection

You have to establish WebSocket connection to `wss://m2.exosite.com/ws`.  The first step is to do authentication with One Platform where you have to send an authentication JSON object [authentication](../portals/rpc/README.md#authentication).  Here's an example:

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

## Second Step: Issuing RPC Calls

Once a client pass the authentication, she can start sending requests to One Platform.  All the requests to One Platform via WebSocket are asynchronous.  A response corresponding to a request is bound to the given `id`.  The client has to pair the request and response by providing an unique `id` per request.  These requests will only include the `calls` part of the JSON RPC call as the following - skipping the `auth` part as authentication is already done.

```
{"calls": 
  [{
    "id": 1, 
      "procedure": "read", 
      "arguments": [
        <ResourceID>,
        {
          "starttime": 1376709504,
          "endtime": 1376709527,
          "limit": 1,
          "sort": "desc",
          "selection": "all"
        }
      ]
  }]
}
```

Response:

```
[{
  "status": "ok",
  "result": [[1376709527, 64.2]],
  "id": 1
}]
```

## Subscribe

`subscribe` allows a client to listen to new incoming data on a data resource. It is only available on the WebSocket API. Unlike other RPC procedures, one subscribe call may result in multiple asynchronous responses.

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

* `<RID/Alias>` specifies which resource to subscribe to: an RID string or alias in the form `{"alias": <alias>}`
* `since` indicates that data received after `<timestamp>` should be returned first. After that it will continuously receive new data as it is updated.

* `timeout` is a duration after which the client will not receive new data. The default value is `never`.

* All updated values will be sent to the client with the same `id` as the one in the `subscribe` request. The `subs_id` is optional to specify a subscription id different from the calls `id`.

Asynchronous data update:

```
[{
  "id": <id|subs_id>,
  "status": "ok",
  "result": [[<timestamp>, <value>]]
}]
```

These data updates can happen anytime while the subscription is active. If a `subs_id` has been provided in the initial subscribe call the `id` value will correspond to the `subs_id`, otherwise it will correspond to the `id` of the initial subscribe call.

## Unsubscribe

`unsubscribe` cancels subscription created by `subscribe`. The request body is defined as follows:

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

* `<RID/Alias>` is used to specify the unsubscribing resource: an RID string or alias in the form `{"alias": <alias>}`.  If a client doesn't give this field, `unsubscribe` call will unsubscribe all resources subscribed to `<subs_id>`. 

* `<id|subs_id>` is the subscription `id` that is to be cancelled. If the initial `subscribe` call specified a `subs_id` this value is to be used. If not, the initial `id` value should be referenced here.
