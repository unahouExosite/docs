# UDP API

The UDP API provides a low-overhead interface that allows clients with strict data bandwidth requirements (e.g. cellular data) to send data to the One Platform. This API uses a simple UDP packet that encapsulates both identification information and data payload. If you're completely new to Exosite's APIs, you may want to read the [API       overview](../README.md) first.

## Table of Contents

[Conventions](#conventions)

[Procedures](#procedures)

[Examples](#examples)

## Conventions

This document uses the following notational conventions:

* A name in angle brackets, e.g. `<myvar>`, is a placeholder that you must define.

## Procedures

### Write 

This interface can be accessed on Port 18494 via m2.exosite.com.

```
Server: m2.exosite.com
Port: 18494
```

Data being sent from the client device is sent over a UDP socket. An Exosite client identification key <CIK> and one or more alias (resource) names <alias>es & <value>s are included as the body of the UDP packet.

Multiple client resource values can be written in the body of a single UDP packet, each client resource is listed by its resource alias name, ‘=’, and it’s value. For example "1=453" or "temp=74.3". To separate each resource the ‘&’ symbol is used.

Content format:

```
cik=<CIK>&<alias 1>=<value 1>&<alias 2...>=<value 2...>&<alias n>=<value n>
```

Response Format:

```
None - no server responses are sent.
```

## Examples

The following example updates the alias "temperature" with a value of "22" for CIK fff51d1a260b4b258fefffd9a9313c433e419fff using the netcat command from the command line:

```
$ echo "cik=fff51d1a260b4b258fefffd9a9313c433e419fff&temperature=22" | nc -w 1 -u m2.exosite.com 18494
```

Our Github Exosite Garage Projects have a number of examples of using this interface. For instance:

* [Python](https://github.com/exosite-garage/udp_single_shot) - Write Example (Socket level code, useful reference for any code base)

