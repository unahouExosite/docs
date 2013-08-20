## Exosite JSON RPC API

The JSON RPC API provides full featured access to data on the One Platform. It is intended for applications that need to do more than just read and write individual points.(For an API designed for bandwidth-constrained environments, see the HTTP Data Interface.)


### Libraries

Wrapper libraries are available for this API:

* Python: [pyonep](https://github.com/exosite-labs/pyonep)
* Java: [javaonep](https://github.com/exosite-labs/javaonep)
* C++: [cpponep](https://github.com/exosite-labs/cpponep)
* .NET: [clronep](https://github.com/exosite-labs/clronep)


### HTTP Request/Response Format

JSON RPC are HTTP POST requests with a body containing a JSON-encoded call. Here is an example of an HTTP request, with JSON formatted for readability:

```
POST /api:v1/rpc/process
Host: m2.exosite.com:80
Content-Type: application/json; charset=utf-8
Content-Length: 235
Accept-Encoding: identity

{
    "auth": {
        "cik": "5de0cfcf7b5bed2ea7a801234567890123456789"
    }, 
    "calls": [
        {
            "arguments": [
                {
                    "alias": "temperature"
                }, 
                {
                    "endtime": 1376957311, 
                    "limit": 3, 
                    "selection": "all", 
                    "sort": "desc", 
                    "starttime": 1
                }
            ], 
            "id": 56, 
            "procedure": "read"
        }
    ]
}
```

HTTP Response:

```
HTTP/1.1 200 OK
Date: Tue, 20 Aug 2013 00:08:27 GMT
Content-Length: 90
Content-Type: application/json; charset=utf-8
Connection: keep-alive
Server: nginx

[
    {
        "id": 56, 
        "result": [
            [
                1376957195, 
                72.2
            ], 
            [
                1376957184, 
                72.3
            ], 
            [
                1376951473, 
                72.5
            ]
        ], 
        "status": "ok"
    }
]
```



### Request Message

A request message to the JSON RPC has the following structure:

```

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

```
[{"id": 0,
  "status": "ok",
  "result": [[1376709527, 64.2]]}]
```

`"id"` identifies the corresponding request call (list order doesn't). `"result"`'s presence and value are procedure-specific and are documented below. 

If a particular call fails, the response message is still a list, but `"status"` for the response for that call is set to something besides "ok", and an `"error"` key is included:

```
[{"id": 0,
  "status": "fail",
  "error": {"code": 501,
            "message": "Error",
            "context": TODO}
```

If the request message causes an error not associated with any given call, the response message will instead look like this:

```
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


## Procedures

###read 

Read data from the specified resource.

```
{
    "procedure": "read",
    "arguments": [
        <rid>,
        {
            "starttime": 1
            "endtime": 1376951491,
            "sort": "desc",
            "limit": 1,
            "selection": "all",
        }
    ],
    "id": 1
}
```

* `<rid>` is the identifier of the device to read. 
* `"starttime"` and `"endtime"` are [Unix timestamps](http://en.wikipedia.org/wiki/Unix_time) that specify the window of time to read.
* `"sort"` defines the order in which points should ordered, ascending (`"asc"`) or descending (`"desc"`) timestamp order. 
* `"limit"` sets a maximum on the number of points to return. `"limit"` is applied after the results have been sorted, so different values of `"sort"` will return different sets of points.
* `"selection"` supports downsampling. Specify `"all"` to return all datapoints. `"givenwindow"` splits the time window evenly into `"limit"` parts and returns at most one point from each part. `"autowindow"` samples evenly across points in the time window up to `"limit"`. Note that these options provide a blind sampling function, not averaging or other type of rollup calculation.


#####response

Response is a list of [timestamp](http://en.wikipedia.org/wiki/Unix_time), value pairs.

```javascript

// float resource 
[[1376709527,64.2]]

// string resource 
[[1376950234,"World"],[1376950230,"Hello"]]

// integer resource 
[[1376950410,11],[1376950405,10]]

// boolean resource 
[[1376950566,"false"],[1376950563,"true"],[1376950561,"true"],[1376950559,"true"]]
```

---

###write

Writes a single value to the resource specified.

```
{
    "procedure": "write",
    "arguments": [
        <rid>, 
        <value> 
    ], 
    "id": 1 
}
```

* `<rid>` is the identifier of the device to write.  
* `<value>` is the value to write.

#####response

```
{
    "status": "ok"
    "id": 1, 
}
```

---

###activate

Given an Activation Code, the associated entity is activated for the calling Client.

TODO: what does it mean to activate an entity?

```
{
    "procedure": "write",
    "arguments": [
        <codetype: "client" | "share" >, 
        <code: string> 
    ], 
    "id": 1 
}
```

* `<codetype>`

    `"client"` Activates the specified client
    interface key (CIK) if it is not already activated or expired. Only the
    owner of the client associated with the CIK can activate it.

    `"share"` Activates the specified share code
    for the specified activator if the activator has not already activated
    a share for the same resource, either using this share code or another.

* `<code>` is the activation code with which the entity to be activated is associated.

#####response

```
{
    "status": <result>
    "id": 1, 
}
```

* `<result>`

    `"ok"`: The activation was successful.

    `"invalid"`: The specified activation code was not found or already activated
    (client only) or expired (client only) or activated by another client
    (share only).  Or, the resource associated with the activation code has already been
    activated either via this or another activation code (share only).

    `"noauth"`: The calling client does not own the client associated with the
    specified activation code (client only).

---
 
###create (client)

Creates a client.

```
{
    "procedure": "create",
    "arguments": [
        "client", 
        {
            "limits":{
                "client": <limit>,
                "dataport": <limit>,
                "datarule": <limit>,
                "disk": <limit>,
                "dispatch": <limit>,
                "email": <limit>,
                "email_bucket": <limit>,
                "http": <limit>,
                "http_bucket": <limit>,
                "share": <limit>,
                "sms": <limit>,
                "sms_bucket": <limit>,
                "xmpp": <limit>,
                "xmpp_bucket": <limit>
            },
            "locked":boolean = false,
            "meta":string = "",
            "name":string = "",
            "public":boolean = false
        }
    "id": 1
}
```

* `<limit>`: Either a number representing a limit on the number of the thing the client can own/use, or `"inherit"`, which inherits the limit of the new client's owner. The default limit is 0. 
* `"client"`, `"dataport"`, `"datarule"`, `"dispatch"`: The number of each type of resource this client can own.
* `"disk"`: The amount of disk space this client can occupy. Currently this limit is not enforced. 
* `"email"`, `"http"`, `"sms"`, `"xmpp"`: The number of each type of dispatch this client can use on a daily basis.
* `"email_bucket"`, `"http_buckket"`, `"sms_bucket"`, `"xmpp_bucket"`: TODO
* `"io"`: The number of One Platform API calls this client can make on a daily basis.
* `"share"`: The number of shares this client can create.
* `"meta"`: General purpose metadata.
* `"name"`: A descriptive name. This field has no further function and the One Platform does not use this name to identify the resource.
* `"public"`: TODO

#####response

```
{
    "status": "ok"
    "id": 1, 
}
```

---

###create (dataport)

Creates a dataport.

```
{
    "procedure": "create",
    "arguments": [
        "dataport", 
        {
            "format": "binary" | "boolean" | "float" | "integer" | "string",
            "meta": string = "",
            "name": string = "",
            "preprocess": list = [],
            "public": boolean = false,
            "retention": {
                "count": number | "infinity",
                "duration": number | "infinity"
            },
            "subscribe": ResourceID = ""
       }
    ], 
    "id": 1
}
```

* `"format"`: The format in which the dataport will store its data.
* `"meta"`: General purpose metadata.
* `"name"`: A descriptive name. This field has no further function and the One Platform does not use this name to identify the resource.
* `"preprocess"`: A list of `[<operation>, <value>]` pairs. For more information, refer to the Platform User Guide (TODO: link?)
    `<operation>` can be one of "add", "sub", "mul", "div", "mod", "gt", "geq", "lt", "leq", "eq", "neq", "value"
    `<value>` is the value to use in the operation.
* `"public"`: TODO
* `"count"`: The maximum number of entries this resource will retain.
* `"duration"`: The maximum number of hours this resource will retain its data.
* `"subscribe"`: An RID to which this resource is subscribed, or `""` if it is not subscribed to another resource.


#####response

```
{
    "status": "ok"
    "id": 1, 
}
```

---

###create (datarule)

Creates a datarule.

```
{
    "procedure": "create",
    "arguments": [
        "datarule", 
        {
            "format": "boolean" | "float" | "integer",
            "meta": string = "",
            "name": string = "",
            "preprocess": list = [],
            "public": boolean = false,
            "retention": {
                "count": number | "infinity",
                "duration": number | "infinity"
            }
            "rule": object,            
            "subscribe":ResourceID = ""
        }
    ], 
    "id": 1
}
```

* `"format"`: The format in which the datarule will store its data.
* `"name"`: A descriptive name. This field has no further function and the One Platform does not use this name to identify the resource.
* `"meta"`: General purpose metadata.
* `"preprocess"`: A list of `[<operation>, <value>]` pairs. For more information, refer to the Platform User Guide (TODO: link?)
    `<operation>` can be one of "add", "sub", "mul", "div", "mod", "gt", "geq", "lt", "leq", "eq", "neq", "value"
    `<value>` is the value to use in the operation.
* `"public"`: TODO 
* `"count"`: The maximum number of entries this resource will retain.
* `"duration"`: The maximum number of hours this resource will retain its data.
* `"subscribe"`: An RID to which this resource is subscribed, or `""` if it is not subscribed to another resource.
* `"rule"`: The main processing this resource will do on each of its incoming datapoint. The rule may be one of the following:

<table><tr><th>Rule</th><th>Description</th></tr>
<tr><td>
<pre><code>
{
    "simple": {
        "comparison": "gt" | "lt" | 
                      "eq" | "geq" | 
                      "leq" | "neq",
        "constant": number,
        "repeat": boolean
    }
}
</code></pre>
</td><td>TODO</td></tr>
<tr><td>
<pre><code>
{
    "timeout": {
        "repeat": boolean,
        "timeout": number
    }
}
</code></pre>
</td><td>TODO</td></tr>
<tr><td>
<pre><code>
{
    "interval": {
        "comparison": "gt" | "lt" | 
                      "eq" | "geq" | 
                      "leq" | "neq",
        "constant": number,
        "repeat": boolean,
        "timeout": number
    }
}
</code></pre>
</td><td>TODO</td></tr>
<tr><td>
<pre><code>
{
    "duration": {
        "comparison": "gt" | "lt" | 
                      "eq" | "geq" |
                      "leq" | "neq",
        "constant": number,
        "repeat": boolean,
        "timeout": number
    }
}
</code></pre>
</td><td>TODO</td></tr>
<tr><td>
<pre><code>
{
    "count": {
        "comparison": "gt" | "lt" |
                      "eq" | "geq" | 
                      "leq" | "neq",
        "constant": number,
        "count": number,
        "repeat": boolean,
        "timeout": number,
    }
}
</code></pre>
</td><td>TODO</td></tr>
<tr><td>
<pre><code>
{
    "script": string
}
</code></pre>
</td><td>TODO</td></tr>
</table>

#####response

```
{
    "status": "ok"
    "id": 1, 
}
```

---

###create (dispatch)

Creates a dispatch.

```
{
    "procedure": "create",
    "arguments": [
        "dispatch", 
        {
            "locked": boolean = false,
            "message": string = "",
            "meta": string = "",
            "method": "email" | "http_get" | "http_post" | "http_put" | "sms" | "xmpp",
            "name": string = "",
            "preprocess": Preprocess = [],
            "public": boolean = false,
            "recipient": string,
            "retention": {
                "count": number | "infinity",
                "duration": number | "infinity"
            },
            "subject": string,
            "subscribe": ResourceID | null = null
        }
    ], 
    "id": 1
}
```

* `"locked"`: With this field set to 'true', the dispatch resource will not send messages to its configured recipient. The output from a locked dispatch resource will be 'undelivered'.
* `"message"`: If not empty, this string will be sent to the configured recipient. If this string is empty, the value output from the preprocessing stage will be output instead.
* `"method"`: The method to be used to deliver messages by this dispatch resource.
* `"format"`: The format in which the dataport will store its data.
* `"name"`: A descriptive name for the client to be created. This field has no further function and the One Platform does not use this name to identify the resource.
* `"public"`: TODO
* `"meta"`: General purpose metadata.
* `"preprocess"`: A list of `[<operation>, <value>]` pairs. For more information, refer to the Platform User Guide (TODO: link?)

    `<operation>` may be one of `"add"`, `"sub"`, `"mul"`, `"div"`, `"mod"`, `"gt"`, `"geq"`, `"lt"`, `"leq"`, `"eq"`, `"neq"`, `"value"`

    `<value>` is the value to use in the operation.

* `"recipient"`: The intended recipient for messages from this dispatch resources. It must be a valid email address, phone number, etc. for the configured delivery method.
* `"count"`: The maximum number of entries this resource will retain.
* `"duration"`: The maximum number of hours this resource will retain its data.
* `"subject"`: The subject string for delivery methods that support a subject line, such as email.
* `"subscribe"`: An RID to which this resource is subscribed, or `""` if it is not subscribed to another resource.


#####response

```
{
    "status": "ok"
    "id": 1, 
}
```


