---
title: HTTP
---

# HTTP API Overview

This is a lightweight HTTP-based API for writing to and reading from the Exosite One Platform. It is intended for bandwidth-constrained applications. It provides the ability to write new data points or read the latest data point.

If you're completely new to Exosite's APIs, you may want to read the [API overview](../README.md) first.


## Procedures


### Timeseries Data Procedures

[Write](#write) - write new data to a set of dataports

[Read](#read) - read the latest data from a set of dataports

[Hybrid Write/Read](#hybrid-writeread) - write a set of dataports, then read a set of dataports

[Long-Polling](#long-polling) - be notified immediately when a dataport is updated

[Record](#record) - write data to historical timestamps

### Provisioning Procedures

[Activate](#activate) - activate device and get device's CIK

[List Available Content](#list-available-content) - get a list of content available to device

[Get Content Info](#get-content-info) - get meta information about content file

[Download Content](#download-content) - get content file


### Utility Procedures

[Timestamp](#timestamp) - get the current unix timestamp


## Libraries and Sample Code

Sample code is available that uses this API.

* [Python hello world](https://github.com/exosite-garage/python_helloworld)
* [Arduino POST](https://github.com/exosite-garage/arduino_http_post)
* [Arduino-compatible devices (Using Arduino Library)](https://github.com/exosite-garage/fluid_simple_cloud) - for, e.g., 8-bit micros running C/C++ code
* [Python read and write example with socket](https://github.com/exosite-garage/utility_scripts/blob/master/http_https_data_interface_read_write_socket_example.py), [Python - Get IP Address Example](https://github.com/exosite-garage/utility_scripts/blob/master/http_https_data_interface_get_ip_socket_example.py) - socket level code intended as a reference for implementation in other languages
* [Python read and write example with httplib](https://github.com/exosite-garage/utility_scripts/blob/master/http_https_data_interface_read_write_example.py)


## Notational Conventions

This document uses a few notational conventions:

* JSON is pretty printed for clarity. The extra whitespace is not included in the RPC JSON.
* Comments (`//`) are occasionally included in JSON to give hints or provide detail. These comments are not included in actual requests or responses.
* A name in angle brackets, e.g. `<myvar>`, is a placeholder that will be defined elsewhere.
* `number` indicates a number, e.g. 42
* `string` represents a string, e.g. "MySensor"
* `|` represents multiple choice
* `=` represents default value
* `...` represents one or more of the previous item


## HTTP Responses

Typical HTTP response codes include:

| Code   | Response      | Description                                          |
| ------ |:--------------|:-----------------------------------------------------|
| 200    | OK            | Successful request, returning requested values       |
| 204    | No Content    | Successful request, nothing will be returned         |
| 4xx    | Client Error  | There was an error\* with the request by the client  |
| 401    | Unauthorized  | No or invalid CIK                                    |
| 5xx    | Server Error  | There way an error with the request on the server    |

_\* Note: aliases that are not found are not considered errors in the request. See the documentation for [read](#read), and [write](#write) and [Hybrid write/read](#hybrid-writeread) for details._


# Data Procedures

## Write

Write one or more dataports of alias `<alias>` with given `<value>`. The client (e.g. device, portal) is identified by `<CIK>`. Data is written with the server timestamp as of the time the data was received by the server. Data cannot be written faster than a rate of once per second, doing so results in undefined behavior. If multiple aliases are specified, they are written at the same timestamp.


### request

```
POST /onep:v1/stack/alias HTTP/1.1 
Host: m2.exosite.com 
X-Exosite-CIK: <CIK> 
Content-Type: application/x-www-form-urlencoded; charset=utf-8 
Content-Length: <length> 
<blank line>
<alias 1>=<value 1>&<alias 2...>=<value 2...>&<alias n>=<value n>
```


### response

```
HTTP/1.1 204 No Content 
Date: <date> 
Server: <server> 
Connection: Close 
Content-Length: 0 
<blank line>
```

* See [HTTP Responses](#http-responses) for a full list of responses.


### example

```
$ curl http://m2.exosite.com/onep:v1/stack/alias \
    -H 'X-Exosite-CIK: <CIK>' \
    -H 'Accept: application/x-www-form-urlencoded; charset=utf-8' \
    -d '<alias>=<value>'
```


## Read

Read the most recent value from one or more dataports with alias `<alias>`. The client (e.g. device or portal) to read from is identified by `<CIK>`. If at least one `<alias>` is found and has data, data will be returned.


### request

```
GET /onep:v1/stack/alias?<alias 1>&<alias 2...>&<alias n> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
Accept: application/x-www-form-urlencoded; charset=utf-8
<blank line>
```


### response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Close
Content-Length: <length>
<blank line>
<alias 1>=<value 1>&<alias 2...>=<value 2...>&<alias n>=<value n>
```

* Response may also be `HTTP/1.1 204 No Content` if either none of the aliases are found or they are all empty of data
* See [HTTP Responses](#http-responses) for a full list of responses


### example

```
$ curl http://m2.exosite.com/onep:v1/stack/alias?<dataport-alias> \
    -H 'X-Exosite-CIK: <CIK>' \
    -H 'Accept: application/x-www-form-urlencoded; charset=utf-8'
```


## Hybrid write/read

Write one or more dataports of alias `<alias w>` with given `<value>` and then read the most recent value from one or more dataports with alias `<alias r>`. The client (e.g. device, portal) to write to and read from is identified by `<CIK>`. All writes occur before all reads.


### request

```
POST /onep:v1/stack/alias?<alias r1>&<alias r2...>&<alias rn> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
Accept: application/x-www-form-urlencoded; charset=utf-8
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>
<blank line>
<alias w1>=<value 1>&<alias w2...>=<value 2...>&<alias wn>=<value n>
```


### response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Close
Content-Length: <length>
<blank line>
<alias r1>=<value 1>&<alias r2...>=<value 2...>&<alias rn>=<value n>
```

* Response may also be `HTTP/1.1 204 No Content` if either none of the aliases are found or they are all empty of data
* See [HTTP Responses](#http-responses) for a full list of responses.


### example

```
$ curl http://m2.exosite.com/onep:v1/stack/alias?<alias_to_read> \
    -H 'X-Exosite-CIK: <CIK>' \
    -H 'Accept: application/x-www-form-urlencoded; charset=utf-8' \
    -d '<alias_to_write>=<value>'
```


## Long Polling

The [read](#read) procedure now supports long polling. Long polling is a method of getting a server push without the complexities of setting up publicly accessible HTTP server endpoints on your device. As the name suggests, long polling is similar to normal polling of an HTTP resource, but instead of requiring the client to make a new request to the server constantly, the server will wait to return until it has new information to return to the client (or a timeout has been reached).

To perform a request with long polling simply add the header `Request-Timeout: <miliseconds>` to your request. The server will then wait until a new datapoint is written to the given dataport and will then immediately return the value. If no datapoint is written before that time a `304 Not Modified` is returned and the client may make another long poling request to continue monitoring that dataport.

You may also optionally add an `If-Modified-Since` header to specify a start time to wait. This is exactly the same as the `alias.last` semantics in scripting. You will want to use this if it's important that you receive all updates to a given dataport, otherwise it is possible to miss points that get written between long polling requests.

Note: Only one dataport may be read at a time when using long polling.


### request

```
GET /onep:v1/stack/alias?<alias 1> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
Accept: application/x-www-form-urlencoded; charset=utf-8
Request-Timeout: <timeout>
If-Modified-Since: <timestamp>
<blank line>
```

* `<alias>` is the alias you monitor for new datapoints.
* `Request-Timeout` specifies the how long to wait on changes.  `<timeout>` is a millisecond value and cannot be more than 300 seconds (300000 ms).
* `If-Modified-Since` specifies waiting on aliases since the `<timestamp>`.  `<timestamp>` can be timestamp seconds since 1970-01-01 00:00:00 UTC or standard <a href=http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html>HTTP-Date</a> format. If this is not specified it defaults to "now".


### response

When the dataport is updated:

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Close
Content-Length: <length>
Last-Modified: <datapoint-modification-date>
<blank line>
<alias>=<value>
```

If the dataport is not updated before timeout:

```
HTTP/1.1 304 Not Modified
Date: <date>
Server: <server>
Connection: Close
Content-Length: <length>
<blank line>
```

When the dataport is updated and a value is returned, a `Last-Modified` header is included. When it is vital for your application to receive all updates to a dataport, you can pass the `Last-Modified` header value back to the `If-Not-Modified-Since` header in your next request to make sure that you don't miss any points that may have been written since the last request returned.


### example

```
$ curl http://m2.exosite.com/onep:v1/stack/alias?<dataport-alias> \
    -H 'X-Exosite-CIK: <CIK>' \
    -H 'Accept: application/x-www-form-urlencoded; charset=utf-8'
    -H 'Request-Timeout: 30000'
    -H 'If-Modified-Since: 1408088308'
```


## record

Write data to one or more historical timestamps of one or more aliases. The client (e.g. device, portal) is identified by `<CIK>`. Timestamps to the same alias cannot have less than 1 second differences between each other, doing so results in error in response.


### request

This example records to `<alias 1>` in `<timestamp 1>` and `<timestamp 2>`, while records to `<alias 2>` in `<timestamp 3>` and `<timestamp 4>`.

```
POST /onep:v1/stack/record HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>
<blank line>
alias=<alias 1>&<timestamp 1>=<value 1>&<timestamp 2>=<value 2>&alias=<alias 2>&<timestamp 3>=<value 3>&<timestamp 4>=<value 4>
```


### response

```
HTTP/1.1 204 No Content 
Date: <date> 
Server: <server> 
Connection: Close 
Content-Length: 0 
<blank line>
```

* See [HTTP Responses](#http-responses) for a full list of responses.

* If `<timestamp 1>` and `<timestamp 2>`, `<timestamp 3>` and `<timestamp 4>` have less than 1 second difference:

```
HTTP/1.1 409 Conflict
Date: <date>
Server: <server>
Connection: Close
Content-Length: <length>
<alias 1>=<timestamp 1>&<alias 2>=<timestamp 3>
```


### example

```
$ curl https://m2.exosite.com/onep:v1/stack/alias/<alias> \
    -H 'X-Exosite-CIK: <CIK>' \
    -H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \
    -d '<timestamp 1>=<value 1>&<timestamp 2>=<value 2>'
```


# Provisioning Procedures

## Activate

Activates and returns `<cik>` of client administrated by Vendor `<vendor>`,
identified my the model ID `<model>` associated with Serial Number `<sn>`.
Client must be enabled via `/provision/manage/model/<model>/<sn>`, the enabled
state must not have expired, and the client must not have already been
activated.

```
POST /provision/activate HTTP/1.1
Host: m2.exosite.com
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

vendor=<vendor>&model=<model>&sn=<sn>
```


### response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<cik>
```

Response may also be:

* `HTTP/1.1 404 Not Found` if the client described by `<vendor>`, `<model>`, `<sn>` is not found on the system.
* `HTTP/1.1 409 Conflict` if the serial number is not enabled for activation.
* See [HTTP Responses](#http-responses) for a full list of responses


### example

This command activates a device with serial number 12345678 and returns its CIK.

```
$ curl http://m2.exosite.com/provision/activate \
    -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" \
    -d "vendor=mysubdomain&model=myclientmodel&sn=12345678"
```


## List Available Content

List content `<id>`s. Caller with `<DeviceCIK>` must have an activated
serial number in given `<vendor>` `<model>` name space.

```
GET /provision/download?vendor=<vendor>&model=<model> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
Content-Length: <length>
<blank line>
```

### response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8

<id 1>
<id 2...>
<id n>
```

Response may also be:

* `HTTP/1.1 403 Forbidden` if the `<vendor>` and `<model>` pair is invalid.
* See [HTTP Responses](#http-responses) for a full list of responses


## Download Content

If caller with `<CIK>` has an activated SN in given `<vendor>` `<model>` name
space, and is authorized for the content, then the `<id>` content blob, or its
requested range, is returned. The header `Range: bytes=<range-specifier>`, if
specified, allows the caller to request a chunk of bytes at a time.
`<range-specifier>` takes the form of `X-Y` where both `X` and `Y` are
optional but at least one of them must be present. `X` is the start byte
position to return, `Y` is the end position. Both are 0 based. If `X` is
omitted, `Y` will request the last `Y` count of bytes of the content. If `Y`
is omitted, it will default to the end of the content. Note that `Content-Type`
of `<blob>` is based on the type set in the `POST` to
`/provision/manage/content/<model>/<id>`.

```
GET /provision/download?vendor=<vendor>&model=<model>&id=<id> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
{Range: bytes=<range-specifier>}
<blank line>
```


### response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
{Accept-Ranges: bytes}
Content-Length: <number of bytes being returned>
{Content-Range: bytes <first position>-<last position>/<total length>}
Content-Type: <content-type>

<blob>
```

Response may also be:

* `HTTP/1.1 206 Partial Content` if the response is partial.
* `HTTP/1.1 403 Forbidden` if the `<vendor>` and `<model>` pair is invalid.
* See [HTTP Responses](#http-responses) for a full list of responses


## Get Content Info

If caller with `<CIK>` has an activated SN in given `<vendor>` `<model>` name
space, and is authorized for the content, then the `<id>` content information
is returned.

```
GET /provision/download?vendor=<vendor>&model=<model>&id=<id>&info=true HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
Content-Length: <length>
<blank line>
```


### response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8

<content-type>,<byte-size>,<updated-timestamp>,<meta>
```

Response may also be:

* `HTTP/1.1 400 Bad Request` if the `<vendor>` and `<model>` pair is invalid.
* See [HTTP Responses](#http-responses) for a full list of responses


# Utility Procedures

## Timestamp

Get the current time according to the server.


### request

```
GET /timestamp HTTP/1.1
Host: m2.exosite.com
<blank line>
```


### response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<timestamp>
```

* See [HTTP Responses](#http-responses) for a full list of responses
