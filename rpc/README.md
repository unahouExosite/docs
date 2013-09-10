## Exosite JSON RPC API

The JSON RPC API provides full featured access to data and resources on the One Platform. It is intended for applications that need to do more than just read and write individual points.

If you're completely new to Exosite's APIs, you may want to read the [API overview](../README.md) first.

### Table of Contents

[API Libraries](#api-libraries)

[Notational Convention](#notational-convention)

[HTTP Request/Response Example](#http-requestresponse-example)

[Making a Request](#making-a-request)

[Authentication](#authentication)

[Identifying Resources](#identifying-resources)

[Request JSON](#request-json)

[Response JSON](#response-json)

[API Improvement](#api-improvement)

####Procedures

#####Time Series Data

[read](#read) - read time series data

[write](#write) - write new data into a time series

[record](#record) - write time series data that has already been timestamped

[flush](#flush) - remove time series data

#####Resources

[create (client)](#create-client) - create a resource that can contain other resources

[create (dataport)](#create-dataport) - create a time series data resource

[create (datarule)](#create-datarule) - create a resource that can perform processing in response to data

[create (dispatch)](#create-dispatch) - create a resource for sending notifications 

[create (clone)](#create-clone) - copy an existing resource

[update](#update) - update an existing resource

[info](#info) - get information about an existing resource

[listing](#listing) - list the children of a client resource

[drop](#drop) - delete a resource

[usage](#usage) - get usage information for a resource

#####Aliases

[map](#map) - create an alias that can be used to refer to a resource

[lookup](#lookup) - look up the resource for an alias

[unmap](#unmap) - remove an alias for a resource

#####Shares and Keys 

[share](#share) - generate a code that can allows non-owners to access resources

[revoke](#revoke) - revoke a share code or CIK

[lookup](#lookup) - look up a resource based on a share code

[activate](#activate) - activate a share code or CIK

[deactivate](#deactivate) - deactivate a share code or CIK

### API Libraries

Wrapper libraries are available for this API:

* Python: [pyonep](https://github.com/exosite-labs/pyonep)
* Java: [javaonep](https://github.com/exosite-labs/javaonep)
* C++: [cpponep](https://github.com/exosite-labs/cpponep)
* .NET: [clronep](https://github.com/exosite-labs/clronep)

### Notational Conventions

This document uses a few notational conventions:

* JSON is pretty printed for clarity. The extra whitespace is not included in the RPC JSON.
* Comments (`//`) are occasionally included in JSON to give hints or provide detail. These comments are not included in actual requests or responses.
* A name in angle brackets, e.g. `<myvar>`, is a placeholder that will be defined elsewhere.
* `<ResourceID>` is a placeholder that may be either a 40 digit resource identifier (e.g., `"879542b837bfac5beee2f4cc5172e6d8a1628bee"`) or an alias reference (e.g., `{"alias": "myalias"}`). It may also be a self reference: `{"alias": ""}`. See [Identifying Resources](#identifying-resources) for details.

* `number` indicates a number, e.g. 42
* `string` represents a string, e.g. "MySensor"
* `|` represents multiple choice
* `=` represents default value
* `...` represents one or more of the previous item

### HTTP Request/Response Example
  
JSON RPC are HTTP POST requests with a body containing a JSON-encoded call. Here is a full example of an HTTP request, with JSON formatted for readability:

```
POST /api:v1/rpc/process
Host: m2.exosite.com:80
Content-Type: application/json; charset=utf-8
User-Agent: API Example (danweaver@exosite.com)
Content-Length: 235
Accept-Encoding: identity

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

### Making a Request

Requests to the JSON RPC are always HTTP POSTs to `/api:v1/rpc/process`. The host should be either `m2.exosite.com` for normal Portals accounts or `<your domain>.exosite.com` for whitebox accounts. At the moment `m2.exosite.com` works for all types of accounts, but this is not guaranteed to be supported in the future. Both HTTP and HTTPS are supported. Your application should identify itself by putting contact information in the User-Agent header. This also is not enforced, but will help us with any support requests you have. 

The body of a request must be valid JSON. See [http://www.json.org](http://www.json.org) for details on the JSON format.


### Authentication

Requests to the JSON RPC are made on behalf of a particular client in the system, 
called the "calling client". Every request passes a client key, called a 
CIK, that functions like a password and grants limited control over that
client and full control of that client's subhierarchy. This is somewhat 
different from other APIs where authentication is done on behalf of a user
account that is granted access to a set of resources.

For example, to [read](#read) from a Portals datasource, you could
authenticate with the CIK of the device that owns the datasource or with 
the CIK of the portal that owns that device, all the way up to the 
root node of the OneP tree.

Authentication information is placed in the JSON body of a request, in
`"auth"`. The value of the `"auth"` key can have one of three forms:

* `{"cik": CIK}` authenticates as the client identified by the given CIK. This is the most common form.

* `{"cik": CIK, "client_id": RID}` authenticates as the given client if the CIK identifies an ancestor of the given client.

* `{"cik": CIK, "resource_id": RID}` authenticate as the owner of the given resource if the CIK identifies as an ancestor of the given resource.


### Identifying Resources

Many procedures in the API include an argument for identifying a resource to act upon. In this documentation, that resource is identified by `<ResourceID>`. This argument can take any of three forms:

1.) `"34eaae237988167d90bfc2ffeb666daaaaaaaaaa"` directly identifies a resource ID. The resource must be in the [calling client](#authentication)'s subhierarchy.

2.) `{"alias": "temperature"}` looks up an immediate child of the [calling client](#authentication) by alias (`"temperature"` in this example).

3.) `{"alias": ""}` identifies the calling client itself. So, for example, if `"auth"` was set to `{"cik":"e469e336ff9c8ed9176bc05ed7fa40daaaaaaaaa"`, the procedure would act upon the client whose CIK is `"e469e336ff9c8ed9176bc05ed7fa40daaaaaaaaa"`.


### Request JSON

The body of a request has the following structure:

```
{
    "auth": {
            "cik": "e469e336ff9c8ed9176bc05ed7fa40daaaaaaaaa"
    },
    "calls": [
        // first call is a read
        [
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
        ],
        // second call is a write
        [
            "id": 2, 
            "procedure": "write", 
            "arguments": [
                 // <ResourceID>
                 // instead of an RID string, this call references the 
                 // alias of one of the calling client's children.
                 {
                     "alias": "temperature"
                 },
                 {
                     "starttime":1376709504,
                      "endtime":1376709527,
                      "limit":1,
                      "sort":"desc",
                      "selection":"all"
                 }
            ]
        ]
    ]
}
```

* `"auth"` provides the authentication for the procedures listed in `"calls"`. See [Authenticating](#authenticating) for details.

`"id"` is an identifier for the call, and may be a number or a string of up to 40 characters. A matching ID is returned in the response. If `"id"` is omitted for a particular call, no response will be returned. If `"id"` is omitted for all calls in `"calls"`, no response will be given for the entire request message.

`"procedure"` and `"arguments"` are specific to individual procedures and are documented [below](#procedures-1). 

### Response JSON

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
            "context": TODO}]
```

If the request message causes an error not associated with any given call, the response body is a JSON object like this:

```
{"error": {"code": 401,
           "message": "Invalid",
           "context": TODO}}
```

* `"code"` may have one of the following values:

    `-1` means the request message is not a proper JSON string

    `400` means the request is not properly formed

    `401` means the credentials in `"auth"` are invalid

    `500` means an internal error occured while generating the response message.  Individual calls may or may not have completed successfully.

    `501` means the application of the given arguments to the specified procedure is not supported.


### API Improvement

Please tell us how we can make the API better. If you have a specific feature request or if you found a bug, please use GitHub issues. Fork these docs and send a pull request with improvements. Thanks!


## Procedures

###read 

Read data from a resource.

```
{
    "procedure": "read",
    "arguments": [
        <ResourceID>,
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

* `<ResourceID>` is the identifier of the device to read. See [Identifying Resources](#identifying-resources) for details.
* `"starttime"` and `"endtime"` are [Unix timestamps](http://en.wikipedia.org/wiki/Unix_time) that specify the window of time to read.
* `"sort"` defines the order in which points should ordered, ascending (`"asc"`) or descending (`"desc"`) timestamp order. 
* `"limit"` sets a maximum on the number of points to return. `"limit"` is applied after the results have been sorted, so different values of `"sort"` will return different sets of points.
* `"selection"` supports downsampling. Specify `"all"` to return all datapoints. `"givenwindow"` splits the time window evenly into `"limit"` parts and returns at most one point from each part. `"autowindow"` samples evenly across points in the time window up to `"limit"`. Note that these options provide a blind sampling function, not averaging or other type of rollup calculation.


#####response

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

// boolean resource 
{
    "status": "ok",
    "result": [[1376950566,"false"],[1376950563,"true"],[1376950561,"true"],[1376950559,"true"]],
    "id": 1
}
```

---

###write

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

#####response

```
{
    "status": "ok",
    "id": 1 
}
```

---

##activate

Given an activation code, activate an entity for the calling client.

TODO: what does it mean to activate an entity? Does entity mean the same thing as resource?

```
{
    "procedure": "activate",
    "arguments": [
        "client" | "share", 
        <code>
    ], 
    "id": 1 
}
```

* The first argument indicates the type of thing to activate:

    `"client"` activates the specified client
    interface key (CIK) if it is not already activated or expired. Only the
    owner of the client associated with the CIK can activate it.

    `"share"` activates the specified share code
    for the specified activator if the activator has not already activated
    a share for the same resource, either using this share code or another.

* `<code>` is a CIK or share code

#####response

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
 
###create (client)

Creates a client.

```
{
    "procedure": "create",
    "arguments": [
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

* `"limits"` is an object containing limits for various entities and consumables. Each limit is either number, or `"inherit"`, which inherits the limit of the client's owner.
    
    `"client"`, `"dataport"`, `"datarule"`, `"dispatch"` represent the number of each type of resource this client can own.
    
    `"disk"` is the amount of disk space this client can occupy. Currently this limit is not enforced. 

    `"email"`, `"http"`, `"sms"`, `"xmpp"` is the number of each type of dispatch this client can use on a daily basis.

    `"email_bucket"`, `"http_buckket"`, `"sms_bucket"`, `"xmpp_bucket"` TODO

    `"io"` is the number of One Platform API calls this client can make on a daily basis.

    `"share"` is the number of shares this client can create.

* `"locked"`, if set to `true`, prevents this client from interacting with the One Platform. Every API call will return the error code "locked".

* `"meta"` is general purpose metadata. It can be used for application-specific purposes. For example, Portals uses meta to store a client's vendor and model, among other things.

* `"name"` is a descriptive name. This field has no further function and the One Platform does not use this name to identify the resource.

* `"public"` needs to be documented (TODO)

#####response

```
{
    "status": "ok",
    "id": 1
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
            "subscribe": <ResourceID> = ""
       }
    ], 
    "id": 1
}
```

* `"format"` is the format in which the dataport will store its data.
* `"meta"`, `"name"`, and `"public"` are described in [create (client)](#create-client)
* `"preprocess"` is a list of `[<operation>, <value>]` pairs describing operations to be performed on incoming data. For more information, refer to the Platform User Guide (TODO: link?)

    `<operation>` may be `"add"`, `"sub"`, `"mul"`, `"div"`, `"mod"`, `"gt"`, `"geq"`, `"lt"`, `"leq"`, `"eq"`, `"neq"`, or `"value"`

    `<value>` is the value to use in the operation.

* `"retention"`

    `"count"` is the maximum number of entries this resource will retain.

    `"duration"` is the maximum number of hours this resource will retain its data.

* `"subscribe"` is an RID to which this resource is subscribed, or `""` if it is not subscribed to another resource.


#####response

```
{
    "status": "ok",
    "id": 1
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
            "subscribe": <ResourceID> = ""
        }
    ], 
    "id": 1
}
```

* `"format"` is the format in which the datarule will store its data.
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
</td><td><p><b>Input:</b> Values</p>

<p><b>Internal Logic:</b> When a Value is received it is used in the Comparison, and the Comparison result
is the result of the Condition.</p>

<p><b>Internal logic configuration parameters:</b></p>

<ul>
<li><code>DataSourceID</code> is an input resource identifier whose input data Values to compare (TODO)</li>
<li><code>"constant"</code> is a numerical constant used by Comparison</li>
<li><code>"comparison"</code> is the comparison to perform.
</td></tr>
<tr><td>
<pre><code>
{
    "timeout": {
        "repeat": boolean,
        "timeout": number
    }
}
</code></pre>
</td><td>
<p><b>Input:</b> Timeouts, Values</p>
<p><b>Internal Logic:</b> A Timeout is always running. If a Value is received, the Timeout is restarted,
otherwise the Timeout repeatedly elapses and restarts. When a Value is received
the Condition result is <code>"false"</code>. When a Timeout elapses, the Condition result is <code>"true"</code>.

<p>e.g. Condition = Timeout</p>

<p><b>Internal logic configuration parameters:</b></p>

<ul>
<li><code>DataSourceID</code> is an input resource identifier whose input data Values to compare (TODO)</li>
<li><code>"timeout"</code> is a timeout in seconds</li>
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
        "repeat": boolean,
        "timeout": number
    }
}
</code></pre>
</td><td>
<p><b>Input:</b> Timeouts, Values</p>

<p><b>Internal Logic:</b> When a Value is received it is used in the Comparison any running Timeout is
canceled and the Comparison result is the result of the Condition.  If the
Comparision result is "true" then a new Timeout is started.  When a Timeout
elapses, the Condition result is "true" and the Timeout restarts.</p>

<p>e.g. Condition = Comparison; repeated while "true"</p>

<p><b>Internal logic configuration parameters:</b></p>

<ul>
<li><code>DataSourceID</code> is the input resource identifier whose input data Values to compare (TODO)</li>
<li><code>"constant"</code> is a numerical constant used by Comparison</li>
<li><code>"comparison"</code> is any of "Comparisons"</li>
<li><code>"timeout"</code> is a timeout in seconds</li>
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
        "repeat": boolean,
        "timeout": number
    }
}
</code></pre>
</td><td>
<p><b>Input:</b> Timeouts, Values</p>

<p><b>Internal Logic:</b> When a Value is received it is used in the Comparison, if the Comparison result
is "true" then a Timeout is started.  If the Comparison is "false" then any
existing Timeout is canceled and the Condition result is "false".  When a
Timeout elapses, the Condition result is "true" and the timer is restarted.</p>

<p>e.g. Condition = Comparison && Timeout</p>

<p><b>Internal logic configuration parameters:</b></p>

<ul>
<li><code>DataSourceID</code> is the input resource identifier whose input data Values to compare (TODO)</li>
<li><code>"constant"</code> is a numerical constant used by Comparison</li>
<li><code>"comparison"</code> is any of "Comparisons"</li>
<li><code>"timeout"</code> is a timeout in seconds</li>
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
        "repeat": boolean,
        "timeout": number,
    }
}
</code></pre>
</td><td>
<p><b>Input:</b> Timeouts, Values</p>

<p><b>Internal Logic:</b> When a Value is received it is used in the Comparison, if the Comparison result
is "true" and no there is no existing Timeout, then a Timeout is started and an
internal counter is set to 1; if a Timeout already exists then increment the
internal counter.  If the internal counter matches the Count configuration
parameter, then Timeout is restarted, the internal counter is set to 0 and the
Condition evaluates to "true".  If the Timeout elapses, the counter is set to 0,
the Timeout is canceled and the condition evaluates to "false".</p>

<p><b>Internal logic configuration parameters:</b></p>

<ul>
<li><code>DataSourceID</code> is the input resource identifier whose input data Values to compare (TODO)</li>
<li><code>"constant"</code> is a numerical constant used by Comparison</li>
<li><code>"comparison"</code> is any of "Comparisons"</li>
<li><code>"timeout"</code> is a timeout in seconds</li>
<li><code>"count"</code> is the aumber of data points accumulated that satisfy the Comparison</li>
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

#####response

```
{
    "status": "ok",
    "id": 1
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
            "subscribe": <ResourceID> = ""
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


#####response

```
{
    "status": "ok",
    "id": 1
}
```

---

###create (clone)

Create a clone from an existing One Platform resource given its RID or a non-activated sharecode for that resource.

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

#####response

```
{
    "status": "ok",
    "id": 1
}
```

---

###deactivate

Given an activation code, deactivate an entity for the calling client.

```
{
    "procedure": "deactivate",
    "arguments": [
        <CodeType>,
        <RIDOrCode> 
    ], 
    "id": 1
}
```

* `<CodeType>` specifies what type of One Platform entity is to be deactivated. It can have one of these values:

    `"client"` deactivate and expire the specified client interface 
    key (CIK) if it was previously activated. If the key was not previously 
    activated, the call will expire the key.

    `"share"` deactivate a previous activation of a resource share for the specified activator

* `<RIDOrCode>` is the client or share activation code or the shared resource ID to be deactivated


#####response

```
{
    "status": "ok",
    "id": 1
}
```

---

###drop

Deletes the specified resource. If the resource is a client, the client's subhierarchy are deleted, too. If 
the resource is a script type datarule, or the hierarchy being dropped contains scripts, the script will 
be terminated.  

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


#####response

```
{
    "status": string,
    "id": 1
}
```

* `"status": "ok"` means the resource was successfully dropped

* `"status": "restricted"` means the resource specified to be dropped is not owned by the caller client

---

###flush

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


#####response

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

###info

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
            "comments: true,
            "description": true,
            "key": true,
            "shares": true,
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

    `"aliases"` returns all aliases associated with the calling client's resources.

    `"basic"` returns basic information about a resource, such as its type, when 
    it was created, last modified and, for 'client' and 'dispatch' type resources, its current status.

    `"comments"` returns all comments associated with the resource that 
    are visible to the calling client. See the One Platform User Guide for 
    'visibility' definition.

    `"description"` returns the description of the resource that was used to create 
    or last update the resource.

    `"key"` returns the Client Interface Key (CIK) associated with the resource.
    This is valid for client resources only.

    `"shares"` returns share activation codes along with information about how many 
    times and for what duration this resource has been shared and which clients the 
    activators are.

    `"tagged"` needs to be documented (TODO)

    `"tags"` needs to be documented (TODO)

    `"usage"` returns current usage information for the resource.



#####response

```
{
    "status": string,
    "id": 1
    "result": {
        "aliases": {
            // Resource to alias mapping. If calling client is not
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
            // TODO
            "subscribers": 0,
            // Type of resource
            // "client" | "dataport" | "datarule" | "dispatch"
            "type": "client 
        },
        // Private and public comments associated with this resource that are 
        // visible to the calling client.
        "comments": [],
        // TODO
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
        // {"code":Code,   // The code for activating this share
        //  "count":Count, // How many times this share can be activated
        //  "duration":Duration,  // How many seconds this share can be activated
        // Activation timestamps and platform RIDs. 
        //  "activated":[[Timestamp,ClientID], ...]} 
        "shares": [],
        "storage": {
            // The number of data entries in the resource's datastack.
            "count": 2681,
            // The timestamp of the oldest entry in the resource's datastack.
            "first": 1372449660,
            // The timestamp of the newest entry in the resource's datastack.
            "last": 1377005537,
            // The total space in bytes of this resource's datastack.
            "size": 40215
        },
        "subscribers": [],
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

* `"status": "ok"` means the infomation was returned in `"result"`. Any other value for `"status"` indicates failure.

--- 

###listing

Returns an ordered list, in the same order as the input TypeList order, of resource id lists, filtered by any provided options.

```
{
    "procedure": "listing",
    "arguments": [
        <type_list>,
        <filter_list>
    ], 
    "id": 1
}
```

* `<type_list>` is a list of resource types, in the order they should be returned. Valid types are `"client"`, `"dataport"`, `"datarule"`, and `"dispatch"`.

* `<filter_list>` is a list of filter options. If no option is provided, it default to as if the "owned" option is specified.

    `"activated"` includes resources that have been shared with and activated by caller client

    `"aliased"` includes resources that have been aliased by caller client

    `"owned"` includes resources owned by caller client

    `"public"` public resources

    `"tagged"` resources that have been tagged by any client, and the caller client has read access to

#####response

```
{
    "status": string,
    "id": 1
    "result": [
        [],
        [
            "85a85bd51361b976260d01234567890123456789",
            "ba423f0dd8c62039239601234567890123456789",
            "c10a68d3a35464c0308b01234567890123456789",
            "df82c362433a2b0df6dc01234567890123456789"
        ],
        [],
        []
    ]
}
```

* `"status": "ok"` means `"result"` contains a list of lists of resource IDs.

* `"status": "error"` means one or more specified resource types are invalid, and `"result"` contains an error string.

--- 

###lookup

Look up a Resource ID by alias, owned Resource ID, or share activation code. 

```
{
    "procedure": "lookup",
    "arguments": [
        "aliased" | "owner" | "shared",
        <alias> | <ResourceID> | <Code>
    ], 
    "id": 1
}
```

* If the first argument is `"aliased"`, the second argument is a string alias, or `""` to 
    look up the caller client's Resource ID.

* If the first argument is `"owner"`, the second argument is a ResourceID whose owner will 
    be looked up. Owner lookup is restricted to within the caller client's subhierarchy. 
    Also, a client is not allowed to look up its own owner's resource id. See 
    [Identifying Resources](#identifying-resources) for details.


* If the first argument is `"shared"`, the second argument is a share activation code whose
    Resource ID will be looked up. 

#####response

```
{
    "status": "ok",
    "result": <ResourceID>,
    "id": 1
}
```

* `"status": "ok"` means `"result"` contains a Resource ID. Other values of `"status"` indicate failure.


--- 

###map

Creates an alias for a resource. Subsequently the resource can be looked up using the "lookup" method.

```
{
    "procedure": "map",
    "arguments": [
        'alias',
        <ResourceID>,
        string  
    ], 
    "id": 1
}
```

* `<ResourceID>` identifies the resource to which the alias should map. See [Identifying Resources](#identifying-resources) for details.

* `string` is an alias string to map to `<ResourceID>`.

#####response

```
{
    "status": "ok",
    "id": 1
}
```

* `"status": "ok"` means the mapping was successfully created


--- 

###record

Records a list of historical entries to the resource specified.

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
* The third argument is currently unused.

#####response

```
{
    "status": "ok",
    "id": 1
}
```

* `"status": "ok"` means the entries were successfully recorded.

--- 

###revoke

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

#####response

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

###share

Generates a share code for the given resource. The share code can
subsequently be used to activate the share and gain read access to the
shared resource.

```
{
    "procedure": "share",
    "arguments": [
        <ResourceID>,
        {
            "duration": 'infinity',
            "count": 1
        }
    ], 
    "id": 1
}
```

* `"duration"` is the duration, in seconds, for which this share can be 
    activated or 'infinity' to indicate no limit
* `"count"` is the number of times this share can be activated

#####response

```
{
    "status": "ok",
    "result": "ab24f30dd8c62039239601234567890123456789" 
    "id": 1
}
```

* `"status": "ok"` means the share code was successfully generated and returned in `"result"`

--- 


###unmap

Removes a mapping of specified type. After the removal, the previously
mapped resource will not be able to be looked up by the mapping.

```
{
    "procedure": "unmap",
    "arguments": [
        "alias",
        <alias> 
    ], 
    "id": 1
}
```

* `<alias>` is the alias string to unmap.

#####response

```
{
    "status": "ok",
    "id": 1
}
```

* `"status": "ok"` means the alias was successfully unmapped


---

###update

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

* `<ResourceID>` identifies the resource to update.  See [Identifying Resources](#identifying-resources) for details.

* `<description>` is a JSON object and is documented in [create (client)](#create-client), [create (dataport)](#create-dataport), [create (datarule)](#create-datarule), and [create (dispatch)](#create-dispatch), but its use for update has some limitations:

    Client limits must not be lowered below current use level. Resources
    must be dropped prior to lowering the limits. For daily limits, those
    may be lowered at any point and take immediate affect.

    Dataport and datarule format may not be changed.


#####response

```
{
    "status": "ok",
    "id": 1
}
```

* `"status": "ok"` means the resource was updated


---

###usage

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

* `<ResourceID>` identifies the resource whose usage will be measured (TODO: must it be a client?). See [Identifying Resources](#identifying-resources) for details.

* `<metric>` is the usage metric to measure. It may be:
    ...an entity: "client" | "dataport" | "datarule" | dispatch"
    ...or a consumable: "share" | "email" | "http" | "sms" | "xmpp"

* `<starttime>` and `<endtime>` specify the window in which to measure usage


#####response

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


