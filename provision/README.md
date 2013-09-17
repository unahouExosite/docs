## Exosite Provision/Device Management API

This API allows devices to authenticate with the One Platform even if they are not pre-programmed with a CIK. It also allows device OEMs to create custom "cloud profiles" for devices so they can accomplish fleet-level management of large device fleets across different device models.

The API uses the HTTP POST, GET, PUT and DELETE methods to configure the different facets of the provisioning system. It is important to note that the words "client" and "device" are interchangeable in the text below. There are various HTTP required headers that are inherent to the protocol, as such they are not specified below. As an example, all of the POST and PUT requests must also contain a correct `Content-Length` header specifying the body payload size. And all responses having a status of 200 will also contain a `Content-Length` response header.

API Version: `1.1`

Host Address: `http://m2.exosite.com` or `https://m2.exosite.com`

If you're completely new to Exosite's APIs, you may want to read the [API overview](../README.md) first.


### Libraries and Sample Code

Wrapper libraries for this API:

* Python: [pyonep](https://github.com/exosite-labs/pyonep) includes a module, provision.py, that wraps the provision API.

Code samples that use this API:

* [Provision Examples](https://github.com/exosite-garage/provision_examples) - socket level code intended as a reference for implementation in other languages


### Conventions

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

## Device Provisioning

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


### /provision/download

#### GET - list content IDs

List content `<id>`s. Caller with `<DeviceCIK>` must have an activated 
serial number in given `<vendor>` `<model>` name space.

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


#### GET - get content

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

#### GET - get content info

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


## Device Model Management

### /provision/manage/content/\<model\>/

#### GET - list content ids

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


#### GET - list authorized content 

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


#### POST - create content entity

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

#### POST - delete content entry

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

#### GET - get content info

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

### /provision/manage/content/\<model\>/\<id\>

#### GET - get content blob 

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

#### GET - get content info

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

#### GET - get content blob

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

#### GET - list groups

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

* `HTTP/1.1 204 No Content` if content `<id>` is not a member of any group.

#### POST - upload content

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


#### DELETE - delete content

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

#### GET - show groups

Returns list of `<group id>`s with `<description>` for `<model>` in
paginated sets of size `<limit>` starting at `<offset>`. `<limit>` is enforced 
to be between 5 and 1000. If omitted, `<offset>` defaults to 0 and `<limit>`
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

* `HTTP/1.1 204 No Content` if there are no matching groups.

#### POST - create group

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


#### POST - delete group

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

### /provision/manage/group/\<model\>/\<id\>

#### GET - get group info

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


#### GET - get group info

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

* `HTTP/1.1 204 No Content` if the group is not a member of any other groups.

#### DELETE - delete group

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

### /provision/manage/group/\<model\>/\<id\>/

#### GET - list group info

Returns information about all members of this group in paginated sets of 
size `<limit>` starting at `<offset>`. `<limit>` is enforced to be between 
5 and 1000. If omitted, `<offset>` defaults to 0 and `<limit>` defaults to
5.

```
GET /provision/manage/group/<model>/<id>/?{?offset=<offset>&limit=<limit>} HTTP/1.1
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
<type 1>,<memberid 1>,<expire 1>,<description 1>
<type 2>,<memberid 2>,<expire 2>,<description 2>
...
<type n>,<memberid n>,<expire n>,<description n>
```

Response may also be:

* `HTTP/1.1 204 No Content` if the group does not have any members.


#### GET - list types with group membership

Returns information about all members of specified `<type>` in this group, in
paginated sets of size `<limit>` starting at `<offset>`. `<limit>` is enforced
to be between 5 and 1000. If omitted, `<offset>` defaults to 0 and `<limit>` 
defaults to 5.

```
GET /provision/manage/group/<model>/<id>/?type=<type>{&offset=<offset>&limit=<limit>} HTTP/1.1
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
<type 1>,<memberid 1>,<expire 1>,<description 1>
<type 2>,<memberid 2>,<expire 2>,<description 2>
...
<type n>,<memberid n>,<expire n>,<description n>
```

Response may also be:

* `HTTP/1.1 204 No Content` if the group does not have any members of specified type.

#### GET - get group member info

Returns information of members of `<id>` in the group.

```
GET /provision/manage/group/<model>/<id>/?id=<id> HTTP/1.1
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

<type 1>,<memberid 1>,<expire 1>,<description 1>
<type 2>,<memberid 2>,<expire 2>,<description 2>
...
<type n>,<memberid n>,<expire n>,<description n>
```

Response may also be:

* `HTTP/1.1 204 No Content` if the group does not have any members that match `<id>`.


#### GET - get group member info

Returns information about specified member in the group.

```
GET /provision/manage/group/<model>/<id>/?type=<type>&id=<id> HTTP/1.1
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

<type>,<memberid>,<expire>,<description>
```

#### POST - add or update similar group members

Adds or updates a member or members to a group, all with the same `<type>`,
`<expire>` time and `<description>`, but with different `<member id>`s.

```
POST /provision/manage/group/<model>/<id>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

type=<type>&id=<member id>&expire=<expire>&description=<description>
 OR
type=<type>&id[]=<member id1>{...&id[]=<member idN>}&expire=<expire>&description=<description>
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

#### POST - add or update dissimilar group members

Adds or updates a member or members to a group, all with different `<type>`, 
`<expire>` time, `<description>` and `<member id>`s.

```
POST /provision/manage/group/<model>/<id>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: text/csv; charset=utf-8
Content-Length: <length>

<type 1>,<memberid 1>,<expire 1>,<description 1>
<type 2>,<memberid 2>,<expire 2>,<description 2>
...
<type n>,<memberid n>,<expire n>,<description n>
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


#### POST - delete similar group members

Deletes a member or members of specified type, with specified id(s), from
this group.

```
POST /provision/manage/group/<model>/<id>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

type=<type>&id=<member id>&delete=true
OR
type=<type>&id[]=<member id1>{...&id[]=<member idN>}&delete=true
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

#### DELETE - delete members of group 

Deletes members matching specified `<type>`s and `<id>`s.

```
DELETE /provision/manage/group/<model>/<id>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: text/csv; charset=utf-8
Content-Length: <length>

<type 1>,<id 1>
<type 2>,<id 2>
...
<type n>,<id n>
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

### /provision/manage/model/

#### GET - list models

Returns list of models owned by the vendor.

```
GET /provision/manage/model/ HTTP/1.1
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

<model 1>
<model 2>
...
<model n>
```

#### GET - list shared models

Returns list of models that other vendors have shared to the calling vendor.

```
GET /provision/manage/model/?show=shared HTTP/1.1
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

<vendorname 1>,<model 1>
<vendorname 2>,<model 2>
...
<vendorname n>,<model n>
```

#### POST - create model

Adds a model, using `<rid>` or `<code>` as the clone template.

```
POST /provision/manage/model/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

model=<model>&rid=<rid>&options[]=noaliases&options[]=nocomments
   &options[]=nohistorical
OR
model=<model>&code=<code>&options[]=noaliases&options[]=nocomments
   &options[]=nohistorical
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

* `HTTP/1.1 409 Conflict` if another model called `<model>` already exists.

#### POST - delete model

Deletes specified provisioning model and all associated serial numbers and 
content.

```
POST /provision/manage/model/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

delete=true&model=<model>
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

### /provision/manage/model/\<model\> 

#### GET - get model info

Get model information.

```
GET /provision/manage/model/<model> HTTP/1.1
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
Content-Type: application/x-www-form-urlencoded; charset=utf-8

rid=<rid>&options[]=noaliases&options[]=nocomments&options=nohistorical
OR
code=<code>&options[]=noaliases&options[]=nocomments&options[]=nohistorical
```

#### PUT - update model

Updates `<model>` with new `<option>`s and `<rid>` or `<code>`.

```
PUT /provision/manage/model/<model> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

rid=<rid>&options[]=noaliases&options[]=nocomments&options=nohistorical
OR
code=<code>&options[]=noaliases&options[]=nocomments&options[]=nohistorical
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

#### DELETE - update model

Deletes specified `<model>` and all associated serial numbers and content.

```
DELETE /provision/manage/model/<model> HTTP/1.1
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

### /provision/manage/model/\<model\>/

Note: If `X-Exosite-Vendor` header is provided, the given `<model>` is one 
associated to `<Vendorname>`. The calling vendor was identified by 
`<VendorCIK>` OR `<VendorToken>`) must have authorized share access to the 
`<model>`. Shared access only provides enable/disable/ reenable controls, 
and view listings are only valid for serial numbers enabled by the calling 
vendor.

#### GET - list serial numbers

Returns list of serial numbers `<sn>` from `<model>` with associated `<rid>` 
in paginated sets of size `<limit>` starting at `<offset>`. `<limit>` is 
enforced to be between 5 and 1000. Optionally specify `shared=<vendor>` to 
filter on serial numbers enabled by a particular shared vendor. If calling 
with header `X-Exosite-Vendor` specified, `<extra>` will always be empty. 
Note that `<rid>` may be blank if the `<sn>` has not yet been instantiated 
as a client.

```
GET /provision/manage/model/<model>/?offset=<offset>&limit=<limit>{&shared=<vendor>} HTTP/1.1
Host: m2.exosite.com
{X-Exosite-Vendor: <VendorName>}
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
<sn 1>,<rid 1>,<extra 1>
<sn 2>,<rid 2>, <extra 2>
...
<sn n>,<rid n>,<extra n>
```

#### GET - get serial number JSON object

Returns JSON object of configured serial number ranges for relevant model.

```
GET /provision/manage/model/<model>/?show=ranges HTTP/1.1
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
Content-Type: application/javascript; charset=utf-8

{
    "ranges":[
        {
            "format": "base10"|"base16"|"mac:48"|"mac-48"|"mac.48",
            // not applicable in mac?48 formats
            "length": <number>, 
            // base16/mac?48 hexidecimal letter casing
            "casing": "upper"|"lower", 
            "first": <number>,
            "last": <number>
        },
        ...
    ]
}
```


#### POST - add single serial number

Adds a single serial number `<sn>` to specified `<model>` entry, with
`<extra>` information.

```
POST /provision/manage/model/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

sn=<sn>&extra=<extra>
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

* `HTTP/1.1 409 Conflict` if `<sn>` already exists.


#### POST - add multiple serial numbers

Adds serial numbers `<sn>` to `<model>`.

```
POST /provision/manage/model/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

sn[]=<sn 1>&sn[]=<sn 2>&sn[]=<sn n>
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

* `HTTP/1.1 409 Conflict` if `<sn>` already exists.


#### POST - add multiple serial numbers and extra information

Adds serial numbers `<sn>` to `<model>`, with extra information `<extra>`.

```
POST /provision/manage/model/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: text/csv; charset=utf-8
Content-Length: <length>

<sn 1>,<extra 1>
<sn 2>,<extra 2>
...
<sn n>,<extra n>
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

* `HTTP/1.1 409 Conflict` if `<sn>` already exists.


#### POST - add serial number ranges

Adds serial number ranges to <model>.

```
POST /provision/manage/model/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/javascript; charset=utf-8
Content-Length: <length>

{
    "ranges":[
        {
            "format": "base10"|"base16"|"mac:48"|"mac-48"|"mac.48",
            // not applicable in mac?48 formats
            "length": <number>, 
            // base16/mac?48 hexidecimal letter casing
            "casing": "upper"|"lower", 
            "first": <number>,
            "last": <number>
        },
        ...
    ]
}
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


#### POST - remove single serial number

Removes a single serial number from relevant model entry.

```
POST /provision/manage/model/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

delete=true&sn=<sn>
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


#### POST - remove multiple serial numbers

Removes serial numbers from relevant model entry.

```
POST /provision/manage/model/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

delete=true&sn[]=<sn 1>&sn[]=<sn 2>&sn[]=<sn n>
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

#### DELETE - remove multiple serial numbers

Remove serial numbers from `<model>`.

```
POST /provision/manage/model/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: text/csv; charset=utf-8
Content-Length: <length>
<blank line>
<sn 1>
<sn 2>
...
<sn n>
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


#### DELETE - delete serial number ranges

Deletes serial number ranges from relevant model entry.

```
DELETE /provision/manage/model/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/javascript; charset=utf-8
Content-Length: <length>

{
    "ranges":[
        {
            "format": "base10"|"base16"|"mac:48"|"mac-48"|"mac.48",
            // not applicable in mac?48 formats
            "length": <number>, 
            // base16/mac?48 hexidecimal letter casing
            "casing": "upper"|"lower", 
            "first": <number>,
            "last": <number>
        },
        ...
    ]
}
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

### /provision/manage/model/\<model\>/\<sn\> 

Note: If `X-Exosite-Vendor` header is provided, the given `<model>` is one 
associated to `<Vendorname>`. The calling vendor was identified by 
`<VendorCIK>` OR `<VendorToken>`) must have authorized share access to the 
`<model>`. Shared access only provides enable/disable/ reenable controls, 
and view listings are only valid for serial numbers enabled by the calling 
vendor.

#### GET - get client RID

Returns associated client `<rid>`, and extra serial number data. If calling 
with header `X-Exosite-Vendor` specified, `<extra>` will always be empty.

```
GET /provision/manage/model/<model>/<sn> HTTP/1.1
Host: m2.exosite.com
{X-Exosite-Vendor: <VendorName>}
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

<status 1>,<rid 1>,<extra 1>
<status 2>,<rid 2>,<extra 2>
...
<status n>,<rid n>,<extra n>
```

Response may also be:

* `HTTP/1.1 204 No-Content` if `<sn>` is unused.


#### GET - list serial number groups

Lists groups of which this serial number is a member, in paginated sets of 
size `<limit>` starting at `<offset>`. `<limit>` is enforced to be between 
5 and 1000. If omitted, `<offset>` defaults to 0 and `<limit>` defaults to 5.

```
GET /provision/manage/model/<model>/<sn>?show=groups{&offset=<offset>&limit=<limit>} HTTP/1.1
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

<group id 1>
<group id 2>
...
<group id n>
```

Response may also be:

* `HTTP/1.1 204 No-Content` if `<sn>` is not a member of any group.


#### GET - get activation log for serial number

Get activation log for serial number `<sn>`.

```
GET /provision/manage/model/<model>/<sn>?show=log HTTP/1.1
Host: m2.exosite.com
{X-Exosite-Vendor: <VendorName>}
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

<timestamp 1>,<connection-info 1>,<log-entry 1>
<timestamp 2>,<connection-info 2>,<log-entry 2>
...
<timestamp n>,<connection-info n>,<log-entry n>
```

Response may also be:

* `HTTP/1.1 204 No-Content` if log is empty.


#### POST - create client from model

Creates a client based on `<model>` under `owner`, associates it with `<sn>`,
and returns its `<ClientRID>`. Owner `<rid>` must be a descendant of the 
`<model>`'s creator, and `<sn>` must not already have an associated client.

```
POST /provision/manage/model/<model>/<sn> HTTP/1.1
Host: m2.exosite.com
{X-Exosite-Vendor: <VendorName>}
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

enable=true&owner=<rid>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8

<ClientRID>
```

Response may also be:

* `HTTP/1.1 409 Conflict` if owner `<rid>` resources not sufficient to 
instantiate a new client of this `<model>` type.


#### POST - remap client to a new serial number

Remaps the client associated with `<oldsn>` to `<sn>`. `<sn>` must subsequently
be activated in order to use the client.

```
POST /provision/manage/model/<model>/<sn> HTTP/1.1
Host: m2.exosite.com
{X-Exosite-Vendor: <VendorName>}
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

enable=true&oldsn=<oldsn>
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


#### POST - regenerate cik for serial number

```Regenerates CIK for client associated with `<sn>`. `<sn>` must have been 
previously enabled, and must subsequently be activated after in order to 
download the new CIK and to use the client.```

```
POST /provision/manage/model/<model>/<sn> HTTP/1.1
Host: m2.exosite.com
{X-Exosite-Vendor: <VendorName>}
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

enable=true
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

#### POST - disable CIK

Disables the CIK associated with `<sn>`.  `<sn>` must be re-enabled before
it can be used again.

```
POST /provision/manage/model/<model>/<sn> HTTP/1.1
Host: m2.exosite.com
{X-Exosite-Vendor: <VendorName>}
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

disable=true
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

#### DELETE - delete serial number

Delete a single serial number `<sn>` from `<model>`.

```
DELETE /provision/manage/model/<model>/<sn> HTTP/1.1
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

### /provision/manage/share/\<model\>/ 

#### GET - list vendors that share a model

Returns list of names of vendors that have a share to `<model>`.

```
GET /provision/manage/share/<model>/ HTTP/1.1
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

<vendorname 1>
<vendorname 2>
...
<vendorname n>
```

Response may also be:

* `HTTP/1.1 204 No-Content` if <model> is not shared to any other vendors.

#### POST - create model share

Shares `<model>` with `<vendorname>`.

```
POST /provision/manage/share/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

vendor=<vendorname>
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

#### POST - delete model share

Deletes the `<model>` share so that `<vendorname>` no longer has share access.

```
POST /provision/manage/share/<model>/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: <length>

vendor=<vendorname>&delete=true
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

### /provision/manage/share/\<model\>/\<vendorname\>

#### GET - find out if a model is shared

Query `<model>` share status with `<vendorname>`.

```
GET /provision/manage/share/<model>/<vendorname> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK> OR X-Exosite-Token: <VendorToken>
<blank line>
```

#####response

```
HTTP/1.1 204 No Content
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8
```

The above response indicates that the `<model>` is shared with `<vendorname>`.

#### DELETE - unshare a model

Deletes the `<model>` share so that `<vendorname>` no longer has share access.

```
DELETE /provision/manage/share/<model>/<vendorname> HTTP/1.1
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

### /provision/register

#### GET - get registered vendor name for cik

Returns vendor name registered to `<CIK>`.

```
GET /provision/register HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<vendor>
```

#### POST - register vendor name for cik

Register a vendor name to `<CIK>`.

```
GET /provision/register HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>

vendor=<vendor>
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

#### POST - delete vendor name from CIK

Unregister vendor name from `<CIK>`.

```
POST /provision/register HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
Content-Type: application/x-www-form-urlencoded; charset=utf-8

delete=true&vendor=<vendor>
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

### /ip

#### GET - get server IP

Returns ip address and port of the server, encoded in 6 comma separated octets
as a string, where the first 4 are the ip and the last 2 are the port,
e.g.,  "192,168,0,1,0,80".

```
GET /ip HTTP/1.1
Host: m2.exosite.com
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<server ip and port>
```

### /jsonp

#### GET - get data for token

Returns data for a collection of aliases in timestamp-ascending order, 
starting at `<p>` * `<limit>` offset into `<starttime>` and `<endtime>` 
window, limited to `<limit>` count, as specified by the token, wrapped
as the parameter to the 'callback' function. If `<p>` is not specified, it 
defaults to 0. `<token>` is obtained by the `POST /jsonp/register` API.

```
GET /jsonp?token=<token>&callback=<callback>&show[]=data{&p=<p>} HTTP/1.1
Host: m2.exosite.com
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<callback>({
      "result":{
          "<alias1>":{"data":[[<ts1>,<value1>]...,[<tsN>,<valueN>]]},
          ...
          "<aliasN>":{"data":[[<ts1>,<value1>]...,[<tsN>,<valueN>]]},
      }});
```


### /jsonp/register 

#### POST - get data access token

Returns a token that will be valid until `<expire>` timestamp and can be
used to read lists of timestamp-value pairs from the specified aliases between
`<starttime>` and `<endtime>`, `<limit>` count pairs at a time.

```
POST /provision/register HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
Content-Type: application/x-www-form-urlencoded; charset=utf-8

alias[]=<alias1>...&alias[]=<aliasN>&starttime=<starttime>&endtime=<endtime>
&limit=<limit>&access[]=data&expire=<expire>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<token>
```

### /provision/admin/auth/

#### GET - list vendor tokens

Returns list of vendor auth token `<id>`s for `<VendorCIK>`.

```
GET /provision/admin/auth/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK>
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

<id1>
<id2>
...
<idN>
```

### POST - create vendor token

Generates a vendor auth token that may be used in place of `<VendorCIK>` and 
associates the token with the given `<id>`.

```
POST /provision/admin/auth/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK>
Content-Type: application/x-www-form-urlencoded; charset=utf-8

id=<id>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<VendorToken>
```

### POST - delete vendor token

Deletes vendor auth token.

```
POST /provision/admin/auth/ HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK>
Content-Type: application/x-www-form-urlencoded; charset=utf-8

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

### /provision/admin/auth/\<id\> 

#### GET - get vendor token

Returns the vendor auth token for the specified `<id>`.

```
GET /provision/admin/auth/<id> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK>
<blank line>
```

#####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/plain; charset=utf-8

<VendorToken>
```

#### DELETE - delete vendor token

Deletes vendor auth token for `<id>`.

```
DELETE /provision/admin/auth/<id> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <VendorCIK>
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
