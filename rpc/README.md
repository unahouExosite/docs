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

Request message bodies have the following structure:

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

* `"id"` identifies the corresponding request call. 
* `"result"` is the return value for the procedure. Procedures without return values omit it entirely.

If a particular call fails, the response message is still a list, but `"status"` for the response for that call is set to something besides "ok", and an `"error"` key is included:

```
[{"id": 0,
  "status": "fail",
  "error": {"code": 501,
            "message": "Error",
            "context": TODO}]
```

If the request message causes an error not associated with any given call, the response message will instead look like this:

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
    "status": "ok",
    "id": 1 
}
```

---

###activate

Given an activation code, activate an entity for the calling Client.

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

    `"client"` activates the specified client
    interface key (CIK) if it is not already activated or expired. Only the
    owner of the client associated with the CIK can activate it.

    `"share"` activates the specified share code
    for the specified activator if the activator has not already activated
    a share for the same resource, either using this share code or another.

* `<code>` is the activation code with which the entity to be activated is associated.

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
    ],
    "id": 1
}
```

* `"limits"` is an object containing limits for various entities and consumables. `<limit>` is either number representing a limit on the number of the thing the client can own/use, or `"inherit"`, which inherits the limit of the new client's owner. The default limit is 0. 
    
    `"client"`, `"dataport"`, `"datarule"`, `"dispatch"` represent the number of each type of resource this client can own.
    
    `"disk"` is the amount of disk space this client can occupy. Currently this limit is not enforced. 

    `"email"`, `"http"`, `"sms"`, `"xmpp"` is the number of each type of dispatch this client can use on a daily basis.

    `"email_bucket"`, `"http_buckket"`, `"sms_bucket"`, `"xmpp_bucket"` TODO

    `"io"` is the number of One Platform API calls this client can make on a daily basis.

    `"share"` is the number of shares this client can create.

* `"locked"`, if set to `true`, prevents this client from interacting with the One Platform. Every API call will return the error code 'locked'.

* `"meta"` is general purpose metadata. It can be used for application-specific purposes. For example, Portals uses meta to store a client's vendor and model, among other things.

* `"name"` is a descriptive name. This field has no further function and the One Platform does not use this name to identify the resource.

* `"public"` TODO

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
            "subscribe": ResourceID = ""
       }
    ], 
    "id": 1
}
```

* `"format"` is the format in which the dataport will store its data.
* `"meta"`, `"name"`, `"public"` are described in [create (client)](#create-client)
* `"preprocess"` is a list of `[<operation>, <value>]` pairs describing operations to be performed on incoming data. For more information, refer to the Platform User Guide (TODO: link?)

    `<operation>` can be one of "add", "sub", "mul", "div", "mod", "gt", "geq", "lt", "leq", "eq", "neq", "value"

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
            "subscribe": ResourceID = ""
        }
    ], 
    "id": 1
}
```

* `"format"` is the format in which the datarule will store its data.
* `"meta"`, `"name"`, `"public"` are described in [create (client)](#create-client)
* `"preprocess"`, `"retention"`, `"subscribe"` are described in [create (dataport)](#create-dataport)
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
            "subscribe": ResourceID = ""
        }
    ], 
    "id": 1
}
```

* `"locked"`, if set to `true`, will prevent the dispatch resource from sending messages to its configured recipient. The output from a locked dispatch resource will be 'undelivered'.
* `"message"` is the message to dispatch. If this string is empty, the value output from the preprocessing stage will be output instead.
* `"meta"`, `"name"`, `"public"` are described in [create (client)](#create-client)
* `"method"` is the method to be used to deliver messages by this dispatch resource.
* `"preprocess"`, `"retention"`, `"subscribe"` are described in [create (dataport)](#create-dataport)
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

* `"rid"` is the resource identifier to clone.
* `"code` is the share code for the resource to clone.
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
        {
            <CodeType>,
            <RIDOrCode> 
        }
    ], 
    "id": 1
}
```

* `<CodeType>` specifies what type of One Platform entity is to be deactivated. It can have one of these values:

    `"client"` deactivate and expire the specified client interface 
    key (CIK) if it was previously activated. If the key was not previously 
    activated, the call will expire the key.

    `"share"` deactivate a previous activation of a resource share for the specified activator.

* `<RIDOrCode>` is the client or share activation code or the shared resource ID to be deactivated.


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
        {
            ResourceID,
        }
    ], 
    "id": 1
}
```

* `ResourceID` specifies the resource to drop.

#####response

```
{
    "status": string,
    "id": 1
}
```

* `"status": "ok"` means the resource was successfully dropped

* `"status": "restricted"` means the resource specified to be dropped is not owned by the caller client.

---

###flush

Empties the specified resource of data per specified constraints. If no constraints are specified, all data gets flushed.  

```
{
    "procedure": "flush",
    "arguments": [
        {
            ResourceID,
            {
                "newerthan": number,
                "olderthan": number
            }
        }
    ], 
    "id": 1
}
```

* `ResourceID` specifies what resource to flush.

* `"newerthan"` and `"olderthan"` are optional timestamps that constrain what data is flushed. If both are specified, only points with timestamp larger than `"newerthan"` and smaller than `"olderthan"` will be flushed. If only `"newerthan"` is specified, then all data with timestamps larger than that timestamp will be removed.


#####response

```
{
    "status": string,
    "id": 1
}
```

* `"status": "ok"` means the resource was successfully flushed 

* `"status": "invalid"` means one or both of "olderthan" and "newerthan" options provided was not a valid timestamp.

* `"status": "restricted"` means the resource specified to be dropped is not owned by the caller client.


---

###info

Provide creation and usage information of specified resource according to
the specified options. Information will be returned for the options
specified. If no option is specified, a full information report is
returned.

```
{
    "procedure": "info",
    "arguments": [
        {
            ResourceID,
            <options>
            
        }
    ], 
    "id": 1
}
```

* `ResourceID` specifies what resource to query.

* `<options>` is a JSON object with boolean entries. Each boolean entry defaults
        to false. If `<options>` is set to `{}` then all available boolean options 
        are set to true, `"starttime"` is set to the start of time, and `"endtime"` 
        is set to the end of time. Not all resource types have the same
        set of options. Valid options are the following:

    `"aliases"` returns all aliases associated with the calling client's resources.

    `"basic"` returns basic information about a resource, such as its type, when 
    it was created, last modified and, for 'client' and 'dispatch' type resources, its current status.

    `"comments"` returns all comments associated with the specified resource that 
    are visible to the calling client. See the One Platform User Guide for 
    'visibility' definition.

    `"description"` returns the description of the resource that was used to create 
    or last update the resource.

    `"key"` returns the Client Interface Key (CIK) associated with the specified resource.
    This is valid for client resources only.

    `"shares"` returns share activation codes along with information about how many 
    times and for what duration this resource has been shared and which clients the 
    activators are.

    `"usage"` returns current usage information for the specified resource.

    `"starttime"` specifies timestamp from which to generate requested information.

    `"endtime"` specifies timestamp upto which to generate information.


#####response

```
{
    "status": string,
    "id": 1
    "result": <result>
}
```

* `"status": "ok"` means the infomation was returned. Any other value for `"status"` indicates failure.

* `<result>` is a JSON object containing the requested information. The following documents parts of the result.

```
{
    "aliases": {
        // key is the ResourceID of the aliased resource,
        // and a list of aliases that map to it. Value is
        // a list of alias strings, or "undefined" if
        // requesting client is not aliased resource or 
        // its owner.
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
```

