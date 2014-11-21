# Portals API (BETA)

__This API is in beta testing and may be to subject to the occasional tweak. Any such tweaks will be documented here.__

Portals provides a user authentication and management system on top of the One Platform. The Portals API provides access to Portals functionality using a REST-style HTTP API, using the JSON format in request and response bodies, and basic authentication where a Portals account is required.

## Overview
---

### API Endpoints

#### Accounts

* [Get all user accounts](#get-user-accounts)
* [Get user account by email](#get-user-account-by-email)

#### Client Models

* [Create client model](#create-client-model) (Not ready)
* [Update client model](#update-client-model)
* [Get client model](#get-client-model)
* [List client models](#list-client-models)
* [Delete client model](#delete-client-model)

#### Collections (Bulk API)

* [Get multiple data sources](#get-multiple-data-sources)
* [Get multiple devices](#get-multiple-devices)
* [Get multiple groups](#get-multiple-groups)
* [Get multiple users](#get-multiple-users)

#### Data Sources

* [Create portal data source](#create-portal-data-source)
* [Get data source](#get-data-source)
* [Get multiple data sources](#get-multiple-data-sources)

#### Data Sources Date

* [Get data source data](#get-data-source-data)
* [Append data source data](#append-data-source-data)
* [Append data source data in JSON format](#append-data-source-data-in-JSON-format)

#### Device

* [Create new device under a portal of authenticated user](#create-new-device-under-a-portal-of-authenticated-user)

#### Devices

* [Create device](#create-device)
* [Update device](#update-device)
* [Get device](#get-device)
* [Get multiple devices](#get-multiple-devices)
* [Delete device](#delete-device)

#### Domain

* [List domains of authenticated user](#list-domains-of-authenticated-user)

#### File Systems

* [Append to a directory](#append-to-a-directory)
* [Get a file](#get-a-file)
* [Get a file content](#get-a-file-content)

#### Groups

* [Create group under user](#create-group-under-user)
* [Update group](#update-group)
* [Get group](#get-group)
* [Get multiple groups](#get-multiple-groups)
* [Delete group](#delete-group)

#### Portal

* [List portals of authenticated user](#list-portals-of-authenticated-user)

#### Portals
* [Create portal](#create-portal)
* [Update portal](#update-portal)
* [Get portal](#get-portal)
* [Delete portal by id](#delete-portal-by-id)
* [Delete portal by rid](#delete-portal-by-rid)

#### Themes

* [Create theme](#create-theme) (Not ready)
* [Update theme](#update-theme)
* [Get theme](#get-theme)
* [List themes](#list-themes)
* [Delete theme](#delete-theme)

#### User

* [Register new user account](#register-new-user-account)
* [Reset user account password](#reset-user-account-password)

#### Users

* [Create user](#create-user)
* [Update user](#update-user)
* [Get all users](#get-all-users)
* [Get all user portals](#get-all-user-portals)
* [Get multiple users](#get-multiple-users)
* [Get user](#get-user)
* [Get user token](#get-user-token)
* [Get user portal](#get-user-portal)
* [Delete user](#delete-user)

### API Index

#### /accounts

* [GET] [/api/portals/v1/accounts](#get-user-accounts)
* [GET] [/api/portals/v1/accounts/{user-email}](#get-user-account-by-email)

#### /client-models

* [GET] [/api/portals/v1/client-models/](#get-client-model)
* [POST] [/api/portals/v1/client-models/](#create-client-model) (Not ready)
* [GET] [/api/portals/v1/client-models/{vendor}/{name}](#list-client-models)
* [PUT] [/api/portals/v1/client-models/{vendor}/{name}](#update-client-model)
* [DELETE] [/api/portals/v1/client-models/{vendor}/{name}](#delete-client-model)

#### /data-sources

* [GET] [/api/portals/v1/data-sources/{data-source-rid}](#get-data-source)
* [GET] [/api/portals/v1/data-sources/{data-source-rid}/data](#get-data-source-data)
* [POST] [/api/portals/v1/data-sources/{data-source-rid}/data](#append-to-data-source-data)
* [POST] [/api/portals/v1/data-sources/{data-source-rid}/json](#append-json-data-to-data-source)

#### /device

* [POST] [/api/portals/v1/device](#create-new-device-under-a-portal-of-authenticated-user)

#### /devices

* [GET] [/api/portals/v1/devices/{device-rid}](#get-device)
* [PUT] [/api/portals/v1/devices/{device-rid}](#update-device)
* [DELETE] [/api/portals/v1/devices/{device-rid}](#delete-device)

#### /domain

* [GET] [/api/portals/v1/domain/](#list-domains-of-authenticated-user)

#### /fs

* [GET] [/api/portals/v1/fs/{directory-path}/{subdirectory}](#get-a-file)
* [GET] [/api/portals/v1/fs/{directory-path}/{subdirectory}/{field-name}](#get-a-file-content)

#### /groups

* [GET] [/api/portals/v1/groups/{group-id}](#get-group)
* [PUT] [/api/portals/v1/groups/{group-id}](#update-group)
* [DELETE] [/api/portals/v1/groups/{group-id}](#delete-group)

#### /portal

* [GET] [/api/portals/v1/portal/ ](#list-portals-of-authenticated-user)

#### /portals
* [GET] [/api/portals/v1/portals/{portal-id}](#get-portal)
* [PUT] [/api/portals/v1/portals/{portal-id}](#update-portal)
* [DELETE] [/api/portals/v1/portals/{portal-id}](#delete-portal-by-id)
* [DELETE] [/api/portals/v1/portals/{portal-rid}/ByRid](#delete-portal-by-rid)
* [POST] [/api/portals/v1/portals/{portal-id}/data-sources](#create-portal-data-source)
* [POST] [/api/portals/v1/portals/{portal-id}/devices](#create-device)

#### /themes

* [GET] [/api/portals/v1/themes/](#list-themes)
* [POST] [/api/portals/v1/themes/](#create-theme) (Not ready)
* [GET] [/api/portals/v1/themes/{themeid}](#get-theme)
* [PUT] [/api/portals/v1/themes/{themeid}](#update-theme)
* [DELETE][/api/portals/v1/themes/{themeid}](#delete-theme)

#### /user

* [POST] [/api/portals/v1/user](#register-new-user-account)
* [POST] [/api/portals/v1/user/password](#reset-user-account-password)

#### /users

* [GET] [/api/portals/v1/users](#get-all-users)
* [POST] [/api/portals/v1/users](#create-user)
* [GET] [/api/portals/v1/users/{user-id}](#get-user)
* [PUT] [/api/portals/v1/users/{user-id}](#update-user)
* [DELETE] [/api/portals/v1/users/{user-id}](#delete-user)
* [POST] [/api/portals/v1/users/{user-id}/groups](#create-group-under-user)
* [GET] [/api/portals/v1/users/{user-id}/portals](#get-all-user-portals)
* [POST] [/api/portals/v1/users/{user-id}/portals](#create-portal)
* [GET] [/api/portals/v1/users/{user-id}/portals/{portal-id}](#get-user-portal)
* [GET] [/api/portals/v1/users/{user-id}/token](#get-user-token)
* [GET] [/api/portals/v1/users/_this/data-sources/[{data-source-rid},{data-source-rid},...]](#collections-bulk-request)
* [GET] [/api/portals/v1/users/_this/devices/[{device-rid},device-rid},...]](#collections-bulk-request)
* [GET] [/api/portals/v1/users/_this/groups/[{group-id},{group-id},...]](#collections-bulk-request)
* [GET] [/api/portals/v1/users/_this/users/[{user-id},{user-id},...]](#collections-bulk-request)

### REST

The API uses a REST-style API, which means that:

* HTTP verbs in the request indicate the type of action the client wants to take (e.g. GET, POST)
* HTTP status in the response indicate (e.g. 200 for success, 400 for bad request or 401 for authentication error)

### Request and Response Format

Request and response bodies, when present, are formatted using JSON. For more see http://json.org

Note that the JSON examples below are sometimes formatted with extra whitespace for clarity.

The header MUST include:

    Content-type: application/json; charset=utf-8

### Authentication

Some API endpoints require a Portals email and password also username and password to combination for authentication. These are passed using basic access authentication. See this link for details about this method of authentication:

http://en.wikipedia.org/wiki/Basic_access_authentication

### Domain

For some API endpoints, the domain of the request URL indicates information about which domain should be affected. For example, a GET request to:

    https://mydomain.exosite.com/api/portals/v1/portal/

...will return a different array of portals than a GET request to:

    https://portals.exosite.com/api/portals/v1/portal/

Also, the domain is used for user authentication. Endpoints that are affected by the querying domain are indicated below.

## Types
---

The following types are common to several API endpoints.

### Account object

An object containing information about a Portals user.

```
{
    "email": <short-string>,
    "fullName": <short-string>,
    "id": <id>,
    "meta": <meta>,
    "phoneNumber": <short-string>
}
```

* `"email"` is the user's email address. It is a string of fewer than 256 characters.
* `"fullName"` is the user's full name. It is a string of fewer than 256 characters.
* `"id"` is a numeric identifier for the user.
* `"meta"` may be any type. It contains application-specific information describing the user. It MUST be less then 2 megabytes long when it's seralized to a JSON string.
* `"phoneNumber"` is the user's phone number. It is a string of fewer than 256 characters.

### Client models object

A sample client model object looks like this:

```
{
    "id": "samplevendor\/samplemodel",
    "domainID": "0000000000",
    "vendor": "samplevendor",
    "friendly": "dfhg",
    "name": "samplemodel",
    "cloneRID": "29770f4f96122ffd33af1f6edb1b875810c7844a",
    "viewID": "0000000000",
    "exampleSN": "",
    "sharedSN": "",
    "convertSN": "no",
    "alternateSN": "",
    "noteSetup": "",
    "noteName": "",
    "noteLocation": "(optional - can be a string or GPS decimal degrees)",
    "pictureDevice": "https:\/\/portals.yourdomain.com\/cache\/model\/samplevendor\/samplemodel_PictureDevice.png",
    "description": "",
    "pictureSN": "",
    "confirmPage": "Your [client model name] [device] was successfully enabled with the CIK\u003Cbr\/\u003E[device cik]\u003Cbr\/\u003E\u003Cbr\/\u003EYour [device] will need to connect to the Exosite platform within 24 hours or your provision request will expire and you will need to re-enable your [device] from the Re-Enable block in your [device] pop-up. If you have any problems connecting, please contact your [device] provider at:\u003Cbr\/\u003E\u003Cbr\/\u003E\u003Cb\u003ECompany name:\u003C\/b\u003E [company name]\u003Cbr\/\u003E\u003Cb\u003ECompany email contact information:\u003C\/b\u003E [company email]\u003Cbr\/\u003E",
    "companyName": "",
    "contactEmail": "",
    ":published": true
}
```

### Data source object

A data source object describes a Portals time series data source.

```
{
    "data": [
        [
            <unix-timestamp-1>,
            <value-1>
        ],
        [
            <unix-timestamp-2>,
            <value-2>
        ],
        ...
    ],
    "info": {
        "basic": <basic>,
        "description": <description>,
        "shares": <shares>,
        "storage": <storage>,
        "subscribers": <subscribers>,
        "tags": <tags>
    },
    "rid": <rid>,
    "unit": <unit>
}
```

* `"data"` is an array of data points. A data point has a unit timestamp and a value.

    * `<unix-timestamp-N>` is a [Unix timestamp](http://en.wikipedia.org/wiki/Unix_time), measured in number of seconds since the epoch.

    * `<value-N>` may be a string, int, or float depending on the data source type.

* `"info"` is a dataport object documented in the [remote procedure call documentation](https://github.com/exosite/docs/tree/master/rpc#info). But only basic, description, shares, storage, subscribers and tags are exposed.
* `"rid"` is the RID of a data source.
* `"unit"` is the unit of a data source.

### Device object

A device object describes a device in Portals.

```
{
    "dataSources": [
        <data-source-rid-1>,
        <data-source-rid-2>,
        ...
    ],
    "info": {
        "aliases": <aliases>,
        "basic": <basic>,
        "description": <description>,
        "key": <key>,
        "shares": <shares>,
        "subscribers": <subscribers>,
        "tagged": <tagged>,
        "tags": <tags>,
    },
    "members": [
        <permission-1>,
        <permission-2>,
        ...
    ],
    "model": <model-id>,
    "rid": <rid>,
    "sn": <sn>,
    "type": <device-type>,
    "vendor": <vendor-id>
}
```

* `"dataSources"` is an array of data source IDs a device has.

    * `<data-source-rid-N>` is a 40 character hex string representing the data source's RID in the One Platform

* `"info"` is an client object documented in the [remote procedure call documentation](https://github.com/exosite/docs/tree/master/rpc#info). But only aliases, basic, description, key, shares, subscribers, tagged and tags are exposed.

    * `<key>` is a 40 character hex string representing the client's CIK in the One Platform or null if the authorized user doesn't have \_\_\_admin permission to this device.

* `"members"` is an array of [permission objects](#permission-object) listing the members of the device.
* `"model"` is a string identifying the model
* `"rid"` is the RID of a device.
* `"sn"` is a string representing the serial number of the device
* `"type"` is a constant string representing the device type.  Possible values are:

    * `"vendor"`

* `"vendor-id"` is a string identifying the vendor

### Group object

A group object describes a Portals permissions group.

```
{
    "id": <group-id>,
    "members": [
        <permission-1>,
        ...
    ],
    "meta": <meta>,
    "name": <short-text>,
    "permissions": [
        <permission-1>,
        ...
    ],
    "userId": <user-id>
}
```

* `"id"` is a number identifying the group.
* `"members"` is an array of [permission objects](#permission-object) listing the members of the group.
* `"meta"` may be any type. It contains application-specific information describing the group. It MUST be less then 2 megabytes long when it's seralized to a JSON string.
* `"name"` is the group name. It is a string of fewer than 256 characters. It MUST be unique among the same user in a domain.
* `"permissions"` is an array of [permission objects](#permission-object) describing Portals resources members of the group may access.
* `"userId"` is a number identifying the owner of the group.

### Permission object

A permission object describes a level of access to a particular Portals resource identified by `"oid"`, and is filtered by current domain of its resource, which means a permission list never contains resources which not belong to current domain.

```
{
    "access": <access>,
    "oid": {
        "id": <id>,
        "type": <type>
    }
}
```

* `"access"` is a constant string. Possible values are:

    * `"___admin"`

    * `"d_____fs"`

* `"oid"` is an object identifying the resource with the permission.

    * `<id>` is a number identifying the resource.

    * `<type>` is a string identifying the thing to which the permission provides access. It may have one of the following values:

        * `"DataSource"`

        * `"Device"`

        * `"Domain"`

        * `"Group"`

        * `"Portal"`

        * `"User"`

### Portal object

An object containing information about a portal.

```
{
    "devices": [
        <device-rid-1>,
        <device-rid-2>,
        ...
    ],
    "id": <id>,
    "info": {
        "aliases": <aliases>,
        "basic": <basic>,
        "description": <description>,
        "key": <key>,
        "shares": <shares>,
        "subscribers": <subscribers>,
        "tagged": <tagged>,
        "tags": <tags>,
    },
    "planId": <plan-id>,
}
```

* `"devices"` is an array of identifiers for devices of which the portal owns.

    * `<device-rid-N>` is a 40 character hex string representing the device's RID in the One Platform

* `"id"` is a numeric identifier for the portal.

* `"info"` is an client object documented in the [remote procedure call documentation](https://github.com/exosite/docs/tree/master/rpc#info). But only aliases, basic, description, key, shares, subscribers, tagged and tags are exposed.

    * `<key>` is a 40 character hex string representing the client's CIK in the One Platform or null if the authorized user doesn't have \_\_\_admin permission to this portal.

* `"planId"` is a numeric identifier for the plan of the portal.

### Theme object

A sample theme object looks like this:

```
{
    "id": "3077881923",
    "name": "sample_theme",
    "description": "this is a description",
    ":default": true,
    "config": {
        "dashboard_background": {
            "background_color": "F9F9F9",
            "background_image": "",
            "background_attachment": "scroll",
            "background_repeat": "repeat-y",
            "background_position": "left top"
        },
        "header_logo": "https:\/\/portals.yourdomain.com\/cache\/theme\/0_1923506535_header_logo.png",
        "header_bkimage": "https:\/\/portals.yourdomain.com\/static\/png\/skin_portals_bannerbg.png?62d38477d5d7a46968a168c460bf76fc",
        "header_title_color": "D5E04D",
        "header_subtitle_color": "FFFFFF",
        "header_titles_position_top": "1.375em",
        "header_linktext_color": "E5E5E5",
        "header_linktextover_color": "D5E04D",
        "header_dropdown_text_color": "FFFFFF",
        "header_linktext_position_top": "1.5em",
        "header_portalmenu_current_color": "0000FF",
        "footer_text": "ANY DEVICE. ANY DATA. ANY WHERE.",
        "footer_text_color": "D5E04D",
        "footer_bar_color": "D5E04D",
        "footer_linktext_color": "5C5D60",
        "footer_linktextover_color": "000000",
        "block_title_text_color": "000000",
        "block_title_linkover_color": "010101",
        "block_title_back_color": "D5E04D",
        "block_invert_icons": "",
        "managepage_highlight_text_color": "0000FF",
        "dashboard_thumbnail": "",
        "thankyoupage_title_text_color": "D5E04D",
        "browser_tab_text": "Exosite Portals",
        "browser_tab_icon": "https:\/\/portals.yourdomain.com\/static\/png\/icon_exosite.png?834282e60aa5c2cf2d3a6894307437dd",
        "admin_menu_style": {
            "admin_menu_title": "Domain Admin",
            "manage_menu_title": "Manage",
            "secondary_menu_title": "Portal Menu",
            "account_menu_title": "Account",
            "menu_title_color": "E5E5E5",
            "background_color": "5C5D60",
            "background_hover_color": "A6A6A6",
            "text_color": "FFFFFF",
            "sub_background_color": "FFFFFF",
            "sub_background_hover_color": "A6A6A6",
            "sub_text_color": "5C5D60",
            "text_active_color": "D5E04D"
        },
        "jsCode": ""
    },
    "code": ""
}
```

### User object

An object containing information about a Portals user.

```
{
    "activated": <boolean>,
    "email": <short-string>,
    "fullName": <short-string>,
    "groups": [
        <group-id-1>,
        <group-id-2>,
        ...
    ],
    "id": <id>,
    "meta": <meta>,
    "permissions": [
        <permission-1>,
        ...
    ],
    "phoneNumber": <short-string>
}
```

* `"activated"` indicates whether a user is activated in the domain or not.
* `"email"` is the user's email address. It is a string of fewer than 256 characters.
* `"fullName"` is the user's full name. It is a string of fewer than 256 characters.
* `"groups"` is an array of identifiers for groups of which the user is a member.

    * `<group-id-N>` is a number identifying the group.

* `"id"` is a numeric identifier for the user.
* `"meta"` may be any type. It contains application-specific information describing the user. It MUST be less then 2 megabytes long when it's seralized to a JSON string.
* `"permissions"` is an array of [permission objects](#permission-object) describing Portals resources the user may access.
* `"phoneNumber"` is the user's phone number. It is a string of fewer than 256 characters.

### User ID ###

Anywhere an API endpoint takes a user ID, you can instead use \_this as an alias for the user ID of the authenticated user.

#### example ####

Given a request is authenticated as a user with ID being 1234.

`GET /api/portals/v1/users/1234`

yields the same result as

`GET /api/portals/v1/users/_this`

## API Endpoints
---
### Accounts

#### Get all user accounts

`GET /api/portals/v1/accounts`

Get account information about all users.

##### Request

Request body is empty

##### Response

On success, response has HTTP status 200 and a body containing an array of [account object](#account-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/accounts' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 09:42:30 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Transfer-Encoding: chunked
Content-Type: application/json; charset=UTF-8

[
    {
        "email": "updatedemail@gmail.com",
        "fullName": "",
        "id": "3167859736",
        "meta": null,
        "phoneNumber": ""
    },
    {
        "email": "olduseremail@gmail.com",
        "fullName": "olduseremail",
        "id": "3407735538",
        "meta": null,
        "phoneNumber": ""
    },
    ...
]
```

#### Get user account by email

`GET /api/portals/v1/accounts/{user-email}`

Get user account by email.

##### Request

Request body is empty

##### Response

On success, responds with HTTP status 200 if user exists in some domain and the body containing user object.
user objects contain the following keys:

* `"email"` - User email
* `"fullName"` - User full name
* `"id"` - User ID
* `"meta"` - User meta
* `"phoneNumber"` - User phonenumber

On failure, responds with HTTP status 404 if user doesn't exist in any domain.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/accounts/useremail@gmail.com' \
     -X GET \
     -u 'adminuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 09:40:58 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 99
Content-Type: application/json; charset=UTF-8

{
    "email": "updatedemail@gmail.com",
    "fullName": "",
    "id": "3167859736",
    "meta": null,
    "phoneNumber": ""
}
```

### Client Models

Client models represent a class of devices. All devices of the same client model have the same behaviour attributes and pricing. Only the domain administrator can use the client model APIs.
**Note: Image data can currently not be modified using this API**

#### Create client model (Not ready)

`POST /api/portals/v1/client-models/`

##### Request

The post body needs to be JSON encoded and at least include the required fields:

* `"friendly"`
* `"name"`
* `"cloneRID"` - Cloned device rid.

#### Get client model

`GET /api/portals/v1/client-models/{vendor}/{name}`

Get information about a client model.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and body is a [client model object](#client-model-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/client-models/myvendor/myname' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 06:21:14 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 1071
Content-Type: application/json; charset=UTF-8

{
    "id": "myvendor/myname",
    "domainID": "3481377489",
    "vendor": "myvendor",
    "friendly": "myname",
    "name": "myname",
    "cloneRID": "96436ca6874ce01d0dd1f41001d71e75c3aebd6f",
    "viewID": "0000000000",
    "exampleSN": "",
    "sharedSN": "",
    "convertSN": "no",
    "alternateSN": "",
    "noteSetup": "",
    "noteName": "",
    "noteLocation": "(optional - can be a string or GPS decimal degrees)",
    "pictureDevice": "",
    "description": "",
    "pictureSN": "",
    "confirmPage": "Your [client model name] [device] was successfully enabled with the CIK<br/>[device cik]<br/><br/>Your [device] will need to connect to the Exosite platform within 24 hours or your provision request will expire and you will need to re-enable your [device] from the Re-Enable block in your [device] pop-up. If you have any problems connecting, please contact your [device] provider at:<br/><br/><b>Company name:</b> [company name]<br/><b>Company email contact information:</b> [company email]<br/>",
    "companyName": "",
    "contactEmail": "",
    ":published": false
}
```

#### Update client model

`PUT /api/portals/v1/client-models/{vendor}/{name}`

Update information about a theme.

##### Request

The body needs to be JSON encoded contains a [client model object](#client-model-object). 

##### Response

On success, response has HTTP status 200 and the body is empty.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/client-models/myvendor/mymodel' \
     -X PUT \
     -d '{"description": "sample model"}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 08:14:01 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 0
Content-Type: application/json; charset=UTF-8
```

#### Get client model

`GET /api/portals/v1/client-models/{vendor}/{name}`

Get information about a client model.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and an array of [client models object](#client-models-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/client-models/myvendor/mymodel' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 06:10:30 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Transfer-Encoding: chunked
Content-Type: application/json; charset=UTF-8

{
    "id": "myvendor/mymodel",
    "domainID": "3481377489",
    "vendor": "myvendor",
    "friendly": "mymodel",
    "name": "mymodel",
    "cloneRID": "96436ca6874ce01d0dd1f41001d71e75c3aebd6f",
    "viewID": "0000000000",
    "exampleSN": "",
    "sharedSN": "",
    "convertSN": "no",
    "alternateSN": "",
    "noteSetup": "",
    "noteName": "",
    "noteLocation": "(optional - can be a string or GPS decimal degrees)",
    "pictureDevice": "",
    "description": "",
    "pictureSN": "",
    "confirmPage": "Your [client model name] [device] was successfully enabled with the CIK<br/>[device cik]<br/><br/>Your [device] will need to connect to the Exosite platform within 24 hours or your provision request will expire and you will need to re-enable your [device] from the Re-Enable block in your [device] pop-up. If you have any problems connecting, please contact your [device] provider at:<br/><br/><b>Company name:</b> [company name]<br/><b>Company email contact information:</b> [company email]<br/>",
    "companyName": "",
    "contactEmail": "",
    ":published": false
}
```

#### List client models

`GET /api/portals/v1/client-models/`

Returns an array of client models which in this domain.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and an array of [client models object](#client-models-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/client-models' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 06:10:30 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Transfer-Encoding: chunked
Content-Type: application/json; charset=UTF-8

[
       {
        "id": "myvendor/myname",
        "domainID": "3481377489",
        "vendor": "myvendor",
        "friendly": "myname",
        "name": "myname",
        "cloneRID": "96436ca6874ce01d0dd1f41001d71e75c3aebd6f",
        "viewID": "0000000000",
        "exampleSN": "",
        "sharedSN": "",
        "convertSN": "no",
        "alternateSN": "",
        "noteSetup": "",
        "noteName": "",
        "noteLocation": "(optional - can be a string or GPS decimal degrees)",
        "pictureDevice": "",
        "description": "",
        "pictureSN": "",
        "confirmPage": "Your [client model name] [device] was successfully enabled with the CIK<br/>[device cik]<br/><br/>Your [device] will need to connect to the Exosite platform within 24 hours or your provision request will expire and you will need to re-enable your [device] from the Re-Enable block in your [device] pop-up. If you have any problems connecting, please contact your [device] provider at:<br/><br/><b>Company name:</b> [company name]<br/><b>Company email contact information:</b> [company email]<br/>",
        "companyName": "",
        "contactEmail": "",
        ":published": false
    },
    {
        "id": "myvendor/testing%2B1412320409837",
        "domainID": "3481377489",
        "vendor": "myvendor",
        "friendly": "testing+1412320546880",
        "name": "testing+1412320409837",
        "cloneRID": "fc03f70ea93a2b8e65ac96e9ad71fbb79bbbd7ad",
        "viewID": "0000000000",
        "exampleSN": "",
        "sharedSN": "",
        "convertSN": "no",
        "alternateSN": "",
        "noteSetup": "",
        "noteName": "",
        "noteLocation": "(optional - can be a string or GPS decimal degrees)",
        "pictureDevice": "",
        "description": "testing+1412320409837",
        "pictureSN": "",
        "confirmPage": "Your [client model name] [device] was successfully enabled with the CIK<br/>[device cik]<br/><br/>Your [device] will need to connect to the Exosite platform within 24 hours or your provision request will expire and you will need to re-enable your [device] from the Re-Enable block in your [device] pop-up. If you have any problems connecting, please contact your [device] provider at:<br/><br/><b>Company name:</b> [company name]<br/><b>Company email contact information:</b> [company email]<br/>",
        "companyName": "testing+1412320546880",
        "contactEmail": "testing+1412320546880@email.com",
        ":published": true
    },
    ...
]
```

#### Delete client model

`DELETE /api/portals/v1/client-models/{vendor}/{name}`

When deleting the current default client model the exosite system client model will be applied to the domain.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and the body is empty.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/client-models/myvendor/mymodel' \
     -X DELETE \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 06:26:52 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 0
Content-Type: application/json; charset=UTF-8
```

### Collections (bulk request)

#### Querystring

* limit
    Internal limit is 200 some are smaller. 0 <= x <= (INTERNAL LIMIT).
    `/users/_this/users/[{user-id},{user-id},...]?limit=10`
* offset
    numbers of items to skip.
    `/users/_this/users/[{user-id},{user-id},...]?offset=10`

#### Get multiple data sources

`GET /users/_this/data-sources/[{data-source-rid},{data-source-rid},...]`

Get information about portals data sources.

##### Request

Request body is empty.

##### Response

On success,
If all items are fetched, response has HTTP status 200 and body is a [data source object](#data-source-object).
If request ID is over the response limit, response has HTTP status 206 and body is a [data source object](#data-source-object), link will appear in header  `Link=<{url}>; rel="previous", <{url}>; rel="next"` 

On failure, response has HTTP status of 400 or greater.

##### Example

###### If all items are fetched

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/_this/data-sources/\[a3fc4e5a6fbc20fcb14091ba0735580e56060e9a,a90f263111b05088a3c78aef511f14275bba6cc5\]' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 02:49:17 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 648
Content-Type: application/json; charset=UTF-8

[
    {
        "data": [
            [
                1416190810,
                100
            ]
        ],
        "info": {
            "basic": {
                "modified": 1416190782,
                "subscribers": 0,
                "type": "dataport"
            },
            "description": {
                "format": "integer",
                "meta": "{\"datasource\":{\"description\":\"\",\"unit\":\"\"}}",
                "name": "test",
                "preprocess": [],
                "public": false,
                "retention": {
                    "count": "infinity",
                    "duration": "infinity"
                },
                "subscribe": null
            },
            "shares": [],
            "storage": {
                "count": 1,
                "first": 1416190810,
                "last": 1416190810,
                "size": 12
            },
            "subscribers": [],
            "tags": []
        },
        "rid": "a3fc4e5a6fbc20fcb14091ba0735580e56060e9a",
        "unit": ""
    },
    {
        "data": [
            [
                1416190822,
                300
            ]
        ],
        "info": {
            "basic": {
                "modified": 1416190793,
                "subscribers": 0,
                "type": "dataport"
            },
            "description": {
                "format": "integer",
                "meta": "{\"datasource\":{\"description\":\"\",\"unit\":\"\"}}",
                "name": "test1",
                "preprocess": [],
                "public": false,
                "retention": {
                    "count": "infinity",
                    "duration": "infinity"
                },
                "subscribe": null
            },
            "shares": [],
            "storage": {
                "count": 1,
                "first": 1416190822,
                "last": 1416190822,
                "size": 12
            },
            "subscribers": [],
            "tags": []
        },
        "rid": "a90f263111b05088a3c78aef511f14275bba6cc5",
        "unit": ""
    }
]
```

###### If request ID is over the response limit

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/_this/data-sources/\[a3fc4e5a6fbc20fcb14091ba0735580e56060e9a,a90f263111b05088a3c78aef511f14275bba6cc5\]?limit=1' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
Date: Mon, 17 Nov 2014 03:18:57 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 206 Partial Content
Link: <https://mydomain.exosite.com/api/portals/v1/users/_this/data-sources/[a3fc4e5a6fbc20fcb14091ba0735580e56060e9a,a90f263111b05088a3c78aef511f14275bba6cc5]?offset=1&limit=1>; rel="next"
Vary: Accept-Encoding
Content-Length: 486
Content-Type: application/json; charset=UTF-8

[
    {
        "data": [
            [
                1416190810,
                100
            ]
        ],
        "info": {
            "basic": {
                "modified": 1416190782,
                "subscribers": 0,
                "type": "dataport"
            },
            "description": {
                "format": "integer",
                "meta": "{\"datasource\":{\"description\":\"\",\"unit\":\"\"}}",
                "name": "test",
                "preprocess": [],
                "public": false,
                "retention": {
                    "count": "infinity",
                    "duration": "infinity"
                },
                "subscribe": null
            },
            "shares": [],
            "storage": {
                "count": 1,
                "first": 1416190810,
                "last": 1416190810,
                "size": 12
            },
            "subscribers": [],
            "tags": []
        },
        "rid": "a3fc4e5a6fbc20fcb14091ba0735580e56060e9a",
        "unit": ""
    }
]
```

#### Get multiple devices

`GET /users/_this/devices/[{device-rid},device-rid},...]`

Get information for devices.

##### Request

Request body is empty.

##### Response

On success,
If all items are fetched, response has HTTP status 200 and body is a [device object](#device-object).
If request ID is over the response limit, response has HTTP status 206 and body is a [device object](#device-object), link will appear in header  `Link=<{url}>; rel="previous", <{url}>; rel="next"` 

On failure, response has HTTP status of 400 or greater.

##### Example

###### If all items are fetched

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/_this/devices/\[47ab21c6e169ca4f749128fb00a4bf077f4a463f,96436ca6874ce01d0dd1f41001d71e75c3aebd6f\]' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 03:29:42 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 2742
Content-Type: application/json; charset=UTF-8

[
    {
        "dataSources": [
            "561d1c757bdafd2c7fb3196e5a35558317045876",
            "8840cd68dfcef3c20c8bc4821f0c670ba2d2eb44"
        ],
        "info": {
            "aliases": {
                "0798132e5e5def5decc7129430112086f1448b39": [
                    "temp"
                ],
                "8840cd68dfcef3c20c8bc4821f0c670ba2d2eb44": [
                    "shared data"
                ],
                "561d1c757bdafd2c7fb3196e5a35558317045876": [
                    "public"
                ]
            },
            "basic": {
                "modified": 1407985593,
                "subscribers": 0,
                "type": "client",
                "status": "activated"
            },
            "description": {
                "limits": {
                    "client": 0,
                    "dataport": "inherit",
                    "datarule": "inherit",
                    "disk": "inherit",
                    "dispatch": "inherit",
                    "email": "inherit",
                    "email_bucket": "inherit",
                    "http": "inherit",
                    "http_bucket": "inherit",
                    "share": "inherit",
                    "sms": "inherit",
                    "sms_bucket": "inherit",
                    "xmpp": "inherit",
                    "xmpp_bucket": "inherit"
                },
                "locked": false,
                "meta": "{\"timezone\":\"Asia\\/Taipei\",\"location\":\"Taichung\",\"device\":{\"type\":\"generic\"},\"activetime\":\"30\"}",
                "name": "device Apple",
                "public": false
            },
            "shares": [
                {
                    "code": "8a7bfcfb3db340d23cdafc599107e16088075b38",
                    "meta": "[\"testing\",\"1\"]",
                    "activator": null
                },
                {
                    "code": "3fcfb90db1210878510c4cd67e06324eb862efb4",
                    "meta": "[\"testing\",\"Fruit+20140807\"]",
                    "activator": null
                },
                {
                    "code": "4b467a56d7b2f5c546d1bcfeab91690bf1e98f24",
                    "meta": "[\"testing\",\"test\"]",
                    "activator": null
                },
                {
                    "code": "98010735f04f1f50ee57251f7342370cbe40d841",
                    "meta": "[\"testing\",\"testing+20140814-1\"]",
                    "activator": null
                },
                {
                    "code": "85c060851a07de239da1159d6294751885afdc9e",
                    "meta": "[\"testing\",\"restfulapi\"]",
                    "activator": null
                },
                {
                    "code": "cd64dfd210e9eb18a403bd04b92901e96c72cc37",
                    "meta": "[\"testing\",\"2\"]",
                    "activator": null
                },
                {
                    "code": "e146db1b2ea1397ce67c02ddf7e876941e137fc5",
                    "meta": "[\"testing\",\"testing+20140822-1\"]",
                    "activator": null
                }
            ],
            "subscribers": [],
            "tagged": [
                "public"
            ],
            "tags": []
        },
        "members": [],
        "model": null,
        "rid": "47ab21c6e169ca4f749128fb00a4bf077f4a463f",
        "sn": null,
        "type": "generic",
        "vendor": null
    },
    {
        "dataSources": [],
        "info": {
            "aliases": [],
            "basic": {
                "modified": 1415769574,
                "subscribers": 0,
                "type": "client",
                "status": "expired"
            },
            "description": {
                "limits": {
                    "client": 0,
                    "dataport": "inherit",
                    "datarule": "inherit",
                    "disk": "inherit",
                    "dispatch": "inherit",
                    "email": "inherit",
                    "email_bucket": "inherit",
                    "http": "inherit",
                    "http_bucket": "inherit",
                    "share": "inherit",
                    "sms": "inherit",
                    "sms_bucket": "inherit",
                    "xmpp": "inherit",
                    "xmpp_bucket": "inherit"
                },
                "locked": false,
                "meta": "{\"DeviceType\":\"generic\",\"DeviceTypeID\":\"0000000002\",\"Timezone\":\"Asia\\/Taipei\",\"Location\":\"Taiwan\",\"activetime\":\"\",\"DeviceTypeName\":\"generic\",\"timezone\":\"Asia\\/Taipei\",\"location\":\"Taiwan\",\"device\":{\"type\":\"vendor\",\"model\":\"testAPI\",\"vendor\":\"testing\",\"sn\":\"888\"}}",
                "name": "888",
                "public": false
            },
            "shares": [],
            "subscribers": [],
            "tagged": [],
            "tags": []
        },
        "members": [],
        "model": "testAPI",
        "rid": "96436ca6874ce01d0dd1f41001d71e75c3aebd6f",
        "sn": "888",
        "type": "vendor",
        "vendor": "testing"
    }
]
```
#### Example Options
```
curl https://<domain>.exosite.com/api/portals/v1/users/&lt;user id>/portals?options=devices -ik -H 'Content-Type: application/json' --user "<domain admin email>:<domain admin passwd>" 
[
  {
    "PortalName": "Steve....",
    "PortalID": "3438636XXX",
    "PortalRID": "................................",
    "UserEmail": "stevelo@XXXXXX",
    "Description": "Steve XXXXXXX",
    "Devices":["acf4838d1aa26e00ae834c1ab67884e21137c1b7","c36ec9302b2fa9b43772ba7a72da3e74efb3dc92"] //enclosed in square brackets are Devices RIDs 
  },
  {
    "PortalName": "steve......",
    "PortalID": "111646XXX",
    "PortalRID": "................................",
    "UserEmail": "stevelo@XXXXXXX",
    "Description": "Default XXXXX",
    "Devices":[]
  }
]
```

###### If request ID is over the response limit

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/_this/devices/\[47ab21c6e169ca4f749128fb00a4bf077f4a463f,96436ca6874ce01d0dd1f41001d71e75c3aebd6f\]?limit=1' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 206 Partial Content
Date: Mon, 17 Nov 2014 03:24:46 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 206 Partial Content
Link: <https://mydomain.exosite.com/api/portals/v1/users/_this/devices/[47ab21c6e169ca4f749128fb00a4bf077f4a463f,96436ca6874ce01d0dd1f41001d71e75c3aebd6f]?offset=1&limit=1>; rel="next"
Vary: Accept-Encoding
Content-Length: 1772
Content-Type: application/json; charset=UTF-8

[
    {
        "dataSources": [
            "561d1c757bdafd2c7fb3196e5a35558317045876",
            "8840cd68dfcef3c20c8bc4821f0c670ba2d2eb44"
        ],
        "info": {
            "aliases": {
                "0798132e5e5def5decc7129430112086f1448b39": [
                    "temp"
                ],
                "8840cd68dfcef3c20c8bc4821f0c670ba2d2eb44": [
                    "shared data"
                ],
                "561d1c757bdafd2c7fb3196e5a35558317045876": [
                    "public"
                ]
            },
            "basic": {
                "modified": 1407985593,
                "subscribers": 0,
                "type": "client",
                "status": "activated"
            },
            "description": {
                "limits": {
                    "client": 0,
                    "dataport": "inherit",
                    "datarule": "inherit",
                    "disk": "inherit",
                    "dispatch": "inherit",
                    "email": "inherit",
                    "email_bucket": "inherit",
                    "http": "inherit",
                    "http_bucket": "inherit",
                    "share": "inherit",
                    "sms": "inherit",
                    "sms_bucket": "inherit",
                    "xmpp": "inherit",
                    "xmpp_bucket": "inherit"
                },
                "locked": false,
                "meta": "{\"timezone\":\"Asia\\/Taipei\",\"location\":\"Taichung\",\"device\":{\"type\":\"generic\"},\"activetime\":\"30\"}",
                "name": "device Apple",
                "public": false
            },
            "shares": [
                {
                    "code": "8a7bfcfb3db340d23cdafc599107e16088075b38",
                    "meta": "[\"testing\",\"1\"]",
                    "activator": null
                },
                {
                    "code": "3fcfb90db1210878510c4cd67e06324eb862efb4",
                    "meta": "[\"testing\",\"Fruit+20140807\"]",
                    "activator": null
                },
                {
                    "code": "4b467a56d7b2f5c546d1bcfeab91690bf1e98f24",
                    "meta": "[\"testing\",\"test\"]",
                    "activator": null
                },
                {
                    "code": "98010735f04f1f50ee57251f7342370cbe40d841",
                    "meta": "[\"testing\",\"testing+20140814-1\"]",
                    "activator": null
                },
                {
                    "code": "85c060851a07de239da1159d6294751885afdc9e",
                    "meta": "[\"testing\",\"restfulapi\"]",
                    "activator": null
                },
                {
                    "code": "cd64dfd210e9eb18a403bd04b92901e96c72cc37",
                    "meta": "[\"testing\",\"2\"]",
                    "activator": null
                },
                {
                    "code": "e146db1b2ea1397ce67c02ddf7e876941e137fc5",
                    "meta": "[\"testing\",\"testing+20140822-1\"]",
                    "activator": null
                }
            ],
            "subscribers": [],
            "tagged": [
                "public"
            ],
            "tags": []
        },
        "members": [],
        "model": null,
        "rid": "47ab21c6e169ca4f749128fb00a4bf077f4a463f",
        "sn": null,
        "type": "generic",
        "vendor": null
    }
]
```

####   Get multiple groups

`GET /users/_this/groups/[{group-id},{group-id},...]`

Get information about groups.

##### Request

Request body is empty.

##### Response

On success,
If all items are fetched, response has HTTP status 200 and body is a [group object](#group-object).
If request ID is over the response limit, response has HTTP status 206 and body is a [group object](#group-object), link will appear in header  `Link=<{url}>; rel="previous", <{url}>; rel="next"` 

On failure, response has HTTP status of 400 or greater.

##### Example

###### If all items are fetched

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/_this/groups/\[2581071857,2937453355\]' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 03:35:46 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 343
Content-Type: application/json; charset=UTF-8

[
    {
        "id": "2581071857",
        "userId": "1026285982",
        "members": [
            {
                "access": "___admin",
                "oid": {
                    "type": "User",
                    "id": "1026285982"
                }
            }
        ],
        "meta": null,
        "name": "test group 10883",
        "permissions": []
    },
    {
        "id": "2937453355",
        "userId": "1026285982",
        "members": [
            {
                "access": "___admin",
                "oid": {
                    "type": "User",
                    "id": "1026285982"
                }
            }
        ],
        "meta": null,
        "name": "test group 13553",
        "permissions": []
    }
]
```

###### If request ID is over the response limit

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/_this/groups/\[2581071857,2937453355\]?limit=1' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 206 Partial Content
Date: Mon, 17 Nov 2014 03:39:28 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 206 Partial Content
Link: <https://mydomain.exosite.com/api/portals/v1/users/_this/groups/[2937453355,2581071857]?offset=1&limit=1>; rel="next"
Vary: Accept-Encoding
Content-Length: 172
Content-Type: application/json; charset=UTF-8

[
    {
        "id": "2937453355",
        "userId": "1026285982",
        "members": [
            {
                "access": "___admin",
                "oid": {
                    "type": "User",
                    "id": "1026285982"
                }
            }
        ],
        "meta": null,
        "name": "test group 13553",
        "permissions": []
    }
]
```

#### Get multiple users

`GET /users/_this/users/[{user-id},{user-id},...]`

Get information about users.

##### Request

Request body is empty.

##### Response

On success,
If all items are fetched, response has HTTP status 200 and body is a [user object](#user-object).
If request ID is over the response limit, response has HTTP status 206 and body is a [user object](#user-object), link will appear in header  `Link=<{url}>; rel="previous", <{url}>; rel="next"` 

On failure, response has HTTP status of 400 or greater.

##### Example

###### If all items are fetched

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/_this/users/\[2014970789,2308265000\]' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 03:43:14 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 648
Content-Type: application/json; charset=UTF-8

[
    {
        "email": "testing+2014+0805+0309+0953+7449@exosite.com",
        "fullName": "",
        "id": "2014970789",
        "meta": null,
        "phoneNumber": "",
        "activated": true,
        "groups": [],
        "permissions": [
            {
                "access": "d_update",
                "oid": {
                    "type": "Device",
                    "id": "27a9414bc2999a8d975a9c65a1195acde7ec3f4b"
                }
            }
        ]
    },
    {
        "email": "testing+2014+0805+0310+0635+2749@exosite.com",
        "fullName": "",
        "id": "2308265000",
        "meta": null,
        "phoneNumber": "",
        "activated": true,
        "groups": [
            "2053728508",
            "2705108658",
            "3415641988"
        ],
        "permissions": [
            {
                "access": "g_modera",
                "oid": {
                    "type": "Group",
                    "id": "2053728508"
                }
            },
            {
                "access": "g_update",
                "oid": {
                    "type": "Group",
                    "id": "2705108658"
                }
            },
            {
                "access": "g_modera",
                "oid": {
                    "type": "Group",
                    "id": "3415641988"
                }
            }
        ]
    }
]
```

###### If request ID is over the response limit

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/_this/users/\[2014970789,2308265000\]?limit=1' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 206 Partial Content
Date: Mon, 17 Nov 2014 03:44:42 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 206 Partial Content
Link: <https://mydomain.exosite.com/api/portals/v1/users/_this/users/[2014970789,2308265000]?offset=1&limit=1>; rel="next"
Vary: Accept-Encoding
Content-Length: 258
Content-Type: application/json; charset=UTF-8

[
    {
        "email": "testing+2014+0805+0309+0953+7449@exosite.com",
        "fullName": "",
        "id": "2014970789",
        "meta": null,
        "phoneNumber": "",
        "activated": true,
        "groups": [],
        "permissions": [
            {
                "access": "d_update",
                "oid": {
                    "type": "Device",
                    "id": "27a9414bc2999a8d975a9c65a1195acde7ec3f4b"
                }
            }
        ]
    }
]
```

### Data Sources

#### Create portal data source

`POST /api/portals/v1/portals/{portal-id}/data-sources`

Create a data source inside a portal

##### Request

Request body is a [data source object](#data-source-object). Currently only the following keys are supported:

* `"format"` - Data source format under info description.(optional)
* `"name"` - Data source name under info description.(optional)
* `"unit"` - Data source unit under info description.(optional)

If you send any keys besides these, it will do nothing.

##### Response

On success, response has HTTP status 201 and the created data source object.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/portals/2853566858/data-sources' \
     -X POST \
     -d '{"info":{"description":{"name": "new data"}}}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 201 Created
Date: Tue, 18 Nov 2014 02:25:20 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 201 Created
Vary: Accept-Encoding
Content-Length: 452
Content-Type: application/json; charset=UTF-8

{
    "data": [],
    "info": {
        "basic": {
            "modified": 1416277438,
            "subscribers": 0,
            "type": "dataport"
        },
        "description": {
            "format": "string",
            "meta": "{\"datasource\":{\"description\":\"\",\"unit\":\"\"}}",
            "name": "new data",
            "preprocess": [],
            "public": false,
            "retention": {
                "count": "infinity",
                "duration": "infinity"
            },
            "subscribe": null
        },
        "shares": [],
        "storage": {
            "count": 0,
            "first": 0,
            "last": 0,
            "size": 0
        },
        "subscribers": [],
        "tags": []
    },
    "rid": "4f39859d41a66468cf1e5e28d08ad2cab45b498f",
    "unit": ""
}
```

#### Get data source

`GET /api/portals/v1/data-sources/{data-source-rid}`

Get information about a Portals data source.
If you want to get more than one data source information can reference [Get multiple data sources](#get-multiple-data-sources).

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and a body containing a [data source object](#data-source-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/data-sources/4f39859d41a66468cf1e5e28d08ad2cab45b498f' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 02:32:43 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 452
Content-Type: application/json; charset=UTF-8

{
    "data": [],
    "info": {
        "basic": {
            "modified": 1416277438,
            "subscribers": 0,
            "type": "dataport"
        },
        "description": {
            "format": "string",
            "meta": "{\"datasource\":{\"description\":\"\",\"unit\":\"\"}}",
            "name": "new data",
            "preprocess": [],
            "public": false,
            "retention": {
                "count": "infinity",
                "duration": "infinity"
            },
            "subscribe": null
        },
        "shares": [],
        "storage": {
            "count": 0,
            "first": 0,
            "last": 0,
            "size": 0
        },
        "subscribers": [],
        "tags": []
    },
    "rid": "4f39859d41a66468cf1e5e28d08ad2cab45b498f",
    "unit": ""
}
```

### Data Sources Data

#### Get data source data

`GET /api/portals/v1/data-sources/{data-source-rid}/data`

This API can retrieve multiple data points. The options below can be included to modify the results of an API call:

* `"starttime"` and `"endtime"` are Unix timestamps that specify the window of time to read. 

* `"sort"` defines the order in which data points will be displayed.

* `"limit"` sets the a maximum on the number of data points to return.

For more details about these options, see the [read API](https://github.com/exosite/docs/tree/master/rpc#read).

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and body is a list of data points. See the contents of `"data"`.

* `"data"` is an array of data points. A data point has a unit timestamp and a value.

    * `{unix-timestamp}` is a [Unix timestamp](http://en.wikipedia.org/wiki/Unix_time), measured in number of seconds since the epoch.

    * `{value}` may be a string, int, or float depending on the data source type.

On failure, response has HTTP status of 400 or greater.

##### Example

* Get data with no option

```
curl 'https://mydomain.exosite.com/api/portals/v1/data-sources/4f39859d41a66468cf1e5e28d08ad2cab45b498f/data' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 02:39:23 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 21
Content-Type: application/json; charset=UTF-8

[[1416278080,"1000"]]
```

* Get data with options

api/portals/v1/data-sources/`ResourceID`/data?starttime=`Unix Timestamp for starttime`&endtime=`Unix Timestamp for endtime`&limit=`Number of data points`&sort=`Sorting order of choice`

```
curl 'https://mydomain.exosite.com/api/portals/v1/data-sources/4f39859d41a66468cf1e5e28d08ad2cab45b498f/data?starttime=1416278080&endtime=1416278417&limit=2&sort=desc' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 02:43:35 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 41
Content-Type: application/json; charset=UTF-8

[[1416278417,"5.00"],[1416278080,"1000"]]
```

#### Append data source data

`POST /api/portals/v1/data-sources/{data-source-rid}/data`

Write data

##### Request
Request body is a [value](#data-source-object).

##### Response

On success, response has HTTP status 201 and the body is empty.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/portals/data-sources/4f39859d41a66468cf1e5e28d08ad2cab45b498f/data' \
     -X POST \
     -d '"1000"' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 201 Created
Date: Tue, 18 Nov 2014 02:36:02 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 201 Created
Vary: Accept-Encoding
Content-Length: 0
Content-Type: application/json; charset=UTF-8
```

#### Append data source data in JSON format

`POST /api/portals/v1/data-sources/{data-source-rid}/json`

Write json data

##### Querystring

* safe
    safe write, server will wait for 1s and scan the data again for safety

##### Request

Request body is a valid JSON.

##### Response

On success, response has HTTP status 201 and the body is empty.

On failure, response has HTTP status of 400 or greater.

When `safe` is passed in querystring, failure will response 409

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/data-sources/4f39859d41a66468cf1e5e28d08ad2cab45b498f/json' \
     -X POST \
     -d '{"how":"are","you":"?"}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 201 Created
Date: Tue, 18 Nov 2014 02:46:49 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 201 Created
Vary: Accept-Encoding
Content-Length: 0
Content-Type: application/json; charset=UTF-8
```

### Device

#### Create new device under a portal of authenticated user

`POST /api/portals/v1/device`

Creates a new device based on a client model, returning the CIK and RID of the new device.

##### Request

The following keys are passed:

* `"portal_rid"` - resource ID of portal where the device is to be created. User creating the device must have at least manager level access to this portal. This may be found in the output of the /portal/ API call, or in Portals here: https://<subdomain>.exosite.com/admin/portallist

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

##### Response

On success, response has a HTTP status code 200. The response body contains a JSON object with the following keys:
* `"rid"` - resource identifier for created device
* `"cik"` - key for created device

After creating a device, it is necessary to activate it using the provisioning API. This is normally done by device firmware, but may also be done at the command line for testing.

[https://github.com/exosite/api/blob/master/provision/device.md#provisionactivate]

The RID and CIK may then be used with Exosite’s other APIs to interact with the device.

On failure, response has a HTTP status code of 400 or greater. The response body contains a JSON formatted response object. The response object may contain the following keys:

* `"errors"` - array of error identifier strings

    * `"limit"` - portal’s device limit has been reached

    * `"invalid_sn"` - serial number is invalid

    * `"unavailable_sn"` - serial number is not available

    * `"forbidden_model"` - model is not available in this domain (this also results if `"vendor"` is invalid or otherwise does not correspond to `"model"`)

    * `"require_purchase"` - creating this type of device requires a purchase

    * `"insufficient_resources"` - device could not be added due to insufficient resources in the portal

    * `"portal_not_found"` - portal_rid could not be found

    * `"missing_*"` - some required input was missing. E.g. `missing_portal_rid` indicates missing or empty (blank) portal_rid.

* `"notices"` - array of user-readable error strings

##### Example

Create the device:

```
$ curl 'https://mydomain.exosite.com/api/portals/v1/device' \
       -X POST \
       -d '{"model": "myDeviceModel", "vendor":"joevendor", "serialnumber":"ABC-123", "location":"Samoa", "timezone":"(GMT-11:00) Midway Island, Samoa", "portal_rid": "5ef46b987385aaaaaaaaaa75183fb43edeb3557b", "name":"Device Name"}' \
       -u 'domainuseremail@gmail.com:adminuserP4ssword' \
       -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 01:45:37 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Vary: Accept-Encoding
Content-Length: 99
Content-Type: application/json; charset=UTF-8

{
    "rid": "1767af3da6283354eb4818a709db4a0c15756eel",
    "cik": "a148dd4b498cf18c8f1b066af0dab8d671a79a5l"
}
```

Then activate the device. Normally this would be done from the device firmware, but we do it here from the command line as an example.

```
$ curl 'https://m2.exosite.com/provision/activate' \
       -d 'vendor=joevendor&model=myDeviceModel&sn=ABC-123'
```

```
a148dd4b498cf18c8f1b066af0dab8d671a79a5l
```

### Devices

#### Create device

`POST /api/portals/v1/portals/{portal-id}/devices`

Create a device inside a portal

##### Request

Request body is a [device object](#device-object). Currently only the following keys are supported:

* `"sn"` - Serial number (required)
* `"vendor"` - Vendor name (required)
* `"model"` - Model name (required)
* `"type"` - Device type, must be 'vendor' for this moment (required)

If you send any keys besides these, it will do nothing.

##### Response

On success, response has HTTP status 201 and the created device object.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/portals/2853566858/devices' \
     -X POST \
     -d '{"sn":"123", "vendor":"mydomain", "model":"apimodel", "type":"vendor"}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 201 Created
Date: Tue, 18 Nov 2014 02:14:27 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 201 Created
Vary: Accept-Encoding
Content-Length: 1113
Content-Type: application/json; charset=UTF-8

{
    "dataSources": [],
    "info": {
        "aliases": [],
        "basic": {
            "modified": 1416276786,
            "subscribers": 0,
            "type": "client",
            "status": "notactivated"
        },
        "description": {
            "limits": {
                "client": 0,
                "dataport": "inherit",
                "datarule": "inherit",
                "disk": "inherit",
                "dispatch": "inherit",
                "email": "inherit",
                "email_bucket": "inherit",
                "http": "inherit",
                "http_bucket": "inherit",
                "share": "inherit",
                "sms": "inherit",
                "sms_bucket": "inherit",
                "xmpp": "inherit",
                "xmpp_bucket": "inherit"
            },
            "locked": false,
            "meta": "{\"DeviceType\":\"generic\",\"DeviceTypeID\":\"0000000002\",\"Timezone\":\"Asia\\/Taipei\",\"Location\":\"Taiwan\",\"activetime\":\"\",\"DeviceTypeName\":\"generic\",\"timezone\":\"\",\"location\":\"\",\"device\":{\"type\":\"vendor\",\"model\":\"apimodel\",\"vendor\":\"mydomain\",\"sn\":\"123\"}}",
            "name": "New Device@2014-11-18T02:14:27+00:00 1416276867.8066",
            "public": false
        },
        "key": "32e5952d4891f2a5e03433080a36fae46e79bd2b",
        "shares": [],
        "subscribers": [],
        "tagged": [],
        "tags": []
    },
    "members": [
        {
            "access": "___admin",
            "oid": {
                "type": "User",
                "id": "1026285982"
            }
        }
    ],
    "model": "apimodel",
    "rid": "bd89188973b18826c99a287f4c43880b0643a757",
    "sn": "123",
    "type": "vendor",
    "vendor": "mydomain"
}
```

#### Update device

`PUT /api/portals/v1/devices/{device-rid}`

Update a device

##### Request

Request body is a [device object](#device-object). Currently only the following keys may be updated:

* `"info": {"description": ...}` - description under info (optional)
* `"info": {"description": ...}` - description under info (optional)

If you send any keys besides these, it will do nothing.

##### Response

On success, response has HTTP status of 200 and body is the updated device object.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/devices/5d4bacb783b10600e12b759bb1ae80b43666085b' \
     -X PUT \
     -d '{"info": {"description": {"name": "device update name"}}}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 02:22:12 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 780
Content-Type: application/json; charset=UTF-8

{
    "dataSources": [],
    "info": {
        "aliases": [],
        "basic": {
            "modified": 1416277250,
            "subscribers": 0,
            "type": "client",
            "status": "activated"
        },
        "description": {
            "limits": {
                "client": 0,
                "dataport": "inherit",
                "datarule": "inherit",
                "disk": "inherit",
                "dispatch": "inherit",
                "email": "inherit",
                "email_bucket": "inherit",
                "http": "inherit",
                "http_bucket": "inherit",
                "share": "inherit",
                "sms": "inherit",
                "sms_bucket": "inherit",
                "xmpp": "inherit",
                "xmpp_bucket": "inherit"
            },
            "locked": false,
            "meta": "{\"timezone\":\"\",\"location\":\"\",\"device\":{\"type\":\"generic\"}}",
            "name": "device update name",
            "public": false
        },
        "key": "36e4df531973d866f5ded2b99704672321cc5d7a",
        "shares": [],
        "subscribers": [],
        "tagged": [],
        "tags": []
    },
    "members": [],
    "model": null,
    "rid": "5d4bacb783b10600e12b759bb1ae80b43666085b",
    "sn": null,
    "type": "generic",
    "vendor": null
}
```

#### Get device

`GET /api/portals/v1/devices/{device-rid}`

Get information for a device.
If you want to get more than one device information can reference [Get multiple devices](#get-multiple-devices).

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and a [device object](#device-object):

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/devices/5d4bacb783b10600e12b759bb1ae80b43666085b'\
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 02:19:42 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 776
Content-Type: application/json; charset=UTF-8

{
    "dataSources": [],
    "info": {
        "aliases": [],
        "basic": {
            "modified": 1416213844,
            "subscribers": 0,
            "type": "client",
            "status": "activated"
        },
        "description": {
            "limits": {
                "client": 0,
                "dataport": "inherit",
                "datarule": "inherit",
                "disk": "inherit",
                "dispatch": "inherit",
                "email": "inherit",
                "email_bucket": "inherit",
                "http": "inherit",
                "http_bucket": "inherit",
                "share": "inherit",
                "sms": "inherit",
                "sms_bucket": "inherit",
                "xmpp": "inherit",
                "xmpp_bucket": "inherit"
            },
            "locked": false,
            "meta": "{\"timezone\":\"\",\"location\":\"\",\"device\":{\"type\":\"generic\"}}",
            "name": "Exosite Device",
            "public": false
        },
        "key": "36e4df531973d866f5ded2b99704672321cc5d7a",
        "shares": [],
        "subscribers": [],
        "tagged": [],
        "tags": []
    },
    "members": [],
    "model": null,
    "rid": "5d4bacb783b10600e12b759bb1ae80b43666085b",
    "sn": null,
    "type": "generic",
    "vendor": null
}
```

#### Delete device

`DELETE /api/portals/v1/devices/{device-rid}`

Delete a device not a clone template of a model, not a pay per use device. This also resets the status of the associated serial number.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status of 204 and body is empty.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/devices/5d4bacb783b10600e12b759bb1ae80b43666085b' \
     -X DELETE \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 204 No Content
Date: Tue, 18 Nov 2014 07:45:09 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 204 No Content
Vary: Accept-Encoding
Content-Length: 0
Content-Type: application/json; charset=UTF-8
```

### Domain

#### List domains of authenticated user

`GET /api/portals/v1/domain/`

Returns an array of domains to which the user’s account is added.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and JSON array of domain objects. Domain objects contain the following keys:

* `"domain"` - the domain address. This may be used in a subsequent call to /api/portals/v1/portal/
* `"role"` - the user’s role on this domain. Has one of the following values:

    * `"user"` - non-admin

    * `"admin"` - domain admin

* `"name"` - vendor name (for provisioning API)
* `"token"` - vendor token (for provisioning API)

On failure, response has HTTP status of 400 or greater.

##### Example

```
$ curl 'https://mydomain.exosite.com/api/portals/v1/domain' \
       -X GET \
       -u 'domainuseremail@gmail.com:adminuserP4ssword' \
       -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 02:54:40 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Vary: Accept-Encoding
Transfer-Encoding: chunked
Content-Type: application/json; charset=UTF-8

[
    {
        "role":"user",
        "name":"exosite_portals",
        "domain":"portals.exosite.com"
    },
    {
        "role":"admin",
        "domain":"joesdomain.exosite.com",
        "name":"joesdomain",
        "token":"01233fb43edeb3557b5ef46b987385abcdef0123"
    }
]
```

### File Systems

#### Append to a directory

Require `___admin` permission to the domain to access this end point.

```
<form action="/api/portals/v1/fs/{directory-path}" enctype="multipart/form-data" method="POST">
    <div>
        <input name="{field-name-1}" type="file">
        <input name="{field-name-2}" type="text">
        <button type="submit">Submit</button>
    </div>
</form>
```

* `<directory-path>` can be `[\/\-_0-9A-Za-z]*`.
* `<field-name-*>` is `^[\-0-9_A-Za-z]*$`.

Submission of this form redirects the page to "/api/portals/v1/fs/{directory-path}/{subdirectory}".

The response entity body is:

```
{
    {field-name-1}: {field-content-type-1},
    {field-name-2}: {field-value-2}
}
```

* `{field-name-*}` is the literal send in the request.
* `{field-content-type-1}` is the content type of the file as the value of field 1.
* `{field-value-2}` is the value of `{field-name-2}`.

#### Get a file

`GET /api/portals/v1/fs/{directory-path}/{subdirectory}`

Require no permission to access this end point.

Following [Append to a directory](#append-to-a-directory).

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and returns response json entity.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/fs/path/141517041216756400' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Wed, 19 Nov 2014 09:09:03 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 21
Content-Type: application/json

{
    {field-name-1}: {field-content-type-1},
    {field-name-2}: {field-value-2}
}
```

#### Get a file content

Require no permission to access this end point.

Following [Append to a directory](#append-to-a-directory).

`GET /api/portals/v1/fs/{directory-path}/{subdirectory}/{field-name}`

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and returns the content of the file as the value of field.

On failure, response has HTTP status of 400 or greater.

##### Example

* IF the myfile is a image file:

```
curl 'https://mydomain.exosite.com/api/portals/v1/fs/141517041216756400/myfile' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 06:41:13 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Content-Length: 82
Content-Type: image/png

▒PNG

IHDR%▒V▒PLTEA▒▒▒▒V▒
IDATx▒cb67|▒IEND▒B`▒
```

* IF the myfile is a text file:

```
curl 'https://mydomain.exosite.com/api/portals/v1/fs/path/141517041216756401/myfile' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 06:58:14 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 43
Content-Type: application/json

{"info":[{"description":{"name":"hello"}}]}
```

### Groups

#### Create group under user

`POST /api/portals/v1/users/{user-id}/groups`

Create a group under a user. A group under a user may be updated only by that user. (TODO: confirm this)

##### Request

The request body is a [group object](#group-object). Currently, only the following keys are supported:

* `"name"` - group name (optional)

If you send keys besides these, it will do nothing.

##### Response

On success, response has HTTP status 201 and the created group object.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/3167859736/groups' \
     -X POST \
     -d '{"name":"new group"}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 201 Created
Date: Tue, 18 Nov 2014 02:48:23 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 201 Created
Location: https://mydomain.exosite.com/api/portals/v1/groups/1206252898
Vary: Accept-Encoding
Content-Length: 163
Content-Type: application/json; charset=UTF-8

{
    "id": "1206252898",
    "userId": "3167859736",
    "members": [
        {
            "access": "___admin",
            "oid": {
                "type": "User",
                "id": "3167859736"
            }
        }
    ],
    "meta": null,
    "name": "new group",
    "permissions": []
}
```

#### Update group

`PUT /api/portals/v1/groups/{group-id}`

Update a group

##### Request

Body contains a [group object](#group-object). Currently only the following keys may be updated:

* `"members"` - group members (optional)
* `"meta"` - group meta (optional)
* `"name"` - group name (optional)
* `"permissions"` - group permissions (optional)

If you send any keys besides these, it will do nothing.

##### Response

On success, response has HTTP status 200 and group object.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/groups/1206252898' \
     -X PUT \
     -d '{"name":"update group name"}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 02:52:44 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 171
Content-Type: application/json; charset=UTF-8

{
    "id": "1206252898",
    "userId": "3167859736",
    "members": [
        {
            "access": "___admin",
            "oid": {
                "type": "User",
                "id": "3167859736"
            }
        }
    ],
    "meta": null,
    "name": "update group name",
    "permissions": []
}
```

#### Get group

`GET /api/portals/v1/groups/{group-id}`

Get information about a group.

If you want to get more than one group information can reference [Get multiple groups](#get-multiple-groups).

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and body is a [group object](#group-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/groups/1206252898' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 02:51:19 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 163
Content-Type: application/json; charset=UTF-8

{
    "id": "1206252898",
    "userId": "3167859736",
    "members": [
        {
            "access": "___admin",
            "oid": {
                "type": "User",
                "id": "3167859736"
            }
        }
    ],
    "meta": null,
    "name": "new group",
    "permissions": []
}
```

#### Delete group

`DELETE /api/portals/v1/groups/{group-id}`

Delete a group

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 204 and empty body.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/groups/3065555968' \
     -X DELETE \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 204 No Content
Date: Tue, 18 Nov 2014 07:42:00 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 204 No Content
Vary: Accept-Encoding
Content-Length: 0
Content-Type: application/json; charset=UTF-8
```

### Portal

#### List portals of authenticated user

`GET /api/portals/v1/portal/`

Get a array of portals for the specified user on the domain specified in the URL of the request.

##### Request

Request body is empty. The domain name in the HTTP request is used to indicate which domain’s portals should be listed.

##### Response

On success, HTTP status is 200 and HTTP response body is a JSON array of portal objects. Portal objects contain the following keys:

* `"name"` - Portal name
* `"domain"` - Portal domain
* `"key"` - Portal CIK (returned only if user has "owner" or "manager" level access to the portal)
* `"rid"` - Portal resource ID
* `"role"` - User’s role for this portal. Possible values are:

    * `"owner"` - user is the portal’s direct owner

    * `"manager"` - user has manager access to the portal. This role grants the same rights as owner. A role of `"manager"` indicates the portal is not a child client of this user in the One Platform hierarchy. Once you have a key to the portal the distinction is not important to the API, though.

On failure, response has a HTTP status code of 400 or greater.

##### Example

```
$ curl 'https://mydomain.exosite.com/api/portals/v1/portal' \
       -X GET \
       -u 'domainuseremail@gmail.com:adminuserP4ssword' \
       -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 09:45:50 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Vary: Accept-Encoding
Content-Length: 1442
Content-Type: application/json; charset=UTF-8

[
    {
        "name": "Test Sighoff 2014-06-19 16:47:21",
        "rid": "845e50e84fae7fe3d680f56ab79c7db31e7ab9b3",
        "key": "18279f186f23aea867eaadc1e2af4010017e1dba",
        "role": "owner",
        "domain": "mydomain.exosite.com"
    },
    {
        "name": "Test Sighoff 2014-06-19 16:47:21",
        "rid": "9dd0f4bf2e3a55553cfae85e3b61dcae178e0544",
        "key": "5fbf1cd65803a8b2eeb823eeaf4a92b0bf5f2bd2",
        "role": "owner",
        "domain": "mydomain.exosite.com"
    },
    ...
]
```

### Portals

#### Create portal

`POST /api/portals/v1/users/{user-id}/portals`

Create a portal under a user.

##### Request

Request body is a [portal object](#portal-object).  Currently only the following keys may be included:

* `"planId"` - portals plan ID from signup page, e.g. https://portals.exosite.com/signup?plan=3676938388. Plan must allow free signups.(optional)

If you send any keys besides these, it will do nothing.

##### Response

On success, response has HTTP status 201 and the created [portal object](#portal-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/3167859736/portals' \
     -X POST \
     -d '{"planId":"3676938388"}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 201 Created
Date: Mon, 17 Nov 2014 09:52:58 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 201 Created
Location: https://mydomain.exosite.com/api/portals/v1/portals/3882920427
Vary: Accept-Encoding
Content-Length: 578
Content-Type: application/json; charset=UTF-8

{
    "devices": [
        "3fb37448bc68d4c84d58c755fd29f187edc74694"
    ],
    "id": "3882920427",
    "info": {
        "aliases": [],
        "basic": {
            "modified": 1416217920,
            "subscribers": 0,
            "type": "client",
            "status": "activated"
        },
        "description": {
            "limits": {
                "client": 5,
                "dataport": 50,
                "datarule": 50,
                "disk": "inherit",
                "dispatch": 50,
                "email": 10,
                "email_bucket": "inherit",
                "http": 100,
                "http_bucket": "inherit",
                "share": 100,
                "sms": 10,
                "sms_bucket": "inherit",
                "xmpp": 100,
                "xmpp_bucket": "inherit"
            },
            "locked": false,
            "meta": "",
            "name": "",
            "public": false
        },
        "key": "9ebc9f396e86995fe52cc77a9533675c0ac8876d",
        "shares": [],
        "subscribers": [],
        "tagged": [],
        "tags": []
    }
}
```

#### Update portal

`PUT /api/portals/v1/portals/{portal-id}`

Update information about a portal.

##### Request

Request body is a [portal object](#portal-object).  Currently only the following keys may be updated:

* `"info"` - Portal's Info is a array. Possible values are:
    
    * `"aliases"` - Aliases under info is a array.(optional) Possible values are:

        * `{rid}` - The under this portal's data-sources/ device rid. Possible values are:

            * `"{aliases}"` - The under this portal's data-sources/ device aliases is a array.

If you send any keys besides these, it will do nothing.

##### Response

On success, response has HTTP status 200 and the updated portal object.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/portals/3882920427' \
     -X PUT \
     -d '{"info":{"aliases":{"3fb37448bc68d4c84d58c755fd29f187edc74694":["update aliases"]}}}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 10:03:21 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 639
Content-Type: application/json; charset=UTF-8

{
    "devices": [
        "3fb37448bc68d4c84d58c755fd29f187edc74694"
    ],
    "id": "3882920427",
    "info": {
        "aliases": {
            "3fb37448bc68d4c84d58c755fd29f187edc74694": [
                "update aliases"
            ]
        },
        "basic": {
            "modified": 1416217920,
            "subscribers": 0,
            "type": "client",
            "status": "activated"
        },
        "description": {
            "limits": {
                "client": 5,
                "dataport": 50,
                "datarule": 50,
                "disk": "inherit",
                "dispatch": 50,
                "email": 10,
                "email_bucket": "inherit",
                "http": 100,
                "http_bucket": "inherit",
                "share": 100,
                "sms": 10,
                "sms_bucket": "inherit",
                "xmpp": 100,
                "xmpp_bucket": "inherit"
            },
            "locked": false,
            "meta": "",
            "name": "",
            "public": false
        },
        "key": "9ebc9f396e86995fe52cc77a9533675c0ac8876d",
        "shares": [],
        "subscribers": [],
        "tagged": [],
        "tags": []
    }
}
```

#### Get portal

`GET /api/portals/v1/portals/{portal-id}`

Get information about a portal.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and a body containing a [portal object](#portal-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/portals/2853566858' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 09:49:38 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 578
Content-Type: application/json; charset=UTF-8

{
    "devices": [
        "5d4bacb783b10600e12b759bb1ae80b43666085b"
    ],
    "id": "2853566858",
    "info": {
        "aliases": [],
        "basic": {
            "modified": 1416213843,
            "subscribers": 0,
            "type": "client",
            "status": "activated"
        },
        "description": {
            "limits": {
                "client": 5,
                "dataport": 50,
                "datarule": 50,
                "disk": "inherit",
                "dispatch": 50,
                "email": 10,
                "email_bucket": "inherit",
                "http": 100,
                "http_bucket": "inherit",
                "share": 100,
                "sms": 10,
                "sms_bucket": "inherit",
                "xmpp": 100,
                "xmpp_bucket": "inherit"
            },
            "locked": false,
            "meta": "",
            "name": "",
            "public": false
        },
        "key": "607be8f93031588b7be6985a16808a7c669413d7",
        "shares": [],
        "subscribers": [],
        "tagged": [],
        "tags": []
    }
}
```

#### Delete portal by id

`DELETE /api/portals/v1/portals/{portal-id}`

delete a portal through portal ID.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and the deleting successful message.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/portals/1156616498' \
     -X DELETE \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Wed, 19 Nov 2014 01:59:13 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 52
Content-Type: application/json; charset=UTF-8

["myportal has been successfully deleted."]
```

#### Delete portal by rid

`DELETE /api/portals/v1/portals/{portal-rid}/ByRid`

delete a portal through portal ID.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and the deleting successful message.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/portals/de3d88a4c15a341d386e7c1cfa0fa2a3a4cf2dcb/ByRid' \
     -X DELETE \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Wed, 19 Nov 2014 01:59:13 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 52
Content-Type: application/json; charset=UTF-8

["myportal has been successfully deleted."]
```

### Themes

Themes are designs that are applied to your domain. Only a domain administrator user can use these Theme APIs. All theme APIs share the same prefix: `/api/portals/v1/themes/`.
**Note: Image data can currently not be modified using this API**

#### Create theme (Not ready)

`POST /api/portals/v1/themes/`

##### Request

The post body needs to be JSON encoded and at least include the required fields:

* `"name"`
* `"description"`

#### Update theme

`PUT /api/portals/v1/themes/{themeid}`

Update information about a theme.

##### Request

The body needs to be JSON encoded contains a [theme object](#theme-object). 

##### Response

On success, response has HTTP status 200 and the body is empty.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/themes/1083890176' \
     -X PUT \
     -d '{"name": "update_theme"}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 06:01:39 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 0
Content-Type: application/json; charset=UTF-8
```

#### Get theme

`GET /api/portals/v1/themes/{themeid}`

Get information about a theme.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and body is a [theme object](#theme-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/themes/1083890176' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 05:59:28 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 1880
Content-Type: application/json; charset=UTF-8

{
    "id": "1083890176",
    "name": "-1408691077",
    "description": "123",
    ":default": true,
    "config": {
        "dashboard_background": {
            "background_color": "D9E4F9",
            "background_image": "",
            "background_attachment": "fixed",
            "background_repeat": "repeat",
            "background_position": "left top"
        },
        "header_logo": "https://mydomain.exosite.com/static/png/skin_portals_bannerbrand.png?9ebccc0ccd74b887b6e0b8aabc97f3b2",
        "header_bkimage": "https://mydomain.exosite.com/static/png/skin_portals_bannerbg.png?62d38477d5d7a46968a168c460bf76fc",
        "header_title_color": "D5E04D",
        "header_subtitle_color": "FFFFFF",
        "header_titles_position_top": "1.375em",
        "header_linktext_color": "E5E5E5",
        "header_linktextover_color": "D5E04D",
        "header_dropdown_text_color": "FFFFFF",
        "header_linktext_position_top": "1.5em",
        "header_portalmenu_current_color": "0000FF",
        "footer_text": "ANY DEVICE. ANY DATA. ANY WHERE.",
        "footer_text_color": "D5E04D",
        "footer_bar_color": "D5E04D",
        "footer_linktext_color": "5C5D60",
        "footer_linktextover_color": "000000",
        "block_title_text_color": "000000",
        "block_title_linkover_color": "010101",
        "block_title_back_color": "D5E04D",
        "block_invert_icons": "0",
        "managepage_highlight_text_color": "0000FF",
        "dashboard_thumbnail": "https://mydomain.exosite.com/cache/theme/0_2110723926_dashboard_thumbnail.png",
        "thankyoupage_title_text_color": "D5E04D",
        "browser_tab_text": "Exosite Portals",
        "browser_tab_icon": "https://mydomain.exosite.com/static/png/icon_exosite.png?834282e60aa5c2cf2d3a6894307437dd",
        "admin_menu_style": {
            "admin_menu_title": "Domain Admin",
            "manage_menu_title": "Manage",
            "secondary_menu_title": "Portal Menu",
            "account_menu_title": "Account",
            "menu_title_color": "E5E5E5",
            "background_color": "5C5D60",
            "background_hover_color": "A6A6A6",
            "text_color": "FFFFFF",
            "sub_background_color": "FFFFFF",
            "sub_background_hover_color": "A6A6A6",
            "sub_text_color": "5C5D60",
            "text_active_color": "D5E04D"
        },
        "jsCode": ""
    },
    "code": ""
}
```

#### List themes

`GET /api/portals/v1/themes/`

Returns an array of themes which in this domain.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and an array of [theme object](#theme-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/themes' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 05:56:40 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 3676
Content-Type: application/json; charset=UTF-8

[
    {
        "id": "1083890176",
        "name": "-1408691077",
        "description": "123",
        ":default": true,
        "config": {
            "dashboard_background": {
                "background_color": "D9E4F9",
                "background_image": "",
                "background_attachment": "fixed",
                "background_repeat": "repeat",
                "background_position": "left top"
            },
            "header_logo": "https://testing.signoff.https://mydomain.exosite.com/static/png/skin_portals_bannerbrand.png?9ebccc0ccd74b887b6e0b8aabc97f3b2",
            "header_bkimage": "https://mydomain.exosite.com/static/png/skin_portals_bannerbg.png?62d38477d5d7a46968a168c460bf76fc",
            "header_title_color": "D5E04D",
            "header_subtitle_color": "FFFFFF",
            "header_titles_position_top": "1.375em",
            "header_linktext_color": "E5E5E5",
            "header_linktextover_color": "D5E04D",
            "header_dropdown_text_color": "FFFFFF",
            "header_linktext_position_top": "1.5em",
            "header_portalmenu_current_color": "0000FF",
            "footer_text": "ANY DEVICE. ANY DATA. ANY WHERE.",
            "footer_text_color": "D5E04D",
            "footer_bar_color": "D5E04D",
            "footer_linktext_color": "5C5D60",
            "footer_linktextover_color": "000000",
            "block_title_text_color": "000000",
            "block_title_linkover_color": "010101",
            "block_title_back_color": "D5E04D",
            "block_invert_icons": "0",
            "managepage_highlight_text_color": "0000FF",
            "dashboard_thumbnail": "https://mydomain.exosite.com/cache/theme/0_2110723926_dashboard_thumbnail.png",
            "thankyoupage_title_text_color": "D5E04D",
            "browser_tab_text": "Exosite Portals",
            "browser_tab_icon": "https://mydomain.exosite.com/static/png/icon_exosite.png?834282e60aa5c2cf2d3a6894307437dd",
            "admin_menu_style": {
                "admin_menu_title": "Domain Admin",
                "manage_menu_title": "Manage",
                "secondary_menu_title": "Portal Menu",
                "account_menu_title": "Account",
                "menu_title_color": "E5E5E5",
                "background_color": "5C5D60",
                "background_hover_color": "A6A6A6",
                "text_color": "FFFFFF",
                "sub_background_color": "FFFFFF",
                "sub_background_hover_color": "A6A6A6",
                "sub_text_color": "5C5D60",
                "text_active_color": "D5E04D"
            },
            "jsCode": ""
        },
        "code": ""
    },
    {
        "id": "1272623304",
        "name": "default",
        "description": "default",
        ":default": false,
        "config": {
            "dashboard_background": {
                "background_color": "F9F8DE",
                "background_image": "",
                "background_attachment": "fixed",
                "background_repeat": "repeat",
                "background_position": "left top"
            },
            "header_logo": "https://mydomain.exosite.com/static/png/skin_portals_bannerbrand.png?9ebccc0ccd74b887b6e0b8aabc97f3b2",
            "header_bkimage": "https://mydomain.exosite.com/static/png/skin_portals_bannerbg.png?62d38477d5d7a46968a168c460bf76fc",
            "header_title_color": "D5E04D",
            "header_subtitle_color": "FFFFFF",
            "header_titles_position_top": "1.375em",
            "header_linktext_color": "E5E5E5",
            "header_linktextover_color": "D5E04D",
            "header_dropdown_text_color": "FFFFFF",
            "header_linktext_position_top": "1.5em",
            "header_portalmenu_current_color": "0000FF",
            "footer_text": "ANY DEVICE. ANY DATA. ANY WHERE.",
            "footer_text_color": "D5E04D",
            "footer_bar_color": "D5E04D",
            "footer_linktext_color": "5C5D60",
            "footer_linktextover_color": "000000",
            "block_title_text_color": "000000",
            "block_title_linkover_color": "010101",
            "block_title_back_color": "D5E04D",
            "block_invert_icons": "0",
            "managepage_highlight_text_color": "0000FF",
            "dashboard_thumbnail": "",
            "thankyoupage_title_text_color": "D5E04D",
            "browser_tab_text": "Exosite Portals",
            "browser_tab_icon": "https://mydomain.exosite.com/static/png/icon_exosite.png?834282e60aa5c2cf2d3a6894307437dd",
            "admin_menu_style": {
                "admin_menu_title": "Domain Admin",
                "manage_menu_title": "Manage",
                "secondary_menu_title": "Portal Menu",
                "account_menu_title": "Account",
                "menu_title_color": "E5E5E5",
                "background_color": "5C5D60",
                "background_hover_color": "A6A6A6",
                "text_color": "FFFFFF",
                "sub_background_color": "FFFFFF",
                "sub_background_hover_color": "A6A6A6",
                "sub_text_color": "5C5D60",
                "text_active_color": "D5E04D"
            },
            "jsCode": ""
        },
        "code": ""
    },
    ...
]
```

#### Delete theme

`DELETE /api/portals/v1/themes/{themeid}`

When deleting the current default theme the exosite system theme will be applied to the domain.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and the body is empty.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/themes/1083890176' \
     -X PUT \
     -d '{"name": "update_theme"}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Tue, 18 Nov 2014 06:06:39 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 0
Content-Type: application/json; charset=UTF-8
```

### User

#### Register new user account

`POST /api/portals/v1/user`

Signs up a new user account, sending an activation email to the specified address.

##### Request

Request body is a JSON object with the following keys:

* `"email"` - new user’s email address (required)
* `"password"` - new user’s password (required)
* `"plan"` - portals plan ID from signup page, e.g. https://portals.exosite.com/signup?plan=3676938388. Plan must allow free signups. (required)
* `"first_name"` - user’s first name (optional)
* `"last_name"` - user’s last name (optional)

If `"first_name"` or `"last_name"` are omitted or empty, they are set to `"New"` and `"User"`, respectively.

The domain name in the HTTP request is used to indicate which domain the user should be signed up in.

##### Response

On success, HTTP status code is 200 and HTTP response body is empty.

On failure, HTTP status code is 400 or greater and HTTP response body contains a JSON formatted response object. Response object may contain the following keys:

* `"errors"` - array of error identifier strings

    * `"missing_*"` - some required input was missing. E.g. missing_email indicates missing or empty (blank) email.

    * `"wrong_password"` - email is already registered with Portals and the password is incorrect

    * `"user_exists_wrong_domain”` - user exists on another domain

    * `"user_exists"` - user already exists on this domain

* `"notices"` - array of user-readable error strings

##### Example

```
$ curl 'https://mydomain.exosite.com/api/portals/v1/user' \
       -X POST \
       -d '{"email": "jane+testuser123@gmail.com", "password":"testuserP4ssword", "plan":"3676938388"}' \
       -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 06:24:51 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Vary: Accept-Encoding
Content-Length: 0
Content-Type: text/html
```

#### Reset user account password

`POST /api/portals/v1/user/password`

Sends a password reset email for this user.

##### Request

Request contains a JSON object with the following keys:

* `"email"` - email address of a Portals user
* `"action"` - what to do. Supported values:

    * `"reset"` - send user a password reset request

##### Response

On success, HTTP status code is 200 and HTTP response body is empty.

On failure, HTTP status code is 400 or greater and the HTTP response body contains a JSON formatted response object. Response object may contain the following keys:

* `"errors"` - array of error identifier strings

    * `"missing_*"` - some required input was missing. E.g. missing_email indicates missing or empty (blank) email.

    * `"failed"` - some other error occurred

* `"notices"` - array of user-readable error strings

##### Example

```
$ curl 'https://mydomain.exosite.com/api/portals/v1/user/password' \ 
       -X POST \
       -d '{"action":"reset", "email": "joe@gmail.com"}' \
       -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 08:16:12 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Vary: Accept-Encoding
Content-Length: 0
Content-Type: text/html
```

### Users

#### Create user

`POST /api/portals/v1/users`

Create a user.

##### Request

Request body is a [user object](#user-object).  Currently only the following keys may be included:

* `"email"` - User email (required)
* `"userName"` - User name.(optional)(If has no this attributes then userName will same as email.)
* `"password"` - User password.(optional)(If has this attributes then email will not send.)
* `"Firstname"` - User first name.(optional)
* `"Lastname"` - User last name.(optional)(If has Firstname and Lastname then Fullname will be Firstname + Lastname.)

If you send any keys besides these, it will do nothing.

##### Response

On success, response has HTTP status 201 and the created user object, and an email with a randomly generated password is sent to the new user.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/users' \
     -X POST \
     -d '{"email":"newuseremail@gmail.com"}' \
     -u 'adminuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 201 Created
Date: Mon, 17 Nov 2014 08:12:25 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 201 Created
Vary: Accept-Encoding
Content-Length: 144
Content-Type: application/json; charset=UTF-8

{
    "email": "newuseremail@gmail.com",
    "fullName": "",
    "id": "3167859736",
    "meta": null,
    "phoneNumber": "",
    "activated": true,
    "groups": [],
    "permissions": []
}
```

#### Update user

`PUT /api/portals/v1/users/{user-id}`

Update a Portals user

##### Request

Request body is a [user object](#user-object). At the moment, only the following keys may be updated:

* `"activated"` - whether a user is activated (optional)
* `"email"` - user email (optional)
* `"userName"` - User name.(optional)
* `"fullName"` - user full name (optional)
* `"password"` - User password.(optional)
* `"meta"` - meta (optional)
* `"permissions"` - user permissions (optional)
* `"phoneNumber"` - user phone number (optional)

If you send any keys besides these, it will do nothing.

When User-A update User-B, User-A doesn't need to grant permission of resources from User-B which User-A doesn't have.

##### Response

On success, response has HTTP status 200 and the updated user object.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/3167859736' \
     -X PUT \
     -d '{"email":"updatedemail@gmail.com"}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 08:33:44 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 144
Content-Type: application/json; charset=UTF-8

{
    "email": "updatedemail@gmail.com",
    "fullName": "",
    "id": "3167859736",
    "meta": null,
    "phoneNumber": "",
    "activated": true,
    "groups": [],
    "permissions": []
}
```

#### Get all users

`GET /api/portals/v1/users`

Get information about all users.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and a body containing an array of [user object](#user-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/users' \
     -X GET \
     -d '{"email":"newuseremail@gmail.com"}' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 08:21:47 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Transfer-Encoding: chunked
Content-Type: application/json; charset=UTF-8

[
    {
        "email": "newuseremail@gmail.com",
        "fullName": "",
        "id": "3167859736",
        "meta": null,
        "phoneNumber": "",
        "activated": true,
        "groups": [],
        "permissions": []
    },
    {
        "email": "olduseremail@gmail.com",
        "fullName": "olduser",
        "id": "3407735538",
        "meta": null,
        "phoneNumber": "",
        "activated": true,
        "groups": [],
        "permissions": [
            {
                "access": "___admin",
                "oid": {
                    "type": "Domain",
                    "id": "0000000000"
                }
            }
        ]
    },
    ...
]
```

#### Get all user portals

`GET /api/portals/v1/users/{user-id}/portals`

Get user have access to as a manager or private viewer.

##### Request
Request body is empty.

##### Response

On success, response has HTTP status 200 and a body containing an array of portal object.
Portal objects contain the following keys:

* `"PortalName"` - Portal name
* `"PortalID"` - Portal ID
* `"PortalRID"` - Portal RID
* `"UserEmail"` - The portal’s direct owner's email
* `"Description"` - Portal description

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/3167859736/portals' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 09:36:45 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 339
Content-Type: application/json; charset=UTF-8

[
    {
        "PortalName": "",
        "PortalID": "2853566858",
        "PortalRID": "6800e1ee0948d39744625990d28d360f78ac2e4d",
        "UserEmail": "updatedemail@gmail.com",
        "Description": "Default Portal"
    },
    {
        "PortalName": "",
        "PortalID": "2978406756",
        "PortalRID": "dd6e30fe1a00a9718b919ccd93601ff10310238b",
        "UserEmail": "updatedemail@gmail.com",
        "Description": "Default Portal"
    }
    ...
]
```

#### Get user

`GET /api/portals/v1/users/{user-id}`

Get information about a user.

If you want to get more than one user information can reference [Get multiple users](#get-multiple-users).

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 200 and a body containing a [user object](#user-object).

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/3167859736' \
     -X GET \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 Created
Date: Mon, 17 Nov 2014 08:18:40 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 Created
Vary: Accept-Encoding
Content-Length: 144
Content-Type: application/json; charset=UTF-8

{
    "email": "newuseremail@gmail.com",
    "fullName": "",
    "id": "3167859736",
    "meta": null,
    "phoneNumber": "",
    "activated": true,
    "groups": [],
    "permissions": []
}
```

#### Get user token

`GET /api/portals/v1/users/{user-id}/token`

Get a portals user log in token

##### Request
Request string.
* `"reDirect"` - URL when login fail reDirect to where.
Request body is empty.

##### Response

On success, response has HTTP status 200.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/3167859736/token\?reDirect\=http%3A%2F%2Fwww.google.com.tw%2F' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 08:39:27 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 16
Content-Type: application/json; charset=UTF-8

MzE2Nzg1OTczNq==
```

#### Get user portal

`GET /api/portals/v1/users/{user-id}/portals/{portal-id}`

Get user have access to as a manager or private viewer.

##### Request
Request body is empty.

##### Response

On success, response has HTTP status 200 and the portals object.

On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/3167859736/portals/2853566858' \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 200 OK
Date: Mon, 17 Nov 2014 08:45:53 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 200 OK
Vary: Accept-Encoding
Content-Length: 168
Content-Type: application/json; charset=UTF-8

{
    "PortalName": "",
    "PortalID": "2853566858",
    "PortalRID": "6800e1ee0948d39744625990d28d360f78ac2e4d",
    "UserEmail": "updatedemail@gmail.com",
    "Description": "Default Portal"
}
```

#### Delete user

`DELETE /api/portals/v1/users/{user-id}`

Delete a user who has no Braintree ID, no portal, no discount.

##### Request

Request body is empty.

##### Response

On success, response has HTTP status 204 and empty response.
On failure, response has HTTP status of 400 or greater.

##### Example

```
curl 'https://mydomain.exosite.com/api/portals/v1/users/3167859736' \
     -X DELETE \
     -u 'domainuseremail@gmail.com:adminuserP4ssword' \
     -i
```

```
HTTP/1.1 204 No Content
Date: Tue, 18 Nov 2014 07:34:30 GMT
Server: Apache/2.2.16 (Debian)
X-Powered-By: PHP/5.3.29-1~dotdeb.0
Status: 204 No Content
Vary: Accept-Encoding
Content-Length: 0
Content-Type: application/json; charset=UTF-8
```
