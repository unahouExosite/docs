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
| 4.00 | Bad Request                  |   N  |
| 4.01 | Unauthorized                 |   Y  |
| 4.02 | Bad Option                   |   Y  |
| 4.03 | Forbidden                    |   Y  |
| 4.04 | Not Found                    |   Y  |
| 4.05 | Method Not Allowed           |   N  |
| 4.06 | Not Acceptable               |   N  |
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

`<alias>`: The alias of the datasource that is being written to.  
`<value>`: The value to be written at the current time.  
`<CIK>`: The client identification key. This can either be a UTF-8 string or the binary representation of the cik as a hexidecimal value sent in network byte order.

### Example

Send CoAP POST to write '37' to alias 'temp':
    
```
Version:       1
Type:          CON
Code:          POST (0.02)
Message_id:    f6
Token Length:  0
Options Count: 3
Option Number: URI_PATH (11)
       Value:  1a
Option Number: URI_PATH (11)
       Value:  temp
Option Number: URI_QUERY (15)
       Value:  \xa3,\x85\xba\x9d\xdaE\x82;\xe4\x16$l\xf8\xb43\xba\xa0h\xd7
Payload: 37
Message as Received (37 bytes of data): 
0000: 40 02 00 f6 b2 31 61 04 74 65 6d 70 4d 07 a3 2c    @��7�1a�tempM��,
0016: 85 ba 9d da 45 82 3b e4 16 24 6c f8 b4 33 ba a0    ����E�;��$l��3�
0032: 68 d7 ff 33 37                                     h��37
```

##Read

Read the most recent value from the dataport with alias `<alias>`. If at `<alias>` is found and has data, data will be returned.

```
GET: coap://coap.exosite.com/1a/<alias>?<CIK>
```

`<alias>`: The alias of the datasource that is to have the latest value read.  
`<CIK>`: The client identification key. This can either be a UTF-8 string or the binary representation of the cik as a hexadecimal value sent in network byte order.

### Example

Send CoAP GET to read latest value from alias 'temp':

```
Version:       1
Type:          CON
Code:          GET (0.01)
Message_id:    9d
Token Length:  0
Options Count: 3
Option Number: URI_PATH (11)
       Value:  1a
Option Number: URI_PATH (11)
       Value:  temp
Option Number: URI_QUERY (15)
       Value:  \xa3,\x85\xba\x9d\xdaE\x82;\xe4\x16$l\xf8\xb43\xba\xa0h\xd7
Payload: 
Message as Received (34 bytes of data): 
0000: 40 01 00 9d b2 31 61 04 74 65 6d 70 4d 07 a3 2c    @��7�1a�tempM��,
0016: 85 ba 9d da 45 82 3b e4 16 24 6c f8 b4 33 ba a0    ����E�;��$l��3�
0032: 68 d7                                              h
```

## Activate

Request an activation of the given device, returns the CIK (as a string) if activated successfully.

```
POST: coap://coap.exosite.com/provision/activate/<vendor>/<model>/<sn>
```

### Responses
* 2.05 Content: Activated, CIK Returned as UTF-8 String
* 4.04 Not Found: No device waiting activation found with given information.

## List Content IDs

Fetch the list of available content IDs for the given device.

```
GET coap://coap.exosite.com/provision/download/<vendor>/<model>?<CIK>
```

### Responses
* 2.05 Content: Content List Returned as UTF-8 Strings Separated by Newlines
* 4.04 Not Found: No device or no content found with given information.

## Download Content

Download the given content using a blockwise transfer.

```
GET coap://coap.exosite.com/provision/download/<vendor>/<model>/<id>?<CIK>
Block Option: Block2
```

### Responses
* 2.05 Content: Content Returned as Uploaded.
* 4.04 Not Found: No device or no content found with given information.

* See [CoAP Responses](#coap-responses) for a full list of responses.

# Supported Features

The CoAP API supports reads and writes to data sources on the One Platform.
It also supports reading and writing blockwise-transfers to/from the One Platform.

# Known Issues

* The `/.well-known/core/` discovery endpoint is not yet supported.
* Publish/subscribe (observe) patterns are not yet supported.

More information about the Exosite roadmap for CoAP can be made available
upon request. Further details about CoAP can be found with the
[IETF](https://datatracker.ietf.org/doc/draft-ietf-core-coap/).

