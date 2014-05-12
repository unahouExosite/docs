# Portals API

__This API is in beta testing and may be to subject to the occasional tweak. Any such tweaks will be documented here.__

Portals provides a user authentication and management system on top of the One Platform. The Portals API provides access to Portals functionality using a REST-style HTTP API, using the JSON format in request and response bodies, and basic authentication where Portals account is required.

## Overview

### Actions

* [List domains of authenticated user](#list-domains-of-authenticated-user)
* [List portals of authenticated user](#list-portals-of-authenticated-user)
* [Register new user account](#register-new-user-account)
* [Reset user account password via registered email confirmation](#reset-user-account-password)
* [Create new device under a portal of authenticated user](#create-new-device-under-a-portal-of-authenticated-user)
* [Get data source](#get-data-source)
* [Get data source data](#get-data-source-data)
* [Get device](#get-device)
* [Get group](#get-group)
* [Get user](#get-user)
* [Create portal devices](#create-portal-devices)
* [Create user](#create-user)
* [Create group under user](#create-group-under-user)
* [Update group](#update-group)
* [Update device](#update-device)
* [Update domain](#update-domain)
* [Update user](#update-user)

### REST

The API uses a REST-style API, which means that:
* HTTP verbs in the request indicate the type of action the client wants to take (e.g. GET, POST)
* HTTP status in the response indicate (e.g. 200 for success, 400 for bad request or 401 for authentication error)

### Request and Response Format

Request and response bodies, when present, are formatted using JSON. For more see http://json.org

Note that the JSON examples below are sometimes formatted with extra whitespace for clarity.

### Authentication

Some API endpoints require a Portals email and password combination for authentication. These are passed using basic access authentication. See this link for details about this method of authentication:

http://en.wikipedia.org/wiki/Basic_access_authentication

### Domain

For some API endpoints, the domain of the request URL indicates information about which domain should be affected. For example, a GET request to:

    https://mydomain.exosite.com/api/portals/v1/portal/

...will return a different list of portals than a GET request to:

    https://portals.exosite.com/api/portals/v1/portal/

Also, the domain is used for user authentication. Endpoints that are affected by the querying domain are indicated below.

## Types

### access

Access is a constant string. Possible values are:

* \_\_\_admin

### data

	[
		datum
	]

Data object is an array of datum object.

See datum in the types section for more detail.

### data-source

	{
		"data": data,
		"info": data-source-info,
		"rid": data-source-id
	}

Data source is an object containing only these three keys.

See data object, data-source-info object and rid in the types section for more detail.

### data-source-id

data-source-id is rid

### data-source-ids

    [
        data-source-id
    ]

Data-source-ids is an array of data-source-id.

See data-source-id in the types section for more detail.

### data-source-info

	{
		"basic": see below,
		"description": see below,
		"shares": see below,
		"storage": see below,
		"subscribers": see below,
		"tags": see below
	}

Data source info is an object containing only these six keys.

See [info section in Remote Procedure Call API](https://github.com/exosite/docs/tree/master/rpc#info) for more details.

### datum

	[
		datum-id,
		datum-value
	]

Datum object is an array with two items.

See datum-id and datum-value in the types section for more details.

### datum-id

Datum id is a [Unit time](http://en.wikipedia.org/wiki/Unix_time).

### datum-value

Datum value depends on the setup of the data source, possible types are:

* float
* int
* string

### device

	{
		"dataSources": data-source-ids,
		"info": device-info,
		"members": permissions,
		"model": model-id,
		"rid": rid,
		"sn": sn,
		"type": device-type,
		"vendor": vendor-id
	}

Devices is an object containing only these eight keys.

See data-source-ids, device-info, permissions, model-id, rid, sn, device-type, vendor-id in the types section for more detail.

### device-info

	{
		"aliases": see below,
		"basic": see below,
		"description": see below,
		"shares": see below,
		"subscribers": see below,
		"tagged": see below,
		"tags": see below
	}

Devices info is an object containing only these seven keys.

See [info section in Remote Procedure Call API](https://github.com/exosite/docs/tree/master/rpc#info) for more details.

### device-type

Device type is a constant string. Possible values are:

* vendor

### domain

	{
		"members": permissions
	}

Domain is an object containing only this key.

See permissions in the types section for more details.

### email

Email is an [email address](https://en.wikipedia.org/wiki/Email_address).

### group

	{
		"id": group-id,
		"meta": meta,
		"members": permissions,
		"name": short-text,
		"permissions": permissions,
		"userId": user-id
	}

Group is an object containing only these six keys.

See gruop-id, meta, permissions, short-text, user-id in the types section for more detail.

### group-id

Group ID is an id.

### group-ids

	[
		group-id
	]

Group IDs is an array of group-id.

See group-id in the types section for more detail.

### id

ID is an integer between 10000000000 and 4294967295.

### meta

Meta can be anything.

### model-id

Model ID is a string.

### oid

	{
		"id": id,
		"type": oid-type
	}

OID is an object containing these two keys.

See id, oid-type in the types section for more detail.

### oid-type

OID type is a constant string. Possible values are:

* Device
* Domain
* Group
* Portal
* User

### permission

	{
		"access": access,
		"oid": oid
	}

Permission is an object containing only these two keys.

See access and oid in the types section for more detail.

### permissions

	[
		permission
	]

Permissions is an array of permission object.

See permission in the types section for more detail.

### rid

RID is a hexadecimal number, 40 digits long stored as a string.

### short-text

Short text is a string less than 256 characters.

### sn

SN is a string.

### user

	{
		"email": email,
		"fullName": short-text,
		"groups": group-ids
		"id": user-id,
		"phoneNumber": short-text
	}

User object is an object containing only these five keys.

See email, group-ids, short-text and user-id in the types section for more details.

### user-id

User ID is an id.

### vendor-id

Vendor ID is a string.

## API Endpoints

### List domains of authenticated user
`GET /api/portals/v1/domain/`

Returns a list of domains to which the user’s account is added.

#### Request
Request body is empty.

#### Response
On success, response has HTTP status 200 and JSON list of domain objects. Domain objects contain the following keys:
* `"domain"` - the domain address. This may be used in a subsequent call to /api/portals/v1/portal/
* `"role"` - the user’s role on this domain. Has one of the following values:

    * `"user"` - non-admin

    * `"admin"` - global admin, network admin, or domain admin

* `"name"` - vendor name (for provisioning API)
* `"token"` - vendor token (for provisioning API)

On failure, response has HTTP status of 400 or greater.

#### Example

```
$ curl https://portals.exosite.com/api/portals/v1/domain/ --user joe@gmail.com:joep4ssword
[{"role":"user",
  "name":"exosite_portals",
  "domain":"portals.exosite.com"},
 {"role":"admin",
  "domain":"joesdomain.exosite.com",
  "name":"joesdomain",
  "token":"01233fb43edeb3557b5ef46b987385abcdef0123"}]
```

### List portals of authenticated user
`GET /api/portals/v1/portal/`

Get a list of portals for the specified user on the domain specified in the URL of the request.

#### Request
Request body is empty. The domain name in the HTTP request is used to indicate which domain’s portals should be listed.

#### Response
On success, HTTP status is 200 and HTTP response body is a JSON list of portal objects. Portal objects contain the following keys:

* `"name"` - Portal name
* `"domain"` - Portal domain
* `"key"` - Portal CIK (returned only if user has "owner" or "manager" level access to the portal)
* `"rid"` - Portal resource ID
* `"role"` - User’s role for this portal. Possible values are:

    * `"owner"` - user is the portal’s direct owner

    * `"manager"` - user has manager access to the portal. This role grants the same rights as owner. A role of `"manager"` indicates the portal is not a child client of this user in the One Platform hierarchy. Once you have a key to the portal the distinction is not important to the API, though.

On failure, response has a HTTP status code of 400 or greater.

#### Example
```
$ curl https://mydomain.exosite.com/api/portals/v1/portal/ --user joe@gmail.com:joep4ssword
[
  {
    "name":"MyPortal1",
    "domain":"mydomain.exosite.com"
    "rid":"5ef46b987385aaaaaaaaaa75183fb43edeb3557b",
    "key":"7ef46b987385bbbbbbbbbb75183fb43edeb3557b",
    "role":"owner"
  },
  {
    "name":"MyPortal2",
    "domain":"mydomain.exosite.com"
    "rid":"46b987385aaaaaaaaaa75183fb43edeb3557bbbb",
    "key":"070bdbf63f50f1e8dbbeb8f5aa9ba9aaaaaaaaaa",
    "role":"manager"
  }
]
```

### Register New User Account
`POST /api/portals/v1/user`

Signs up a new user account, sending an activation email to the specified address.

#### Request
Request body is a JSON object with the following keys:

* `"email"` - new user’s email address (required)
* `"password"` - new user’s password (required)
* `"plan"` - portals plan ID from signup page, e.g. https://portals.exosite.com/signup?plan=3676938388. Plan must allow free signups. (required)
* `"first_name"` - user’s first name (optional)
* `"last_name"` - user’s last name (optional)

If `"first_name"` or `"last_name"` are omitted or empty, they are set to `"New"` and `"User"`, respectively.

The domain name in the HTTP request is used to indicate which domain the user should be signed up in.

#### Response
On success, HTTP status code is 200 and HTTP response body is empty.

On failure, HTTP status code is 400 or greater and HTTP response body contains a JSON formatted response object. Response object may contain the following keys:

* `"errors"` - list of error identifier strings

    * `"missing\_*"` - some required input was missing. E.g. missing_email indicates missing or empty (blank) email.

    * `"wrong_password"` - email is already registered with Portals and the password is incorrect

    * `"user_exists_wrong_domain”` - user exists on another domain

    * `"user_exists"` - user already exists on this domain

* `"notices"` - list of user-readable error strings

#### Example
```
$ curl https://janesdomain.exosite.com/api/portals/v1/user -d '{"email": "jane+testuser123@gmail.com", "password":"testuserP4ssword", "plan":"3676938388"}'
```

### Reset user account password
`POST /api/portals/v1/user/password`

Sends a password reset email for this user.

#### Request
Request contains a JSON object with the following keys:

* `"email"` - email address of a Portals user
* `"action"` - what to do. Supported values:
* `"reset"` - send user a password reset request

#### Response
On success, HTTP status code is 200 and HTTP response body is empty.

On failure, HTTP status code is 400 or greater and the HTTP response body contains a JSON formatted response object. Response object may contain the following keys:

* `"errors"` - list of error identifier strings

    * `"missing\_*"` - some required input was missing. E.g. missing_email indicates missing or empty (blank) email.

    * `"failed"` - some other error occurred

* `"notices"` - list of user-readable error strings

#### Example

```
$ curl https://portals.exosite.com/api/portals/v1/user/password -d '{"action":"reset", "email": "joe@gmail.com"}'
```

### Create new device under a portal of authenticated user
`POST /api/portals/v1/device`

Creates a new device based on a client model, returning the CIK and RID of the new device.

#### Request
The following keys are passed:

* `"portal_rid"` - resource ID of portal where the device is to be created. User creating the device must have at least manager level access to this portal. This may be found in the output of the /portal/ api call, or in Portals here: https://<subdomain>.exosite.com/admin/portallist

![Find Portal RID](images/find_portal_rid.png)

* `"vendor"` - vendor identifier. Administrators may find this identifier here: https://<subdomain>.exosite.com/admin/home

![Find Vendor ID](images/find_vendor.png)

* `"model"` - client model of device to create. Administrators may find this here, at the bottom of the page: https://<subdomain>.exosite.com/admin/managemodels

![Find Model](images/find_model.png)

* `"serialnumber"` - serial number of new device. The serial numbers available are configurable per device model. Administrators may configure individual serial numbers, or configure a range, here:  https://<subdomain>.exosite.com/admin/serialnumbers For example, this model has serial numbers consisting of six base 10 digits, e.g. 123456.

![Find device serial number](images/find_serialnumber.png)

* `"name"` - device name. This is a human-readable name for the device.
* `"timezone"` - device timezone (optional)
* `"location"` - device location (optional)

The domain name in the HTTP request indicates which domain to authenticate the user, and must be the same domain in which portal_rid is registered.

#### Response
On success, response has a HTTP status code 200. The response body contains a JSON object with the following keys:
* `"rid"` - resource identifier for created device
* `"cik"` - key for created device

After creating a device, it is necessary to activate it using the provisioning API. This is normally done by device firmware, but may also be done at the command line for testing.

[https://github.com/exosite/api/blob/master/provision/device.md#provisionactivate]

The RID and CIK may then be used with Exosite’s other APIs to interact with the device.

On failure, response has a HTTP status code of 400 or greater. The response body contains a JSON formatted response object. The response object may contain the following keys:

* `"errors"` - list of error identifier strings

    * `"limit"` - portal’s device limit has been reached

    * `"invalid_sn"` - serial number is invalid

    * `"unavailable_sn"` - serial number is not available

    * `"forbidden_model"` - model is not available in this domain

    * `"require_purchase"` - creating this type of device requires a purchase

    * `"insufficient_resources"` - device could not be added due to insufficient resources in the portal

    * `"portal_not_found"` - portal_rid could not be found

    * `"missing\_*"` - some required input was missing. E.g. missing_portal_rid indicates missing or empty (blank) portal_rid.

* `"notices"` - list of user-readable error strings

#### Example

Create the device:

```
$ curl https://joesdomain.exosite.com/api/portals/v1/device -d '{"model": "myDeviceModel", "vendor":"joevendor", "serialnumber":"ABC-123", "location":"Samoa", "timezone":"(GMT-11:00) Midway Island, Samoa", "portal_rid": "5ef46b987385aaaaaaaaaa75183fb43edeb3557b", "name":"Device Name"}' --user joe@gmail.com:joep4ssword
{
  "cik": "ef123475183fb435ef46b987385abcdedeb3557b",
  "rid": "987385abcdedeef123475183fb435ef46baf367b"
}
```

Then activate the device. Normally this would be done from the device firmware, but we do it here from the command line as an example.

```
$ curl https://m2.exosite.com/provision/activate -d 'vendor=joevendor&model=myDeviceModel&sn=ABC-123'
ef123475183fb435ef46b987385abcdedeb3557b
```

### Get data source
`GET /api/portals/v1/data-sources/{data-source-id}`

Return a infomation of data source

#### Request
Request body is empty.

#### Response
On success, response has HTTP status 200 and data source object. See [data-source](#data-source) in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```

### Get data source data
`GET /api/portals/v1/data-sources/{data-source-id}/data`

Return data

#### Request
Request body is empty.

#### Response
On success, response has HTTP status 200 and data source data object. See [data](#data) in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```

### Get device
`GET /api/portals/v1/devices/{device-id}`

Return a infomation of device

#### Request
Request body is empty.

#### Response
On success, response has HTTP status 200 and device object. See [device](#device) in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```

### Get group
`GET /api/portals/v1/groups/{group-id}`

Return a infomation of group

#### Request
Request body is empty.

#### Response
On success, response has HTTP status 200 and group object. See group in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```

### Get user
`GET /api/portals/v1/users/{user-id}`

Return a infomation of user

#### Request
Request body is empty.

#### Response
On success, response has HTTP status 200 and user object. See user in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```

### Create portal devices
`POST /api/portals/v1/portals/{portal-id}/devices`

Create a infomation of portal device

#### Request
Please reference [device](#device) in the type section.

But now just can send the following keys:
* `"sn"` - Serial number (required)
* `"vendor"` - Vendor name (required)
* `"model"` - Model name (required)
* `"type"` - Device type, must be 'vendor' for this moment (required)

If you send the other keys which not support now, it will do nothing.

#### Response
On success, response has HTTP status 201 and portal device object. See portal device in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```

### Create user
`POST /api/portals/v1/users`

Create a infomation of user

#### Request
Please reference [user](#user) in the type session.

But now just can send the following keys:
* `"email"` - User email (required)

If you send the other keys which not support now, it will do nothing.

#### Response
On success, response has HTTP status 201 and user object. See user in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```

### Create group under user
`POST /api/portals/v1/users/{user-id}/groups`

Create a infomation of group under the user

#### Request
Please reference [group under user](#group-under-user) in the type session.

But now just can send the following keys:
* `"name"` - Group name (optional)

If you send the other keys which not support now, it will do nothing.

#### Response
On success, response has HTTP status 201 and group under user object. See group under user in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```

### Update group
`PUT /api/portals/v1/groups/{group-id}`

Update a infomation of group

#### Request
Please reference [update group](#update-group) in the type session.

But now just can send the following keys:
* `"meta"` - Group meta, ned to less then 2 mega (optional)
* `"members"` - Group membrs (optional)
* `"name"` - Group name (optional)
* `"permissions"` - Group permissions (optional)

If you send the other keys which not support now, it will do nothing.

#### Response
On success, response has HTTP status 200 and group object. See group in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```

### Update device
`PUT /api/portals/v1/devices/{device-id}`

Update a infomation of device

#### Request
Please reference [update device](#update-device) in the type session.

But now just can send the following keys:
* `"info" - "description"` - Description under info (optional)

If you send the other keys which not support now, it will do nothing.

#### Response
On success, response has HTTP status 200 and device object. See device in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```

### Update domain
`PUT /api/portals/v1/domains/{domain-id}`

Update a infomation of domain

#### Request
Please reference [update domain](#update-domain) in the type session.

But now just can send the following keys:
* `"members"` - Domain members (optional)

If you send the other keys which not support now, it will do nothing.

#### Response
On success, response has HTTP status 200 and domain object. See domain in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```

### Update user
`PUT /api/portals/v1/users/{user-id}`

Update a infomation of user

#### Request
Please reference [update user](#update-user) in the type session.

But now just can send the following keys:
* `"email"` - User email (optional)
* `"fullName"` - User full name (optional)
* `"phoneNumber"` - User phone number (optional)

If you send the other keys which not support now, it will do nothing.

#### Response
On success, response has HTTP status 200 and user object. See user in the type section for more details.

On failure, response has HTTP status of 400 or greater.

#### Example

```
TODO
```
