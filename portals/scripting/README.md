---
title: Platform Scripting
---

# Lua Scripting API

Exosite's [One Platform](/oneplatform/) can run Lua scripts on your behalf. These scripts have
a rich set of capabilities and may be used to offload processing from your
device.

If you're completely new to Exosite's APIs, you may want to read the [API overview](../README.md) first.


## Overview

Scripts are written in Lua 5.2 scripting language. For general information
about Lua 5.2, please reference the [online Lua manual](http://www.lua.org/manual/5.2/).

Scripts may be added to an application either using Portals, or by
using the [Remote Procedure Call API](../portals/rpc). In Portals,
scripts are added on the [script management page](https://portals.exosite.com/manage/scripts).

To use the RPC to create a script, use the
[create](../portals/rpc#create-datarule) RPC
procedures. It's also possible to use the
[Exoline](https://github.com/dweaver/exoline) utility to upload a script from
the command line using the `script` Exoline command. Run this command for details:

```
$ exo script --help
```

Scripts are associated with a client and may read, write, record and
subscribe to data for any resources that client owns. For example, in Portals,
if a script A is added to a particular device client it may access
all of that device's datasources, but not the datasources of any other devices.
If script B is added to a portal, it will have access to portal-level
datasources as well as devices in that portal and their datasources.

A script may also dispatch messages using transports such as HTTP, SMS, Email, and XMPP.

## Examples

Examples of One Platform Lua scripts are made available in this repository:
[Example Platform Scripts Repository](https://github.com/exosite-garage/PlatformScripts)


## The script environment

Scripts are completely isolated from one another, each running in its own,
secure environment, complete with access to a set of Lua tables and functions,
as well as a set of One Platform API functions, the 'alias' table and Global
properties and functions.

Scripts are scheduled to run with a limited number of execution ticks.
When these ticks are consumed, the script is suspended until subsequently
rescheduled.

Scripts also have memory usage limits, which if completely consumed
terminates the script with a 'not enough memory' error.  Please reference the
Lua 5.2 manual for how Lua manages memory. In particular:

- [Garbage Collection](http://www.lua.org/manual/5.2/manual.html#2.5)

- [Visibility Rules](http://www.lua.org/manual/5.2/manual.html#3.5)

### Lua tables and functions

The following global Lua tables and functions are available to Lua
scripts. They operate exactly as described in the Lua 5.2 reference manual.

* [`bit32`](http://www.lua.org/manual/5.2/manual.html#6.7)

* [`math`](http://www.lua.org/manual/5.2/manual.html#6.6) (Note:
    the `math.randomseed` function is not available to scripts.)

* [`string`](http://www.lua.org/manual/5.2/manual.html#6.4) (Note:
    the `string.dump` and `string.gsub` functions are not available to scripts.)

* [`table`](http://www.lua.org/manual/5.2/manual.html#6.5) (Note:
    the `table.sort` function is not available to scripts.)

* [`ipairs()`](http://www.lua.org/manual/5.2/manual.html#pdf-ipairs)

* [`next()`](http://www.lua.org/manual/5.2/manual.html#pdf-next)

* [`pairs()`](http://www.lua.org/manual/5.2/manual.html#pdf-pairs)

* [`select()`](http://www.lua.org/manual/5.2/manual.html#pdf-select)

* [`tonumber()`](http://www.lua.org/manual/5.2/manual.html#pdf-tonumber)

* [`tostring()`](http://www.lua.org/manual/5.2/manual.html#pdf-tostring)

* [`type()`](http://www.lua.org/manual/5.2/manual.html#pdf-type)


### One Platform tables

The following One Platform resources and features are available to Lua scripts:

* [`alias`](#the-alias-table)
* [`dispatch`](#the-dispatch-table)
* [`manage`](#the-manage-table)


### Global tables, functions, and properties

The following global resources and features are available to Lua scripts:

* [`json`](#the-json-global-table)
* [`date()`](#utilities)
* [`debug()`](#utilities)
* [`setlocale()`](#utilities)
* [`settimezone()`](#utilities)
* `now` holds the current UNIX timestamp. Note that `now` causes a One Platform API call behind the scenes so that it stays in step with the One Platform time. For best performance we recommend calling this at most once per iteration of a looping script. For example, if three different variables are to be initialized to the current timestamp in a row, `now` should be called once, its value stored in a local variable and subsequently used to initialize the variables.


## The alias table

Every script is owned by a One Platform client, and has access to that client
and all of its resources through the `alias` table.

* The client: `alias['']`
* The client's owned resource (by alias): `alias['myAlias']`
* The client's owned resource (by resource ID): `alias[{rid = '64c217b5243eeda29d4101234567890123456789'}]`

It is a good idea to create a local reference to specific aliases used
in the script, e.g.:

```
local room_temp = alias['room_temp']
```

Each alias has properties and functions through which the script can interact
with the aliased resource (for example to read from a dataport or write to a dataport)

* `.alias`

    This sub alias table is only available if the referenced alias is a client.
    It provides the same functionality as the global alias table but for the
    referenced client.

* `.manage`

    The manage table is only available if the referenced alias is a client. For
    the functionality provided, see [The manage table](#the-manage-table).

* `.meta`

    This provides read-only access to the `meta` field of the resource.

* `.name`

    This provides read-only access to the `name` field of the resource.

* `.status`

    Indicates the outcome of the most recent activity performed on the Alias.
    Actions include the reading or writing of any of the Alias properties and
    functions, excluding `.last` and `.status` itself.

    The actual values this property can return are listed with each property and
    function that can affect the value of `.status`. This property is read only.

* `.timestamp`

    The timestamp of the most recent datapoint written to the resource. If the
    resource contains no datapoints, `.timestamp` will read `nil`.

```
  ------------------------------------------------------------------------------
  Values:      timestamp :: number | nil

  ------------------------------------------------------------------------------
  Status:           'ok' :: string - accessing .timestamp was successful
```

* `.value`

    When read, it returns the value of the most recent datapoint written to the
    resource. If the resource contains no datapoints, `.value` will read `nil`.
    When written, the given value gets written to the resource with the current
    timestamp.

```
  ------------------------------------------------------------------------------
  Values:          value :: boolean | number | string | nil

  ------------------------------------------------------------------------------
  Status:           'ok' :: string - accessing .value was successful
```


* `.last`

    When read, it returns the timestamp returned by the most recent call to
    `.wait` function.  When written, the current time, as the script perceives
    it, will be changed to the given timestamp. Thus it is possible to set
    `.last` to a point in the past and iterate through historical data using
    `.wait`. When the script starts `.last` is initialized to the value of
    `.timestamp`.

```
  ------------------------------------------------------------------------------
  Values:           last :: number
```

* `.wait([expire])`

    Returns the timestamp for the next unprocessed datapoint. Next being relative
    to the timestamp held by `.last` property. If there is no datapoint available,
    the call will block. The `expire` parameter sets the wait expiration timestamp
    in case no datapoint becomes available. When the call returns, `.last` property
    will be updated to the timestamp of the next unprocessed datapoint or the wait
    expiration timestamp.

    Note that the `expire` period is non deterministic. Although the One Platform
    honors the `expire` parameter, there may be small fluctuations
    of up to a few seconds beyond what is specified by the `expire` parameter.

```
  ------------------------------------------------------------------------------
  Arguments:             :: nil    - no expiration
                  expire :: number - expiration timestamp

  ------------------------------------------------------------------------------
  Returns:     timestamp :: number - timestamp of the next unprocessed datapoint
                         :: nil    - wait expired

  ------------------------------------------------------------------------------
  Status:           'ok' :: string - the call has returned without expiring
               'expired' :: string - the call has expired
```

* `[<timestamp>]`

    Indexing an alias with a numerical timestamp makes it possible to read and
    record historical data.

    When read, the value of the datapoint with the given timestamp. If no value
    exists for the given timestamp then `nil` will be returned.

    When written, the given non-nil value gets recorded to the resource at the
    given timestamp. When nil is specified, the datapoint at the given timestamp
    will be deleted.

```
  ------------------------------------------------------------------------------
  Values:  [<timestamp>] :: boolean | number | string | nil

  ------------------------------------------------------------------------------
  Status:           'ok' :: string - accessing [<timestamp>] was successful
```

## The manage table

    The manage table provides resource management functionality.

    The manage table can be referenced globally and on client type alias objects.
    When invoked globally, the functions in the table will act on behalf of the
    script owner client. When invoked on an alias object, they will act on the
    alias object owner's behalf.

* `manage.activate(rid | {alias = <alias>}, type, code)`

    Given an activation code, the associated entity is activated for the
    client specified in rid.

```
  ------------------------------------------------------------------------------
  Arguments:        rid :: string - Client ID under which to activate the entity
                                    Note: an earlier form of this function
                                    allowed omitting this argument. That
                                    form is deprecated and should no
                                    longer be used.
                   type :: string - "client" | "share"
                   code :: string - Activation code

  ------------------------------------------------------------------------------
  Returns:          true :: boolean - Activation was successful
            false, error :: boolean, string - "badarg" | "invalid" | "noauth"
```


* `manage.create(rid | {alias = <alias>}, type, description)`

    Create a One Platform resource of specified Type and Description under rid.

```
  ------------------------------------------------------------------------------
  Arguments:     rid :: string - Client ID under which to create a resource
                                 Note: an earlier form of this function
                                 allowed omitting this argument. That
                                 form is deprecated and should no
                                 longer be used.
                type :: string - "client" | "dataport" | "datarule" | "dispatch"
         description :: table - Description table specific to resource type.

  "client" description ::
    {
      limits = {
        client = <non_neg_integer> | "inherit",
        dataport = <non_neg_integer> | "inherit",
        datarule = <non_neg_integer> | "inherit",
        disk = <non_neg_integer> | "inherit",
        dispatch = <non_neg_integer> | "inherit",
        email = <non_neg_integer> | "inherit",
        email_bucket = <non_neg_integer> | "inherit",
        http = <non_neg_integer> | "inherit",
        http_bucket = <non_neg_integer> | "inherit",
        share = <non_neg_integer> | "inherit",
        sms = <non_neg_integer> | "inherit",
        sms_bucket = <non_neg_integer> | "inherit",
        xmpp = <non_neg_integer> | "inherit",
        xmpp_bucket = <non_neg_integer> | "inherit"
      },
      locked = true | false,
      meta = <string>,
      name = <string>,
      public = true | false,
    }

  "dataport" description ::
    {
      format = "binary" | "boolean" | "float" | "integer" | "string",
      meta = <string>,
      name = <string>,
      preprocess = {
        "add"|"sub"|"mod"|"div"|"mul"|"gt"|"lt"|"eq"|"geq"|"leq"|"neq"|"value" =
        <constant> ,...
      },
      public = true | false,
      retention = {
        count = <non_neg_integer> | "infinity",
        duration = <non_neg_integer> | "infinity"
      },
      subscribe = <rid> | nil
    }

  "datarule" description ::
    {
      format = "boolean" | "float" | "integer" | "string",
      meta = <string>,
      name = <string>,
      preprocess = {
        "add"|"sub"|"mod"|"div"|"mul"|"gt"|"lt"|"eq"|"geq"|"leq"|"neq"|"value" =
        <constant> ,...
      },
      public = true | false,
      retention = {
        count = <non_neg_integer> | "infinity",
        duration = <non_neg_integer> | "infinity"
      },
      rule = {
        simple = {
          comparision = "gt" | "lt" | "eq" | "geq" | "leq" | "neq",
          constant = <number>,
          repeat = true | false
        }
        |
        timeout = {
          repeat = true | false,
          timeout = <number>
        }
        |
        interval = {
          comparison = "gt" | "lt" | "eq" | "geq" | "leq" | "neq",
          constant = <number>,
          repeat = true | false,
          timeout = <number>
        }
        |
        duration = {
          comparison = "gt" | "lt" | "eq" | "geq" | "leq" | "neq",
          constant = <number>,
          repeat = true | false,
          timeout = <number>
        }
        |
        count = {
          comparison = "gt" | "lt" | "eq" | "geq" | "leq" | "neq",
          constant = <number>,
          count = <number>,
          repeat = true | false,
          timeout = <number>
        }
        |
        script = <string>
     }
     ,subscribe = <rid> | nil
    }

  "dispatch" description ::
    {
      locked = true | false,
      message = <string>,
      meta = <string>,
      method = "email" | "http_get" | "http_post" | "http_put" | "sms" | "xmpp",
      name = <string>,
      preprocess = {
        "add"|"sub"|"mod"|"div"|"mul"|"gt"|"lt"|"eq"|"geq"|"leq"|"neq"|"value" =
        <constant> ,...
      },
      public = true | false,
      retention = {
        count = <non_neg_integer> | "infinity",
        duration = <non_neg_integer> | "infinity"
      },
      subject = <string>,
      subscribe = <rid> | nil
    }

  ------------------------------------------------------------------------------
  Returns:    true, rid :: boolean, string - Resource created, id returned.
           false, error :: boolean, string - "badarg" | "invalid" | "limit" |
                                              "restricted"
```

* `manage.deactivate(cid | {alias = <alias>}, type, code | rid)`

    Given an activation code, or resource ID for shares, the associated entity is
    deactivated for the client specified in cid.

```
  ------------------------------------------------------------------------------
  Arguments:        cid :: string - Client ID under which to deactivate the entity
                                    Note: an earlier form of this function
                                    allowed omitting this argument. That
                                    form is deprecated and should no
                                    longer be used.
                   type :: string - "client" | "share"
                   code :: string - Activation code
                   rid  :: string - Resource ID that code is associated with

  ------------------------------------------------------------------------------
  Returns:         true :: boolean - Deactivation was successful
           false, error :: boolean, string - "badarg" | "invalid" | "noauth"
```

* `manage.drop (rid | {alias = <alias>})`

    Drop specified resource.

```
  ------------------------------------------------------------------------------
  Arguments:        rid :: string - Resource ID to drop
                  alias :: string - Alias for resource ID to drop

  ------------------------------------------------------------------------------
  Returns:         true :: boolean - Drop was successful
           false, error :: boolean, string - "badarg" | "invalid" | "restricted"
```

* `manage.info (rid | {alias = <alias>}, options)`

    Provide creation and usage information of specified resource according to the
    specified Options (e.g., options could specify to only return the description)

```
  ------------------------------------------------------------------------------
  Arguments:        rid :: string - Resource ID to query
                  alias :: string - Alias for resource ID to query
                options :: table - Options specifying what information to return

    options - Specify one or more. Not all are valid for every resource type.
    {
      "aliases",
      "basic",
      "counts",
      "description",
      "key",
      "shares",
      "storage",
      "subscribers",
      "tagged",
      "tags",
      "usage"
    }

  ------------------------------------------------------------------------------
  Returns:   true ,info :: boolean ,table - Requested info successful returned
           false ,error :: boolean ,string - "badarg" | "invalid" | "restricted"

    info table structure:
    {
      -- for all resource types
      basic = {
        created = <timestamp>,
        modified = <timestamp>,
        subscribers = <number>,
        type = "client" | "dataport" | "datarule" | "dispatch"
      },
      -- see 'create' function for details about description
      description = <description>,
      shares = {
        {
          activator = <rid>,
          code = <code_string>,
          meta = <string>
        }
        ,...
      },
      subscribers = {
        {client | dataport | datarule | dispatch = {<rid>, ...}}, ...
      },
      tags = {
        <string>, ...
      },
      -- for clients:
      aliases = {
        {<rid>, {<string>, ...}}, ...
      },
      basic = {
        status = "activated" | "locked" | "notactivated" | "expired"
      },
      counts = {
        client = <number>,
        dataport = <number>,
        datarule = <number>,
        disk = <number>,
        dispatch = <number>,
        email = <number>,
        http = <number>,
        share = <number>,
        sms = <number>,
        xmpp = <number>
      },
      key = <cik_string>,
      usage = {
        client = <number>,
        dataport = <number>,
        datarule = <number>,
        disk = <number>,
        dispatch = <number>,
        email = <number>,
        http = <number>,
        share = <number>,
        sms = <number>,
        xmpp = <number>
      },
      tagged = {
        <string> ,...
      },

      -- for non-clients (dataport ,datarule ,dispatch)
      storage = {
        count = <number>,
        first = <timestamp>,
        last = <timestamp>,
        size = <number>
      },

      -- for datarules (scripts only):
      basic = {
        status = "completed" | "error" | "running" | "waiting",
        activity = {{<timestamp> = {<status>, ...}}, ...}
      },

      -- for dispatches:
      basic = {
        status = "normal" | "locked",
      }
    }
```

* `manage.listing(rid | {alias = <alias>}, type, options)`

    List resource IDs of given type(s) under client identified by rid or alias,
    filtered according to specified options.
    Resource IDs qualified by all options will be returned. If no option is
    specified, owned resources will be returned by default.

```
  ------------------------------------------------------------------------------
  Arguments:        rid :: string - Client ID under which to list resources
                                    Note: an earlier form of this function
                                    allowed omitting this argument. That
                                    form is deprecated and should no
                                    longer be used.
                  alias :: string - Alias for resource ID.
                   type :: table - List of resource types.
                options :: table - Categories of resources to return.

    type - Specify one or more.
    {
      "client",
      "dataport",
      "datarule",
      "dispatch"
    }

    options - Specify none or more.
    {
      "activated",
      "aliased",
      "owned",
      "public",
      "tagged"
    }

  ------------------------------------------------------------------------------
  Returns:   true ,list :: boolean ,table - Successful, list returned.
           false ,error :: boolean ,string - "badarg" | "invalid" | "restricted"

    list :: {{client | dataport | datarule | dispatch = {<rid> ,...}} ,...}
```

* `manage.lookup(cid | {alias = <alias>}, type, rid | alias | code)`

    Lookup an aliased resource, a resource's owner or a shared resource under cid.

```
  ------------------------------------------------------------------------------
  Arguments:        cid :: string - Client ID under which to lookup a resource
                                    Note: an earlier form of this function
                                    allowed omitting this argument. That
                                    form is deprecated and should no
                                    longer be used.
                   type :: string - Lookup based on: owner, alias or code.
                    rid :: string - Resource ID (owner lookup only).
                  alias :: string - Alias for resource ID.
                   code :: string - Share activation code.

    type :: "aliased" | "owner" | "shared"

  ------------------------------------------------------------------------------
  Returns:    true ,rid :: boolean ,string - Successful, resource id returned.
           false ,error :: boolean ,string - "badarg" | "invalid" | "restricted"
```

* `manage.map(type, rid | {alias = <alias>}, mapping)`

    Give the specified ResourceID an alias or a tag.

```
  ------------------------------------------------------------------------------
  Arguments:       type :: string - Type of mapping: alias or tag.
                    rid :: string - Resource ID to alias or tag.
                  alias :: string - Alias for resource ID.
                mapping :: string - The alias or tag to map to resource ID.

    type :: "alias" | "tag"

  ------------------------------------------------------------------------------
  Returns:         true :: boolean         - Successful, resource id mapped.
           false, error :: boolean, string - "badarg" | "inuse" | "invalid" |
                                             "notfound" | "restricted"
```

* `manage.revoke(type, code)`

    Given an activation code, the associated entity is revoked after which the
    activation code can no longer be used.

```
  ------------------------------------------------------------------------------
  Arguments:       type :: string - Type of code: client or share
                   code :: string - Activation code

  ------------------------------------------------------------------------------
  Returns:         true :: boolean         - Successful, code revoked.
           false, error :: boolean, string - "badarg" | "invalid" | "noauth"
```

* `manage.share(rid | {alias = <alias>}, options)`

    Generates a share code for the given resource ID.

```
  ------------------------------------------------------------------------------
  Arguments:        rid :: string - Resource ID to be shared.
                  alias :: string - Alias for resource ID.
                options :: table  - Share options.

    options
    {
      meta = <string>
    }

  ------------------------------------------------------------------------------
  Returns:   true, code :: boolean, string - Successful, share code returned.
           false, error :: boolean, string - "badarg" | "invalid" | "limit" |
                                             "restricted"
```

* `manage.tag(rid | {alias = <alias>}, action, name)`

    Add or remove tag.

```
  ------------------------------------------------------------------------------
  Arguments        rid  :: string - Resource ID to be tagged.
                action  :: string - can be 'add' or 'remove'.
                  name  :: string - The name of the tag

  ------------------------------------------------------------------------------
  Returns:         true :: boolean         - Successful, resource id tagged or
                                             tag removed.
           false, error :: boolean, string - "badarg"
```

* `manage.unmap(rid | {alias = <alias>}, type, mapping)`

    Remove the specified type of mapping under client identified by rid or alias.

```
  ------------------------------------------------------------------------------
  Arguments:        rid :: string - Client ID under which to unmap the mapping
                                    Note: an earlier form of this function
                                    allowed omitting this argument. That
                                    form is deprecated and should no
                                    longer be used.
                   type :: string - Type of mapping: alias only.
                mapping :: string - The mapped string to be removed.

    type :: "alias"

  ------------------------------------------------------------------------------
  Returns:         true :: boolean         - Successful, resource id mapped.
           false, error :: boolean, string - "badarg"
```

* `manage.update(rid | {alias = <alias>}, description)`

    Updates the description of specified resource. See 'create' for description
    parameter content, however that content may be restricted as described below:

    Client resource limits must not be lowered below current use level.  Resources must
    be dropped prior to lowering the limits. For daily limits, those may be
    lowered at any point and take immediate affect.

    Dataport and datarule formats must not be changed.

```
  ------------------------------------------------------------------------------
  Arguments:        rid :: string - Resource ID to be shared.
                  alias :: string - Alias for resource ID.
            description :: table - Description table specific to resource type.

  ------------------------------------------------------------------------------
  Returns:         true :: boolean         - Successful, resource updated.
           false, error :: boolean, string - "badarg" | "invalid" | "limit" |
                                             "restricted"
```

* `manage.usage(rid | {alias = <alias>}, metric, starttime, endtime)`

    Returns Metric usage between StartTime and EndTime by client and subhierarchy.

    The Metric parameter either specifies a consumable or an entity, depending on
    which, the returned value is computed as follows:
        * for consumables: the sum of the consumable used during the given window
        * for entities: the sum of the number of entities used in one second for
          each second in the given window.

```
  ------------------------------------------------------------------------------
  Arguments:        rid :: string - Resource ID for which to query usage.
                  alias :: string - Alias for resource ID.
                 metric :: string - Usage metric to query.
              starttime :: number - Start of time window to query.
                endtime :: number - End of time window to query.

    metric :: "client" | "dataport" | "datarule" | "dispatch" | "share"
            | "email" | "http" | "sms" | "xmpp"

  ------------------------------------------------------------------------------
  Returns:  true, value :: boolean, number - Successful, usage value returned.
           false, error :: boolean, string - "badarg" | "invalid" | "restricted"
```

## The JSON global table

Supports the encoding to and decoding from JSON format as specified at:
http://www.json.org/

* `json.array(table)`

    Initializes a Lua table to represent a JSON array.  A JSON array is
    represented as a Lua table having a sequence `{1..N}`, such that the
    only keys in the table are the numerical set `{1..N}`.

```
  ------------------------------------------------------------------------------
  Arguments:       table :: table  - the Lua table to be initialized as array

  ------------------------------------------------------------------------------
  Returns:         array :: table       - Lua table initialized as 'array'
          nil, error_msg :: nil ,string - error if table could not be
                                          initialized as a JSON-compliant array
```

* `json.decode(json_string)`

    Decodes the provided JSON encoded string.

```
  ------------------------------------------------------------------------------
  Arguments: json_string :: string - valid JSON encoded string

  ------------------------------------------------------------------------------
  Returns: decoded_value :: string | number | table | true | false | json.null
          nil, error_msg :: nil, string - error description encountered during
                                          decode
```

* `json.encode(value)`

    Encodes the provided native Lua value as a JSON string.

```
  ------------------------------------------------------------------------------
  Arguments:       value :: string | number | table | true | false | json.null

  ------------------------------------------------------------------------------
  Returns:  encoded_json :: string      - successfully encoded JSON string
          nil, error_msg :: nil, string - error description encountered during
                                          encode
```

* `json.null`

    Represents the JSON 'null' constant, use it when constructing Lua tables.

* `json.object(table)`

    Initializes a Lua table to represent a JSON object.  A JSON Object is
    represented as a Lua table having only keys of string type.

```
  ------------------------------------------------------------------------------
  Arguments:       table :: table - the Lua table to be initialized as object

  ------------------------------------------------------------------------------
  Returns:        object :: table       - Lua table initialized as 'object'
          nil, error_msg :: nil, string - error if table could not be
                                          initialized as a JSON-compliant object
```

* `json.type(value)`

    Returns the JSON specific type of the supplied value.

```
  ------------------------------------------------------------------------------
  Arguments:       value :: string | number | table | true | false | json.null
                            Lua value to check its type.

  ------------------------------------------------------------------------------
  Returns:          type :: string - "array" | "object" | "string" | "number" |
                                     "boolean" | "null"
                     nil :: nil    - the type of value is not a valid JSON type
```

## The dispatch table

The One Platform supports sending messages to external recipients over several
transports as 'dispatches' which are available via the 'dispatch' table.

The dispatch table can be referenced globally and on client type alias
objects. When invoked globally, the functions in the table operate on behalf
of the script owner client. When invoked through a client alias object, they
will operate on behalf of that client.

* `dispatch.email(address, subject, message, type)`

Sends an email `message` to `address` with `subject` line. `type` is optional
and specifies the email `Content-Type` header, and defaults to:

```
    "text/plain; charset=UTF-8"
```

```
  ------------------------------------------------------------------------------
  Arguments:    address :: string - valid email address
                subject :: string - email subject line text
                message :: string - text message
                   type :: string - (optional) message content type

  ------------------------------------------------------------------------------
  Returns:         true :: boolean         - email was successfully sent
          false, reason :: boolean, string - email was not successfully sent
```

* `dispatch.headline(address, subject, message)`

    Sends an xmpp headline `message` to `address` with `subject` line.

```
  ------------------------------------------------------------------------------
  Arguments:    address :: string - valid email address
                subject :: string - headline subject line text
                message :: string - text message

  ------------------------------------------------------------------------------
  Returns:         true :: boolean         - headline was successfully sent
          false, reason :: boolean, string - headline was not successfully sent
```

* `dispatch.http(url, method, body, contenttype, headers, timeout)`

    Makes a HTTP `method` request on the specified url with the given `body` of
    `contenttype`.  Optional request-specific `headers` and `timeout` may be set.

```
  ------------------------------------------------------------------------------
  Arguments:        url :: string - fully formed url - eg "http://example.com/"
                 method :: string - request method, "post" | "put" | "get"
                   body :: string | nil - text message, if 'method' is "get",
                           'body' should be nil or it will be ignored. when
                           'method' is other than "get", 'body' must not be nil.
            contenttype :: string | nil - 'Content-Type' header value, if
                           'method' is "get", 'contenttype' should be nil or it
                           will be ignored. when 'method' is other than "get",
                           'contenttype' must not be nil.
                headers :: table | nil  - custom header table or nil
                           e.g. {'custom_1'="value_1",'custom_2'='value_2'}
                timeout :: number | nil - number of miliseconds before
                           the request times out or nil.

  ------------------------------------------------------------------------------
  Returns: true, result :: boolean, table  - request was successfully made
          false, reason :: boolean, string - request was not successfully made

    result
    {
      status = <number>,
      headers = {<header> = <string> ,...},
      body = <string>
    }
```

* `dispatch.sms(number, message)`

    Sends an sms `message` to phone `number`. Phone number must include country
    code.

```
  ------------------------------------------------------------------------------
  Arguments:     number :: string - phone number, including country code
                message :: string - text message

  ------------------------------------------------------------------------------
  Returns:         true :: boolean         - sms was successfully sent
          false, reason :: boolean, string - sms was not successfully sent
```
Note: Currently `true` is always returned. This function does not wait for delivery becuase SMS can take several minutes or more to be delivered. There is currently no way to verify that a message has been delivered.

* `dispatch.tweet(auth, message)`

    Sends a `message` on behalf of the authenticated twitter user application.

```
  ------------------------------------------------------------------------------
  Arguments:       auth :: table  - authentication table (see below)
                message :: string - text message

  The 'auth' table has four fields:

     oauth_consumer_key :: string - Consumer Key
  oauth_consumer_secret :: string - Consumer Secret
            oauth_token :: string - Token
     oauth_token_secret :: string - Token Secret

  Authentication with www.twitter.com requires that a user have a twitter.com
  account and, under their user account, a twitter application, on behalf of
  which, the One Platform script will be able to send tweets. Follow the process
  described on www.twitter.com to set up an account and an application for your
  account. Then, under the new application's settings, obtain the above four
  values.

  ------------------------------------------------------------------------------
  Returns:         true :: boolean         - tweet was successfully sent
          false, reason :: boolean, string - tweet was not successfully sent

  twitter.com rejects subsequent, identical tweets. This can result in failure
  reason "undelivered".
```

## Utilities

The scripting system has access to utilities functions in the global scope.

* `date()`, `date(format)`, `date(format, time)`

    Returns the current or supplied time, formatted as specified. Non-specifier
    characters are copied verbatim to the returned string.

```
  ------------------------------------------------------------------------------
  Arguments:     format :: string - '*t' or strftime-compliant format specifier
                                    See http://linux.die.net/man/3/strftime
                                    If omitted, defaults to '%c'.
                   time :: number - UNIX time value to be formatted
                                    If omitted, defaults to current UTC time.

  ------------------------------------------------------------------------------
  Returns:         date :: string - formatted date and/or time string
                   date :: table  - if format was specified as '*t', the Lua
                                    table with the following number fields:
                                     .sec   - seconds              (0-59)
                                     .min   - minutes              (0-59)
                                     .hour  - hours                (0-23)
                                     .day   - day of month         (1-31)
                                     .month - month                (1-12)
                                     .year  - year
                                     .wday  - weekday              (Sun=1-7)
                                     .yday  - days since January 1 (1-366)

    nil, "badspecifier" :: nil, string - if invalid format specifier was given
```

* `debug(message)`

    Writes the given message to the calling script's datastack. It prepends the
    message with the line number from which it was called.

```
  ------------------------------------------------------------------------------
  Arguments:     essage :: string - debug message

  ------------------------------------------------------------------------------
  Returns:         nil
```

* `setlocale(locale)`

Locale controls formatting and internationalization of various outputs. In the
One Platform scripting environment, these are the `date` function and some of
the built in Lua functions, such as `tonumber`.

By default, scripts use the en_US.utf8 locale. Scripts can switch to another
locale by calling this function and specifying the new locale. The new locale
remains in effect until a subsequent invocation of this function.

```
  ------------------------------------------------------------------------------
  Arguments:     locale :: string - the name of the locale

    Supported are the 'C' and 'POSIX' locales and the <language>_<country>.utf8
    locales as follows:

    aa_DJ, af_ZA, an_ES, ar_AE, ar_BH, ar_DZ, ar_EG, ar_IQ, ar_JO, ar_KW, ar_LB,
    ar_LY, ar_MA, ar_OM, ar_QA, ar_SA, ar_SD, ar_SY, ar_TN, ar_YE, as_IN, az_AZ,
    be_BY, bg_BG, br_FR, bs_BA, ca_AD, ca_ES, ca_FR, ca_IT, cs_CZ, cy_GB, da_DK,
    de_AT, de_BE, de_CH, de_DE, de_LI, de_LU, el_CY, el_GR, en_AU, en_BW, en_CA,
    en_DK, en_GB, en_HK, en_IE, en_NZ, en_PH, en_SG, en_US, en_ZA, en_ZW, es_AR,
    es_BO, es_CL, es_CO, es_CR, es_DO, es_EC, es_ES, es_GT, es_HN, es_MX, es_NI,
    es_PA, es_PE, es_PR, es_PY, es_SV, es_US, es_UY, es_VE, et_EE, eu_ES, eu_FR,
    fi_FI, fo_FO, fr_BE, fr_CA, fr_CH, fr_FR, fr_LU, ga_IE, gd_GB, gl_ES, gv_GB,
    he_IL, hr_HR, hu_HU, id_ID, is_IS, it_CH, it_IT, iw_IL, ja_JP, ka_GE, kk_KZ,
    kl_GL, ko_KR, ku_TR, kw_GB, lg_UG, lt_LT, lv_LV, mg_MG, mi_NZ, mk_MK, ms_MY,
    mt_MT, nb_NO, nl_BE, nl_NL, nn_NO, oc_FR, om_KE, pl_PL, pt_BR, pt_PT, ro_RO,
    ru_RU, ru_UA, sk_SK, sl_SI, so_DJ, so_KE, so_SO, sq_AL, st_ZA, sv_FI, sv_SE,
    tg_TJ, th_TH, tl_PH, tr_CY, tr_TR, tt_RU, uk_UA, uz_UZ, wa_BE, xh_ZA, yi_US,
    zh_CN, zh_HK, zh_SG, zh_TW, zu_ZA

  ------------------------------------------------------------------------------
  Returns:         true :: boolean - new locale was successfully set
                  false :: boolean - locale was not successfully set
```

* `settimezone(timezone)`

    The timezone set for the script affects the output of the `date` function.

    By default, scripts use the UTC timezone. Scripts can call this function to
    switch to a different timezone. The new timezone setting will remain in effect
    until a subsequent invocation of this function.

```
  ------------------------------------------------------------------------------
  Arguments: timezone :: string - the name of timezone

    For a list of available time zones, reference 'List' table in the following
    article: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

    For the argument to this function, use the timezone name values found in the
    TZ* column of that table.

  ------------------------------------------------------------------------------
  Returns:         true :: boolean - the new timezone was successfully set
                  false :: boolean - the new timezone was not successfully set
```
