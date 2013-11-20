# Device Provisioning and Fleet Management API

Procedures in this API fall into one of two categories:

- [Device Provisioning](device.md) procedures enable devices to authenticate with the One Platform even if they are not pre-programmed with a CIK.
- [Fleet Management](management.md) procedures enable device OEMs to create custom "cloud profiles" for devices so they can accomplish fleet-level management of devices across different device models. 

Both APIs use the HTTP POST, GET, PUT and DELETE methods to configure the different facets of the provisioning system. Note that the terms "client" and "device" are interchangeable in the text below. There are various HTTP required headers that are inherent to the protocol that are not repeated in each API procedure description. As an example, all of the POST and PUT requests must also contain a correct `Content-Length` header specifying the body payload size. Also, all responses having a status of 200 will also contain a `Content-Length` response header.

API Version: `1.1`

Host Address: `http://m2.exosite.com` or `https://m2.exosite.com`

If you're completely new to Exosite's APIs, you may want to read the [API overview](../README.md) first.


## Libraries and Sample Code

Wrapper libraries for this API:

* Python: [pyonep](https://github.com/exosite-labs/pyonep) includes a module, provision.py, that wraps the provision API.

Code samples that use this API:

* [Provision Examples](https://github.com/exosite-garage/provision_examples) - socket level code intended as a reference for implementation in other languages


## Conventions

This document uses a few notational conventions:

* A name in angle brackets, e.g. `<myvar>`, is a placeholder that will be defined elsewhere.
* Items in curly braces, e.g., `{vendor=<id>}`, are optional.
* `...` indicates the previous content is repeated.

## HTTP Responses

Typical HTTP response codes include:

| Code   | Response      | Description                                       |
|:------ |:--------------|:------------------------------------------------- |
| 200    | OK            | Successful request, returning requested values    |
| 204    | No Content    | Successful request, nothing will be returned      |
| 4xx    | Client Error  | There was an error with the request by the client |
| 5xx    | Server Error  | There way an error with the request on the server |

## Procedures

See the [Device Provisioning](device.md) and [Fleet Management](management.md) pages for information of API procedures.


