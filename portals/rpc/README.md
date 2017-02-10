---
title: RPC
---

# Remote Procedure Call API

The JSON RPC API provides full featured access to data and resources on the One Platform. It is intended for applications that need to do more than just read and write individual points.

If you're completely new to Exosite's APIs, you may want to read the [API overview](../README.md) first.

#### Time Series Data

[read](#read) - read time series data

[write](#write) - write new data into a time series

[writegroup](#writegroup) - write new data into multiple time series

[record](#record) - write time series data that has already been timestamped

[recordbatch](#recordbatch) - write multiple time series data at specific timestamps

[flush](#flush) - remove time series data

[wait](#wait) - long polling, i.e., wait a data and get response when the data is updated

#### Resources

[create (client)](#create-client) - create a resource that can contain other resources

[create (dataport)](#create-dataport) - create a time series data resource

[create (datarule)](#create-datarule) - create a resource that can perform processing in response to data

[create (dispatch)](#create-dispatch) - create a resource for sending notifications

[create (clone)](#create-clone) - copy an existing resource

[move](#move) - move an existing resource

[update](#update) - update an existing resource

[info](#info) - get information about an existing resource

[listing](#listing) - list the children of a client resource

[drop](#drop) - delete a resource

[usage](#usage) - get usage information for a resource

#### Aliases

[map](#map) - create an alias that can be used to refer to a resource

[lookup](#lookup) - look up the resource for an alias

[unmap](#unmap) - remove an alias for a resource

#### Shares and Keys

[share](#share) - generate a code that allows non-owners to access resources

[revoke](#revoke) - revoke a share code or CIK

[lookup](#lookup) - look up a resource based on a share code

[activate](#activate) - activate a share code or CIK

[deactivate](#deactivate) - deactivate a share code or CIK

## API Libraries

Wrapper libraries are available for this API:

* Python: [pyonep](https://github.com/exosite-labs/pyonep)
* Java: [javaonep](https://github.com/exosite-labs/javaonep)
* C++: [cpponep](https://github.com/exosite-labs/cpponep)
* .NET: [clronep](https://github.com/exosite-labs/clronep)
* Cocoa: [cocoaonep](https://github.com/exosite-labs/cocoaonep)
* Go: [goonep](https://github.com/exosite-labs/goonep)
* Node.js: [nodeonep](https://github.com/exosite-labs/node-onep)

## Conventions

This document uses a few notational conventions:

* JSON is pretty printed for clarity. The extra whitespace is not included in the RPC JSON.
* Comments (`//`) are occasionally included in JSON to give hints or provide detail. These comments are not included in actual requests or responses.
* A name in angle brackets, e.g. `<myvar>`, is a placeholder that will be defined elsewhere.
* `<ResourceID>` is a placeholder that may be either a 40 digit resource identifier (e.g., `"879542b837bfac5beee201234567890123456789"`) or an alias reference (e.g., `{"alias": "myalias"}`). It may also be a self reference: `{"alias": ""}`. See [Identifying Resources](#identifying-resources) for details.

* `number` indicates a number, e.g. 42
* `string` represents a string, e.g. "MySensor"
* `|` represents multiple choice
* `=` represents default value
* `...` represents one or more of the previous item

## HTTP Request/Response Example

JSON RPC are HTTP POST requests with a body containing a JSON-encoded call. Here is a full example of an HTTP request, with JSON formatted for readability:

```
POST /onep:v1/rpc/process HTTP/1.1
Host: m2.exosite.com:80
Content-Type: application/json; charset=utf-8
User-Agent: API Example (danweaver@exosite.com)
Content-Length: 235

{
    "auth": {
        "cik": "5de0cfcf7b5bed2ea7a801234567890123456789"
    },
    "calls": [
        {
            "id": 56,
            "procedure": "read",
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
            ]
        }
    ]
}
```

Here is the full HTTP response for that request:

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

## Making a Request

RPC API requests are HTTP POSTs to `/onep:v1/rpc/process` and may contain the following headers.

| Header | Description | Required? |
| ------ | ----------- |:---------:|
| `Host: m2.exosite.com:80` | The host should be either `m2.exosite.com` for normal Portals accounts or `<your domain>.m2.exosite.com` for whitebox accounts. At the moment `m2.exosite.com` works for all types of accounts, but this is not guaranteed to be supported in the future. Both HTTP and HTTPS are supported. | Yes |
| `Content-Type: application/json; charset=utf-8` | Describes the content type of the body. For the JSON RPC, this is always `application/json; charset=utf-8` | Yes |
| `User-Agent: API Example (danweaver@exosite.com)` | If possible your application should identify itself by putting contact information in the `User-Agent` header. This also is not enforced, but will help us with any support requests you have. | No |
| `Content-Length: 235` | `Content-Length` contains the number of bytes in the body of the request. | Yes |

The body of a request must be valid JSON. See [http://www.json.org](http://www.json.org) for details on the JSON format.

The maximum number of consecutive HTTP requests that can be sent via a single connection to the One Platform is 100. In its response to the 100th request on the same connection, the One Platform will send the header "Connection: close" and then close the underlying TCP connection. The client should in this case create a new connection to the One Platform to continue.

## Authentication

Requests to the JSON RPC are made on behalf of a particular client in the system,
called the "calling client". Every request passes a client key, called a
CIK, that functions like a password and grants limited control over that
client and full control of that client's subhierarchy. This is somewhat
different from other APIs where authentication is done on behalf of a user
account that is granted access to a set of resources.

For example, to [read](#read) from a Portals datasource, you could
authenticate with the CIK of the device that owns the datasource or with
the CIK of the portal that owns that device, all the way up to the
root node of the One Platform tree.

Authentication information is placed in the JSON body of a request, in
`"auth"`. The value of the `"auth"` key can take any of these forms:

* `{"cik": CIK}` authenticates as the client identified by the given CIK. This is the most common form.

* `{"cik": CIK, "client_id": RID}` authenticates as the given client if the CIK identifies an ancestor of the given client.

* `{"cik": CIK, "resource_id": RID}` authenticate as the owner of the given resource if the CIK identifies as an ancestor of the given resource.


## Identifying Resources

Many procedures in the API include an argument for identifying a resource to act upon. In this documentation, that resource is identified by `<ResourceID>`. This argument can take any of these forms:

* `"34eaae237988167d90bfc2ffeb666daaaaaaaaaa"` directly identifies a resource ID. The resource must be in the [calling client](#authentication)'s subhierarchy.

* `{"alias": "temperature"}` looks up an immediate child of the [calling client](#authentication) by alias (`"temperature"` in this example).

* `{"alias": ""}` identifies the calling client itself. So, for example, if `"auth"` was set to `{"cik":"e469e336ff9c8ed9176bc05ed7fa40daaaaaaaaa"`, the procedure would act upon the client whose CIK is `"e469e336ff9c8ed9176bc05ed7fa40daaaaaaaaa"`.


## Request JSON

The body of a request has the following structure:

```
{
    "auth": {
            "cik": "e469e336ff9c8ed9176bc05ed7fa40daaaaaaaaa"
    },
    "calls": [
        // first call is a read
        {
            "id": 1,
            "procedure": "read",
            "arguments": [
                 // <ResourceID>
                 // descendant RID of calling client
                 "34eaae237988167d90bfc2ffeb666daaaaaaaaaa",
                 {
                     "starttime":1376709504,
                      "endtime":1376709527,
                      "limit":1,
                      "sort":"desc",
                      "selection":"all"
                 }
            ]
        },
        // second call is a write
        {
            "id": 2,
            "procedure": "write",
            "arguments": [
                 // <ResourceID>
                 // instead of an RID string, this call references the
                 // alias of one of the calling client's children.
                 {
                     "alias": "temperature"
                 },
                 65.4
            ]
        }
    ]
}
```

* `"auth"` provides the authentication for the procedures listed in `"calls"`. See [Authenticating](#authenticating) for details.

`"id"` is an identifier for the call, and may be a number or a string of up to 40 characters. A matching ID is returned in the response. If `"id"` is omitted for a particular call, no response will be returned. If `"id"` is omitted for all calls in `"calls"`, no response will be given for the entire request message.

`"procedure"` and `"arguments"` are specific to individual procedures and are documented [below](#procedures-1).

## Response JSON

The response body is always JSON, but its format varies based on error handling conditions. If a call succeeds, the body of the response is a JSON list of responses to the calls made in the request:

```
[
    // response for
    {
        "id": 1,
        "status": "ok",
        "result": [[1376709527, 64.2]]
    }
]
```

* `"id"` identifies the corresponding request call.
* `"result"` is the return value for the procedure. Procedures without return values omit it entirely.

If a particular call fails, the response body is still a list, but `"status"` for the response for that call is set to something besides `"ok"`, and an `"error"` key is included:

```
[{"id": 0,
  "status": "fail",
  "error": {"code": 501,
            "message": "Error",
            "context": "arguments"}]
```

If the request message causes an error not associated with any given call, the response body is a JSON object like this:

```
{"error": {"code": 401,
           "message": "Invalid",
           "context": "auth"}}
```

* `"code"` may have one of the following values:

    `-1` means the request message is not a proper JSON string

    `400` means the request is not properly formed

    `401` means the credentials in `"auth"` are invalid

    `500` means an internal error occured while generating the response message.  Individual calls may or may not have completed successfully.

    `501` means the application of the given arguments to the specified procedure is not supported.


* `"context"` indicates where the failure happened. If present, it may have one of the following values:

    `"arguments"` if arguments for a procedure are missing

    `"auth"` if the auth field is of invalid format

    `"calls"` if the calls field is of invalid format, i.e. not a list

    `"procedure"` if the procedure is missing


# Time Series Data

## read

Read data from a resource.

```
{
    "procedure": "read",
    "arguments": [
        <ResourceID>,
        {
            "starttime": number = 0
            "endtime": number = <current unix time>,
            "sort": "asc" | "desc" = "desc"
            "limit": number = 1,
            "selection": "all" | "givenwindow" | "autowindow" = "all",
        }
    ],
    "id": 1
}
```

* `<ResourceID>` is the identifier of the device to read. See [Identifying Resources](#identifying-resources) for details.
* `"starttime"` and `"endtime"` are [Unix timestamps](http://en.wikipedia.org/wiki/Unix_time) that specify the window of time to read. `"starttime"` defaults to `0` and `"endtime"` defaults to the current time.
* `"sort"` defines the order in which points should be ordered: ascending (`"asc"`) or descending (`"desc"`) timestamp order. Defaults to `"desc"`.
* `"limit"` sets a maximum on the number of points to return. `"limit"` is applied after the results have been sorted, so different values of `"sort"` will return different sets of points. Defaults to `1`.
* `"selection"` supports downsampling. `"givenwindow"` splits the time window evenly into `"limit"` parts and returns at most one point from each part. `"autowindow"` samples evenly across points in the time window up to `"limit"`. Note that these options provide a blind sampling function, not averaging or other type of rollup calculation. Defaults to `"all"`, which turns off downsampling, returning all points up to `"limit"`.

#### response

Response is a list of [timestamp](http://en.wikipedia.org/wiki/Unix_time), value pairs.

```

// float resource
{
    "status": "ok",
    "result": [[1376709527,64.2]],
    "id": 1
}

// string resource
{
    "status": "ok",
    "result": [[1376950234,"World"],[1376950230,"Hello"]],
    "id": 1
}

// integer resource
{
    "status": "ok",
    "result": [[1376950410,11],[1376950405,10]],
    "id": 1
}
```

#### Example

Read the most recent single value for a datasource:

```
$ curl -d '{"auth":{"cik":"bef3c7f91ac3562e6a2212345678901234567890"},"calls":[{"procedure":"read","arguments":[{"alias":
"log"}, {}],"id":0}]}' -H 'Content-type: application/json; charset=utf-8' http://m2.exosite.com/onep:v1/rpc/process
[{"id":0,"status":"ok","result":[[1390622248,"test value"]]}]
```

Read the earliest two points for a datasource:

```
$ curl -d '{"auth":{"cik":"bef3c7f91ac3562e6a2212345678901234567890"},"calls":[{"procedure":"read","arguments":[{"alias":
"log"}, {"sort":"asc", "limit":2}],"id":0}]}' -H 'Content-type: application/json; charset=utf-8' http://m2.exosite.com/onep:v1/rpc/process
[{"id":0,"status":"ok","result":[[1390622242,"second value"],[1390622240,"first value"]]}]
```

## write

Writes a single value to the resource specified.

```
{
    "procedure": "write",
    "arguments": [
        <ResourceID>,
        <value>
    ],
    "id": 1
}
```

* `<ResourceID>` is the identifier of the device to write. See [Identifying Resources](#identifying-resources) for details.

* `<value>` is the value to write.

#### response

```
{
    "status": "ok",
    "id": 1
}
```

---

## writegroup

Writes the given values for the respective resources in the list. The difference between calling `writegroup` and combining multiple `write` calls into a single request is that `writegroup` guarantees the points are written at the same timestamp.

```
{
    "procedure": "writegroup",
    "arguments": [
        [[<ResourceID>, <value>], ...]
    ],
    "id": 1
}
```

* `<ResourceID>` is the identifier of the resource to which to write. See [Identifying Resources](#identifying-resources) for details.

* `<value>` is the value to write.

#### response

```
{
    "status": "ok",
    "id": 1
}
```

---

## record

Records a list of historical entries to the resource specified. NOTE: this API is deprecated. Please use [`recordbatch`](#recordbatch) instead.

```
{
    "procedure": "record",
    "arguments": [
        <ResourceID>,
        [[<timestamp>, <value>], ...],
        {}
    ],
    "id": 1
}
```

* `<ResourceID>` is a resource identifier. See [Identifying Resources](#identifying-resources) for details.
* The second argument is a list of timestamp, value entries to record to the resource. If
    `<timestamp>` is a negative value, it means an offset back into the past from the current time.

* The behavior of the platform when `<timestamp>` is set to times in the future is undefined.
* The third argument is currently unused.

#### response

```
{
    "status": "ok",
    "id": 1
}
```

* `"status": "ok"` means the entries were successfully recorded.

---

## recordbatch

Records a list of historical entries to the resource specified.


```
{
    "procedure": "recordbatch",
    "arguments": [
        <ResourceID>,
        [[<timestamp>, <value>], ...]
    ],
    "id": 1
}
```

* `<ResourceID>` is a resource identifier. See [Identifying Resources](#identifying-resources) for details.

* The second argument is a list of timestamp, value entries to record to the resource. If
    `<timestamp>` is a negative value, it means an offset back into the past from the current time.

* The behavior of the platform when `<timestamp>` is set to times in the future is undefined.

#### response

```
{
    "status": "ok",
    "id": 1
}
```

* `"status": "ok"` means the entries were successfully recorded.

```
{
    "status": [[<timestamp>, 'invalid'], ...],
    "id": 1
}
```

* If `"status"` is not `"ok"`, it will return an array to indicate which `<timestamp>` is failed to be writen.

#### example
```
{
    "arguments": [
        "553d1367fa4613f0eea894d1677a13ef1f091150",
        [[1421906172,30],[1421906160,20]]
    ],
    "id": 1,
    "procedure": "recordbatch"
}

response:

{
    "status": [[1421906172, 'invalid']],
    "id": 1
}

```

---

## flush

Empties the specified resource of data per specified constraints. If no constraints are specified, all data gets flushed.  

```
{
    "procedure": "flush",
    "arguments": [
        <ResourceID>,
        {
            "newerthan": number,
            "olderthan": number
        }
    ],
    "id": 1
}
```

* `<ResourceID>` specifies what resource to flush. See [Identifying Resources](#identifying-resources) for details.


* `"newerthan"` and `"olderthan"` are optional timestamps that constrain what data is flushed. If both are specified, only points with timestamp larger than `"newerthan"` and smaller than `"olderthan"` will be flushed. If only `"newerthan"` is specified, then all data with timestamps larger than that timestamp will be removed.


#### response

```
{
    "status": string,
    "id": 1
}
```

* `"status": "ok"` means the resource was successfully flushed

* `"status": "invalid"` means one or both of "olderthan" and "newerthan" options provided was not a valid timestamp

* `"status": "restricted"` means the resource specified to be dropped is not owned by the caller client


---

# Resources

## create (client)

Creates a generic client under the client specified in `<ResourceID>`.

_NOTE:_ To create a client based on a client model and connected with a serial number, use the [portals create device API](http://docs.exosite.com/portals/#create-new-device-under-a-portal-of-authenticated-user) or the [fleet management create client from model POST API](http://docs.exosite.com/provision/management/#provisionmanagemodelmodelsn) instead.

```
{
    "procedure": "create",
    "arguments": [
        <ResourceID>,
        "client",
        {
            "limits": {
                "client":       number | "inherit" = 0,
                "dataport":     number | "inherit" = 0,
                "datarule":     number | "inherit" = 0,
                "disk":         number | "inherit" = 0,
                "dispatch":     number | "inherit" = 0,
                "email":        number | "inherit" = 0,
                "email_bucket": number | "inherit" = 0,
                "http":         number | "inherit" = 0,
                "http_bucket":  number | "inherit" = 0,
                "share":        number | "inherit" = 0,
                "sms":          number | "inherit" = 0,
                "sms_bucket":   number | "inherit" = 0,
                "xmpp":         number | "inherit" = 0,
                "xmpp_bucket":  number | "inherit" = 0
            },
            "locked": boolean = false,
            "meta": string = "",
            "name": string = "",
            "public": boolean = false
        }
    ],
    "id": 1
}
```

* `<ResourceID>` is the client id under which to create a resource. (Please note: an earlier previous form of `create` that omitted this argument is deprecated and should not be used.)

* `"limits"` is an object containing limits for various entities and consumables. Each limit is either number, or `"inherit"`, which inherits the limit of the client's owner.

    `"client"`, `"dataport"`, `"datarule"`, `"dispatch"` represent the number of each type of resource this client can own.

    `"disk"` is the amount of disk space this client can occupy. Currently this limit is not enforced.

    `"email"`, `"http"`, `"sms"`, `"xmpp"` is the number of each type of consumable this client can use in each UTC day. These throttle the rate that a client may draw from their corresponding `_bucket` limits.

    `"email_bucket"`, `"http_bucket"`, `"sms_bucket"`, `"xmpp_bucket"` is the number of each type of consumable this client can use. The bucket can be refilled when depleted by updating the client's description. Updating the limit in the description draws from the client's parent's bucket for as long as the parent (or other ancestor, in the case of a parent bucket set to `"inherit"`) has anything left in its bucket.

    `"share"` is the number of shares this client can create.

* `"locked"`, if set to `true`, prevents this client from interacting with the One Platform. Every API call will return the error code "locked".

* `"meta"` is general purpose metadata. It can be used for application-specific purposes. For example, Portals uses meta to store a client's vendor and model, among other things.

* `"name"` is a descriptive name. This field has no further function and the One Platform does not use this name to identify the resource.

* `"public"` provides public read-only access to the resource. If set to `true`, it makes the resource readable by any client. If set to `false`, the resource is readable only by ancestors of the resource or any client with which the resource has been shared.

#### response

```
{
    "status": "ok",
    "id": 1,
    "result": "<ResourceID>"
}
```

---

## create (dataport)

Creates a dataport.

```
{
    "procedure": "create",
    "arguments": [
        "dataport",
        {
            "format": "float" | "integer" | "string",
            "meta": string = "",
            "name": string = "",
            "preprocess": list = [],
            "public": boolean = false,
            "retention": {
                "count": number | "infinity",
                "duration": number | "infinity"
            },
            "subscribe": <ResourceID> |  null = null
       }
    ],
    "id": 1
}
```

* `"format"` is the format in which the dataport will store its data.
* `"meta"`, `"name"`, and `"public"` are described in [create (client)](#create-client)
* `"preprocess"` is a list of `[<operation>, <value> | <ResourceID>]` pairs describing operations to be performed on incoming data.

    `<operation>` may be `"add"`, `"sub"`, `"mul"`, `"div"`, `"mod"`, `"gt"`, `"geq"`, `"lt"`, `"leq"`, `"eq"`, `"neq"`, or `"value"`

    `<value>` is the value to use in the operation.

    `<ResourceID>` is a an resource identifier of any resource in this client, will use the value of that resource in this operation.

* `"retention"`

    `"count"` is the maximum number of entries this resource will retain.

    `"duration"` is the maximum number of hours this resource will retain its data.

* `"subscribe"` is an RID to which this resource is subscribed, or null if it is not subscribed to another resource. If set to an RID, this resource will receive a publication whenever a value is written to the specified RID.


#### response

```
{
    "status": "ok",
    "id": 1,
    "result": "<ResourceID>"
}
```

---

## create (datarule)

Creates a datarule.

```
{
    "procedure": "create",
    "arguments": [
        "datarule",
        {
            "format": "float" | "integer" | "string",
            "meta": string = "",
            "name": string = "",
            "preprocess": list = [],
            "public": boolean = false,
            "retention": {
                "count": number | "infinity",
                "duration": number | "infinity"
            }
            "rule": object,
            "subscribe": <ResourceID> | null = null
        }
    ],
    "id": 1
}
```

* `"format"` is the format in which the datarule will store its data.  Lua script datarules should be format `"string"`.
* `"meta"`, `"name"`, and `"public"` are described in [create (client)](#create-client)
* `"preprocess"`, `"retention"`, and `"subscribe"` are described in [create (dataport)](#create-dataport)
* `"rule"` is a JSON object describing the main processing this resource will do on each incoming datapoint. It may be one of the following:

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
</td><td>
<p>Values received by this rule are compared to a numerical constant and the result is the boolean result of that comparison.
<ul>
<li><code>"constant"</code> is a numerical constant used by comparison</li>
<li><code>"comparison"</code> is the comparison to perform.</li>
<li><code>"repeat"</code> specifies whether new inputs that would not change
the output should be written to the output data stack anyway. If set to
<code>true</code>, the output of this rule is always written to the rule's
data stack. If set to <code>false</code>, a output is only written if it's
different from the previous value.</li>
</td></tr>
<tr><td>
<pre><code>
{
    "timeout": {
        "timeout": number,
        "repeat": boolean
    }
}
</code></pre>
</td><td>
<p>Output <code>true</code> if no input value is received within a timeout period. If an input value is received within the period, output <code>false</code>. The timer is restarted when an input value is received, when the timeout elapses and when the script is first started. A timeout value of 0 indicates that the timeout shall not repeat.

<ul>
<li><code>"timeout"</code> is a timeout in seconds</li>
<li><code>"repeat"</code> specifies whether new inputs that would not change
the output should be written to the output data stack anyway. If set to
<code>true</code>, the output of this rule is always written to the rule's
data stack. If set to <code>false</code>, a output is only written if it's
different from the previous value.</li>
</ul>

</td></tr>
<tr><td>
<pre><code>
{
    "interval": {
        "comparison": "gt" | "lt" |
                      "eq" | "geq" |
                      "leq" | "neq",
        "constant": number,
        "timeout": number,
        "repeat": boolean
    }
}
</code></pre>
</td><td>
<p>This rule outputs the result of the comparison any time an input value is received.
Additionally, if the comparison result is <code>true</code>, a timer is
started. If the timer elapses, the rule output becomes <code>true</code>,
and the timer is restarted. If a input value is received that makes the comparison
<code>false</code>, <code>false</code> is output and the timer is canceled.</p>

<ul>
<li><code>"comparison"</code> is the comparison to do</li>
<li><code>"constant"</code> is a numerical constant used by comparison</li>
<li><code>"timeout"</code> is a timeout in seconds</li>
<li><code>"repeat"</code> specifies whether new inputs that would not change
the output should be written to the output data stack anyway. If set to
<code>true</code>, the output of this rule is always written to the rule's
data stack. If set to <code>false</code>, a output is only written if it's
different from the previous value.</li>
</ul>
</td></tr>
<tr><td>
<pre><code>
{
    "duration": {
        "comparison": "gt" | "lt" |
                      "eq" | "geq" |
                      "leq" | "neq",
        "constant": number,
        "timeout": number,
        "repeat": boolean
    }
}
</code></pre>
</td><td>
<p>When a value is received, it is immediately used in the configured
comparison.  If the comparison result is <code>true</code>, the rule waits for
the specified timeout period before setting its output to <code>true</code>.
If instead the comparison result is <code>false</code>, then
<code>false</code> becomes the output of the rule immediately, cancelling
any existing timeout.</p>
<ul>
<li><code>"comparison"</code> is the comparison to do</li>
<li><code>"constant"</code> is a numerical constant used by comparison</li>
<li><code>"timeout"</code> is a timeout in seconds</li>
<li><code>"repeat"</code> specifies whether output from this rule should
be written to its data stack if it is the same as the latest
value already on the data stack. If set to <code>true</code>, the output of
this rule is always written to the rule's data stack. If set to
<code>false</code>, a output is only written if it is different from the
previous value.</li>
</ul>
</td></tr>

<tr><td>
<pre><code>
{
    "count": {
        "comparison": "gt" | "lt" |
                      "eq" | "geq" |
                      "leq" | "neq",
        "constant": number,
        "count": number,
        "timeout": number,
        "repeat": boolean
    }
}
</code></pre>
</td><td>
<p>
When a value is received it is used in the comparison. If the comparison
result is <code>true</code> and there is no existing timeout then a timeout
is started and an internal counter is set to <code>1</code>. If a timeout
already exists then the internal counter is incremented. If the internal
counter matches the count configuration parameter, then the timeout is
restarted, the internal counter is set to <code>0</code> and the condition
evaluates to <code>true</code>. If the timeout elapses, the counter is set
to <code>0</code>, the timeout is cancelled and the rule outputs
<code>false</code>.
</p>
<ul>
<li><code>"comparison"</code> is the comparison to do</li>
<li><code>"constant"</code> is a numerical constant used by comparison</li>
<li><code>"count"</code> is the number of data points accumulated that satisfy the comparison</li>
<li><code>"timeout"</code> is a timeout in seconds</li>
<li><code>"repeat"</code> specifies whether output from this rule should
be written to its data stack if it is the same as the latest
value already on the data stack. If set to <code>true</code>, the output of
this rule is always written to the rule's data stack. If set to
<code>false</code>, a output is only written if it is different from the
previous value.</li>
</ul>
</td></tr>
<tr><td>
<pre><code>
{
    "script": string
}
</code></pre>
</td><td>
<code>"script"</code> is a string containing Lua source code to run on the server.
</td></tr>
</table>
#### response

```
{
    "status": "ok",
    "id": 1,
    "result": "<ResourceID>"
}
```

---

## create (dispatch)

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
            "preprocess": list = [],
            "public": boolean = false,
            "recipient": string,
            "retention": {
                "count": number | "infinity",
                "duration": number | "infinity"
            },
            "subject": string,
            "subscribe": <ResourceID> | null = null
        }
    ],
    "id": 1
}
```

* `"locked"`, if set to `true`, will prevent the dispatch resource from sending messages to its configured recipient. The output from a locked dispatch resource will be 'undelivered'.
* `"message"` is the message to dispatch. If this string is empty, the value output from the preprocessing stage will be output instead.
* `"meta"`, `"name"`, and `"public"` are described in [create (client)](#create-client)
* `"method"` is the method to be used to deliver messages by this dispatch resource.
* `"preprocess"`, `"retention"`, and `"subscribe"` are described in [create (dataport)](#create-dataport)
* `"recipient"` is the intended recipient for messages from this dispatch resources. It must be a valid email address or phone number, depending on the configured delivery method.
* `"subject"` is the subject string for delivery methods that support a subject line, such as email.


#### response

```
{
    "status": "ok",
    "id": 1,
    "result": "<ResourceID>"
}
```

---

## create (clone)

Create a clone from an existing One Platform resource given its RID or a non-activated sharecode for that resource. The resource to clone must be a client.

```
{
    "procedure": "create",
    "arguments": [
        "clone",
        {
             // 'rid' and 'code' are mutually exclusive options
             "rid": string,
             "code": string,
             "noaliases":boolean = false,
             "nohistorical":boolean = false
        }
    ],
    "id": 1
}
```

* `"rid"` is the resource identifier to clone
* `"code` is the share code for the resource to clone
* `"noaliases"` specifies whether to create clone aliases
* `"nohistorical"` specifies whether to clone historical data

#### response

```
{
    "status": "ok",
    "id": 1,
    "result": "<ResourceID>"
}
```

---

## move

Moves a resource from one parent client to another.

```
{
    "procedure": "move",
    "arguments": [
        <ResourceID>,
        <DestinationClientID>,
        <Options>
    ],
    "id": 1
}
```

* `<ResourceID>` identifies the resource to be moved. See [Identifying Resources](#identifying-resources) for details. Note, however, that a resource may not move itself.

* `<DestinationClientID>` identifies the client under which the resource should be moved. See [Identifying Resources](#identifying-resources) for details.

* `<Options>` is a JSON object and can contain these options:

 * `aliases` is a boolean that when set to true will try to re-create aliases pointing the the moved resource in the new context. When set to false all aliases that would become invalid are being deleted without replacement.


#### response

```
{
    "status": "ok",
    "id": 1
}
```

* `"status": "ok"` means the resource was moved

---

## update

Updates the description of the resource.

```
{
    "procedure": "update",
    "arguments": [
        <ResourceID>,
        <description>
    ],
    "id": 1
}
```

* `<ResourceID>` identifies the resource to update. See [Identifying Resources](#identifying-resources) for details. Note, however, that a resource may not update itself.

* `<description>` is an object, e.g. `{"name": "My Name"}`. It is documented in [create (client)](#create-client), [create (dataport)](#create-dataport), [create (datarule)](#create-datarule), and [create (dispatch)](#create-dispatch), but its use for update has some limitations:

    Client limits must not be lowered below current use level. Resources
    must be dropped prior to lowering the limits. For daily limits, those
    may be lowered at any point and take immediate affect.

    Dataport and datarule format may not be changed.


#### response

```
{
    "status": "ok",
    "id": 1
}
```

* `"status": "ok"` means the resource was updated

---

## wait

This is a HTTP Long Polling API which allows a user to wait on specific resources to be updated. It will return a timestamp which is the time the resource was updated.

```
{
    "auth": {
        "cik": <CIK>
    },
    "calls": [
        {
            "procedure": "wait",
            "arguments": [
                <ResourceID>,
                {
                    "timeout": <Number> = 30000
                    "since": <Timestamp> = null
                }
            ],
            "id": 1
        }
    ]
}
```

* `<ResourceID>` specifies what resource to wait on. See [Identifying Resources](#identifying-resources) for details.

* `timeout` is a number that specifies a timeout value, in milliseconds. If you don't provide `timeout` key, it will default to 30000 (30 seconds).

* `since` is a Unix timestamp to specify when you want to wait from.  If you wait since a timestamp, the first updated value after that timestamp will be returned.  If you don't provide `since` key or if you set <Timestamp> `null`, you wait from the time the wait call is received.

The following is an JSON example of the wait API.

```
{
  "auth": {
    "cik": "1c5410607e30469aeedfe899b56011f5ce51ffed",
  },
  "calls": [
    {
      "procedure": "wait",
      "arguments": [
        {"alias": "wait_dataport"},
        {
          "timeout": 5000,
          "since": null
        }
      ],  
      "id": 1
    }
  ]
}
```

The following is an example to wait with default timeout, 30 seconds from now.

```
{
  "auth": {
    "cik": "1c5410607e30469aeedfe899b56011f5ce51ffed",
  },
  "calls": [
    {
      "procedure": "wait",
      "arguments": [
          {"alias": "wait_dataport"},
          {}
      ],  
      "id": 1
    }
  ]
}
```

#### response

```
{
    "status": string,
    "result": [timestamp, value],
    "id": 1
}
```

* `"status": "ok"` means the resource was updated

* `"status": "expire"` means the long poll request is expired. You may need to send another wait request.

* `"status": "error"` means there is something wrong in the request. You have to check the returned error message.

* `"result"`: `timestamp` is the time that the resource is updated. `value` is the corresponding value for that timestamp.

---

## info

Request creation and usage information of specified resource according
to the specified options. Information is returned for the options
specified. If no option is specified, a full information report is
returned.

```
{
    "procedure": "info",
    "arguments": [
        <ResourceID>,
        // <options>
        {
            "aliases": true,
            "basic": true,
            "counts": true,
            "description": true,
            "key": true,
            "shares": true,
            "storage":true,
            "subscribers":true,
            "tagged": true,
            "tags": true,
            "usage": true
        }
    ],
    "id": 1
}
```

* `<ResourceID>` specifies what resource to query. See [Identifying Resources](#identifying-resources) for details.

* `<options>` is a JSON object with boolean entries. Each boolean entry defaults
    to `false`. If `<options>` is set to `{}` then all available boolean options
    are set to `true` Not all resource types have the same set of options. Valid
    options are the following:

    `"aliases"` returns all aliases associated with the calling client's child resources.

    `"basic"` returns basic information about a resource, such as its type, when
    it was created, last modified and, for 'client' and 'dispatch' type resources, its current status.

    `"comments"` are deprecated and should not be used.

    `"counts"` returns the actual count of the resources/consumables used by the client, does not include
    resources/consumables by subresources.

    `"description"` returns the description of the resource that was used to create
    or last update the resource.

    `"key"` returns the Client Interface Key (CIK) associated with the resource.
    This is valid for client resources only.

    `"shares"` returns share activation codes along with information about how many
    times and for what duration this resource has been shared and which clients the
    activators are.

    `"storage"` Available for dataport,datarule, and dispatch resources. Returns the numbers for
    "count", "first", "last", and "size.

    `"subscribers"` returns the resources subscribed to this resource.

    `"tagged"` is reserved for future use.

    `"tags"` is reserved for future use.

    `"usage"` returns current usage information for the resource.

Clients can call `info` on any resource in their sub-hierarchy, including themselves. The type of info available to the caller depends on whether the caller is the client itself on which info is being called or the resource's direct owner or some other client up the hierarchy. For information about making a call on behalf of a particular client, see [Authentication](#authentication).

Available to any client up the hierarchy:

- `"basic"`
- `"counts"`
- `"usage"`
- `"description"`
- `"storage"`
- `"subscribers"`
- `"tags"`

Available only to the client's direct owner and itself:

- `"aliases"`
- `"tagged"`
- `"shares"`

Available only to the client's direct owner.

- `"key"`



#### response

```
{
    "status": "ok",
    "id": 1,
    "result": {
        "aliases": {
            // Child resource to alias mapping. If calling client is not
            // the aliased resource or its owner, the value is "undefined"
            // rather than a list of aliases.
            "1b1ae80c224b4df0c74401234567890123456789": [
                "myinteger"
            ],
            "6154e05357efac4ec3d801234567890123456789": [
                "temperature",
                "myfloat"
            ],
        },
        "basic": {
            // The timestamp at which this resource was last updated via
            // the 'update' API.
            "modified": 1374553089,
            // The current status of this resource. Applicable to client
            // and dispatch type resources only.
            // "activated" | "locked" | "notactivated"
            "status": "activated",
            // the number of resources subscribed to this one
            "subscribers": 0,
            // Type of resource
            // "client" | "dataport" | "datarule" | "dispatch"
            "type": "client"
        },
        // The actual count of the resources/consumables used by the client on which info
        // was called. This is different from "usage" in that "counts" does not include
        // resources allocated to subresources but not actually used by them.
        "counts": {
            "client": 3,
            "dataport": 14,
            "datarule": 0,
            "disk": 40516,
            "dispatch": 0,
            "email": 0,
            "http": 0,
            "share": 0,
            "sms": 0,
            "xmpp": 0
        },
        // description as passed to create procedure
        "description": {
            "limits": {
                "client": 500,
                "dataport": 10000,
                "datarule": 5100,
                "disk": "inherit",
                "dispatch": 5100,
                "email": 2500,
                "email_bucket": "inherit",
                "http": 1000,
                "http_bucket": "inherit",
                "share": 5100,
                "sms": 5,
                "sms_bucket": 30,
                "xmpp": 1000,
                "xmpp_bucket": "inherit"
            },
            "locked": false,
            "meta": "",
            "name": "Dev",
            "public": false
        },
        // List of shares in this format:
        // {"activator": Activator,  client that activated the code
        //                           or null if the code has not yet
        //                           been activated.
        //  "code": Code,            The code to be used to activate
        //                           the share.
        //  "meta": Meta}            Meta information string, similar to
        //                           the meta field in resource descriptions.
        "shares": [],
        // List of resources that are subscribed to this one in the form {Type, RID}
        "subscribers": [],
        // Numbers for the resource storage retention
        // Available for dataport, datarule, dispatch only
        "storage":{
            "count":0
           ,"first":0
           ,"last":0
           ,"size":0
        },
        "tagged": [],
        "tags": [],
        "usage": {
            // Number of the respective resource type owned by this
            // and allocated to descendant clients. Applicable to
            // client type resources only.
            "client": 3,
            "dataport": 14,
            "datarule": 0,
            "dispatch": 0,
            // Number of resources
            // shared by this and allocated to descendant clients.
            // Applicable to client type resources only.
            "share": 0,
            // Current total disk space in bytes used by this and descendant
            // clients, expressed in bytes. Applicable to client type
            // resources only.
            "disk": 40516,
            // Current daily usage of the respective dispatch type by this
            // and descendant clients. Applicable to 'client' type
            // resources only.
            "email": 0,
            "http": 0,
            "sms": 0,
            "xmpp": 0
        }
    }
}
```

* `"status": "ok"` means the information was returned in `"result"`. Any other value for `"status"` indicates failure.

---

## listing

Returns lists of RIDs of types specified in `<type_list>` under client specified in `<ResourceID>`.

```
{
    "procedure": "listing",
    "arguments": [
        <ResourceID>,
        <type_list>,
        <options>
    ],
    "id": 1
}
```

* `<ResourceID>` is the client id under which to list RIDs. (Please note: an earlier previous form of `listing` that omitted this argument is deprecated and should not be used.)

* `<type_list>` is a list of resource types. Valid types are `"client"`, `"dataport"`, `"datarule"`, and `"dispatch"`.

* `<options>` is an object describing what should be returned. If options is set to `{}`, it defaults to `{"owned":true}`.

    `"activated": true` includes resources that have been shared with and activated by caller client

    `"aliased": true` includes resources that have been aliased by caller client

    `"owned": true` includes resources owned by caller client

    `"public": true` includes public resources

    `"tagged"` specifies a list of tags and includes only resources that have tags in the list. For example, `"tagged": ["tag1", "tag2"]` would include resources that have been tagged with "tag1" or "tag2" by any client.

#### response

```
{
    "status": string,
    "id": 1
    "result": {
        "client": [],
        "dataport": [   
            "85a85bd51361b976260d01234567890123456789",
            "ba423f0dd8c62039239601234567890123456789",
        ],
        "datarule": [],
        "dispatch": []
    }
}
```
* `"status": "ok"` means `"result"` contains an object containing list(s) of resource IDs.

* `"status": "error"` means one or more specified resource types are invalid, and `"result"` contains an error string.


<strong>DEPRECATED</strong> If the `<options>` argument is left out, the result is instead a list of resource IDs in the same order as the input type list. This form of the `listing` command is deprecated and should not be used.

```
{
    "status": string,
    "id": 1
    "result": [
        [],
        [
            "85a85bd51361b976260d01234567890123456789",
            "ba423f0dd8c62039239601234567890123456789",
        ],
        [],
        []
    ]
}
```

---

## drop

Deletes the specified resource. If the resource is a client, the client's subhierarchy are deleted, too. If
the resource is a script type datarule, or the hierarchy being dropped contains scripts, the script will
be terminated.  

_NOTE:_ The drop procedure should only be used to drop generic clients, i.e. clients that were created without a client model. To drop/delete a client based on a client model, use the [Portals API delete device](http://docs.exosite.com/portals/#delete-device). This will free up the serial number associated with that device.

```
{
    "procedure": "drop",
    "arguments": [
        <ResourceID>,
    ],
    "id": 1
}
```

* `<ResourceID>` specifies the resource to drop.  See [Identifying Resources](#identifying-resources) for details.


#### response

```
{
    "status": string,
    "id": 1
}
```

* `"status": "ok"` means the resource was successfully dropped

* `"status": "restricted"` means the resource specified to be dropped is not owned by the caller client

---

## usage

Returns metric usage for client and its subhierarchy.

```
{
    "procedure": "usage",
    "arguments": [
        <ResourceID>,
        <metric>,
        <starttime>,
        <endtime>,
    ],
    "id": 1
}
```

* `<ResourceID>` identifies the client resource whose usage will be measured. See [Identifying Resources](#identifying-resources) for details.

* `<metric>` is the usage metric to measure. It may be:
    ...an entity: "client" | "dataport" | "datarule" | dispatch"
    ...or a consumable: "share" | "email" | "http" | "sms" | "xmpp"

* `<starttime>` and `<endtime>` specify the window in which to measure usage


#### response

```
{
    "status": "ok",
    "result": number,
    "id": 1
}
```

* `"status": "ok"` means `"result"` contains the value for the metric

* `"result"` depends on usage metric being measured.

    For consumables, `"result"` is the sum of the consumable used during the given window.

    For entities, `"result"` is the sum of the number of that entity used in one second for
    each second in the given window

# Aliases

## unmap

Removes a mapping of specified type under the client specified in `<ClientID>`.
After the removal, the previously mapped resource will not be able to be looked up by the mapping.

```
{
    "procedure": "unmap",
    "arguments": [
        <ClientID>,
        "alias",
        <alias>
    ],
    "id": 1
}
```

* `<ClientID>` is the client id under which to unmap a mapping. (Please note: an earlier previous form of `unmap` that omitted this argument is deprecated and should not be used.)

* `<alias>` is the alias string to unmap.

#### response

```
{
    "status": "ok",
    "id": 1
}
```

* `"status": "ok"` means the alias was successfully unmapped


---

## lookup

Look up a Resource ID by alias, owned Resource ID, or share activation code
under the client specified in `<ClientID>`.

```
{
    "procedure": "lookup",
    "arguments": [
        <ClientID>,
        "alias" | "owner" | "shared",
        <alias> | <ResourceID> | <Code>
    ],
    "id": 1
}
```

* `<ClientID>` is the client id under which to lookup a resource. (Please note: an earlier previous form of `lookup` that omitted this argument is deprecated and should not be used.)

* If the first argument is `"alias"`, the second argument is a string alias, or `""` to
    look up the caller client's Resource ID.

* If the first argument is `"owner"`, the second argument is a ResourceID whose owner will
    be looked up. Owner lookup is restricted to within the caller client's subhierarchy.
    Also, a client is not allowed to look up its own owner's resource id. See
    [Identifying Resources](#identifying-resources) for details.


* If the first argument is `"shared"`, the second argument is a share activation code whose
    Resource ID will be looked up.

#### response

```
{
    "status": "ok",
    "result": <ResourceID>,
    "id": 1
}
```

* `"status": "ok"` means `"result"` contains a Resource ID. Other values of `"status"` indicate failure.


---



# Shares and Keys

## share

Generates a share code for the given resource. The share code can
subsequently be used to [activate](#activate) the share and gain access
to the shared resource.

```
{
    "procedure": "share",
    "arguments": [
        <ResourceID>,
        {
            "meta": <string>
        }
    ],
    "id": 1
}
```

* `"meta"` is a string that describes the share. It defaults to `""`. `"meta"` may be updated for an existing share by passing a previous share code `"code"` in options.

#### response

```
{
    "status": "ok",
    "result": "ab24f30dd8c62039239601234567890123456789"
    "id": 1
}
```

* `"status": "ok"` means the share code was successfully generated and returned in `"result"`

---

## revoke

Given an activation code, the associated entity is revoked after which
the activation code can no longer be used. The calling client must be
the owner of the resource with which the activation code is associated.

```
{
    "procedure": "revoke",
    "arguments": [
        "client" | "share",
        <code>
    ],
    "id": 1
}
```

* The first argument specifies what to revoke.

    `"client"` revokes the specified client interface key (CIK) passed in
    `<code>` and generates a new one. If the revoked code was previously
    activated, the new one replacing it will need to be activated. The new
    code will expire after the default CIK expiration period.

    `"share"` revokes the specified share activation code after which the
    resource associated with the share activation code will no longer be
    accessible by the activator.

* `<code>` is either a CIK (if the first argument was `"client"`), or a share activation code (if the first argument was `"share"`).

#### response

```
{
    "status": "ok",
    "id": 1
}
```

* `"status": "ok"` means the specified item was successfully revoked.

* `"status": "invalid"` means the specified CIK or code was not found.

* `"status": "noauth"` means the client associated with the specified CIK or client activation code is
      not owned by caller client.

---

## activate

Given an activation code, activate an entity for the client specified in `<ResourceID>`.

```
{
    "procedure": "activate",
    "arguments": [
        <ResourceID>,
        "client" | "share",
        <code>
    ],
    "id": 1
}
```

* `<ResourceID>` is the client id under which to activate an entity. (Please note: an earlier previous form of `activate` that omitted this argument is deprecated and should not be used.)

* The second argument indicates the type of thing to activate:

    `"client"` activates the specified client
    interface key (CIK) if it is not already activated or expired. Only the
    owner of the client associated with the CIK can activate it.

    `"share"` activates the specified share code
    for the specified activator if the activator has not already activated
    a share for the same resource, either using this share code or another.

* `<code>` is a CIK or share code

#### response

```
{
    "status": string,
    "id": 1
}
```

* `"status": "ok"` means the activation was successful.

* `"status": "invalid"` means the specified activation code was not found or already activated
    (client only) or expired (client only) or activated by another client
    (share only).  Or, the resource associated with the activation code has already been
    activated either via this or another activation code (share only).

* `"status": "noauth"` means the calling client does not own the client associated with the
    specified activation code (client only).

---

## deactivate

Given an activation code, deactivate an entity for the client specified in `<ResourceID>`.

```
{
    "procedure": "deactivate",
    "arguments": [
        <ResourceID>,
        "client" | "share",
        <code>
    ],
    "id": 1
}
```

* `<ResourceID>` is the client id under which to deactivate the entity. (Please note: an earlier previous form of `deactivate` that omitted this argument is deprecated and should not be used.)

* The second argument indicates the type of thing to deactivate:

    `"client"` deactivate and expire the specified client interface
    key (CIK) if it was previously activated. If the key was not previously
    activated, the call will expire the key.

    `"share"` deactivate a previous activation of a resource share for the specified activator

* `<code>` is the client or share activation code or the shared resource ID to be deactivated


#### response

```
{
    "status": "ok",
    "id": 1
}
```

---






## map

Creates an alias for a resource. Subsequently the resource can be looked up using the [lookup](#lookup) method.

```
{
    "procedure": "map",
    "arguments": [
        "alias",
        <ResourceID>,
        string  
    ],
    "id": 1
}
```

* `<ResourceID>` identifies the resource to which the alias should map. See [Identifying Resources](#identifying-resources) for details.

* `string` is an alias string to map to `<ResourceID>`.

#### response

```
{
    "status": "ok",
    "id": 1
}
```

* `"status": "ok"` means the mapping was successfully created
