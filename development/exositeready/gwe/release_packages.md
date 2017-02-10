# Table of Contents

* [Getting Started](/exositeready/gwe/getting_started)
* [Product Overview](/exositeready/gwe/product_overview) 
* [Release Packages](/exositeready/gwe/release_packages)
* [Custom Gateway Applications](/exositeready/gwe/custom_gateway_applications)
* [Over the Air Updates](/exositeready/gwe/otau)
* [GWE Solution App](/exositeready/gwe/solution-app)
* [Device Client - Docs](/exositeready/gwe/device-client)
* [GWE - Docs](/exositeready/gwe/gateway-engine)
* [Gateway Message Queuing - Docs](/exositeready/gwe/gmq)

# Release Packages

This section contains links and downloadable files that are referenced throughout the ExositeReady™ Gateway Engine (GWE) documentation. Below are sections outlining the various options when choosing a copy of GWE. The packages all contain the same version of GWE, but with specific Custom Gateway Applications packaged into it. Each option also contains an additional option of the git branch its build is based—`master` or `dev`. Release packages based on the `dev` branch are for development purposes and come with no guarantee or warranty. Releases based on the `master` branch are stable and undergo a comprehensive QA process.

# GWE Downloads

The download options below contain GWE release packages.

## Listing of Releases

To download the latest version of Gateway Engine...

[**CLICK HERE**](https://s3-us-west-2.amazonaws.com/exosite-client-downloads/gateway-engine-release-area/gmq-master/list.html)

...to view a listing of downloadable releases. 

## Shell Command

The shell command, below works on most Linux and OSX machines to download and echo the name of the downloaded file to the terminal.

```
basename $(curl -v -k --remote-name $(curl --silent -k https://s3-us-west-2.amazonaws.com/exosite-client-downloads/gateway-engine-release-area/gmq-master/latest.lnk) 2>&1 | awk '/GET/{print $(NF-1)}')
```

# Release Package Overview

A release package comes in the form of a compressed tar file. Unpacking
this tar file and running the included installer will install GWE and all its dependencies. The GWE software will not
start/execute until the machine has been rebooted. Most public releases
of GWE come with an example program that other sections
(otau, custom\_gateway\_applications) in this documentation refer to.

Here is what a typical release package of GWE looks like:

```
$ tar tvf GatewayEngine.v1-0-6.tar.gz 
drwxr-xr-x  0 jenkins jenkins     0 Aug 25 17:14 gateway-engine/
-rw-r--r--  0 jenkins jenkins     1 Aug 25 17:14 gateway-engine/requirements.txt
-rw-r--r--  0 jenkins jenkins  4198 Aug 25 17:14 gateway-engine/setup.py
-rwxr-xr-x  0 jenkins jenkins  6579 Aug 25 17:14 gateway-engine/packager.sh
drwxr-xr-x  0 jenkins jenkins     0 Aug 25 17:14 gateway-engine/apps_to_install/
-rw-r--r--  0 jenkins jenkins 35701 Aug 25 17:14 gateway-engine/apps_to_install/meld3.v102.tar.gz
-rw-r--r--  0 jenkins jenkins 42227 Aug 25 17:14 gateway-engine/apps_to_install/elementtree.v126-20050316.tar.gz
-rw-r--r--  0 jenkins jenkins  2526 Aug 25 17:14 gateway-engine/apps_to_install/gmq.v10_0ca92e7.tar.gz
-rw-r--r--  0 jenkins jenkins 461249 Aug 25 17:14 gateway-engine/apps_to_install/supervisor.v30.tar.gz
-rw-r--r--  0 jenkins jenkins   6712 Aug 25 17:14 gateway-engine/gwe.build
-rwxr-xr-x  0 jenkins jenkins   3106 Aug 25 17:14 gateway-engine/install.sh
drwxr-xr-x  0 jenkins jenkins      0 Aug 25 17:14 gateway-engine/init/
-rwxr-xr-x  0 jenkins jenkins   1297 Aug 25 17:14 gateway-engine/init/init.sh
-rwxr-xr-x  0 jenkins jenkins    520 Aug 25 17:14 gateway-engine/init/S80ftdi
-rw-r--r--  0 jenkins jenkins   8540 Aug 25 17:14 gateway-engine/init/supervisord.conf
-rwxr-xr-x  0 jenkins jenkins   4849 Aug 25 17:14 gateway-engine/init/supervisor
-rw-r--r--  0 jenkins jenkins    177 Aug 25 17:14 gateway-engine/init/gwe.conf
-rwxr-xr-x  0 jenkins jenkins    500 Aug 25 17:14 gateway-engine/init/S90supervisord
-rw-r--r--  0 jenkins jenkins     11 Aug 25 17:14 gateway-engine/init/pre_install_commands.sh
-rw-r--r--  0 jenkins jenkins     11 Aug 25 17:14 gateway-engine/init/post_install_commands.sh
drwxr-xr-x  0 jenkins jenkins      0 Aug 25 17:14 gateway-engine/GatewayEngine/
-rwxr-xr-x  0 jenkins jenkins  13230 Aug 25 17:14 gateway-engine/GatewayEngine/installer.py
-rwxr-xr-x  0 jenkins jenkins    506 Aug 25 17:14 gateway-engine/GatewayEngine/constants.py
-rw-r--r--  0 jenkins jenkins     87 Aug 25 17:14 gateway-engine/GatewayEngine/__version__.py
-rw-r--r--  0 jenkins jenkins     63 Aug 25 17:14 gateway-engine/GatewayEngine/Gateway.cfg
-rwxr-xr-x  0 jenkins jenkins  19766 Aug 25 17:14 gateway-engine/GatewayEngine/utils.py
-rw-r--r--  0 jenkins jenkins   6083 Aug 25 17:14 gateway-engine/GatewayEngine/tarball.py
-rwxr-xr-x  0 jenkins jenkins     37 Aug 25 17:14 gateway-engine/GatewayEngine/__init__.py
-rw-r--r--  0 jenkins jenkins    125 Aug 25 17:14 gateway-engine/GatewayEngine/__build_id__.py
-rw-r--r--  0 jenkins jenkins     74 Aug 25 17:14 gateway-engine/GatewayEngine/Engine.config
-rwxr-xr-x  0 jenkins jenkins  49984 Aug 25 17:14 gateway-engine/GatewayEngine/GatewayEngine.py
-rw-r--r--  0 jenkins jenkins   2557 Aug 25 17:14 gateway-engine/GatewayEngine/README.md
-rw-r--r--  0 jenkins jenkins  21884 Aug 25 17:14 gateway-engine/README.md
-rw-r--r--  0 jenkins jenkins 451156 Aug 25 17:14 gateway-engine/device-client.v1-4-13.tar.gz
-rw-r--r--  0 jenkins jenkins     17 Aug 25 17:14 gateway-engine/requirements-osx.txt
drwxr-xr-x  0 jenkins jenkins      0 Aug 25 17:14 gateway-engine/test/
-rw-r--r--  0 jenkins jenkins   4696 Aug 25 17:14 gateway-engine/test/test_gwe.py
-rwxr-xr-x  0 jenkins jenkins  13412 Aug 25 17:14 gateway-engine/test/test_gateway_engine.py
-rw-r--r--  0 jenkins jenkins      0 Aug 25 17:14 gateway-engine/test/__init__.py
-rwxr-xr-x  0 jenkins jenkins   4821 Aug 25 17:14 gateway-engine/test/test_engine.py
```

Notice, the various sections of the release tarball from the above
listing. There is typically only one section at the top level of the
tarball, and that is the `gateway-engine/` directory.

At the `gateway-engine/` directory level, there is

```
install.sh
setup.py
LICENSE.txt
GatewayEngine/
apps_to_install/
init/
```

The `install.sh` script (roughly) does the following in this order:

* Run the `init/init.sh` script.
* Run the `pre_install_commands.sh` script.
* Install all tarballs in `apps_to_install/`.
* Install `GatewayEngine` with `setup.py`.
* Run the `post_install_commands.sh` script.

If you want to simply install everything needed to get your gateway data
to Exosite promptly, we recommend executing `install.sh`. This will
ensure all dependencies and programs get installed. Once complete, the
gateway will need to be rebooted so all initializations can be executed.
After a reboot, `supervisord` will be started by the Linux `init.d`
subsystem. Once `supervisord` is running, it will start `GatewayEngine`
as well as any other program it installed from the
`apps_to_install` directory.

**NOTE:** If you want to manually start `GatewayEngine`, you can use the same
command that `supervisord` uses: `gwe`. If Supervisor is installed on
the gateway prior to running the `install.sh` installer, then gateway
engine installer overwrites it.

# Release Notes

This section contains release notes for each release of GWE.
The subsections are broken down by release and contain notes about known
bugs that were fixed and new features added.

## Version 1.3.x

### Bug Fixes

### New Features

* Custom Gateway Application build command --build-app added.
* Build file linter --check-buildfile added.
* Custom Gateway Application tarball test command --check-tarfile added.
* Unkown exceptions during `gwe` runtime are logged to the `fetch_status` dataport.

## Version 1.1.4

An early, stable developer preview version.

### Bug Fixes

* Logging improvements.
* Some Jenkins CI fixes to packaging and naming releases.
* Fixed 'environment' option in `gwe.conf` so the system runtime env
  propagates to forked processes.
* Better documented exec\_install\_dot\_sh and demystified
  return codes.
* Fixed `gwe` post-OTAU behavior to do `supervisorctl reload` instead
  of just restarting `gwe`.
* Removed commented/dead code.
* Re-enabled the `usage_report` feature (beta) to show new,
  re-worked behavior.
* Fixed upgrade path to remove old `device_client` library with known
  import issue.

### New Features

* Gateway Engine now fully supported on Murano.
* Added `gwe --set-product-id <PRODUCT_ID>` cli to configure Gateway
  Engine for use with Murano.
* Added `gwe --gateway-cik` cli to retrieve Gateway Engine's
  current CIK.
* Rewrote READMEs and docs for Murano support.
* Added `fetch_status` alias to Gateway Engine model. Gateway Engine
  will write the STDOUT/STDERR of any OTAU `install.sh` script to this
  new alias.
* Improved upgrade and OTAU for `gwe`. Upgrades retain configurations
  from previous installation. Upgrading from a previous release with a
  newer Release Package can be done by adding touch file
  `touch gateway-engine/THIS_IS_AN_OTAU.txt` before executing
  `install.sh`.
* User agent now defaults to 'GatewayEngine-v&lt;VERSION&gt;'.
  Overrides to this default are supported via the
  `gwe --set-user-agent <USER_AGENT>` cli and can be viewed with the
  `gwe --engine-conf` command. Reverting to default User-Agent can be
  done with `gwe --set-user-agent \'\'`.
* Added beginnings of developer guide, standards, gitflow, CI
  automation, etc. docs to `gateway-engine/docs`.
* Added old spec file to `gateway-engine/model/` directory.
* The '.' character is no longer illegal to use in the version string
  of an OTAU app.
* OTAU packages are now created (though not published yet) for every
  Release Package of Gateway Engine.
* Gateway Engine now installs `pip` and `setuptools` during Release
  Package installation.
* Improved automated unit test coverage.
* Added framework for Docker-based, virtualized automated
  test environment.
* Added some OSX support for developer environment.
* Removed `gwe --build-id` as this feature is no longer supported.
  Version information still available with `gwe --version`.
* Any time Gateway Engine is configured with the cli, the new
  configuration is printed/echoed to console.
* Added `localhost:8090/reread` endpoint to `gmq` to support runtime
  logging and tunable parameter changes without the need for
  restarting the server.

## Version 1.0.6

### Bug Fixes

* Now copying the existing config instead of creating a new one. This
  addresses the case where the user updated GWE but wanted to keep
  their existing config.
* Exceptions are now properly caught while running checking install
  packages (e.g. `gwe -z`)
* General code cleanup - duplicate code, comments, logging messages.
* User agent for GWE is now dynamically built by the build sytem.
  Because of this, Gateway Engine: Gateway constructor no longer
  needs user\_agent. User-Agent for Gateway Engine HTTP requests now
  use current version.
* Added test for checking Gateway Engine User-Agent against the
  current version.
* Versioning changed to custom semantic versioning scheme where
  version reflects MAJOR.MINOR.BUILD designators. Only MAJOR and MINOR
  are tracked in git. BUILD designator tracked in Jenkins and appended
  to Gateway Engine:\_\_version\_\_:\_\_version\_\_ after
  successful build.
* User configured interface is validated against the existing system
  interfaces and a warning is issued if it is found invalid.

### Changing a Gateway Serial Number or Interface

Changing a gateway's `uuid` or `iface` configuration has been supported
by GWE since the `iface` option was added but has been error
prone and subject to confusion.

If ever during development of a gateway IoT solution you change the
serial number scheme of the device fleet moving forward, you may need
to change the serial number of a given gateway. GWE can be
configured to use an interface (e.g., eth0, wlan0, ppp0, etc.) MAC
address as the serial number with the iface option, or it can be configured to use
a custom serial number with the uuid option.

When GWE starts up, it checks for a `uuid` option. If one is
not set (i.e., it is an empty string) it checks for an `iface` option. If
neither are set, GWE refuses to run and exits `-1`.

In order to change the serial number of a gateway, the gateway
administrator has to first ensure the uuid field is empty.

To check the current serial number setting, checking the `uuid` option
in the GWE config file can be done with the following
command.

```
$ gwe --gateway-cfg
[device]
cik = f1d4f10f3ca413caa08bba34c91d095d010bcd32
model = GatewayEngine_V1
vendor = gateway-engine-demo
uuid = 00:2F:AC:43:55:A0
iface = eth0
```

The following command will clear the current serial number from the
GWE config file.

```
gwe --set-uuid \'\'
```

Check the config file again to confirm it has been set to an empty
string.

```
$ gwe --gateway-cfg
[device]
cik = f1d4f10f3ca413caa08bba34c91d095d010bcd32
model = GatewayEngine_V1
vendor = gateway-engine-demo
uuid = ''
iface = eth0
```

Now that the serial number has been cleared, the gateway administrator
can either choose to use a different interface's MAC address by
changing the `iface` option with the following command.

```
$ gwe --set-iface wlan0
$
```

Or, if a custom serial number is desired, one can be configured with the
following command.

```
$ gwe --set-uuid anyserial!@#$%^&*()number
$ 
```
