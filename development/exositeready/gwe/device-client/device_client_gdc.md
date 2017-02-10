# Device Client (GDC) README

The purpose of the `device-client` package is to provide a library to the Exosite [HTTP Device API](/portals/http/) as well as providing some other gateway-centric services.

## Overview

The Gateway Device Client (GDC) can be referred to as the protocol layer of the gateway. It is a python package that can be used as a common entry point for all requests to Exosite. Though other Exosite API libraries exist, GDC is used by ExositeReady™ Gateway Engine (GWE) and other Exosite gateway technologies to format and process all Exosite API requests. The GDC library has a few features that make it extremely useful for development, debugging, and telemetry purposes.

### Response Handlers

Writing code that handles HTTP(s) responses can quickly add to the overhead of writing a gateway IoT application. Utilizing the built-in response handlers can simplify things.

```
from exo.api import ExositeAPI

api = ExositeAPI(cik='7f091cf4b16de3fb3172c253eb35109a6992d76b')

resp_handler = api.http_write('hello_dataport', 'World')
if resp_handler.success:
    pass
else:
    print('Unable to send message: {}'.format(resp_handler))
```

### Interface Auditing

When using either the `ExositeAPI()` or `Device()` objects, all requests to Exosite will be logged for gathering statistics and telemetrics. The log is in the form of an `sqlite3` database located in `/tmp/ifaces.db` (default) for efficient queries.

```
sqlite3 /tmp/ifaces.db ".dump"
```

### Connect to Custom Servers

Sometimes your IoT solution is in development and you need to point your data originator at some URL other than `VENDOR.m2.exosite.com`. The `device-client` library supports custom server URLs (as well as port).

```
from exo.api import ExositeAPI

PORT = '443'

api = ExositeAPI(
    cik='7f091cf4b16de3fb3172c253eb35109a6992d76b',
    url='192.168.10.242:'+PORT
)

resp_handler = api.http_write('hello_dataport', 'World')
if resp_handler.success:
    pass
else:
    print('Unable to send message: {}'.format(resp_handler))
```

For more information on the configurable parameters to the `ExositeAPI` class, visit [the module documentation](https://gateway-engine.exosite.io/device-client/apidoc/modules.html).

### Command-line Interface

A light-weight CLI is provided for common tasks like checking the version number, install path, etc.

```
$ gdc -h
usage: gdc [-h] [-v] [-b] [-p]

Exosite Gateway Device Client Command Line Interface

optional arguments:
  -h, --help      show this help message and exit
  -v, --version   Print the current version of device-client.
  -p, --path      Print the installation path to the device-client python
                  package.

For more information visit https://github.com/exosite/device-client
$ gdc --version 
1.4.1
```

## Building

The `device-client` library is **built** for installation via GWE.

```
$ cd device-client
$ source gwe.build && gwe_build
Creating __build_id__: device-client.v1_f97dd97
a exo
a exo/__build_id__.py
a exo/__init__.py
a exo/api.py
a exo/constants.py
a exo/device.py
a exo/handlers.py
a exo/ifaces.py
a README.md
a requirements.txt
a setup.py
/Users/willcharlton/sandbox/GatewayEngine/device-client/device-client.v1_f97dd97.tar.gz
```

The resultant tarball is installable with the GWE OTAU feature. This is the same process that creates the production version of `device-client` that GWE installs and utilizes.

## Installation

Currently, the `device-client` library can be installed in several ways. Installing from source is supported but not recommended because the process of **building** `device-client` makes the exact version of the code traceable (making support and debug easier).

### From GWE Installer

If you have, or intend to have, GWE installed, you can install `device-client` from a build.

```
# virtualenv step optional
mkvirtualenv gwe --python=`which python2.7`
pip install -e git+ssh://git@github.com/exosite/gateway-engine.git#egg=gateway-engine
gwe -I device-client.v1_f97dd97.tar.gz 
```

### From Tarball

```
tar zxvf device-client.v1_f97dd97.tar.gz
cd device-client
python setup.py install
```

### From Source (pip)

```
mkvirtualenv device-client --python=python2.7
pip install -e git+ssh://git@github.com/exosite/device-client.git#egg=device-client
```

### From Source (setup.py)

```
git clone git@github.com:exosite/device-client.git
cd device-client
python setup.py install
```


## Documentation

The documentation for `device-client` can be built with the [Sphinx Documentation](http://www.sphinx-doc.org/) tool. The `Makefile` has been modified to include the creation of a single PDF.

To create the docs, simply run:

```
cd device-client
mkvirtualenv device-client-sphinx
python setup.py install
pip install -r requirements-docs.txt
make html
```

To create a PDF file of all of the documentation, simply run:

```
make singlepdf
```

