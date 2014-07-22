# Data API

This is a lightweight HTTP-based API for writing to and reading from the Exosite One Platform. It is intended for bandwidth-constrained applications. It provides the ability to write new data points or read the latest data point.

If you're completely new to Exosite's APIs, you may want to read the [API overview](../README.md) first.


## Table of Contents

[Libraries and Sample Code](#libraries-and-sample-code)

[Conventions](#conventions)

[HTTP Responses](#http-responses)


####Procedures

[Write](#write) - write new data to a set of dataports

[Read](#read) - read the latest data from a set of dataports

[Hybrid write/read](#hybrid-writeread) - read a set of dataports, then write a set of dataports

[IP](#ip) - get the IP address of the host server 


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
| 5xx    | Server Error  | There way an error with the request on the server    |

_\* Note: aliases that are not found are not considered errors in the request. See the documentation for [read](#read), and [write](#write) and [Hybrid write/read](#hybrid-writeread) for details._

# Procedures

##Write

Write one or more dataports of alias `<alias>` with given `<value>`. The client (e.g. device, portal) is identified by `<CIK>`. Data is written with the server timestamp as of the time the data was received by the server. Data cannot be written faster than a rate of once per second with this API.

#####request

```
POST /onep:v1/stack/alias HTTP/1.1 
Host: m2.exosite.com 
X-Exosite-CIK: <CIK> 
Content-Type: application/x-www-form-urlencoded; charset=utf-8 
Content-Length: <length> 
<blank line>
<alias 1>=<value 1>&<alias 2...>=<value 2...>&<alias n>=<value n>
```

#####response

```
HTTP/1.1 204 No Content 
Date: <date> 
Server: <server> 
Connection: Close 
Content-Length: 0 
<blank line>
```

* See [HTTP Responses](#http-responses) for a full list of responses.

#####example

```
$ curl http://m2.exosite.com/onep:v1/stack/alias \
    -H 'X-Exosite-CIK: <CIK>' \
    -H 'Accept: application/x-www-form-urlencoded; charset=utf-8' \
    -d '<alias>=<value>'
```


##Read

Read the most recent value from one or more dataports with alias `<alias>`. The client (e.g. device or portal) to read from is identified by `<CIK>`. If at least one `<alias>` is found and has data, data will be returned.

#####request

```
GET /onep:v1/stack/alias?<alias 1>&<alias 2...>&<alias n> HTTP/1.1 
Host: m2.exosite.com 
X-Exosite-CIK: <CIK> 
Accept: application/x-www-form-urlencoded; charset=utf-8 
<blank line>
```

#####response

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

#####example

```
$ curl http://m2.exosite.com/onep:v1/stack/alias?<dataport-alias> \
    -H 'X-Exosite-CIK: <CIK>' \
    -H 'Accept: application/x-www-form-urlencoded; charset=utf-8' 
```


##Hybrid write/read

Write one or more dataports of alias `<alias w>` with given `<value>` and then read the most recent value from one or more dataports with alias `<alias r>`. The client (e.g. device, portal) to write to and read from is identified by `<CIK>`. All writes occur before all reads.

#####request

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

#####response

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

#####example

```
$ curl http://m2.exosite.com/onep:v1/stack/alias?<alias_to_read> \
    -H 'X-Exosite-CIK: <CIK>' \
    -H 'Accept: application/x-www-form-urlencoded; charset=utf-8' \
    -d '<alias_to_write>=<value>'
```


