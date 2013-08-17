## Exosite JSON RPC API

### HTTP Format

_TODO_

### Libraries

Wrapper libraries for this API are available:

* Python: [pyonep](https://github.com/exosite-labs/pyonep)
* Java: [javaonep](https://github.com/exosite-labs/javaonep)
* C++: [cpponep](https://github.com/exosite-labs/cpponep)
* .NET: [clronep](https://github.com/exosite-labs/clronep)


### Request Message

A request message to the JSON RPC has the following structure:

```javascript

{"auth": {"cik": "e469e336ff9c8ed9176bc05ed7fa40daaaaaaaaa"},
 "calls": [
    ["id": 1, 
     "procedure": "read", 
     "arguments": [
         "34eaae237988167d90bfc2ffeb666daaaaaaaaaa", 
         {"starttime":1376709504,
          "endtime":1376709527,
          "limit":1,
          "sort":"desc",
          "selection":"all"}]]
 ]}
```

`"auth"` provides the authentication for the procedures listed in "calls", and can take several forms: 

* `{"cik": CIK}` authenticates as the Client identified by the given CIK.
* `{"cik": CIK, "client_id": RID}` authenticates as the given Client if the CIK identifies an ancestor of the given Client.
* `{"cik": CIK, "resource_id": RID}` authenticate as the Owner of the given Resource if the CIK identifies as an ancestor of the given Resource.

`"id"` is a unique identifier for the call, and may be a number or a string of up to 40 characters. A matching ID is returned in the response. If `"id"` is omitted for a particular call, no response will be returned. If `"id"` is omitted for all calls in `"calls"`, no response will be given for the entire request message.

`"procedure"` and `"arguments"` are specific to individual procedures and are documented below. 


### Response Message


If the call succeeds, a response message from the JSON RPC is a list of responses to the calls made in the request:

```javascript
[{"id": 0,
  "status": "ok",
  "result": [[1376709527, 64.2]]}]
```

`"id"` identifies the corresponding request call (list order doesn't). `"result"`'s presence and value are procedure-specific and are documented below. 

If a particular call fails, the response message is still a list, but `"status"` for the response for that call is set to something besides "ok", and an `"error"` key is included:

```javascript
[{"id": 0,
  "status": "fail",
  "error": {"code": 501,
            "message": "Error",
            "context": TODO}
```

If the request message causes an error not associated with any given call, the response message will instead look like this:

```javascript
{"error": {"code": 401,
           "message": "Invalid",
           "context": TODO}}
```

`"code"` may have one of the following values:

* `-1` The Request Message is not a proper JSON string
* `400` The Request is not properly formed
* `401` The Auth credentials are invalid
* `500` An internal error occured will generating the Response Message.  Individual Call Requests may or may not have completed successfully.
* `501` The application of the given Arguments to the specified Procedure is not supported.


_TODO: procedure calls_

