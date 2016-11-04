# Product Overview

This product overview takes a deeper look at Gateway Engine as a
developer tool and an application hosting platform.

# Features

Internet gateways often run some flavor of Linux and, as such, have a
Python environment. Leveraging this fact, Gateway Engine is a framework
written (mainly) in Python for developing and hosting Custom Gateway
Applications *in any language* on Linux gateways. IoT gateway softwares
often perform the same functions regardless of the use-case because the
needs are so often the same.

The features of GWE are included below and described in more detail in 
the following sections:

* Over the Air Updating (OTAU)
* Application version control
* Process management
* Logfile management
* Exosite API libraries
* Gateway telemetrics
* Power failure tolerance
* Gateway fleet management

## Over the Air Updating (OTAU)

At some point or another a software requirement changes, a bug is
discovered or a new feature is added. When any of these things happen,
there needs to be a way for the new executable code or binary to make
its way onto the gateway and/or sensors that are attached to the
gateway. Gateway Engine is the vehicle for these changes from your
development or staging environment down to the gateway in a secure and
scalable manner.

By design, the OTAU feature of Gateway Engine installs updates and new
programs the same way that it installs and updates itself and its
complementary components. For general design information and
instructions on how to create OTAU and new program installation
packages, please refer to the [Over the Air Updates](/gwe/otau/) section.

## Application version control

Gateway Engine employs a light-weight version tracking system. It uses
the Custom Gateway Application tarball name and version to help you keep
track of the latest version of the application deployed to a gateway.
Incrementing or changing the version designator in the tarball name
changes the version in the next Gateway Engine report for that app in
the `engine_report` dataport.

## Process and Logfile management

Process management in Gateway Engine is implemented with the
`supervisord` process management tool. It is light-weight, portable and
extensible. The core features of [supervisor](http://supervisord.org)
that Gateway Engine utilizes are logfile rotation and process restarting
in case of bugs that can cause crashes. Gateway Engine uses supervisor
to restart itself as well as all other managed processes.

## Exosite API libraries

Gateway Engine uses and depends on the `device-client` python library
for all Exosite [Provision and
HTTP](/murano/products/device_api/http/) API
calls. Additional documentation as well as source code documentation can
be found on the
[Device Client - Docs](/gwe/device-client) page.

## Gateway telemetrics

As any devops professional can tell you, diagnosing issues on any
computer system either post-mortem or predictively requires basic system
information. Gateway Engine provides both filesystem and OS metadata as
well as modem bandwidth usage (beta). These data are reported to
separate dataports `device_info` and `usage_report`, respectively.

## Network outage and Power failure tolerance

When gateways are deployed into production environments they are subject
to the whims of their environments.

### Application start-on-reboot behavior

Power interruptions are bound to occur and gateways must be resilient to
them. Should a power failure occur, `supervisord` will restart all
managed processes once power is restored.

### Non-volatile data queuing

If your IoT solution can tolerate dataloss, then this section won't
apply to your gateway solution. If data originating at sensors, nodes or
the gateway itself *absolutely must* terminate at Exosite Murano (or
on-premise solutions), then the [Gateway Message
Queuing](/gwe/gmq/) is an option
you can leverage for a powerful, tunable store-and-forward non-volatile
queue designed specifically for network and power outages.

## Gateway fleet management

Murano Solutions can easily be designed and employed to manage small
(&lt;100) to medium (&lt;10,000) gateway fleets. As your fleet of
gateway devices grows, so likely will the complexity and customization
of your IoT solution. Development of custom webapps and APIs is the
solution most often adopted when scaling IoT solutions and Exosite makes
this easy with [Murano](https://exosite.com/murano/) and [Professional
Services](https://exosite.com/services/professional-services/).
