# Gateway Message Queuing README

Gateway Message Queuing (GMQ) is designed to be a local proxy for Exosite, with benefits. GMQ is a process in the ExositeReady™ Gateway Engine (GWE) product that receives HTTP requests from local (on-gateway) processes.

# The Basics

GMQ is designed to be a localhost **store-and-forward-style** HTTP server that processes incoming requests and, when a network connection cannot be made, retries them when the network becomes available. The `gmq` API contains the following subset of the [Exosite HTTP Data API](/reference/products/device-api/http/).

* **activate**
* **write**
* **record**

The `gmq` server's main function is to assure that the data you give it will terminate at Exosite.

# Refactoring Existing Code to Work with GMQ

Since the endpoints of `gmq` are the same as the Exosite HTTP Data API, all you need to do to make your application's existing `activate`, `write`, and `record` calls to Exosite use `gmq` instead is to change the hostname in the url from `<PRODUCT_ID>.m2.exosite.com` to `localhost:8090`.

For example, take the following `curl` command that writes JSON data to Murano Product ID **dubhxzv0r4e1m7vj** using the HTTP Device API.

```
curl -XPOST dubhxzv0r4e1m7vj.m2.exosite.com/onep:v1/stack/alias \
    -H 'X-Exosite-CIK: b08d341ac17f355eec975ab0593b93ae17dd6329' \
    -H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \
    -H 'Content-Length: 32' \
    -d "device_report={\"pressure\": \"63\"}"
```

To change this to point at the `gmq` server endpoint:

```
curl -XPOST localhost:8090/onep:v1/stack/alias \
    -H 'X-Exosite-CIK: b08d341ac17f355eec975ab0593b93ae17dd6329' \
    -H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \
    -H 'Content-Length: 32' \
    -d "device_report={\"pressure\": \"63\"}"
```

Your application code is likely programmed to provision a client and retrieve a CIK using the client model, vendor, and serial number. The GMQ server takes care of managing provisioning and CIKs when you use the "X-Exosite-VMS" header instead of a CIK.

```
curl -XPOST localhost:8090/onep:v1/stack/alias \
    -H 'X-Exosite-VMS: MyVendor MyModel 012345' \
    -H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \
    -H 'Content-Length: 32' \
    -d "device_report={\"pressure\": \"63\"}"
```

This custom header and its use is covered in more detail in the [Identity Management](#identity-management) and [GMQ Custom Header](#gmq-custom-header) sections below.

# Choosing APIs

When writing your custom gateway application, there are a some considerations to take into account when choosing between the **write** and **record** APIs.

## Send My Data Immediately

If you want GMQ to attempt to send data immediately, the **write** API is the best choice. If the request fails due to a bad network connection, then the timestamp of the **write** request and the request itself is queued so it can be **record**ed later when the connection gets reestablished. When the request is recorded to Murano, it will appear in the time-series at the time of the failed **write** request, not the time of the successful **record** request.

## Send My Data in Bursts or Batches

Since the behavior of the GMQ server is configurable, you can use the **record** API to queue all outgoing data so it can be batch uploaded according to the configured period. There are two main configuration settings to worry about when tuning GMQ for your Bursts/Batches of uploaded data:

### batch_record_period

The current `batch_record_period` setting can be viewed with the following command:

```
# gmq cfg get unq batch_record_period
10.0
```

This setting controls the amount of time, in seconds, that GMQ attempts unqueue recorded data and upload it to Murano. 

### batch_qty

The amount of data uploaded every `batch_record_period` is controlled by another *unq* section option called `batch_qty`. The `batch_qty` setting determines the number of records to attempt to upload every `batch_record_period`.

For example, if I wanted to queue sensor data every `5` seconds and then upload all queued data every `5` minutes, I would make the following configuration adjustments:

`1 request / 5 seconds * 300 seconds = 60 requests` 

```
# set batch upload/record period to 5 minutes
gmq cfg set unq batch_record_period 300.0
# set number of requests to send every batch_record_period
gmq cfg set unq batch_qty 60
```

Though this makes sense in a perfect network scenario, setting `batch_qty` to `60` will only ever keep up with the latest incoming dataset. A good rule of thumb is to double the amount of records to upload based on the rate of incoming data. So for the example above, a `batch_qty` of `120` would be better in case a lossy network leads to a large backlog of queued data.

# Identity Management

The GMQ server introduces the Vendor-Model-Serial (VMS) data structure as the fundamental unit of any given node's identity, called the VMS Client. By making a request to localhost:8090 endpoints with a VMS identity (VENDOR, MODEL, SERIAL), GMQ will automatically:

1.  Attempt to provision the VMS Client with Murano and retrieve its CIK.
2.  Immediately forward all "write" requests on to Murano.
3.  If "write" requests fail due to a lossy internet connection or no/invalid CIK, the request will be queued into the "record" database with the timestamp of the request. FUTURE: Requests that get a `400` response code from Murano will not be queued into the "record" db.
4.  Immediately queue all "record" requests into a datastore that uploads a configurable number (`batch_qty`) of requests to Murano according to a configurable frequency (``). See the [Module Documentation](https://gateway-engine.exosite.io/gmq/apidoc/modules.html#) for information on default behavior.

The VENDOR, MODEL, SERIAL data is an old paradigm from the Exosite One Platform product that has been replaced by the Murano Product ID paradigm. In order to use GMQ with a Murano Product, all you have to do is set the VENDOR and MODEL to the Murano Product ID.

# GMQ Custom Header

GMQ uses a new custom header to identify a requestor as a VMS Client.
This new header is:

    X-Exosite-VMS: <VENDOR> <MODEL> <SERIAL>

The standard 1P authorization header, below, is supported in GMQ.

    X-Exosite-CIK: <CIK>

GMQ supports both authorization headers.

# GMQ API Endpoints

GMQ serves three main endpoints for the following procedures:

|   GMQ API     |  Verb  |           Endpoint              |
| :-----------: | :----: | ------------------------------- |
| **activate**  | POST   | `/provision/activate`            |
| **write**     | POST   | `/onep:v1/stack/alias`           |
| **record**    | POST   | `/onep:v1/stack/alias/<alias>`   |
| **reread**    | POST   | `/reread`

## GMQ activate

`POST localhost:8090/provision/activate <HEADERS> <VMS>`

1. Triggers an activation request if there is no CIK associated with the VMS client.
2. The GMQ server will respond `200` with the CIK associated with the VMS client. If GMQ has no CIK, it will respond `204` with an empty payload. GMQ will respond `400` for invalid requests.

Example for Product ID `dubhxzv0r4e1m7vj` and serial number `02ab7fc89`:

    curl -XPOST localhost:8090/provision/activate \
     -H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8'\
     -d 'vendor=dubhxzv0r4e1m7vj&model=dubhxzv0r4e1m7vj&sn=02ab7fc89'

## GMQ write

`POST localhost:8090/onep:v1/stack/alias <HEADERS> <DATA>`

1. Forward the write request to 1P using the CIK associated with the VMS client specified by the new "X-Exosite-VMS" header. If GMQ has no CIK for the given VMS client in the X-Exosite-VMS header, an activation attempt will be made.
2. The GMQ server will respond `204` with an empty payload. GMQ will respond `400` for invalid requests.

Example for Product ID `dubhxzv0r4e1m7vj` and serial number `02ab7fc89`:

    curl -XPOST http://localhost:8090/onep:v1/stack/alias \
     -H 'X-Exosite-VMS: dubhxzv0r4e1m7vj dubhxzv0r4e1m7vj 02ab7fc89' \
     -H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \
     -d "device_report={\"coffee_level\": 63}."

## GMQ record

`POST localhost:8090/onep:v1/stack/<alias> <HEADERS> <DATA>`

1. Append **DATA** to the VMS Client's database. A separate thread of execution will batch record these entries at regular intervals. Like the "write" method, GMQ will use the CIK associated with the VMS client specified by the new "X-Exosite-VMS" header. If GMQ has no CIK for the given VMS client in the X-Exosite-VMS header, an activation attempt will be made.
2. The GMQ server will respond `204` with an empty payload. GMQ will respond `400` for invalid requests.

Example for Product ID `dubhxzv0r4e1m7vj` and serial number `02ab7fc89`:

    curl -XPOST http://localhost:8090/onep:v1/stack/alias/device_report \
     -H 'X-Exosite-VMS: dubhxzv0r4e1m7vj dubhxzv0r4e1m7vj 02ab7fc89' \
     -H 'Content-Type: application/x-www-form-urlencoded; charset=utf-8' \
     -d "`date +'%s'`=Linux 'date' command is a good way to get a timestamp!"
     
## GMQ reread

`POST localhost:8090/reread`

Any time configuration settings are changed, the GMQ server must be notified to reread the configuration settings files and update its internal state. This can be done in two ways:

* POST directly to `localhost:8090/reread`
* Use the command line to run `gmq reread`

# Configuration and the `gmq` Command Line

Any time a configuration setting is changed, the server must [reread](#gmq-reread) its configuration files in order for the change to take effect.

## Manually Editing Configurations

Configuration files, of which there are two, can be edited with your favorite editor (i.e., nano, vim, emacs, etc.).

The two configuration files are `gmq.cfg` and `logging.cfg`. The paths to these files can be retrieved using the `--cfg-path` and `--log-cfg-path` command-line switches, respectively.

## Editing Configurations on the Command Line

A quick and easy way to configure GMQ after installation or during development is to use the provided command line options available.

### Examples

To view the current GMQ configuration file, try the command: `gmq cfg`.
To view the database tuning parameters, try the command: `gmq cfg get db`.
To view the current database debug level, try the command: `gmq log get logger_db`

## The Command Line

Here is the `gmq` command-line help screen.

```
# gmq --help
Gateway Message Queue (GMQ)

GMQ is a localhost HTTP server for use as a general purpose
request queue for data intended for Exosite Murano Products
and Solutions. The primary use cases for GMQ is for lossy
cellular and intermittent WiFi networks, but it can be used
as a store-and-forward queue for outgoing data. 

Usage:
  gmq
  gmq [-v|--version]
  gmq [-g|--cfg-path]
  gmq [-l|--log-cfg-path]
  gmq (cfg|log) set <section> <option> <value>
  gmq (cfg|log) [ get <section> <option> ]
  gmq reread

Arguments:
  cfg     Option for adjusting real-time behavior of the gmq server.
  log     Option for adjusting the logging behavior of the gmq server.

Options:
  -h --help                             Show this screen.
  -v --version                          Show version.
  -g --cfg-path                         Print the path to the gmq configuration file.
  -l --log-cfg-path                     Print the path to the gmq logging configuration file.
  cfg                                   Print the contents of the gmq configuration.
  cfg get                               Print a list of the gmq configuration sections.
  cfg get <section>                     Print a list of the configuration options for <section>.
  cfg get <section> <option>            Print the configuration option.
  cfg set <section> <option> <value>    Set the configuration option. 
  log                                   Print the contents of the gmq logging configuration.
  log get                               Print a list of the logging configuration sections.
  log get <section>                     Print a list of the logging configuration options for <section>.
  log get <section> <option>            Print the logging configuration option.
  log set <section> <option> <value>    Set the logging configuration option. 
```

# Installation

Installing GMQ can be done a couple of different ways. 

1. Use the GWE Over-the-air-Update feature.
2. Use the GWE's installer locally/manually: `$ gwe --install-apps /path/to/gmq.v<VERSION>.tar.gz`.
3. Untar the release tarball and run `install.sh` manually.

Information on GWE installation methods and procedures can be
found on the main [ExositeReady Gateway Engine](/exositeready/gwe/) page.

# GMQ Package and Module documentation

## Packaging

If you have a local copy of the `gmq` repository, you can build the GWE installation package by using the `gwe_build` function:

    $ source gwe.build && gwe_build
    /path/to/sandbox/gmq/gmq.v1_8d09124.tar.gz

## Documentation

The documentation for GMQ is built with the Sphinx tool. The `Makefile` has been modified to include the creation of a single PDF.

To create the docs, simply run:

    $ mkvirtualenv gmq-sphinx
    $ pip install -r requirements-docs.txt
    $ make html

To create a PDF file of all of the documentation, simply run:

    $ make singlepdf

# Known Issues

## The `&` Bug

The `&` character in "write" and "record" requests can cause requests to fail. This issue is known and currently being addressed by Professional Services.

## The Off-by-one CIK Renewal Behavior

If a "write" or "record" request receives a 401 (unauthorized) by GMQ from One Platform, the CIK for the associated VMS Client is flagged for reactivation. Only on successive "write" and "record" requests will the activation actually take place. FUTURE: This might be solvable by moving from a central identity db (`gmq.db`) and just tracking the CIK in the `<VENDOR>.<MODEL>.<SERIAL>.db`. 

## The New HTTP Record API

The very week that `GMQ` was released, so was the newest version of the Exosite HTTP Record API. Currently, `GMQ` uses the old version of this API and plans are underway to update to the newest version, but rest assured that the old version of the Exosite HTTP Record API is still supported and fully functional.
