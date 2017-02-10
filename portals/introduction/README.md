---
title: Introduction to Device Connectivity
template: portals
---
# Introduction to Device Connectivity

Exosite's most basic concept is to make internet connected physical things useful to people and businesses.  Exosite's products help developers, companies, and organizations build IoT (Internet of Things) product solutions - providing pieces of the IoT system including device code, a device connectivity / application platform, and hosted applications and services.

[Exosite Device Software - Libraries, Examples, SDKs](../exositeready)

## Basic Device Communication
The first goal of device connectivity is to have the device interact with Exosite's [One Platform](/oneplatform), which provides a virtual representation of that thing in the cloud.  The most common way for devices to interact is via Exosite's [HTTP Device API](/portals/http) (Application Programming Interface).  Using this API, a standard message would like the following, which is in <a href="https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol" target="_blank">HTTP</a> format.  We will pick it a part here to help give some context to the Exosite [One Platform](/oneplatform) which it is communicating to.

* [One Platform Reference](/oneplatform)
* [HTTP Device API](/portals/http)

```
POST /onep:v1/stack/alias HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: af027fe792f0fc74cedbe3777f5a22961e7b8384
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Content-Length: 14

temperature=44
```

Most of this syntax from this message is standard to the HTTP format.  There are a couple of key parts here to analyze.

```
Host: m2.exosite.com
```
The device is communicating with Exosite's [HTTP Data API](/portals/http), which can be found at this address: m2.exosite.com.  (Note: This is an API, you can not ping this address).  Want to quick try out the API - the current unix timestamp is hosted (without auth) at this address: [https://m2.exosite.com/timestamp](https://m2.exosite.com/timestamp)

```
/onep:v1/stack/alias
```

This is the URL for the Exosite [HTTP Data API](/portals/http).  In this case, we are writing data to an alias that represents the piece of data in the platform, otherwise known as a dataport.

```
X-EXOSITE-CIK: af027fe792f0fc74cedbe3777f5a22961e7b8384
```
This long 40 character hexadecimal number is a Client Interface Key or CIK.  This is the authorization for this HTTP message to be accepted.  Each device in the platform has an associated CIK.  This CIK typically comes the the Provisioning activation call, where the Platform sends the CIK down to the device after the proper provision steps have occurred and the device has made it's activate request.  For getting started though, the Portals evaluation tool (https://portals.exosite.com) allows you to create `generic` devices with a activated CIK to copy over to your device.  
* [Getting Started using Portals](/tutorials/get-started)


```
temperature=44
```
Finally, the body of the message is temperature=44.  This will write a value of 44 to dataport in the One Platform.  Dataports store historical values, each with a unix timestamp.  

To learn more about the Exosite One Platform, check out the [One Platform Guide](/oneplatform).

## Standard Questions about device communication
#### Can I read data or send data to the device?
Yes, the platform allows for reading data.  In regards to sending data (push), there are a few methods of doing this but the most common is to use `long-polling` method for HTTP Data API, the `wait` RPC, or the `observe` method for CoAP API.  These methods are covered under each API's documentation.

Here is an example of reading data.
```
GET /onep:v1/stack/alias?command HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: af027fe792f0fc74cedbe3777f5a22961e7b8384
Accept: application/x-www-form-urlencoded; charset=utf-8
<blank line>
```
Note that instead of a POST, this is a GET request.

```
/onep:v1/stack/alias?command
```
Adding this query parameter `?command` to the URL will look to retrieve the value of the dataport with alias `command`.
The response will look something like this.

```
HTTP/1.1 200 OK
Date: <date>
Server: <server>
Connection: Close
Content-Length: 14

command=dothis
```


Here would be an example of making a long-poll request with the HTTP Data API
```
GET /onep:v1/stack/alias?command HTTP/1.1
Host: m2.exosite.com
X-Exosite-CIK: af027fe792f0fc74cedbe3777f5a22961e7b8384
Accept: application/x-www-form-urlencoded; charset=utf-8
Request-Timeout: 300
<blank line>
```
This call would not return immediately.  The server will respond with a value when there is a new value written or the 300 second timeout occurs.  This gives the device immediate updates when new data is available.



#### Why are there multiple APIs?
Devices can very in the resources they have available, including memory, IP socket, Operating System (or none), etc.   Exosite wants to provide the best possible solution to allow embedded developers a path that fits their product.  HTTP is well established.  [CoAP](https://en.wikipedia.org/wiki/Constrained_Application_Protocol) has a much lower resource constraint on devices, but is not supported out of the box yet with many modules and software packages.  The JSON RPC uses HTTP to transmit large JSON formatted data sets and gives more features than the standard HTTP Data API, but may not be appropriate for a small embedded device.  JSON RPC makes perfect sense to use on a Linux based device though, for example using our Python library.


## Libraries
Code libraries can make life much easier for the different code languages.  Exosite supports a large number of libraries as open source code for use on on gateways, embedded devices, and custom applications like web apps and mobile applications.
* https://github.com/exosite-labs

For devices, there are a number of embedded development kits that are supported with [ExositeReady™](../exositeready) or have had reference code ported to them.  

* [ExositeReady™ Embedded Device SDK](../exositeready) - Links to supported hardware platforms
* <a href="https://support.exosite.com/hc/en-us/categories/200011008-Hardware-Platform" target="_blank">Other Reference Hardware Platform Support</a>

If you have a question about a specific embedded module, microcontroller, gateway, or development kit - please feel free to ask us through support.  








# Help
Looking for answers you may have yet?  Check out the Exosite support site [knowledge base articles on the One Platform](https://support.exosite.com/hc/en-us/sections/200072527).
