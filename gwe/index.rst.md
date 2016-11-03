Gateway Engine
==============

Welcome to Gateway Engine by Exosite Professional Services.

Gateway Engine was created by Exosite to service a commonly occurring
design pattern in IoT applications.

What Gateway Engine is and does...
----------------------------------

-   It is the product that installs and modifies software over-the-air
    in a secure and scalable manner.
-   It is an application hosting framework for Custom
    Gateway Applications.
-   It provides an Exosite API library in Python called `device-client`.
-   It is integrated with [Supervisor](http://supervisord.org) to manage
    your Custom Gateway Applications' runtime environment.

What Gateway Engine is **not** and **doesn't** do...
----------------------------------------------------

-   It doesn't read any sensor data.
-   It doesn't auto-discover any connected nodes or sensors and
    automatically send data.
-   It doesn't know what a Custom Gateway Application does.

What is a gateway?
------------------

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
applications, the Professional Services team at Exosite created Gateway
Engine as an out-of-the-box developer and deployment tool for Internet
gateways.

Terminology
-----------


