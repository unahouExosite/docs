## Exosite Provision/Device Management API

This API allows devices to authenticate with the One Platform even if they are not pre-programmed with a CIK. It also allows device OEMs to create custom "cloud profiles" for devices so they can accomplish fleet-level management of large device fleets across different device models.

The API uses the HTTP POST, GET, PUT and DELETE methods to configure the different facets of the provisioning system. It is important to note that the words "Client" and "Device" are interchangeable in the text below. There are various HTTP required headers that are inherent to the protocol, as such they are not specified below. As an example, all of the POST and PUT requests must also contain a correct Content-Length: header specifying the body payload size. And all responses having a status of 200 will also contain a Content-Length: response header.

API Version: 1.1

Host Address: `http://m2.exosite.com` or `https://m2.exosite.com`

If you're completely new to Exosite's APIs, you may want to read the [API overview](../README.md) first.


### Libraries and Sample Code

Wrapper libraries for this API:

* Python: [pyonep](https://github.com/exosite-labs/pyonep) includes a module, provision.py, that wraps the provision API.

Code samples that use this API:

* [Provision Examples](https://github.com/exosite-garage/provision_examples) - socket level code intended as a reference for implementation in other languages


### Notational Conventions

This document uses a few notational conventions:

* A name in angle brackets, e.g. `<myvar>`, is a placeholder that will be defined elsewhere.
* Items in curly braces, e.g., `{vendor=<id>}`, are optional.
* `...` indicates the previous content is repeated.

### HTTP Responses

Typical HTTP response codes include:

| Code   | Response      | Description                                       |
|:------ |:--------------|:------------------------------------------------- |
| 200    | OK            | Successful request, returning requested values    |
| 204    | No Content    | Successful request, nothing will be returned      |
| 4xx    | Client Error  | There was an error with the request by the client |
| 5xx    | Server Error  | There way an error with the request on the server |


## Procedures


## Procedures for device provisioning

### POST /provision/activate - activate client

Activates and returns `<cik>` of client administrated by Vendor `<vendor>`, of
model type `<model>` associated with Serial Number `<sn>`. Client must be 
enabled via `/provision/manage/model/<model>/<sn>`, the enabled state must not 
have expired, and the client must not have already been activated.

```
POST /provision/activate HTTP/1.1
Host: m2.exosite.com
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

vendor=<vendor>&model=<model>&sn=<sn>
```

#####response

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


### GET /provision/download?vendor=<vendor>&model=<model> - list content ids

If caller with `<DeviceCIK>` has an activated serial number in given 
`<vendor>` `<model>` name space then a list of authorized content `<id>`s 
are returned.

```
GET /provision/download?vendor=<vendor>&model=<model> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
Content-Length: <length>
<blank line>
```

#####response

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


### GET /provision/download?vendor=<vendor>&model=<model>&id=<id> - get content

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

#####response

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

### GET /provision/download?vendor=<vendor>&model=<model>&id=<id>&info=true - get content info

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

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8

<content-type>,<byte-size>,<updated-timestamp>,<description>
```

Response may also be:

* `HTTP/1.1 400 Bad Request` if the `<vendor>` and `<model>` pair is invalid.


## Procedures for model managers (factory or device owners)

### GET /provision/manage/content/<model>/ - list content ids

Returns list of content `<id>`s for `<model>`.

```
GET /provision/manage/content/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8
<blank line>
<id 1>
<id 2>
...
<id n>
```

Response may also be:

* `HTTP/1.1 400 Bad Request` if the `<vendor>` and `<model>` pair is invalid.


### GET /provision/manage/content/<model>/?sn=<serialnumber> - list authorized content 

Returns list of content `<id>`s authorized for access by `<serialnumber>`.

```
GET /provision/manage/content/<model>/?sn=<serialnumber> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8
<blank line>
<id 1>
<id 2>
...
<id n>
```

Response may also be:

* `HTTP/1.1 400 Bad Request` if the `<vendor>`, `<model>` and `<serialnumber>` combination is invalid.


### POST /provision/manage/content/<model>/ - create content entity

Creates content entity bucket named `<id>`. If `protected` is not specified or
`false` then the content entry is available to all model serial numbers.

```
POST /provision/manage/content/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

id=<id>&description=<description>{&protected=true}
```

#####response

```
HTTP/1.1 205 Reset Content
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: 0
<blank line>
```

Response may also be:

* `HTTP/1.1 409 Conflict` if `<id>` already exists.

### POST /provision/manage/content/<model>/ - delete content entry

Deletes content management entry and associated content.

```
POST /provision/manage/content/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

delete=true&id=<id>
```

#####response

```
HTTP/1.1 205 Reset Content
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: 0
<blank line>
```

### GET /provision/manage/content/<model>/<id> - get content info

Returns information about the specified content `<id>`.

```
GET /provision/manage/content/<model>/<id> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8
<blank line>
<content-type>,<byte-size>,<updated-timestamp>,<description>,<protected>
```

### GET /provision/manage/content/<model>/<id>?download=true - get content blob 

Returns the `<blob>` of the specified content `<id>`. `Range` is optional –
it allows the caller to request a chunk of bytes at a time. 
`<range-specifier>` takes the form of `X-Y` where both `X` and `Y` are 
optional but at least one of them must be present. `X` is the start byte 
position to return, `Y` is the end position. Both are 0 based. If `X` is 
omitted, `Y` will request the last `Y` count of bytes of the content. If `Y`
is omitted, it will default to the end of the content. Note that the 
`<content-type>` of the `<blob>` is based on the type set in the `POST` to 
`/provision/manage/content/<model>/<id>`.


```
GET /provision/manage/content/<model>/<id>?download=true HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
{Range: bytes=<range-specifier>}
<blank line>
```

#####response

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

### GET /provision/manage/content/<model>/<id>?sn=<serialnumber> - get content info

Returns information of the specified content `<id>` if `<serialnumber>` is 
authorized to download it.

```
GET /provision/manage/content/<model>/<id>?sn=<serialnumber> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Length: <length>
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8

<content-type>,<byte-size>,<updated-timestamp>,<description>
```

Response may also be:

* `HTTP/1.1 400 Bad Request` if the `<vendor>`, `<model>` and `<serialnumber>` combination is invalid.

### GET /provision/manage/content/<model>/<id>?download=true&sn=<serialnumber> - get content blob 

If `<serialnumber>` is authorized for the content, then the `<id>` content 
blob, or its requested range, is returned. The `Range` header 
is optional – it allows the caller to request a chunk of bytes at a time. 
`<range-specifier>` takes the form `X-Y` where both `X` and `Y` are optional 
but at least one of them must be present. `X` is the start byte position to 
return, `Y` is the end position. Both are 0 based. If `X` is omitted, `Y` will
request the last `Y` count of bytes of the content. If `Y` is omitted, it will
default to the end of the content. Note that the `<content-type>` of `<blob>` 
is based on the type set in the `POST` to 
`/provision/manage/content/<model>/<id>`.

```
GET /provision/manage/content/<model>/<id>?download=true&sn=<serialnumber> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
{Range: bytes=<range-specifier>}
<blank line>
```

#####response

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


### GET /provision/manage/content/<model>/<id>?show=groups{&offset=<offset>&limit=<limit>} - list groups

Returns the list of `<group id>`s which this content is a member of, if any, 
in paginated sets of size `<limit>` starting at `<offset>`, limit is 
enforced to be between 5 and 1000. If omitted, `<offset>` and `<limit>` will
respectively default to 0 and 5.

```
GET /provision/manage/content/<model>/<id>?show=groups{&offset=<offset>&limit=<limit>} HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8
<blankline>
<group id 1>
<group id 2>
...
<group id n>
```

Response may also be:

* `HTTP/1.1 204` if content `<id>` is not a member of any group.

### POST /provision/manage/content/<model>/<id>?show=groups{&offset=<offset>&limit=<limit>} - upload content

Stores `<blob>` as the payload for `<id>` under the given model. The given 
`<content-type>` is used as the `Content-Type` in subsequent download requests
for the `<id>`. Stores the payload for the given model with given
`Content-Type`.

```
POST /provision/manage/content/<model>/<id> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: <content-type>
Content-Length: <length>

<blob>
```

#####response

```
HTTP/1.1 205 Reset Content
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: 0
<blank line>
```

Response may also be:

* `HTTP/1.1 409 Conflict` if `<id>` already exists.


### DELETE /provision/manage/content/<model>/<id> - delete content

Deletes content `<id>`, and all payload and information, under the given 
`<model>`.

```
DELETE /provision/manage/content/<model>/<id> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
<blank line>
```

#####response

```
HTTP/1.1 205 Reset Content
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: 0
<blank line>
```

### GET /provision/manage/group/<model>/{?offset=<offset>&limit=<limit>}

Returns list of `<group id>`s with `<description>` for `<model>`, if any, in
paginated sets of size `<limit>` starting at `<offset>`, limit is enforced to
be between 5 and 1000. If omitted, `<offset>` defaults to 0 and `<limit>`
defaults to 5.

```
GET /provision/manage/group/<model>/{?offset=<offset>&limit=<limit>} HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8
<blankline>
<group id 1>,<description 1>
<group id 2>,<description 2>
...
<group id n>,<description n>
```

Response may also be:

* `HTTP/1.1 204` if there are no matching groups.

### POST /provision/manage/group/<model>/ - create group

Creates a new group with given `<id>` and `<description>`.

```
POST /provision/manage/group/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

id=<id>&description=<description>
```

#####response

```
HTTP/1.1 205 Reset Content
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: 0
<blank line>
```


Response may also be:

* `HTTP/1.1 409 Conflict` if group `<id>` already exists.


### POST /provision/manage/group/<model>/ - delete group

Deletes the group with given `<id>`.

```
POST /provision/manage/group/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

id=<id>&delete=true
```

#####response

```
HTTP/1.1 205 Reset Content
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: 0
<blank line>
```

### GET /provision/manage/group/<model>/<id> - get group info

Returns the `<description>` and the number of members of group `<id>`.

```
GET /provision/manage/group/<model>/<id> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8

<description>,<count>
```


### GET /provision/manage/group/<model>/<id>?show=groups{&offset=<offset>&limit=<limit>} - get group info

Returns the list of `<group id>`s of which this group is a member,
in paginated sets of size `<limit>` starting at `<offset>`, limit is enforced
to be between 5 and 1000. If omitted, `<offset>` and `<limit>` will 
respectively default to 0 and 5. 

```
GET /provision/manage/group/<model>/<id>?show=groups{&offset=<offset>&limit=<limit>} HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8
<blankline>
<group id 1>
<group id 2>
...
<group id n>
```

Response may also be:

* `HTTP/1.1 204` if the group is not a member of any other groups.

### DELETE /provision/manage/group/<model>/<id> - delete group

Deletes group <id>.

```
DELETE /provision/manage/group/<model>/<id> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
<blank line>
```

#####response

```
HTTP/1.1 205 Reset Content
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: 0
<blank line>
```

### GET /provision/manage/group/<model>/<id>/{?offset=<offset>&limit=<limit>} - get group member info

Returns information of all members of this group, if any, in paginated sets
of size 'limit' starting at 'offset', limit is enforced to be between 5 and
1000. If omitted, 'offset' and 'limit' will respectively default to 0 and 5

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: text/csv; charset=utf-8
   body:
     <type>,<memberid>,<expire>,<meta>
     ...
   status: 200
   status: 204 (if no members)

### GET /provision/manage/group/<model>/<id>/?type=<type>{&offset=<offset>&limit=<limit>}

Returns information of all members of specified type in this group, if any,
in paginated sets of size 'limit' starting at 'offset', limit is enforced
to be between 5 and 1000. If omitted, 'offset' and 'limit' will
respectively default to 0 and 5.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: text/csv; charset=utf-8
   body:
     <type>,<memberid>,<expire>,<meta>
     ...
   status: 200
   status: 204 (if no members of specified type)

### GET /provision/manage/group/<model>/<id>/?id=<id> - get group member info

Returns information of members with <id> in this group.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: text/csv; charset=utf-8
   body:
     <type>,<memberid>,<expire>,<meta>
     ...
   status: 200
   status: 204 (if no members with specified id)

### GET /provision/manage/group/<model>/<id>/?type=<type>&id=<id> - get group member info

Returns information of specified member in this group.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: text/csv; charset=utf-8
   body:
     <type>,<memberid>,<expire>,<meta>
   status: 200

### POST /provision/manage/group/<model>/<id>/ - add or update members of group

Adds or updates a member or members of specified type, with specified
id(s), expiration and meta to this group. Note, that multiple
members added will all share the same type, expiration and meta.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     type=<type>&id=<mid>&expire=<expire>&meta=<meta>
     OR
     type=<type>&id[]=<mid1>{...&id[]=<midN>}&expire=<expire>
       &meta=<meta>

   status: 205

### POST /provision/manage/group/<model>/<id>/ - add members to group

Adds members of specified type, with specified id, expiration and
meta to this group.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: text/csv; charset=utf-8
   body:
     <type>,<memberid>,<expire>,<meta>
     ...

   status: 205

### POST /provision/manage/group/<model>/<id>/ - delete members of group

Deletes a member or members of specified type, with specified id(s), from
this group.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     type=<type>&id=<mid>&delete=true
     OR
     type=<type>&id[]=<mid1>{...&id[]=<midN>}&delete=true

   status: 205

### DELETE /provision/manage/group/<model>/<id>/ - delete members of group 

Deletes members of type, matching id(s) from this group.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: text/csv; charset=utf-8
   body:
     <type>,<id>
     ...

   status: 205

### GET /provision/manage/model/ - list models

Returns list of models added by the vendor.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: text/csv; charset=utf-8
   body:
     <model>
     ...
   status: 200

### GET /provision/manage/model/?show=shared - list shared models

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: text/csv; charset=utf-8
   body:
     <vendorname>,<model>
     ...
   status: 200

### POST /provision/manage/model/ - add model

Adds a "model" entry, using <rid> OR <code> as the clone template.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     model=<model>&rid=<rid>&options[]=noaliases&options[]=nocomments
       &options[]=nohistorical
     OR
     model=<model>&code=<code>&options[]=noaliases&options[]=nocomments
       &options[]=nohistorical

   status: 205

### POST /provision/manage/model/ - delete model

Deletes specified provisioning model and all associated serial numbers and
content.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     delete=true&model=<model>

   status: 205

### GET /provision/manage/model/<model> - get model info

Get model information.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     rid=<rid>&options[]=noaliases&options[]=nocomments&options[]=nohistorical
     OR
     code=<code>&options[]=noaliases&options[]=nocomments&options[]=nohistorical
   status: 200

### PUT /provision/manage/model/<model> - update model

Updates <model> with new <option>s and <rid> OR <code>.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     rid=<rid>&options[]=noaliases&options[]=nocomments&options[]=nohistorical
     OR
     code=<code>&options[]=noaliases&options[]=nocomments&options[]=nohistorical

   status: 205

### DELETE /provision/manage/model/<model> - update model

Deletes specified provisioning model and all associated serial numbers and
content.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   status: 205

### GET /provision/manage/model/<model>/?offset=<offset>&limit=<limit>{&shared=<vendor>} - list serial numbers

Returns list of serial numbers from model with associated RID if any in
paginated sets of size 'limit' starting at 'offset', limit is enforced to
be between 5 and 1000. Optionally specify 'shared=<vendor>' to filter on
serial numbers enabled by a particular shared vendor.  If calling with
header 'X-Exosite-Vendor' specified, <extra> will always be empty.

Note: Where accepted, if X-Exosite-Vendor header is provided, the given <model> is
one associated to the provided <Vendorname>. The calling (as identified by
VendorCIK) vendor must have authorized share access to the <model>.  Shared
access only provides enable/disable/reenable controls, and view listings are
only valid for serial numbers enabled by the calling vendor.

   X-Exosite-Vendor: <VendorName>  {optional - see NOTE at top of section}
   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: text/csv; charset=utf-8
   body:
     <sn>,<rid>,<extra>
     ...
   status: 200

### GET /provision/manage/model/<model>/?show=ranges - get serial number json object (? TODO)

Returns json object of configured serial number ranges for relevant model.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: application/javascript; charset=utf-8
   body:
     {
       "ranges":[
         {
           "format":"base10" or "base16" or "mac:48" or "mac-48" or "mac.48"
          ,"length":<number> (not applicable in mac?48 formats)
          ,"casing":"upper" or "lower" (base16/mac?48 hexidecimal letter casing)
          ,"first":<number>
          ,"last":<number>
         }
        ,...
       ]
     }
   status: 200

### POST /provision/manage/model/<model>/ - add single serial number

Adds a single serial number and extra data to relevant model entry.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     sn=<sn>&extra=<extra>

   status: 205

### POST /provision/manage/model/<model>/ - add multiple serial numbers

Adds serial numbers to relevant model entry.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     sn[]=<sn1>&sn[]=<sn2>&sn[]=<snX>

   status: 205

### POST /provision/manage/model/<model>/ - delete single serial number

Deletes a single serial number from relevant model entry.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     delete=true&sn=<sn>

   status: 205

### POST /provision/manage/model/<model>/ - delete multiple serial numbers

Deletes serial numbers from relevant model entry.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     delete=true&sn[]=<sn1>&sn[]=<sn2>&sn[]=<snX>

   status: 205

### POST /provision/manage/model/<model>/ - add serial numbers

Adds serial numbers to relevant model entry.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: text/csv; charset=utf-8
   body:
     <sn>,<extra>
     ...

   status: 205

### POST /provision/manage/model/<model>/ - add serial number ranges

Adds serial number ranges to relevant model entry.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/javascript; charset=utf-8
   body:
     {
       "ranges":[
         {
           "format":"base10" or "base16" or "mac:48" or "mac-48" or "mac.48"
          ,"length":<number> (not applicable in mac?48 formats)
          ,"casing":"upper" or "lower" (base16/mac?48 hexidecimal letter casing)
          ,"first":<number>
          ,"last":<number>
         }
        ,...
       ]
     }

   status: 205

### DELETE /provision/manage/model/<model>/ - delete serial numbers

Deletes serial numbers from relevant model entry

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: text/csv; charset=utf-8
   body:
     <sn>
     ...

   status: 205

### DELETE /provision/manage/model/<model>/ - delete serial number ranges

Deletes serial number ranges from relevant model entry.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/javascript; charset=utf-8
   body:
     {
       "ranges":[
         {
           "format":"base10" or "base16" or "mac:48" or "mac-48" or "mac.48"
          ,"length":<number> (not applicable in mac?48 formats)
          ,"casing":"upper" or "lower" (base16/mac?48 hexidecimal letter casing)
          ,"first":<number>
          ,"last":<number>
         }
        ,...
       ]
     }

   status: 205

### GET /provision/manage/model/<model>/<sn> - get client RID

Returns associated client <rid> if any, and extra serial number data.  If
calling with header 'X-Exosite-Vendor' specified, <extra> will always be
empty.

NOTE: Where accepted, if X-Exosite-Vendor header is provided, the given <model> is
one associated to the provided <Vendorname>. The calling (as identified by
VendorCIK) vendor must have authorized share access to the <model>.  Shared
access only provides enable/disable/reenable controls, and view listings are
only valid for serial numbers enabled by the calling vendor.

   X-Exosite-Vendor: <VendorName>  {optional - see NOTE at top of section}
   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: text/csv; charset=utf-8
   body:
     <status>,<rid>,<extra>
     ...
   status: 200

### GET /provision/manage/model/<model>/<sn>?show=groups{&offset=<offset>&limit=<limit>} - list serial number groups

Returns the list of groups which this serialnumber is a member of, if any,
in paginated sets of size 'limit' starting at 'offset', limit is enforced
to be between 5 and 1000. If omitted, 'offset' and 'limit' will
respectively default to 0 and 5.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: text/csv; charset=utf-8
   body:
     <id>
     ...
   status: 200
   status: 204 (if this serialnumber is not a member of any group)

### GET /provision/manage/model/<model>/<sn>?show=log - get serial number activation log

Show serial number activation log.

   X-Exosite-Vendor: <VendorName> {optional - see NOTE at top of section}
   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: text/csv; charset=utf-8
   body:
     <timestamp>,<connection-info>,<log-entry>
     ...
   status: 200
   status: 204 (when log is empty)

### POST /provision/manage/model/<model>/<sn> - map client to serial number

If <sn> does not have an associated client, then it provisions associated
profile under specified owner if <rid> is a descendant of the <model>
creator.  returns rid of client associated with <sn>.

   X-Exosite-Vendor: <VendorName>  {optional - see NOTE at top of section}
   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     enable=true&owner=<rid>

   Content-Type: text/plain; charset=utf-8
   body:
     <rid>
   status: 200

### POST /provision/manage/model/<model>/<sn> - remap client to a new serial number

Remaps the client associated with <oldsn> to <sn>. 
The <sn> must be activated after.

   X-Exosite-Vendor: <VendorName>  {optional - see NOTE at top of section}
   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     enable=true&oldsn=<oldsn>

   status: 205

### POST /provision/manage/model/<model>/<sn> - regenerate cik for serial number

Regenerates cik associated with <sn>. <sn> must have been previously enabled.

   X-Exosite-Vendor: <VendorName>  {optional - see NOTE at top of section}
   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     enable=true

   status: 205

### POST /provision/manage/model/<model>/<sn> - disable cik

Disables the cik associated with <sn>.  <sn> must be re-enabled before it
can be used again.

   X-Exosite-Vendor: <VendorName>  {optional - see NOTE at top of section}
   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     disable=true

   status: 205

### DELETE /provision/manage/model/<model>/<sn> - delete serial number

Delete serial number from relevant model entry.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   status: 205

### GET /provision/manage/share/<model>/ - list vendors that share a model

Returns list of <vendorname>s that have a share to the <model>.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   Content-Type: text/csv; charset=utf-8
   body:
     <vendorname>
     ...
   status: 200
   status: 204 (if no shares)

### POST /provision/manage/share/<model>/ - share a model

Shares the <model> with <vendorname>.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     vendor=<vendorname>

   status: 205

### POST /provision/manage/share/<model>/ - unshare a model

Deletes the <model> share with <vendorname>.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     vendor=<vendorname>&delete=true

   status: 205

### GET /provision/manage/share/<model>/<vendorname> - find out if a model is shared

Determine if <model> is shared with <vendorname>.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   status: 204 (if shares exists)

### DELETE /provision/manage/share/<model>/<vendorname> - unshare a model

Deletes the <model> share with <vendorname>.

   X-Exosite-CIK: <VendorCIK>
   OR
   X-Exosite-Token: <VendorToken>

   status: 205

### GET /provision/register - get vendor name for cik

Returns vendor name associated with caller's CIK if any.

   X-Exosite-CIK: <CIK>

   Content-Type: text/plain; charset=utf-8
   body:
     <vendor>
   status: 200

### POST /provision/register - set vendor name for cik

Vendor registration, make a vendor name with the caller's CIK.

   X-Exosite-CIK: <CIK>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     vendor=<vendor>

   status: 205

### POST /provision/register - delete vendor name from cik

Delete a vendor name with the caller's CIK.

   X-Exosite-CIK: <CIK>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     delete=true&vendor=<vendor>

   status: 205


### GET /ip - get server IP

Returns ip address and port encoded in 6 comma separated octets as a
string, where the first 4 are the ip and the last 2 are the port.
eg.  "192,168,0,1,0,80"

   Content-Type: text/plain

### GET /jsonp?token=<token>&callback=<callback>&show[]=data{&p=<p>} - get data for token

Returns JSON structure holding timestamp-value lists for each 'alias'
in timestamp-ascending order, starting at <p> * <limit> offset into
'starttime' and 'endtime' window, limited to 'limit' count, as specified by
the token, wrapped as the parameter to the 'callback' function. If <p> is
not specified, it defaults to 0.

  Content-Type: application/javascript
  body:
    <callback>({
      "result":{
          "<alias1>":{"data":[[<ts1>,<value1>]...,[<tsN>,<valueN>]]}
         ,...
         ,"<aliasN>":{"data":[[<ts1>,<value1>]...,[<tsN>,<valueN>]]}
      }});
  status: 200

### POST /jsonp/register - get data access token

Returns a 'token' that will be valid until <expire> timestamp and can be
used to read lists of timestamp-value pairs from 'aliasX' between
'starttime' and 'endtime', 'limit' count pairs at a time.

   X-Exosite-CIK: <CIK>
   Content-Type: application/x-www-form-urlencoded; charset=utf-8
   body:
     alias[]=<alias1>...&alias[]=<aliasN>&startime=<st>&endtime=<et>
       &limit=<limit>&access[]=data&expire=<expire>

   Content-Type: text/plain; charset=utf-8
   body:
     <token>
   status: 200


## Procedures for Vendor Management

### GET /provision/admin/auth/ - list vendor tokens

Returns list of vendor auth token <id>s for the VendorCIK.

```
   X-Exosite-CIK: <VendorCIK>

```

#####response

```
HTTP/1.1 200 OK
Content-Type: text/csv; charset=utf-8

<id>
...
```

### POST /provision/admin/auth/ - create vendor token

Generates a vendor auth token to be used in place of VendorCIK and associates the token with the given <id>.

```
X-Exosite-CIK: <VendorCIK>
Content-Type: application/x-www-form-urlencoded; charset=utf-8

id=<id>
```

#####response

```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8

<VendorToken>
```

### POST /provision/admin/auth/ - delete vendor token

Deletes vendor auth token.

```
X-Exosite-CIK: <VendorCIK>
Content-Type: application/x-www-form-urlencoded; charset=utf-8

delete=true&id=<id>
```

#####response

```
HTTP/1.1 205 Reset Content 
<blank line>
```

### GET /provision/admin/auth/<id> - get vendor token

Returns the vendor auth token for the specified <id>.

```
X-Exosite-CIK: <VendorCIK>
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8

<VendorToken>
```

### DELETE /provision/admin/auth/<id> - get vendor token

Deletes vendor auth token

```
X-Exosite-CIK: <VendorCIK>
<blank line>
```

#####response

```
HTTP/1.1 205 Reset Content 
<blank line>
```


