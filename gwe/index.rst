.. GatewayEngine documentation master file, created by
   sphinx-quickstart on Wed Apr  6 10:36:47 2016.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

Gateway Engine
===============
Welcome to Gateway Engine by Exosite Professional Services.

Gateway Engine was created by Exosite to service a commonly occurring design pattern in IoT applications.

What Gateway Engine is and does...
----------------------------------------------
* It is the product that installs and modifies software over-the-air in a secure and scalable manner.
* It is an application hosting framework for Custom Gateway Applications.
* It provides an Exosite API library in Python called ``device-client``.
* It is integrated with `Supervisor <http://supervisord.org>`_ to manage your Custom Gateway Applications' runtime environment.

What Gateway Engine is **not** and **doesn't** do...
----------------------------------------------------------------
* It doesn't read any sensor data.
* It doesn't auto-discover any connected nodes or sensors and automatically send data.
* It doesn't know what a Custom Gateway Application does.

What is a gateway?
-------------------
In the context of IoT, a 'gateway' can be loosely defined as any device that serves as a communication broker for other devices. Gateways, in this context, often bridge the gap between an IoT platform (Exosite) and some collection of devices that don't posses the ability of communicating on the Internet. Sometimes the ‘devices’ that are generating the data you want on the Internet aren't devices, per se, but data from other networks the gateway can access such as modbus and CAN. Either way, the purpose of any gateway is to move local data to an external agent on the Internet.

Since using gateways is common throughout so many industrial applications, the Professional Services team at Exosite created Gateway Engine as an out-of-the-box developer and deployment tool for Internet gateways.

Terminology
------------
    .. csv-table:: Some new terms defined.
        :header: "Term", "Definition"

        "CIK", "The abbreviation for 'Client Interface Key'. The CIK is the authorization for operations like reading and writing data to dataports, creating new clients, dataports and scripts, and even dropping (a.k.a deleting) the client."
        "Custom Gateway Application", "This is the application that you (the developer) develop as your IoT solution. It is the application that Gateway Engine hosts on your gateway(s)."
        "Gateway Engine", "A Python framework for creating Custom Gateway Applications on linux gateways."
        "``GatewayEngine``", "The Python package in the Gateway Engine framework developed and maintained by Exosite Professional Services."
        "GWE", "An abbreviation for Gateway Engine and/or ``GatewayEngine``."
        "Vendor", "An Exosite One Platform term that refers to an account name."
        "OTAU", "Over the Air Update. This the mechanism that enables software and firmware updates over internet connections."
        "tarball", "A type of compressed file that contains other files, directories and even other tarballs."

.. toctree::
   :maxdepth: 2


   getting_started
   product_overview
   release_packages
   .. custom_gateway_applications
   otau
   .. architecture/index
   device-client/index
   gateway-engine/index
   gmq/index

