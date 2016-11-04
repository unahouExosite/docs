# ExositeReady Gateway Engine

ExositeReady Gateway Engine was created by Exosite to service a commonly occurring
design pattern in IoT applications. This page provides information about
what Gateway Engine does and doesn't do, as well as a list of the terms 
that are used and the additional resources that are available. 

# About Gateway Engine 

## What is a Gateway?

In the context of IoT, a 'gateway' can be loosely defined as any device
that serves as a communication broker for other devices. Gateways, in
this context, often bridge the gap between an IoT platform (Exosite) and
some collection of devices that don't posses the ability of
communicating on the Internet. Sometimes the ‘devices’ that are
generating the data you want on the Internet aren't devices, per se, but
data from other networks the gateway can access such as modbus and CAN.
Either way, the purpose of any gateway is to move local data to an
external agent on the Internet.

Since using gateways is common throughout so many industrial
applications, Exosite created Gateway Engine as an out-of-the-box developer 
and deployment tool for Internet-connected gateways.

## What Gateway Engine Does

* It is the product that installs and modifies software over-the-air
    in a secure and scalable manner.
* It is an application hosting framework for Custom
    Gateway Applications.
* It provides an Exosite API library in Python called `device-client`.
* It is integrated with [Supervisor](http://supervisord.org) to manage
    your Custom Gateway Applications' runtime environment.

## What Gateway Engine Doesn't Do

* It doesn't read any sensor data.
* It doesn't auto-discover any connected nodes or sensors and
    automatically send data.
* It doesn't know what a Custom Gateway Application does.

# Terminology


| Term          | Definition    |
| ------------- | ------------- |
| CIK           | An acronym for Client Interface Key. The CIK is the authorization for operations like reading and writing data to dataports, creating new clients, dataports and scripts, and even dropping (a.k.a deleting) the client.  |
| Custom Gateway Application  | This is the application that you (the developer) develop as your IoT solution. It is the application that Gateway Engine hosts on your gateway(s).  |
| Gateway Engine | A Python framework for creating Custom Gateway Applications on linux gateways. |
| `"GatewayEngine"` | The Python package in the Gateway Engine framework developed and maintained by Exosite Professional Services.|
| GWE | An acronym for Gateway Engine and/or `"GatewayEngine"`. |
| Vendor | An Exosite One Platform term that refers to an account name. |
| OTAU | An acronym for Over the Air Update. This the mechanism that enables software and firmware updates over internet connections. |
| tarball | A type of compressed file that contains other files, directories and even other tarballs.|

# Resources

* [Getting Started](/gwe/getting_started/)
* [Product Overview](/gwe/product_overview/) 
* [Gateway Engine Release Packages](/gwe/release_packages/)
* [Over the Air Updates](/gwe/release_packages/)
* Device Client - Docs
  * README - Device Client (gdc)
  * Module Documentation
* Gateway Engine - Docs
  * Key Features
* Gateway Message Queuing (GMQ) - Docs
  * README - Gateway Message Queuing (`"gmq"`)
  * gmq Package
  * Module Documentation
  

