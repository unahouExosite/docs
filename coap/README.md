# CoAP API

The Constrained Application Protocol (CoAP) is a specialized web transfer protocol for use with constrained nodes and constrained (e.g., low-power, lossy) networks. The nodes often have 8-bit microcontrollers with small amounts of ROM and RAM, while constrained networks such as 6LoWPAN often have high packet error rates and a typical throughput of 10s of kbit/s. The protocol is designed for machine-to-machine (M2M) applications such as smart energy and building automation.

CoAP provides a request/response interaction model between application endpoints, supports built-in discovery of services and resources, and includes key concepts of the Web such as URIs and Internet media types. CoAP is designed to easily interface with HTTP for integration with the Web while meeting specialized requirements such as multicast support, very low overhead and simplicity for constrained environments.

This api currently uses [draft 18](http://tools.ietf.org/html/draft-ietf-core-coap-18) of the CoAP protocol and may be updated as further protocol modifications are published by the IETF.

## Table of Contents

[Libraries and Sample Code](#libraries-and-sample-code)

[Notational Conventions](#notational-conventions)

[CoAP Responses](#coap-responses)

[Procedures](#procedures)

[Supported Features](#supported-features)

[Known Issues](#known-issues)

[Roadmap](#roadmap)

## Libraries and Sample Code

A sample CoAP client written in python is available in the [CoAPExample](https://github.com/exosite-garage/CoAPExample) repository.

## Notational Conventions

This document uses a few notational conventions:

* A name in angle brackets, e.g. `<myvar>`, is a placeholder that will be defined elsewhere.
* CoAP request packets are shown in a text format with the format `METHOD: URI\nPAYLOAD`.

## CoAP Responses

CoAP makes use of so called CoAP Response Codes which resemble the HTTP status codes defined in [RFC2616](https://www.ietf.org/rfc/rfc2616.txt) plus some CoAP-specific status codes. The Response Code is encoded into an 8-bit unsigned integer code as defined in [section 3 of the specification](http://tools.ietf.org/html/draft-ietf-core-coap-18#section-3). 

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

Write one or more dataports of alias `<alias>` with given `<value>`. Data is written with the server timestamp as of the time the data was received by the server. Data cannot be written faster than a rate of once per second.

```
POST: coap://coap.exosite.com/1a/<alias>?<CIK>
<value>
```

```
  Client                            Server
      |                                 |
      |           CON [0x15df]          |
      | POST uri_path:/1a/<alias>?<CIK> |
      |          (Token 0x1259)         |
      |            "<value>"            |
      +-------------------------------->|
      |                                 |
      |           ACK [0x15df]          |
      |           2.04 Changed          |
      |          (Token 0x1259)         |
      |<--------------------------------+
```

`<alias>`: The alias of the datasource that is being written to.  
`<value>`: The value to be written at the current time.  
`<CIK>`: The client identification key. This can either be a UTF-8 string or the binary representation of the cik as a hexidecimal value sent in network byte order.

### Responses
* 2.04 Changed: The value has been written.
* 4.01 Unauthorized: The given CIK couldn't be used to authenticate.
* 4.04 Not Found: The given alias couldn't be found.


##Read

Read the most recent value from the dataport with alias `<alias>`. If at `<alias>` is found and has data, data will be returned.

```
GET: coap://coap.exosite.com/1a/<alias>?<CIK>
```

```
  Client                           Server
      |                                |
      |          CON [0xf35a]          |
      | GET uri_path:/1a/<alias>?<CIK> |
      |         (Token 0xefc1)         |
      +------------------------------->|
      |                                |
      |          ACK [0xf35a]          |
      |          2.05 Content          |
      |         (Token 0xefc1)         |
      |           "<value>"            |
      |<-------------------------------+
```

`<alias>`: The alias of the datasource that is to have the latest value read.  
`<CIK>`: The client identification key. This can either be a UTF-8 string or the binary representation of the cik as a hexadecimal value sent in network byte order.

### Responses
* 2.05 Content: The value is returned.
* 4.01 Unauthorized: The given CIK couldn't be used to authenticate.
* 4.04 Not Found: The given alias couldn't be found.


## Activate

Request an activation of the given device, returns the CIK (as a string) if activated successfully.

```
POST: coap://coap.exosite.com/provision/activate/<vendor>/<model>/<sn>
```

```
   Client                                            Server
      |                                                  |
      |                   CON [0xf245]                   |
      |  POST /provision/activate/<vendor>/<model>/<sn>  |
      |                   (Token 0x7492)                 |
      +------------------------------------------------->|
      |                                                  |
      |                    ACK [0xf245]                  |
      |                    2.05 Content                  |
      |                   (Token 0x7492)                 |
      |                      "<cik>"                     |
      |<-------------------------------------------------+
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
   Client                                            Server
      |                                                  |
      |                   CON [0xbf34]                   |
      | GET /provision/download/<vendor>/<model>/?<CIK>  |
      |                  (Token 0x13f4)                  |
      +------------------------------------------------->|
      |                                                  |
      |                   ACK [0xbf34]                   |
      |                   2.05 Content                   |
      |                  (Token 0x13f4)                  |
      |            "<id1>, <id2>, <id3>, ..."            |
      |<-------------------------------------------------+
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
   Client                                                     Server
      |                                                           |
      |                     CON [0x7a10]                          |
      | GET /provision/download/<vendor>/<model>/<id>/info?<CIK>  |
      |                     (Token 0x73)                          |
      +---------------------------------------------------------->|
      |                                                           |
      |                      ACK [0x7a10]                         |
      |                      2.05 Content                         |
      |                      (Token 0x73)                         |
      | "<content-type>,<byte-size>,<updated-timestamp>,<meta>"   |
      |<----------------------------------------------------------+
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
   Client                                                     Server
     |                                                            |
     |                       CON [0x342a]                         |
     |    GET /provision/download/<vendor>/<model>/<id>?<CIK>     |
     |                       2:0/0/128                            |
     +----------------------------------------------------------->|
     |                                                            |
     |                      ACK [0x342a]                          |
     |                      2.05 Content                          |
     |                      "<payload>"                           |
     |                      2:0/1/128                             |
     |<-----------------------------------------------------------+
     |                                                            |
     |                       CON [0x342b]                         |
     |    GET /provision/download/<vendor>/<model>/<id>?<CIK>     |
     |                       2:1/0/128                            |
     +----------------------------------------------------------->|
     |                                                            |
     |                      ACK [0x342b]                          |
     |                      2.05 Content                          |
     |                      "<payload>"                           |
     |                      2:1/1/128                             |
     |<-----------------------------------------------------------+
     |                                                            |
     |                       CON [0x342c]                         |
     |    GET /provision/download/<vendor>/<model>/<id>?<CIK>     |
     |                       2:2/0/128                            |
     +----------------------------------------------------------->|
     |                                                            |
     |                      ACK [0x342c]                          |
     |                      2.05 Content                          |
     |                      "<payload>"                           |
     |                      2:2/0/128                             |
     |<-----------------------------------------------------------+
```

For more information about blockwise transfers, see:
http://wiki.tools.ietf.org/html/draft-ietf-core-block

### Responses
* 2.05 Content: Content Returned as Uploaded.
* 4.01 Unauthorized: The given CIK couldn't be used to authenticate.
* 4.04 Not Found: No device or no content found with given information.


# Supported Features

The CoAP API supports reads and writes to data sources on the One Platform.
It also supports reading and writing blockwise-transfers to/from the One Platform.

# Known Issues

* The `/.well-known/core/` discovery endpoint is not yet supported.
* Publish/subscribe (observe) patterns are not yet supported.

More information about the Exosite roadmap for CoAP can be made available
upon request. Further details about CoAP can be found with the
[IETF](https://datatracker.ietf.org/doc/draft-ietf-core-coap/).

