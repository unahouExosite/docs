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

# Over the Air Updates

## Overview

Performing Over the Air Updates to gateways is the core function of
ExositeReady™ Gateway Engine (GWE) and, more specifically, the `gwe` process.

Over the Air Updating can be tricky. To help you understand how GWE's OTAU feature works, the diagram below was created to show
the sequence that results in a GWE Over the Air Update.

![otau](/exositeready/gwe/otau_image.png)

In words, this diagram states that GWE will check for the
`engine_fetch` alias for specially formatted JSON objects that contain
instructions for new custom gateway applications or updates to existing
ones to be downloaded and installed. If there is nothing to download and
install, it will sleep for the amount of seconds configured in the
`update_interval` alias.

**NOTE:** The default value `update_interval` `GatewayEngine` uses when it
starts for the 1st time is `14400` seconds. This comes out to 12 hours
(twice/day). If you want to shorten this, write the amount of seconds
you want `GatewayEngine` to sleep before it checks in again in the
`update_interval` alias. Once it reads this new value, it will "clear"
the alias (i.e., write an empty string).

The `update_interval` can be changed before `gwe` ever starts with the
following command:

### command (*gateway*)

```
gwe --set-update-interval <INTERVAL>
```

If this command is run while `gwe` is running, the process will
need to be restarted in order for the change to be applied.

### command (*gateway*)

```
supervisorctl restart gwe
```

### A Note on Cellular vs. Development Gateways

During the development of your custom gateway application, if you are
not on a cellular network or otherwise are not concerned with network
bandwidth usage, use a really fast `update_interval`. You can set the
`update_interval` to as low as one second. Doing so will ensure that
as soon as you have updates to deploy to the gateway, they will be
installed immediately.

## Uploading Content

In order for GWE to be able to download an OTAU package, it 
must be uploaded to your GWE product's content area. To upload
content to your Product's content area, use the following MrMurano commands:

### command (*dev machine*)

```
mr content upload your_app.v1.2.3.tar.gz your_app.v1.2.3.tar.gz
```

Verify `your_app.v1.2.3.tar.gz` was uploaded:

### command (*dev machine*)

```
mr content list
```

## Deploy the OTAU

Now that your OTAU package is in the content area, it is available for 
download by GWE. In order for your gateway to download the 
OTAU, you must tell it to do so. Remember that GWE checks 
every `update_interval` seconds for new OTAUs to download and if there
aren't any specified in it's `engine_fetch` dataport it won't do anything.

To deploy the OTAU `your_app.v1.2.3.tar.gz` to your gateway, you'll need
the following:

*  The serial number of the gateway, usually the MAC (e.g. 00:10:C2:9B:A8:46)
   address of the internet interface (`eth0`, `ppp0`).
*  The filename of the OTAU content for GWE to download and install
   (e.g. `your_app.v1.2.3.tar.gz`)

Use the following MrMurano command to deploy the `your_app.v1.2.3.tar.gz` OTAU
to gateway with serial number `<SERIAL_NUMBER_OF_GATEWAY>`:

### example (*dev machine*)

```
mr product device write <SERIAL_NUMBER_OF_GATEWAY> engine_fetch '{"install": [{"name": "your_app.v1.2.3.tar.gz"}]}'
```

The JSON object must be formatted like this:

```
{"install": [{"name": "<APP_NAME>.v<VERSION>.tar.gz"}]}
```

## Verify/Debug

One of the reasons that GWE is such a powerful developer and fleet management tool for IoT gateway systems is the OTAU feature. Once an OTAU is deployed and GWE checks in to download and install it, it "clears" the `engine_fetch` dataport to signify that it is now downloading and installing the OTAU package.

Once the download and install is complete, it writes the STDOUT/STDERR
of the OTAU package's `install.sh` script to the `engine_fetch` dataport.

After a reasonable amount of time, you should be able to see the status
of your OTAU deployment with the following command:

### example (*dev machine*)

```
mr product device read <SERIAL_NUMBER_OF_GATEWAY> fetch_status
```

# A Development Cycle

Here is a common development cycle for developing custom gateway applications
with GWE:

1. Create/fix custom gateway application.

  ### command (*dev machine*)

  ```
  gwe --create-buildfile
  # edit build file
  gwe --check-buildfile <BUILD_FILE>
  gwe --build-app <BUILD_FILE>
  gwe --check-tarball <APP_NAME>.v<VERSION>.tar.gz
  ```

  **NOTE**: The `gwe --build-app <BUILD_FILE>` command prints the full path to  the new application tarball to STDOUT, but it runs checks on the build file and the new tarball by default. You can view the output by adding the optional debug flags on the command line:

  ```
  gwe -d DEBUG --build-app <BUILD_FILE> 
  ```

2. Upload, deploy to gateway.

  ### command (*dev machine*)

  ```
  mr content upload <APP_NAME>.v<VERSION>.tar.gz <APP_NAME>.v<VERSION>.tar.gz
  mr product device write <MAC_ADDRESS> engine_fetch '{"install": [{"name": "<APP_NAME>.v<VERSION>.tar.gz"}]}'
  ```

3. Check status of installation.

  ### command (*dev machine*)

  ```
  mr product device read <MAC_ADDRESS> fetch_status
  ```

4. Verify application behavior.
5. If application still isn't working right, go to Step 1.

## Summary/Recap

The GWE Over-the-Air-Update feature is your most powerful tool
as a developer because it uses the same installation mechanism for OTAUs
and command-line installs. When used as the method for deploying 
development code to your gateway, it paves the pathway for managing your
fleet of gateways as your IoT system grows over time.


