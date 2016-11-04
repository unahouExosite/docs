# Gateway Engine (gwe) README

Gateway Engine was created by Exosite to service a commonly occurring design pattern in IoT applications. In the IoT context, a 'gateway' can be loosely defined as any device that serves as a communication broker for other devices. Gateways, in this context, often bridge the gap between an IoT platform (Exosite) and some a collection of devices that don't posses the ability of internet (HTTP/CoAP/MQTT) communications.

# Overview

It is often the case that a gateway appears as a component in many IoT applications. Gateway Engine is an out-of-the-box solution for developing and supporting custom IoT gateways for as long as hardware will allow.

Internet gateways often run some flavor of Linux and, as such, have a Python environment. Leveraging this fact, Gateway Engine is a program written in Python that provides you (the developer) with the ability to develop your specific IoT business needs instead of repeatable gateway logic. Gateway software often performs the same functions because the needs are often the same.

# Key Features

Gateway Engine was created by Exosite out of the necessity for the following (but not limited to):

*  Application Hosting
*  OTA Application Management
*  OS/Filesystem Metadata Collection
*  Exosite Device API Client
*  Bandwidth Telemetrics (Beta)

# Installation, Configuration and First Start

Gateway Engine can be installed in several different ways. Depending on the target environment, installing via a **build** is preferable to installing from source. Whichever method you use it is important to note that if using a non-built version, the **__version__**'s from the Exosite Device API Client (`device-client`) and the `GatewayEngine` module will not be traceable to source code version in git at the time of the build. This can make debugging and root-cause analysis difficult if not impossible in field-deployed, production systems.

## From a Release Package

After downloading a release build of Gateway Engine from [the release areas](https://gateway-engine.exosite.io/release_packages.html#id2), follow these simple steps to copy it to your gateway and configure for use with your Murano Product:

### Copy Gateway Engine to Gateway

Using the `scp` command, remotely copy Gateway Engine to the `/opt` directory.

```
ssh <USER>@<GATEWAY_IP> "mkdir -p /opt"
scp GatewayEngine.v1-0-6.tar.gz <USER>@<GATEWAY_IP>:/opt
```

### Install Gateway Engine on Gateway

The command, below, can be used to remotely install Gateway Engine.

```
ssh <USER>@<GATEWAY_IP> "cd /opt
   tar zxvf GatewayEngine.v1-0-6.tar.gz
   cd gateway-engine
   ./install.sh
"
```

### Configure Gateway Engine to your Murano Product

When configuring gateway engine to you Murano Product ID, you are faced with two choices with regards to determining your Gateway Engine serial number:

 1. Configure GWE to use a specific internet interface (e.g. `eth0`, `wlan0`, `ppp0`, etc.) and retrieve its MAC address for use as its serial number. GWE defaults to using this MAC address in UPPER case characters. 

```
gwe --product-id <MURANO_PRODUCT_ID> --set-iface <INET_IFACE>
```

Once this command has completed, use the following command to view the resultant serial number for Gateway Engine:

```
(shell) $ gwe --gateway-cfg
[device]
cik = ''
model = asdfiuyhj567uj
vendor = asdfiuyhj567uj
uuid = ''
iface = en0
```

Notice that the `uuid` option is still empty. GWE will populate this field once it is started.

 2. Configure GWE to use a specific serial number of your choosing instead of the MAC address from option #1.

```
gwe --product-id <MURANO_PRODUCT_ID> --set-uuid <SERIAL_NUMBER>
```

## First Start

Once Gateway Engine has been installed and configured, it is time for the first start. Instead of manually calling the `gwe` executable (though this is an option), it is a good idea to reboot the gateway. This is because during the Gateway Engine installation process, it configures the linux `init.d` subsystem to start `supervisord`, which in-turn is configured to start `gwe`.

```
reboot
```

After reboot, you can check whether or not `supervisord` and `gwe` are running with the following command:

```
supervisorctl status
```

This will print a summary of the applications that are installed and hosted by Gateway Engine.

```
(shell) $ supervisorctl status
gmq                              RUNNING    pid 579, uptime 0:00:20
gwe                              RUNNING    pid 578, uptime 0:00:20
```

If you see any status for `gwe` or `gmq` other than `RUNNING` (e.g. `FATAL`, `BACKOFF`, etc.) or if you see the following error message:

```
(shell) $ supervisorctl status
unix:///tmp/supervisord.sock refused connection
```

or 

```
(shell) $ supervisorctl status
unix:///tmp/supervisord.sock no such file
```

please contact gwesupport@exosite.com with the following details:

 - The hardware platform and version used.
 - The OS and kernel version (`uname -a` output).
 - The installation log (`/opt/gateway-engine/gwe_install_<DATE_TIME>.log`).
 - The version of Python on the gateway (`python --version`)

## From source (setup.py)

Installing `GatewayEngine` to a development machine/laptop is a great idea for accessing some of the command line tools. To do this on a development machine, it is recommended that you create a Python Virtual Environment and install to it. To do this, you'll need to navigate to [the release areas](https://gateway-engine.exosite.io/release_packages.html#id2) and download a copy of a Gateway Engine and execute the following:

```
mkdir gwe
cp <GWE_RELEASE> gwe/
cd gwe/
tar zxvf <GWE_RELEASE>
cd gateway-engine
mkvirtualenv gwe --python=python2.7
GatewayEngine/installer.py "$(ls device-client.v*.tar.gz)"
python setup.py install
```

# Building Gateway Engine

Distributable builds and official releases of Gateway Engine are created with the `jenkins.sh` script at the top-level of this (`gateway-engine`) repository. There are several helpful arguments one can pass to the `jenkins.sh` script for various tasks like running tests, creating `git` tags, tracking `BUILD` version numbers, etc. Our Continuous Integration method of making releases is the following:

## Release Candidates

We make available a release based on the `integration` branch for testing bug fixes, new features, etc.

```
#!/usr/bin/env bash
./jenkins.sh track_rc
git tag # for log
export TAG="$(./jenkins.sh tag_rc)"
echo $TAG
echo "TAG = ${TAG}" > TAG.file
./jenkins.sh create_rc
```

## Distributable Releases

For our distributable releases, a similar process:

```
#!/usr/bin/env bash
./jenkins.sh track_r
git tag # for log
export TAG="$(./jenkins.sh tag_r)"
echo $TAG
echo "TAG = ${TAG}" > TAG.file
./jenkins.sh create_r
```

# Command Line Interface

A cli is provided for configuring the run-time environment as well as initializing a development environment. To acquaint yourself with the cli, install Gateway Engine on your development machine and look through the help dialog:

```
$ gwe -h
usage: gwe [-h] [-v] [-p] [-e] [-g] [-C] [-o] [-x] [-y]
           [-I APP_TARBALL [APP_TARBALL ...]] [-c CIK] [-m MODEL] [-r VENDOR]
           [-P PRODUCT_ID] [-u UUID] [-i IFACE] [-l INTERVAL_SECONDS]
           [-d {DEBUG,INFO,WARNING,ERROR,CRITICAL}] [-t UPDATE_INTERVAL]
           [-a USER_AGENT] [-n APP_NAME] [-s APP_VERSION]
           [--download-latest RELEASE_AREA] [-w BUILDFILE] [-z TARBALL]

optional arguments:
  -h, --help            show this help message and exit
  -v, --version         Print the current GWE version.
  -p, --path            Print the installation path to GWE python package.
  -e, --engine-conf     Print the contents of the Engine.config file.
  -g, --gateway-cfg     Print the contents of the Gateway.cfg file.
  -C, --gateway-cik     Print the GWE cik.
  -o, --once            Do not continuously run GWE. Run once and exit.
  -x, --create-buildfile
                        Create buildfile.
  -y, --build-app-tarball
                        Build application tarball.
  -I APP_TARBALL [APP_TARBALL ...], --install-apps APP_TARBALL [APP_TARBALL ...]
                        Provide the path to a tarball or a list of paths to tarballs to install.
  -c CIK, --set-cik CIK
                        Set the GWE cik with provided value.
  -m MODEL, --set-model MODEL
                        Set the GWE model with provided value.
  -r VENDOR, --set-vendor VENDOR
                        Set the GWE vendor with provided value.
  -P PRODUCT_ID, --set-product-id PRODUCT_ID
                        Configure GWE with your Murano Product ID with provided value.
  -u UUID, --set-uuid UUID
                        Set the GWE uuid/serial-number with provided value.
  -i IFACE, --set-iface IFACE
                        Set the hardware interface (e.g. eth0, wlan0, ppp0, etc.)
                        for GWE to use to get a MAC address as its 
                        uuid/serial-number.
  -l INTERVAL_SECONDS, --set-act-retry-interval INTERVAL_SECONDS
                        Set activation retry interval in seconds. The activation 
                        retry interval is the amount of time gwe waits in between 
                        successive activation requests.
  -d {DEBUG,INFO,WARNING,ERROR,CRITICAL}, --set-debug-level {DEBUG,INFO,WARNING,ERROR,CRITICAL}
                        Set the runtime logging level of GWE.
  -t UPDATE_INTERVAL, --set-update-interval UPDATE_INTERVAL
                        Set period (in seconds) of time between GWE check-ins.
  -a USER_AGENT, --set-user-agent USER_AGENT
                        Set the GWE User-Agent HTTP header.
  -n APP_NAME, --app-name APP_NAME
                        The name of the Custom Gateway Application. This is the NAME in NAME.v1.tar.gz.
  -s APP_VERSION, --app-version APP_VERSION
                        The version of the Custom Gateway Application. This is the VERSION in NAME.vVERSION.tar.gz
  --download-latest RELEASE_AREA
                        Download the latest release of Gateway Engine.
                        
                        Currently there are several release areas to choose from:
                        
                         * gmq-master:      The most common and popular release of 
                                            Gateway Engine that contains the 
                                            store-and-forward Gateway Message
                                            Queuing (GMQ) server.
                         * gmq-dev:         Same as gmq-master, but built from a 
                                            development branch used for testing and 
                                            development. Not intended for Production use.
                         * baseline-master: This is a stripped-down version of Gateway
                                            Engine that contains only a minimal feature-set.
                         * baseline-dev:    Same as baseline-master, but built from a 
                                            development branch used for testing and 
                                            development. Not intended for Production use.
                        
                        Example usage:
                        
                            $ gwe --download-latest gmq-master
  -w BUILDFILE, --check-buildfile BUILDFILE
                        Checks the gwe.build file for common problems. Does not detect all problems.
  -z TARBALL, --check-tarball TARBALL
                        Checks GWE tarball for things like structure, optional elements.
```

# Documentation

The documentation for `gateway-engine` can built with the [Sphinx Documentation](http://www.sphinx-doc.org/) tool. The `Makefile` has been modified to include the creation of a single PDF.

To create the docs, simply run:

```
cd gateway-engine
mkvirtualenv gateway-engine-sphinx
python setup.py install
pip install -r requirements-docs.txt
make html
```

To create a PDF file of all of the documentation, simply run:

```
make singlepdf
```


# Over-the-Air Updates
The primary function of Gateway Engine is to provide Over-the-Air-Updates (OTAU). Utilizing Exosite's Content Area, Gateway Engine makes updating software running on your gateway simple, reliable, and secure. 

Over-the-Air Updates can take many forms:

 - Versioned application software upgrades
 - Installation of new applications
 - Retrieving the status of connected hardware
 - Sending one-off commands to the gateway (reboot, restart app, etc.)

The Over-the-Air Update capability of Gateway Engine is essentially limited by the capabilities of the gateways themselves.

# Process Monitoring
Software crashes. This fact causes countless hours of sleep to be lost by IoT developers everywhere. Gateway Engine calms this issue down by utilizing the very popular, open source project [supervisor](supervisor.org "supervisor"). The `supervisor` tool provides a simple interface to monitoring a gateway application's statistics (runtime, exitcode, status, etc.) as well as immediately re-starting an application in case it crashes. Since Gateway Engine relies on `supervisor` for these features, it comes with all of the configuration possibilities of `supervisor` for free as well.

# Statistics Reporting
The default behavior of Gateway Engine is to report things like:

 - Disk space utilization
 - Internet interface utilization
 - Static OS information

As with any other Linux OS, gateways can suffer from their disk space getting filled up and Gateway Engine gives you visibility on this metric by default. Another key metric is how much data you're sending and receiving on the network. This is especially crucial for cellular gateways. Gateway Engine provides some level of statistics on bandwidth consumption. And in addition to information that always changes, Gateway Engine reports things like kernel version and build information so that you can quickly and easily sort and filter a fleet of gateways based on these data.

# Exosite APIs
Gateway Engine comes with the [HTTP and Provisioning](http://docs.exosite.com/murano/products/device_api/http/ "HTTP Device API") implemented in Python as a globally importable module that, in essence, functions as the gateway *protocol layer*. This means that, if you choose to write your applications in Python, you won't have to spend time writing an Exosite interface library to make HTTP and Provisioning calls. This library is developed in a separate repository called `device-client`.

```
# test_app.py
from exo.api import ExositeAPI
from time import sleep
from math import *

a = ExositeAPI(cik='7f091cf4b16de3fb3172c253eb35109a6992d76b')

while True:
    # each loop iteration is another point on a sinusoid
    data = int(100 * cos(radians(time.clock()) * 100))
    a.http_write('test',data) # send data to 'test' alias
    sleep(5)
```


In the above code snippet, the `http_write()` function handles *all* of the Exosite communication and represents pages of code that you no-longer have to write. More information on the API library in the `device-client` project documentation.

# Hosted Applications
You can write your applications in any language you want. 

**Gateway Engine doesn't care which language your application is written in.**

Exosite understands that every IoT application is different and that every situation is different. The fact that Gateway Engine is written in Python does not preclude a developer from writing the actual business application in Java, Perl, C, or even BASH. If you compile your application from C, or use interpreted languages like Python or Perl, Gateway Engine will still work with your application. This is because Gateway Engine operates at the *process* level. If the application runs as a process on the gateway, Gateway Engine will work with it just fine.

# Example
What do we mean by 'application'?

For example, let's say you are a developer at a company that makes temperature sensors. The sensors report their data over Bluetooth Low Energy so you will need an internet gateway with a BLE radio. Now you need to write an application to run on the gateway that collects data from any number of these temperature sensors. This BLE application is what you want to develop, debug and test. You don't want to spend your time writing an HTTP library for interacting with Exosite's OnePlatform APIs. You don't want to spend your time writing scripts that restart the temperature sensor application if it crashes, or rotating log files if they get too large. You just want to write the application that collects sensor data and reports it.

```
# /usr/local/bin/temp_app.v1/temp_app.cfg
cik = ''
vendor = dubhxzv0r4e1m7vj
model = dubhxzv0r4e1m7vj
uuid = AF:14:B9:00:50:2C
```

```
# /usr/local/bin/temp_app.v1/temp_app.py
""" An example of subclassing Device. """
from exo.device import Device
from time import sleep
from my_BLE_LIB import get_BLE_temp

PATH_TO_DEVICE_CFG = '/usr/local/bin/temp_app.v1/temp_app.cfg'

class TempSensor(Device):
    def __init__(self):
        Device.__init__(
          'temp_sensor_v1',
          PATH_TO_DEVICE_CFG
        )
    def report_tmp(self):
        self.http_write('device_temp", get_BLE_temp())

if __name__ == '__main__':
    d = TempSensor()
    while not d.activated():
        d.activate()
    while True:
        d.report_tmp()
        sleep(300) # report temp to exosite every 5 minutes
```

# Updating and Installing Applications

Now that we have our temp sensor application written, it's time to plug it into Gateway Engine.

In order to get Gateway Engine to download and install a new application or update an existing one, it has to first be uploaded to the Exosite Content Area. For this reason, applications need to be in the form of tarballs. This gives us a single file with which we can download and parse for its name and version.

## Custom Gateway Application Assets

In order to install your application, Gateway Engine needs it in a certain form, with certain files present. Here are the rules...

### The Install Script

Create an install script called `install.sh` with 

 - its `x` bit set
 - a "shebang" on the first line pointing the GNU SHELL

The `install.sh` script must contain all of the instructions Gateway Engine needs to install your application. These instructions are completely up to you (the developer).

```
    (bash) $ cat << EOF > install.sh
#!/bin/sh

INSTALL_PATH="/usr/local/bin"

echo "Installing test_app..."
set -x
mkdir -p ${INSTALL_PATH}
cp test_app.py ${INSTALL_PATH}/
set +x
echo "Installation complete."

EOF
    (bash) $ chmod +x install.sh
    (bash) $ 
```

### The Supervisor Configuration File

Though this file is not a requirement for any Custom Gateway Application, it is recommended for use with any long-running application. An example of when it is **not** used is when the "app" is a single command like `reboot` in the `install.sh` script or a simple maintenance script that changes configurations or uploads some debug data. For long running applications, a file called `supervisor.conf` must be included with the app with the rules you (the developer) decide are the right rules for supervisor to manage your app. All supervisor configuration options are supported but **some** defaults are imposed if they aren't included in your `supervisor.conf` file. These defaults are:

 - 'command': 'command'
 - 'stdout_logfile': '/var/log/<APP_NAME>.log',
 - 'redirect_stderr': 'true',
 - 'stdout_logfile_maxbytes': '200KB',
 - 'stdout_logfile_backups': '1',

If your `supervisor.conf` file contains any of these defaults, your values will be used instead. These defaults are provided as a means to avoid filling up the gateway hard disk.

### The Application Tarball

Your Custom Gateway Application must take the form of a gzip'ed tarfile with a somewhat strict naming convention. It must contain the name of the app and the version as well as the suffix `.tar.gz`.

```
(bash) $ APP_NAME=test_app
(bash) $ VERSION=1
(bash) $ tar zcvf ${APP_NAME}.v${VERSION}.tar.gz supervisor.conf install.sh test_app.py
x supervisor.conf
x install.sh
x test_app.py
```

## Installing a Custom Gateway Application

There are a couple of ways you can install your app onto a gateway with Gateway Engine. 

### Custom Release Packaging

Gateway Engine release packages contain a sub-directory called `apps_to_install` that you can put your app in and then re-package for distribution to hardware vendors.

```
(bash) $ tar zxvf GatewayEngine.v1-0-6.tar.gz
... lots of output ...
(bash) $ cp test_app.v1.tar.gz gateway-engine/apps_to_install/
(bash) $ tar zcvf CustomGatewayEngine.v1-0-6.tar.gz gateway-engine
... lots of output ...
```

In the re-packaging step, we've renamed the release package so as not to confuse the two packages - one with the custom app and one without. With the app in the `apps_to_install` directory you can distribute this new release package to hardware vendors, developers, etc. for installation on production and test gateways. Simply follow the normal Gateway Engine installation instructions and the test app will be installed during the regular installation.

### Command Line Install

With Gateway Engine installed onto your gateway, you can install a custom app with the command-line.

```
(bash) $ gwe --set-debug-level DEBUG --install-apps test_app.v1.tar.gz
... lots of output ...
```

### Over-the-Air (OTA) Install/Update

Over-the-air (OTA) installs, though common, can be a bit more involved. It's not too terribly complicated, but several things are assumed in order for this to work so easily:

 1. You have a Murano account.
 2. You have a Product in your Murano account with Gateway Engine's aliases populated.
 3. You have a gateway with Gateway Engine installed and configured with the Product ID in step 2.

At this point you can perform the OTA install. Take the following steps.

 1. Upload the app tarball to your Murano Product ID's content area.
 2. Write the install command to the Gateway Engine's Product ID's `engine_fetch` alias.

The OTA install command for the `test_app.v1.tar.gz` application is a JSON string as follows:

    {"install": [{"name": "test_app.v1.tar.gz"}]}

#### Upload the App Tarball to your Murano Product ID's content area.

The [MrMurano](https://github.com/tadpol/MrMurano) tool was created for this and many other purposes. It is currently the only supported tool we have for uploading any content to a Murano Product ID's content area. To get your application tarball uploaded, follow the instructions on the `MrMurano` github page to configure the tool and then use the `mr content upload` command to upload your application tarball into the content area.

#### Writing the Install Command to the `engine_fetch` Alias

Once you've uploaded your application tarball to your Product ID's content area, you can tell GWE to download and install it.

There are currently two ways to write the JSON install command into your GWE Murano device:

 1. The Murano Device's UI.
 2. The `MrMurano` command-line tool.

##### Murano Device UI

Navigate the the device and write the JSON install command into the `engine_fetch` alias.

##### MrMurano Command-line Tool

Execute the following command with `MrMurano`:

```
mr product write <GWE_SERIAL_NUMBER> engine_fetch '{"install": [{"name": "test_app.v1.tar.gz"}]}'
```

Once these actions have been taken, Gateway Engine will download the app tarball from the Product ID's content area and install it. The STDOUT output from the install will be written to the Product ID's `fetch_status` alias once the install is complete.

### Murano Product Aliases

In order to receive status reports from `gwe` and perform OTAUs, a Murano Device must exist in your Product ID with all of the following aliases defined:

 - alias: usage_report
   name: GatewayEngine Usage
   format: string
 - alias: engine_report
   name: Engine Report
   format: string/json
 - alias: engine_fetch
   name: Install Apps
   format: string
 - alias: device_info
   name: Device Info
   format: string
 - alias: update_interval
   name: Update Interval
   format: string
 - alias: fetch_status
   name: Fetch Status
   format: string

# Coda
The examples provided in this document illustrate how Gateway Engine can be used as a developer tool and framework for managing fleets of gateways in a production environment. Thank you for taking the time to read this instructional document.
