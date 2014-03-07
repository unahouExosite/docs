# CoAP API

The Constrained Application Protocol (CoAP) is a specialized web transfer protocol for use with constrained nodes and constrained (e.g., low-power, lossy) networks. The nodes often have 8-bit microcontrollers with small amounts of ROM and RAM, while constrained networks such as 6LoWPAN often have high packet error rates and a typical throughput of 10s of kbit/s. The protocol is designed for machine-to-machine (M2M) applications such as smart energy and building automation.

CoAP provides a request/response interaction model between application endpoints, supports built-in discovery of services and resources, and includes key concepts of the Web such as URIs and Internet media types. CoAP is designed to easily interface with HTTP for integration with the Web while meeting specialized requirements such as multicast support, very low overhead and simplicity for constrained environments.

The Exosite CoAP API allows for writing to and reading from data sources on the Exosite One Platform.

If you're completely new to Exosite's APIs, you may want to read the [API overview](../README.md) first.

## Table of Contents

[Libraries and Sample Code](#libraries-and-sample-code)

[Conventions](#conventions)

[CoAP Responses](#coap-responses)

[Procedures](#procedures)

[Supported Features](#supported-features)

[Known Issues](#known-issues)

[Roadmap](#roadmap)

####Procedures

[Write](#write) - write new data to a set of dataports

[Read](#read) - read the latest data from a set of dataports

## Libraries and Sample Code

Sample CoAP client code can be provided by Exosite upon request.

## Notational Conventions

This document uses a few notational conventions:

* A name in angle brackets, e.g. `<myvar>`, is a placeholder that will be defined elsewhere.
* `number` indicates a number, e.g. 42
* `string` represents a string, e.g. "MySensor"
* `|` represents multiple choice
* `=` represents default value
* `...` represents one or more of the previous item

## CoAP Responses

CoAP makes use of (a subset of) the HTTP status codes defined in [RFC2616] plus some CoAP-specific status codes.  The HTTP status code is encoded into an 8-bit unsigned integer code with the mapping defined in Table 3.  The use of these codes is defined throughout this document using the HTTP Name (except for CoAP-specific codes).

| Code | HTTP Name                               |
| ---- | --------------------------------------- |
| 40   | 100 Continue                            |
| 80   | 200 OK                                  |
| 81   | 201 Created                             |
| 124  | 304 Not Modified                        |
| 160  | 400 Bad Request                         |
| 164  | 404 Not Found                           |
| 165  | 405 Method Not Allowed                  |
| 175  | 415 Unsupported Media Type              |
| 200  | 500 Internal Server Error               |
| 202  | 502 Bad Gateway                         |
| 203  | 503 Service Unavailable                 |
| 204  | 504 Gateway Timeout                     |
| 240  | Token Option required by server         |
| 241  | Uri-Authority Option required by server |
| 242  | Critical Option not supported           |

# Procedures

##Write

Write one or more dataports of alias `<alias>` with given `<value>`. The client (e.g. device, portal) is identified by `<CIK>`. Data is written with the server timestamp as of the time the data was received by the server. Data cannot be written faster than a rate of once per second with this API.

Send CoAP POST to write data '99' to alias 'battery':
    
```
CoAP SERVER(65.49.60.152, 5683) says: 64 44 DC 65 84 49 40 E4
Type: ACK, Token Length: 4, Code: 2.04(Changed)
RX MID: DC 65
RX Token: 84 49 40 E4
Ack from CoAP server is good.
```

##Read

Read the most recent value from one or more dataports with alias `<alias>`. The client (e.g. device or portal) to read from is identified by `<CIK>`. If at least one `<alias>` is found and has data, data will be returned.

Send CoAP GET to read data from alias 'battery':

```
CoAP SERVER(65.49.60.152, 5683) says: 64 45 A9 85 CA 32 3F 11 FF 00 00 00 63
Type: ACK, Token Length: 4, Code: 2.05(Content)
RX MID: A9 85
RX Token: CA 32 3F 11
Ack from CoAP server is good.
Payload: 99
```

* See [CoAP Responses](#coap-responses) for a full list of responses.

# Supported Features

The CoAP API supports reads and writes to data sources on the ONE Platform. The
following table depicts specific scenarios that have been tested. The "Device"
column indicates what type of data is originating from the device under test
(simulated by coap_client.py), and the "Cloud" column indicates the data format
of the data source on the ONE Platform that is being written to.

+---------+---------+-------+-------+----------------------------------------+
| Device  | Cloud   | Write | Read  | Notes                                  |
+=========|=========================+========================================+
| Integer | Integer | Yes   | Yes   | NA                                     |
+---------+---------+-------+-------+----------------------------------------+
| Integer | String  | Yes   | Yes   | NA                                     |
+---------+---------+-------+-------+----------------------------------------+
| Integer | Float   | Yes   | Yes   | NA                                     |
+---------+---------+-------+-------+----------------------------------------+
| Float   | Float   | No    | No    | Float not yet supported                |
+---------+---------+-------+-------+----------------------------------------+
| Float   | Integer | No    | No    | Float not yet supported                |
+---------+---------+-------+-------+----------------------------------------+
| Float   | String  | No    | No    | Float not yet supported                |
+---------+---------+-------+-------+----------------------------------------+
| String  | String  | Yes   | Yes   | NA                                     |
+---------+---------+-------+-------+----------------------------------------+
| String  | Integer | Yes   | Yes   | String coerced to integer before write |
+---------+---------+-------+-------+----------------------------------------+
| String  | Float   | Yes   | Yes   | String coerced to integer before write |
+---------+---------+-------+-------+----------------------------------------+

# Known Issues

Known issues:

* Uses pre-production server at '65.49.60.152' - this server may not be
  available at all times.

* Only One Platform data source types of "string" and "integer" are supported.

* Float types and CoAP block data transfers are not yet supported.

# Roadmap

Today, the Exosite CoAP API supports read/write to data sources on the platform. 
Future features that will become available:

April 1st, 2014:

* Moved from beta status to production status.
* Limited support for blob transfers

Beyond:

* Discovery 
* Observe

More information about the Exosite roadmap for CoAP can be made available
upon request. Further details about CoAP can be found with the
[IETF](https://datatracker.ietf.org/doc/draft-ietf-core-coap/).

