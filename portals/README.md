# Portals API

__This API is in beta testing and may be to subject to the occasional tweak. Any such tweaks will be documented here.__

Portals provides a user authentication and management system on top of the One Platform. The Portals API provides access to Portals functionality using a REST-style HTTP API, using the JSON format in request and response bodies, and basic authentication where Portals account is required. 

### Actions

* [List domains of authenticated user](#list-domains-of-authenticated-user)
* [List portals of authenticated user](#list-portals-of-authenticated-user)
* [Register new user account](#register-new-user-account)
* [Reset user account password via registered email confirmation](#reset-user-account-password)
* [Create new device under a portal of authenticated user](#create-new-device-under-a-portal-of-authenticated-user)

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

    * `"manager"` - user has manager access to the portal

On failure, response has a HTTP status code of 400 or greater.

#### Example
```
$ curl https://mydomain.exosite.com/api/portals/v1/portal/ --user joe@gmail.com:joep4ssword
[
  {
    "name":"MyPortal1",
    "domain":"mydomain.exosite.com"
    "rid":"5ef46b987385aaaaaaaaaa75183fb43edeb3557b", 
    "role":"user"
  }, 
  {
    "name":"MyPortal2",
    "domain":"mydomain.exosite.com"
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
