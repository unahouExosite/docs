---
title: CoAP
---

# CoAP API

This api is currently released as a beta and may be updated at any time.

The Constrained Application Protocol (CoAP) is a specialized web transfer protocol for use with constrained nodes and constrained (e.g., low-power, lossy) networks. The nodes often have 8-bit microcontrollers with small amounts of ROM and RAM, while constrained networks such as 6LoWPAN often have high packet error rates and a typical throughput of 10s of kbit/s. The protocol is designed for machine-to-machine (M2M) applications such as smart energy and building automation.

CoAP provides a request/response interaction model between application endpoints, supports built-in discovery of services and resources, and includes key concepts of the Web such as URIs and Internet media types. CoAP is designed to easily interface with HTTP for integration with the Web while meeting specialized requirements such as multicast support, very low overhead and simplicity for constrained environments.

For more information on the CoAP protocol see [RFC7252](https://tools.ietf.org/html/rfc7252).


## Procedures


### Timeseries Data Procedures

[Write](#write) - write new data to a set of dataports

[Read](#read) - read the latest data from a set of dataports

[Observed Read](#observed-read) - be notified immediately when a dataport is updated

[Multiple Read and Write](#multiple-read-and-write) - write a set of dataports, then read a set of dataports


### Provisioning Procedures

[Activate](#activate) - activate device and get device's CIK

[List Content IDs](#list-content-ids) - get a list of content available to device

[Get Content Info](#get-content-info) - get meta information about content file

[Download Content](#download-content) - get content file


### Utility Procedures

[Timestamp](#timestamp) - get the current unix timestamp

[Remote Procedure Call Proxy](#remote-procedure-call-proxy) - proxy CBOR-RPC calls to the [JSON-RPC](/portals/rpc) API

## Libraries and Sample Code

A sample CoAP client written in python is available in the [CoAPExample](https://github.com/exosite-garage/CoAPExample) repository.

## Notational Conventions

This document uses a few notational conventions:

* A name in angle brackets, e.g. `<myvar>`, is a placeholder that will be defined elsewhere.
* CoAP request packets are shown in a text format with the format `METHOD: URI\nPAYLOAD`.

## CoAP Responses

CoAP makes use of so called CoAP Response Codes which resemble the HTTP status codes defined in [RFC7231](https://tools.ietf.org/html/rfc7231#section-6) plus some CoAP-specific status codes. The Response Code is encoded into an 8-bit unsigned integer code as defined in [section 3 of the rfc](https://tools.ietf.org/html/rfc7252#section-3). 

Exosite's API currently only return a subset of the response codes as defined in the table below, however we may start using any other code at any time. You should, at a minimum, support every code class if you don't handle each code individually.

| Code | Description                  | Used |
|------|------------------------------|------|
| 2.01 | Created                      |   Y  |
| 2.02 | Deleted                      |   N  |
| 2.03 | Valid                        |   N  |
| 2.04 | Changed                      |   Y  |
| 2.05 | Content                      |   Y  |
| 2.31 | Continue                     |   Y  |
| 4.00 | Bad Request                  |   N  |
| 4.01 | Unauthorized                 |   Y  |
| 4.02 | Bad Option                   |   Y  |
| 4.03 | Forbidden                    |   Y  |
| 4.04 | Not Found                    |   Y  |
| 4.05 | Method Not Allowed           |   N  |
| 4.06 | Not Acceptable               |   N  |
| 4.08 | Request Entity Incomplete    |   Y  |
| 4.12 | Precondition Failed          |   Y  |
| 4.13 | Request Entity Too Large     |   N  |
| 4.15 | Unsupported Content-Format   |   N  |
| 5.00 | Internal Server Error        |   N  |
| 5.01 | Not Implemented              |   N  |
| 5.02 | Bad Gateway                  |   N  |
| 5.03 | Service Unavailable          |   N  |
| 5.04 | Gateway Timeout              |   N  |
| 5.05 | Proxying Not Supported       |   N  |


# Procedures

##Write

Write one dataport of alias `<alias>` with given `<value>`. Data is written with the server timestamp as of the time the data was received by the server. Data cannot be written faster than a rate of once per second.

```
POST: coap://coap.exosite.com/1a/<alias>?<CIK>
"<value>"
```

```
  Client                    Server
      |                        |
      |   CON POST             |
      |   uri_path: "1a"       |
      |   uri_path: "<alias>"  |
      |   uri_query: "<CIK>"   |
      |   "<value>"            |
      +----------------------->|
      |                        |
      |   ACK Changed (2.04)   |
      |<-----------------------+
```

`<alias>`: The alias of the datasource that is being written to.  
`<value>`: The value to be written at the current time as a UTF-8 string.  
`<CIK>`: The client identification key. This can either be a UTF-8 string or the binary representation of the cik as a hexidecimal value sent in network byte order. However note that using the binary representation may technically violate protocol when used in the uri query option.

### Responses
* 2.04 Changed: The value has been written.
* 4.01 Unauthorized: The given CIK couldn't be used to authenticate.
* 4.03 Forbidden: The given alias couldn't be accesses with the given CIK.


##Read

Read the most recent value from the dataport with alias `<alias>`. If at `<alias>` is found and has data, data will be returned.

```
GET: coap://coap.exosite.com/1a/<alias>?<CIK>
```

```
  Client                    Server
      |                        |
      |   CON GET              |
      |   uri_path: "1a"       |
      |   uri_path: "<alias>"  |
      |   uri_query: "<CIK>"   |
      +----------------------->|
      |                        |
      |   ACK Content (2.05)   |
      |   "<value>"            |
      |<-----------------------+
```

`<alias>`: The alias of the datasource that is be read.  
`<value>`: The latest value that has been written to the given dataport as a UTF-8 string.  
`<CIK>`: The client identification key. This can either be a UTF-8 string or the binary representation of the cik as a hexadecimal value sent in network byte order. However note that using the binary representation may technically violate protocol when used in the uri query option.

### Responses
* 2.05 Content: The value is returned.
* 4.01 Unauthorized: The given CIK couldn't be used to authenticate.
* 4.03 Forbidden: The given alias couldn't be accesses with the given CIK.

## Observed Read

The read API supports the [observe](https://tools.ietf.org/html/draft-ietf-core-observe-15) feature which allows to be notified any time the specified dataport is updated.

*NOTE: This feature is based on a draft RFC and is a brand new feature being implemented currently. Therefore, is even more subject to change than than the rest of the API.*

You can inform the server that you would like to be informed of updates by including the observe option in the standard read request. If you receive a response with a 2.05 Content code and an observe option you have successfully observed that dataport and our server will send you asynchronous requests any time the dataport is updated or when the max_age of the last sent packet expires.

```
GET: coap://coap.exosite.com/1a/<alias>?<CIK>
```

```
  Client                    Server
      |                        |
      |   CON GET              |
      |   observe: 0           |
      |   uri_path: "1a"       |
      |   uri_path: "<alias>"  |
      |   uri_query: "<CIK>"   |
      +----------------------->|
      |                        |
      |   ACK Content (2.05)   |
      |   observe: 0           |
      |   "<value>"            |
      |<-----------------------+
                  ...
      |                        |
      |   CON Content (2.05)   |
      |   observe: <N>         |
      |   max_age: <S>         |
      |   "<value>"            |
      |<-----------------------+
      |                        |
      |   ACK Empty (0.00)     |
      |----------------------->+
```

`<alias>`: The alias of the datasource that is to have the latest value read.  
`<CIK>`: The client identification key. This can either be a UTF-8 string or the binary representation of the cik as a hexadecimal value sent in network byte order. However note that using the binary representation may technically violate protocol when used in the uri query option.

### Responses
* 2.05 Content: The value is returned.
* 4.01 Unauthorized: The given CIK couldn't be used to authenticate.
* 4.03 Forbidden: The given alias couldn't be accesses with the given CIK.

##Multiple Read and Write

Read the most recent value from zero or more dataports and write a value to zero or more dataports with the given values in one call. The server will look in the first uri query option for the CIK.

The payloads for both writing and the returned values for reading are in the CBOR (Concise Binary Object Representation) format. It is shown in this document in a JSON-like format for display purposes. See http://cbor.io for more information.

```
POST: coap://coap.exosite.com/1a?<CIK>
```

```
  Client                                                   Server
      |                                                      |
      |   CON POST                                           |
      |   uri_path: "1a"                                     |
      |   uri_query: "<CIK>"                                 |
      |   uri_query: "<alias r1>"                            |
      |   ...                                                |
      |   uri_query: "<alias rN>"                            |
      |   {"<alias w1>": "26.1", ..., "<alias wN>": "on"}    |
      +----------------------------------------------------->|
      |                                                      |
      |   ACK Content (2.05)                                 |
      |   {"<alias r1>": "99", ..., "<alias rN>": "0"}       |
      |<-----------------------------------------------------+
```

`<alias#>`: The alias of the datasource that is to have the latest value read or written.  
`<CIK>`: The client identification key. This can either be a UTF-8 string or the binary representation of the cik as a hexadecimal value sent in network byte order. However note that using the binary representation may technically violate protocol when used in the uri query option.

### Responses
* 2.05 Content: The value is returned.
* 4.01 Unauthorized: The given CIK couldn't be used to authenticate.
* 4.03 Forbidden: The given alias couldn't be accesses with the given CIK.


## Activate

Request an activation of the given device, returns the CIK (as a string) if activated successfully.

```
POST: coap://coap.exosite.com/provision/activate/<vendor>/<model>/<sn>
```

```
  Client                      Server
      |                           |
      |   CON POST                |
      |   uri_path: "provision"   |
      |   uri_path: "activate"    |
      |   uri_path: "<vendor>"    |
      |   uri_path: "<model>"     |
      |   uri_path: "<sn>"        |
      +-------------------------->|
      |                           |
      |   ACK Content (2.05)      |
      |   "<CIK>"                 |
      |<--------------------------+
```

### Responses
* 2.05 Content: Activated, CIK Returned as UTF-8 String
* 4.04 Not Found: No device waiting activation found with given information.


## List Content IDs

Fetch the list of available content IDs for the given device.

```
GET coap://coap.exosite.com/provision/download/<vendor>/<model>?<CIK>
```

```
  Client                      Server
      |                           |
      |   CON GET                 |
      |   uri_path: "provision"   |
      |   uri_path: "download"    |
      |   uri_path: "<vendor>"    |
      |   uri_path: "<model>"     |
      |   uri_query: "<CIK>"      |
      +-------------------------->|
      |                           |
      |   ACK Content (2.05)      |
      |   "<id1>, <id2>, ..."     |
      |<--------------------------+
```

### Responses
* 2.05 Content: Content List Returned as UTF-8 Strings Separated by Newlines
* 4.01 Unauthorized: The given CIK couldn't be used to authenticate.
* 4.04 Not Found: No device or no content found with given information.


## Get Content Info

Fetch information about the given content.

```
GET coap://coap.exosite.com/provision/download/<vendor>/<model>/<id>/info?<CIK>
```

```
  Client                                                        Server
      |                                                             |
      |   CON GET                                                   |
      |   uri_path: "provision"                                     |
      |   uri_path: "download"                                      |
      |   uri_path: "<vendor>"                                      |
      |   uri_path: "<model>"                                       |
      |   uri_path: "<id>"                                          |
      |   uri_path: "info"                                          |
      |   uri_query: "<CIK>"                                        |
      +------------------------------------------------------------>|
      |                                                             |
      |   ACK Content (2.05)                                        |
      |   "<content-type>,<byte-size>,<updated-timestamp>,<meta>"   |
      |<------------------------------------------------------------+
```

### Responses
* 2.05 Content: Content Info Returned as UTF-8 String
* 4.01 Unauthorized: The given CIK couldn't be used to authenticate.
* 4.04 Not Found: No device or no content found with given information.


## Download Content

Download the given content using a blockwise transfer.

```
GET coap://coap.exosite.com/provision/download/<vendor>/<model>/<id>?<CIK>
Block Option: Block2
```

```
  Client                       Server
      |                            |
      |   CON GET                  |
      |   uri_path: "provision"    |
      |   uri_path: "download"     |
      |   uri_path: "<vendor>"     |
      |   uri_path: "<model>"      |
      |   uri_path: "<id>"         |
      |   uri_query: "<CIK>"       |
      |   block2: 0/0/128          |
      +--------------------------->|
      |                            |
      |   ACK Content (2.05)       |
      |   block2: 0/1/128          |
      |   "<content-block>"        |
      |<---------------------------+
      |                            |
      |   CON GET                  |
      |   uri_path: "provision"    |
      |   uri_path: "download"     |
      |   uri_path: "<vendor>"     |
      |   uri_path: "<model>"      |
      |   uri_path: "<id>"         |
      |   uri_query: "<CIK>"       |
      |   block2: 1/0/128          |
      +--------------------------->|
      |                            |
      |   ACK Content (2.05)       |
      |   block2: 1/1/128          |
      |   "<content-block>"        |
      |<---------------------------+
      |                            |
      |   CON GET                  |
      |   uri_path: "provision"    |
      |   uri_path: "download"     |
      |   uri_path: "<vendor>"     |
      |   uri_path: "<model>"      |
      |   uri_path: "<id>"         |
      |   uri_query: "<CIK>"       |
      |   block2: 2/0/128          |
      +--------------------------->|
      |                            |
      |   ACK Content (2.05)       |
      |   block2: 2/0/128          |
      |   "<last-content-block>"   |
      |<---------------------------+
```

For more information about blockwise transfers, see:
http://wiki.tools.ietf.org/html/draft-ietf-core-block

### Responses
* 2.05 Content: Content Returned as Uploaded.
* 4.01 Unauthorized: The given CIK couldn't be used to authenticate.
* 4.04 Not Found: No device or no content found with given information.


##Timestamp

Get the current time as a unix timestamp.

```
GET: coap://coap.exosite.com/ts
```

```
  Client                    Server
      |                        |
      |   CON GET              |
      |   uri_path: "ts"       |
      +----------------------->|
      |                        |
      |   ACK Content (2.05)   |
      |   "<timestamp>"        |
      |<-----------------------+
```

`<timestamp>`: The current unix timestamp. This can either be a UTF-8 string or the binary representation of the timestamp as a signed integer sent in network byte order. However note that using the binary representation may technically violate protocol when used in the uri query option. The default format is a UTF-8 string, to request it as a signed integer, make the request with the option `Content-Format` set to `application/octet-stream` (42).

### Responses
* 2.05 Content: The value is returned.


# Remote Procedure Call Proxy

If you need to do more with your data than read the latest value and write new values at the current time, you'll need to use the [RPC API](https://github.com/exosite/docs/blob/master/rpc). Generally devices don't use this API since it is relatively complicated and the JSON format is rather heavy and hard to parse and construct, but luckily for you, we've setup a proxy that will translate the HTTP + JSON format that that API uses into a CoAP + CBOR format which drastically brings down the requirements needed to use it.

See the [RPC API docs](https://github.com/exosite/docs/blob/master/rpc) for more information about using this API. The JSON of that API maps one to one the CBOR that you will receive and be expected to send.

You can also request that the JSON be passed straight through by sending an 'Accept' option with 'application/json'.

Responses that are longer than about 1500 bytes will need to be downloaded using block transfers.

The payloads for both writing and the returned values for reading are in the CBOR (Concise Binary Object Representation) format. It is shown in this document in a JSON-like format for display purposes. See http://cbor.io for more information.

```
POST: coap://coap.exosite.com/rpc
```

```
  Client                                                   Server
      |                                                      |
      |   CON POST                                           |
      |   uri_path: "rpc"                                    |
      |   { "auth" : {"cik" : "<CIK>"},                      |
      |        "calls" : [{                                  |
      |             "id" : 1,                                |
      |             "procedure" : "read",                    |
      |             "arguments" : [                          |
      |                 {"alias" : "<alias r1>"},            |
      |                 {"limit" : 1}                        |
      |             ]                                        |
      |         },                                           |
      |         {                                            |
      |             "id" : 2,                                |
      |             "procedure" : "write",                   |
      |             "arguments" : [{                         |
      |                 "alias" : "<alias w1>"               |
      |             },                                       |
      |             65.4]                                    |
      |         },                                           |
      |         {                                            |
      |             "id" : 3,                                |
      |             "procedure" : "record",                  |
      |             "arguments" : [{                         |
      |                 "alias" : "<alias w2>"               |
      |             },                                       |
      |             [[1410360812,65.4],                      |
      |             [1410360813,66.3],                       |
      |             [1410360815,67.9]],                      |
      |             {}]                                      |
      |         }]                                           |
      |     }                                                |
      |                                                      |
      +----------------------------------------------------->|
      |                                                      |
      |   ACK Content (2.05)                                 |
      |   [{                                                 |
      |         "id": 1,                                     |
      |         "status": "ok",                              |
      |        "result": [[1410360840, 64.2]]                |
      |     },                                               |
      |     {                                                |
      |         "id": 2,                                     |
      |         "status": "ok",                              |
      |     },                                               |
      |     {                                                |
      |         "id": 3,                                     |
      |         "status": "ok",                              |
      |     }]                                               |
      |<-----------------------------------------------------+
```

`<alias #>`: The alias of the datasource that is to have the latest value read or written.  
`<CIK>`: The client identification key. This can either be a UTF-8 string or the binary representation of the cik as a hexadecimal value sent in network byte order. However note that using the binary representation may technically violate protocol when used in the uri query option.

### Responses
* 2.05 Content: The value is returned.
* 4.01 Unauthorized: The given CIK couldn't be used to authenticate.
* 4.03 Forbidden: The given alias couldn't be accesses with the given CIK.




# More Info

More information about the Exosite roadmap for CoAP can be made available
upon request. Further details about CoAP can be found with the
[IETF](https://datatracker.ietf.org/doc/draft-ietf-core-coap/).

