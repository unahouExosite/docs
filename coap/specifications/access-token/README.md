# Introduction

This document registers a CoAP Option Number that can be used for
authentication from a client to a server.

# Status

* This draft specification has been sent to the IANA for review. (2014-07-22)

# Option Number Definition

    +-----+---+---+---+---+----------------+--------+--------+----------+
    | No. | C | U | N | R | Name           | Format | Length | Default  |
    +-----+---+---+---+---+----------------+--------+--------+----------+
    | -?- | x |   |   |   | Access-Token   | opaque | 0-255  | (none)   |
    +-----+---+---+---+---+----------------+--------+--------+----------+

             C=Critical, U=Unsafe, N=NoCacheKey, R=Repeatable

This option is to be used as a temporary authentication token to authenticate
a client to a server in a similar manner to an HTTP cookie.

When this option appears in a request it is to be used to authenticate the
requester. A request with a zero-length Access-Token is to be interpreted as a
a request for a token and should be accompanied by other (usually much more
verbose) information to identify the device to the server.

When this option appears in a response it is to be saved by the requester,
replacing any existing Access-Token and be used for all further requests to the
responding server. A zero length Access-Token in a response has no definition
and must be processed as a message format error.

The format of the token is up to the server that assigns it and is to be treated
as an opaque byte string by the client.

This option must not appear more than once in a request or response.

# References

[RFC7252 - The Constrained Application Protocol](http://tools.ietf.org/html/rfc7252)
