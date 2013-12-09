One Platform User Guide
=======================

The One Platform is a highly scalable system for aggregating, 
processing, manipulating, converting, analyzing, publishing
and sharing data.

The concepts behind the One Platform can be summarized as follows:

-   It accepts data over the Internet, using secure, standard protocols
-   It processes and stores data according to user specified definitions.
-   Incoming data is timestamped and processed real-time as received
    which allows users to specify 'rules' to act upon the
    processing outcome of their data virtually in real-time.
-   The results of the processing can optionally be fed into other
    processing definitions. This allows for complex processing.
-   The processed data is stored in time series databases allowing users
    to read back and run analytics on their historical data, or include
    it in further processing definitions.
-   It allows users to package their data and send it to email, sms and
    other protocol recipients.
-   It allows users to share their data with other users in a secure,
    controlled manner.

Terminology
-----------

Terms used throughout this document are collected here for quick reference.

-   [Terminology](terminology.md)

Resource
--------

The operation of the One Platform relies on a distributed and
scalable software framework and the invented concept of *resources*.
Connecting to, and leveraging the services of, the One Platform is
enabled by a set of interfacing technologies, but from the user's
standpoint, the use of the One Platform revolves around resources.

-   [Resource](resource.md)

Interfaces
----------

Several programming and access interfaces are available for resource
management, low bandwidth data reporting, content browsing and device
provisioning, using various protocols and transports.

-   JSON RPC over HTTP
-   RESTful interface over HTTP (In Progress)
-   XMPP Chat Bot
-   UDP Data Reporting (Beta)
-   Custom Device Protocols

Provisioning
------------

Resource provisioning enables assembly line tethering of devices to the
One Platform as they come off the line, readying devices for use off the
shelf. A full device model and serial number management and infield
firmware content delivery system is exposed over a simple HTTP control
interface.

-   [Provisioning](provisioning.md)

Customization
-------------

The One Platform was built with an extensible core feature set on top of
which platform 'services' are built. These services have access to the
same redundancy and distribution components the core feature set uses
while using the same robust API provided to all applications. This
allows prototyping functionality prior to integration into the One
Platform systems.

Contact [support@exosite.com](mailto:support@exosite.com) for more
information.
