# Device Provisioning API

The following procedures are intended to be accessed from devices to get API keys and initialization content (e.g., firmware images) so that they can access the One Platform from other APIs.

For general information about accessing this API, see the [main section](README.md).

## Endpoints

[/provision/activate](#provisionactivate) - get a CIK for a device and activate it

[/provision/download](#provisiondownload) - list content, get content, get content information

## /provision/activate

### POST - activate client

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

####response

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

####example

This command activates a device with serial number 12345678 and returns its CIK.

```
$ curl http://m2.exosite.com/provision/activate \
    -H "Content-Type: application/x-www-form-urlencoded; charset=utf-8" \
    -d "vendor=mysubdomain&model=myclientmodel&sn=12345678"
```

## /provision/download

### GET - list content IDs

List content `<id>`s. Caller with `<DeviceCIK>` must have an activated 
serial number in given `<vendor>` `<model>` name space.

```
GET /provision/download?vendor=<vendor>&model=<model> HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: <CIK>
Content-Length: <length>
<blank line>
```

####response

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


### GET - get content

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

####response

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

### GET - get content info

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

####response

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Keep-Alive
Content-Length: <length>
Content-Type: text/csv; charset=utf-8

<content-type>,<byte-size>,<updated-timestamp>,<meta>
```

Response may also be:

* `HTTP/1.1 400 Bad Request` if the `<vendor>` and `<model>` pair is invalid.

