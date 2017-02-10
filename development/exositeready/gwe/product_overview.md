# Product Overview

This product overview takes a deeper look at ExositeReady™ Gateway Engine (GWE) as a
developer tool and application hosting platform.

# Features

Internet gateways often run some flavor of Linux and, as such, have a
Python environment. Leveraging this fact, GWE is a framework
written (mainly) in Python for developing and hosting Custom Gateway
Applications—in any language—on Linux gateways. IoT gateway softwares
often perform the same functions, regardless of the use case, because the
needs are so often the same.

The features of GWE are included below and described in more detail in 
the following sections:

* Over the Air Updating (OTAU)
* Application Version Control
* Process Management
* Logfile Management
* Exosite API Libraries
* Gateway Telemetrics
* Power Failure Tolerance
* Gateway Fleet Management

## Over the Air Updating (OTAU)

At some point or another, a software requirement changes, a bug is
discovered, or a new feature is added. When any of these things happen,
there needs to be a way for the new executable code or binary to make
its way onto the gateway and/or sensors attached to the
gateway. GWE is the vehicle for these changes from your
development or staging environment down to the gateway in a secure and
scalable manner.

By design, the OTAU feature of GWE installs updates and new
programs the same way it installs and updates itself and its
complementary components. For general design information and
instructions on how to create OTAU and new program installation
packages, please refer to the [Over the Air Updates](/exositeready/gwe/otau/) section.

## Application Version Control

GWE employs a light-weight version tracking system. It uses
the Custom Gateway Application tarball name and version to help you keep
track of the latest version of the application deployed to a gateway.
Incrementing or changing the version designator in the tarball name
changes the version in the next GWE report for that app in
the `engine_report` dataport.

## Process and Logfile Management

Process management in GWE is implemented with the
`supervisord` process management tool. It is light-weight, portable, and
extensible. The core features of [Supervisor](http://supervisord.org)
that GWE utilizes are logfile rotation and process restarting
in case of bugs that can cause crashes. GWE uses supervisor
to restart itself as well as all other managed processes.

## Exosite API Libraries

GWE uses and depends on the `device-client` python library
for all Exosite [Provision and
HTTP](/reference/products/device_api/http/) API
calls. Additional documentation as well as source code documentation can
be found on the
[Device Client - Docs](/exositeready/gwe/device-client) page.

## Gateway Telemetrics

As any devops professional can tell you, diagnosing issues on any
computer system, either post-mortem or predictively, requires basic system
information. GWE provides both filesystem and OS metadata as
well as modem bandwidth usage (beta). These data are reported to
the separate dataports `device_info` and `usage_report`, respectively.

## Network Outage and Power Failure Tolerance

When gateways are deployed into production environments, they are subject
to the whims of their environments.

### Application Start-on-reboot Behavior

Power interruptions are bound to occur, and gateways must be resilient to
them. Should a power failure occur, `supervisord` will restart all
managed processes once power is restored.

### Non-volatile Data Queuing

If your IoT solution can tolerate dataloss, then this section will not
apply to your gateway solution. If data originating at sensors, nodes, or
the gateway itself must terminate at Exosite Murano (or
on-premise solutions), then the [Gateway Message
Queuing](/exositeready/gwe/gmq/) is an option
you can leverage for a powerful, tunable store-and-forward non-volatile
queue designed specifically for network and power outages.

## Gateway Fleet Management

Murano Solutions can easily be designed and employed to manage small
(&lt;100) to medium (&lt;10,000) gateway fleets. As your fleet of
gateway devices grows, so likely will the complexity and customization
of your IoT solution. Development of custom webapps and APIs is the
solution most often adopted when scaling IoT solutions, and Exosite makes
this easy with [Murano](https://exosite.com/murano/) and [Professional
Services](https://exosite.com/services/professional-services/).
