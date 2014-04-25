# CoAP API

The Constrained Application Protocol (CoAP) is a specialized web transfer protocol for use with constrained nodes and constrained (e.g., low-power, lossy) networks. The nodes often have 8-bit microcontrollers with small amounts of ROM and RAM, while constrained networks such as 6LoWPAN often have high packet error rates and a typical throughput of 10s of kbit/s. The protocol is designed for machine-to-machine (M2M) applications such as smart energy and building automation.

CoAP provides a request/response interaction model between application endpoints, supports built-in discovery of services and resources, and includes key concepts of the Web such as URIs and Internet media types. CoAP is designed to easily interface with HTTP for integration with the Web while meeting specialized requirements such as multicast support, very low overhead and simplicity for constrained environments.

The Exosite CoAP API allows for writing to and reading from data sources on the Exosite One Platform.

If you're completely new to Exosite's APIs, you may want to read the [API overview](../README.md) first.

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
* `number` indicates a number, e.g. 42
* `string` represents a string, e.g. "MySensor"
* `|` represents multiple choice
* `=` represents default value
* `...` represents one or more of the previous item
* CoAP request packets are shown in a text format with the format `METHOD: URI\nPAYLOAD`.

## CoAP Responses

CoAP makes use of so called CoAP Response Codes which resemble the HTTP status codes defined in [RFC2616](https://www.ietf.org/rfc/rfc2616.txt) plus some CoAP-specific status codes. The Response Code is encoded into an 8-bit unsigned integer code as defined in [section 3 of the specification](http://tools.ietf.org/html/draft-ietf-core-coap-18#section-3)). 

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

Write one or more dataports of alias `<alias>` with given `<value>`. The client (e.g. device, portal) is identified by `<CIK>`, which is binary value, not a UTF-8 string. Data is written with the server timestamp as of the time the data was received by the server. Data cannot be written faster than a rate of once per second with this API.

```
POST: coap://coap.exosite.com/a1/<alias>?<CIK>
<value>
```

Send CoAP POST to write data '37' to alias '1':
    
```
Version:       01
Type:          CON
Code:          POST (0.02)
Message_id:    9d
Token Length:  0
Options Count: 3
Option Number: URI_PATH (11)
       Value:  1a
Option Number: URI_PATH (11)
       Value:  1
Option Number: URI_QUERY (15)
       Value:  \xa3,\x85\xba\x9d\xdaE\x82;\xe4\x16$l\xf8\xb43\xba\xa0h\xd7
Payload: 37

Binary Message (34 bytes of data): 
0000: 40 02 00 9d b2 31 61 01 31 4d 07 a3 2c 85 ba 9d    @����1a�1M��,��
0016: da 45 82 3b e4 16 24 6c f8 b4 33 ba a0 68 d7 ff    �E�;��$l��3��h�
0032: 33 37                                              37

```

##Read

Read the most recent value from one or more dataports with alias `<alias>`. The client (e.g. device or portal) to read from is identified by `<CIK>`. If at least one `<alias>` is found and has data, data will be returned.

```
GET: coap://coap.exosite.com/a1/<alias>?<CIK>
```

Send CoAP GET to read data from alias '1':

```
Version:       01
Type:          CON
Code:          0.01
Message_id:    ec0e
Token Length:  4
Options Count: 3
Option Number: URI_PATH (11)
      - Value:  1a
Option Number: URI_PATH (11)
      - Value:  1
Option Number: URI_QUERY (15)
      - Value:  \xa3,\x85\xba\x9d\xdaE\x82;\xe4\x16$l\xf8\xb43\xba\xa0h\xd7
Payload: 

Binary Message (35 bytes of data): 
0000: 44 01 ec 0e 7a 5f 6b 53 b2 31 61 01 31 4d 07 a3    D���z_kS�1a�1M�
0016: 2c 85 ba 9d da 45 82 3b e4 16 24 6c f8 b4 33 ba    ,����E�;��$l��3
0032: a0 68 d7                                           �h

```

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

