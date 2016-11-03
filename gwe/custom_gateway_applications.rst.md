Custom Gateway Applications
===========================

By itself, Gateway Engine hosts Custom Gateway Applications and Gateway
Message Queuing server waits for incoming requests from Custom Gateway
Applications, so, without a Custom Gateway Application, it doesn't do
much. This section is dedicated to defining how Custom Gateway
Applications fit into the Gateway Engine hosting framework.

Developing A Custom Gateway Application
---------------------------------------

This section covers how a Custom Gateway Application developer (you) can
go about developing a Custom Gateway Application. In this section we
will download a release package of Gateway Engine that includes an
example Custom Gateway Application called `coffee_reporter`.

To download and install this special version of Gateway Engine that
contains the example application, open a terminal and run the following
commands:

> ``` {.sourceCode .bash}
> mkdir ~/gwe # any directory will work
> cd ~/gwe
> basename $(curl -v -k --remote-name $(curl --silent -k https://s3-us-west-2.amazonaws.com/exosite-client-downloads/gateway-engine-release-area/example-master/latest.lnk) 2>&1 | awk '/GET/{print $(NF-1)}')
> tar zxvf *\.tar.gz # the build's filename changes from release to release
> cd gateway-engine
> ./install.sh
> reboot
> ```

Now that you have Gateway Engine downloaded, installed and running on
your gateway, verify that the `coffee_reporter` application is running
with the following command:

> ``` {.sourceCode .bash}
> supervisorctl status coffee_reporter
> ```

The output of this command should show that it is `RUNNING`.

<div class="admonition note">

If the status is not `RUNNING`, please [contact the
author](gwesupport@exosite.com) with information about the hardware
platform and OS you're using as well as any log files you can provide to
report the problem.

</div>

Next, it's time to examine how this example application fits into the
Gateway Engine framework. Using the `t` option with `tar`, we can just
take a peek at the contents of the tarball without "untarring" it.

> ``` {.sourceCode .console}
> $ cd ~/gwe/gateway-engine/apps_to_install/
> $ tar tvf coffee_reporter.v1.tar.gz 
> x supervisor.conf
> x install.sh
> x my_coffee_lib.py
> x report_coffee.py
> ```

Gateway Engine is designed to be used as *the installer* for Custom
Gateway Applications because it is the over-the-air-update mechanism for
new applications and existing ones. Gateway Engine supports two entry
points for installing Custom Gateway Applications:

-   An `install.sh` script.
-   A `setup.py` script for python `setuptools`.

Of the two supported methods, the `install.sh` script is most common.
This is because it is needed to perform such tasks as copying scripts
and other executables into directories like `/bin`, `/usr/bin` or
`/usr/local/bin`, whereas `setup.py` methods are typically used for
installing library code that other executables will include and consume.
However, if you're a dyed-in-the-wool pythonista, you'll know how to
install executable python programs with `setuptools` but that is beyond
the scope of this document.

### A Simple Example Custom Gateway Application

Below is the main module of the `coffee_reporter` program.

> ``` {.sourceCode .python}
> # report_coffee.py 
> # pylint: disable=I0011,W0312,W0212
>
> from exo.device import Device
> from GatewayEngine.utils import gwe_conf
> from my_coffee_lib import get_coffee_level
> from time import sleep
>
> UserAgent = 'BestCoffeeCompany-V1'
> ConfigPath = 'best_coffee.device'
>
> # allow some time for GatewayEngine to start
> # and activate
> sleep(2*60) # 2 minutes
>
> # Objects of class Device contain Exosite 
> # API library and other useful features.
> # This object uses the configuration file
> # of the GatewayEngine process.
> D = Device( UserAgent, gwe_conf() )
>
> while True:
>     print(  D.http_write(
>                 'coffee_dataport', # name of dataport
>                 get_coffee_level() # current data
>             )
>     )
>     sleep(300) # report coffee level every 5 minutes
> ```

The first import in this module is from the python Exosite API library
of Gateway Engine: `exo`. From this package, we import a single class
`Device`, which takes a User-Agent and the path to an INI-style
configuration file (a.k.a. a device file) as constructor arguments.

The second import is a utility function from `GatewayEngine`'s `utils`
module that returns the path to its device configuration file. This
allows the `Device()` object use `GatewayEngine`'s `cik` and allows us
side-step the issue of having to create a separate [Client
Model](https://support.exosite.com/hc/en-us/articles/200491563-Client-Models)
for our coffee reporter program. The constructor of our `Device()`
object allows us to specify a custom User-Agent which can come in handy
later on in scaled IoT environments.

The program doesn't really give us any useful data because it comes from
a mocked out (fake) coffee maker library, below. This library is solely
to illustrate that you (the Custom Gateway Application developer) might
need libraries custom to your IoT solution that interacts with gateway
peripherals like serial ports, buses, network interfaces, etc:

> ``` {.sourceCode .python}
> # my_coffee_lib.py
> def get_coffee_level():
>     return 'Full'
> ```

Below is partial output of the logfile for this process:

> ``` {.sourceCode .console}
> $ head /var/log/coffee_reporter.log
> 2016-04-08 14:05:56,712-DEBUG-device:__init__:64 ::> Initializing...
> 2016-04-08 14:05:56,712-DEBUG-device:update_device_from_cfg:582 ::> Updating member variables from config file: '/usr/lib/python2.7/site-packages/GatewayEngine-0.0.1-py2.7.egg/GatewayEngine/Gateway.cfg'
> 2016-04-08 14:05:56,713-DEBUG-device:_set_cik:312 ::> Got good cik: '3dea69ec********************************'
> 2016-04-08 14:05:56,719-DEBUG-device:http_write:388 ::> Writing 'Full'' to dataport coffee_dataport
> 2016-04-08 14:05:56,719-DEBUG-device:send_post:280 ::> url = 'https://gateway-engine-demo.m2.exosite.com/onep:v1/stack/alias' :: body = {'coffee_dataport': 'Full'}
> Response code: 204, Response body: u'', success: True
> ```

### Supervisor configuration

Gateway Engine supports all possible `supervisord` configuration
settings you can read about on the [Supervisor](http://supervisord.org)
docs site. There are, however, a few options that Gateway Engine imposes
as defaults if you don't specify them in the `supervisor.conf` file. To
find out what the defaults are on your version of `GatewayEngine`, visit
the [Gateway Engine Module
Documentation](http://gateway-engine.exosite.io/gateway-engine/apidoc/GatewayEngine.html#GatewayEngine.installer.SupervisorDefault):

Below are the defaults listed and explained:

-   

    "redirect\_stderr": "true"

    :   -   This tells `supervisord` to redirect `STDERR` to `STDOUT`.

-   

    "stdout\_logfile\_maxbytes": "200KB"

    :   -   This tells `supervisord` to keep the logfile size less than
            or equal to 200KB.

-   

    "stdout\_logfile\_backups": "1"

    :   -   This tells `supervisord` to keep only 1 backup of
            the logfile.

-   

    "command": "command"

    :   -   This is the command `supervisord` will use to run/execute
            your application. The default command is "command". This
            will always fail and is just a placeholder for the actual
            command needed to start your app (e.g.
            "command": /usr/local/bin/my\_app).

-   

    "stdout\_logfile": "/var/log"

    :   -   This is the logfile `supervisord` will redirect your STDOUT
            and STDERR to. Gateway Engine will use the name of the
            tarball to fill in the rest of the logfile name if you don't
            specify your own.

From this we can see that the logfile default path is
`/var/log/<application_name>.log` where the `<application_name>` of the
logfile comes from the install package name. The
`coffee_reporter.v1.tar.gz` tarball would result in "stdout\_logfile":
"/var/log/coffee\_reporter.log", for instance.

To over-ride any of these default settings with ones that better suit
your solution's needs simply add the configuration option the Custom
Gateway Application's `supervisor.conf`.

In nearly all cases, the `supervisord` configuration directory will be
`/etc/supervisor/conf.d/`. When Gateway Engine installs Custom Gateway
Applications it looks for the app's `supervisor.conf` and creates a
`<application_name>.conf` file in the `supervisord` configuration
directory. If this isn't done correctly then `supervisord` won't have
the required information to start and/or restart the Custom Gateway
Application.

> <div class="admonition attention">
>
> By not including a `supervisor.conf` file, the Gateway Engine
> installer will have no way to configure `supervisord` to automatically
> start the Custom Gateway Application on boot, or to restart it when it
> crashes. Sometimes there are cases when you want this behavior. Custom
> Gateway Applications that have no `supervisord` configuration are
> effectively one-off applications. Restated, these can still be
> considered applications, but they execute only once - when Gateway
> Engine runs the `install.sh`. This can be a handy tool if you want to
> just send a command to a gateway like `reboot`.
>
> </div>

Here is the `coffee_reporter` Custom Gateway Application's
`supervisor.conf` file:

> ``` {.sourceCode .bash}
> [supervisord]
> command = python -u /usr/local/bin/report_coffee.py
> ```

Based on the default settings that Gateway Engine imposes on Custom
Gateway Applications, the resultant `supervisord` configuration file for
this application would be:

> ``` {.sourceCode .bash}
> [program:coffee_reporter]
> command = python -u /usr/local/bin/report_coffee.py
> redirect_stderr = true
> stdout_logfile_maxbytes = 200KB
> stdout_logfile_backups = 1
> stdout_logfile = /var/log/coffee_reporter.log
> ```

### Writing the Installer

Using the same example application from as the super\_conf section, the
`/usr/local/bin/report_coffee.py` is the command that `supervisord` uses
to start the application. The installer must be written to ensure that
the program is where `supervisord` expects it to be when it executes the
"command" in the given `<application_name>.conf` file. In this example,
`report_coffee.py` and `my_coffee_lib.py` are the only files the Custom
Gateway Application installer (`install.sh`) needs to handle.

> ``` {.sourceCode .console}
> $ cat install.sh
> #!/bin/sh
>
> cp report_coffee.py /usr/local/bin
> cp my_coffee_lib.py /usr/local/bin
> ```

In addition to the installer copying files, executing commands and
performing other installation tasks, there are two requirements that
Gateway Engine needs to run your installer:

1.  The `x`, or "execute", flag needs to be enabled on the
    `install.sh` file. When you're writing your `install.sh` script,
    make sure you enable this flag.
2.  The shebang `#!/bin/sh` must be the first line of the of
    the installer.

Below, an `install.sh` file with the `x` flag *disabled*. Gateway Engine
will be unable to execute this installer.

> ``` {.sourceCode .console}
> $ la -la install.sh 
> -rw-r--r--  1 willcharlton  staff  70 Apr 11 11:44 install.sh
> ```

Use the following commands to enable the `x` flag and verify:

> ``` {.sourceCode .console}
> $ chmod +x install.sh
> $ la -la install.sh 
> -rwxr-xr-x  1 willcharlton  staff  70 Apr 11 11:44 install.sh
> ```

Now we have an `install.sh` script that copies our Custom Gateway
Application to its execute directory, the `x` flag set and the shebang
is the first line of the script.

In a nutshell, all Gateway Engine does when installing a Custom Gateway
Application is execute an `install.sh` script. This provides a single
entry point to the developer during development,
over-the-air-deployments and factory installations.

The Three Types of Custom Gateway Applications
----------------------------------------------

At this point in the reading, it should be apparent that in order to
start and run applications, Gateway Engine uses
[Supervisor](http://supervisord.org). This is also how it does logfile
management and process control. Not every Custom Gateway Application
needs to leverage all of these features, however. Sometimes you just
need to have a single command executed on a gateway, or maybe there is
an API library that requires an update. For applications like these,
there is no use for process control, logfile rotation, or even
supervisor configuration files.

Broadly speaking, there are 3 types of Custom Gateway Applications:

1.  **A long-running application**. Gateway applications usually have
    some sort of `While-True` loop that essentially attempts to make the
    program run forever. In order to start and continuously manage a
    long-running application, a `supervisor.conf` file should be
    provided (or rely on the defaults) to configure `supervisord`.
    Though there are many configuration options available, Gateway
    Engine essentially only needs to know one thing to start/execute and
    continue running a given Custom Gateway Application:

    > 1.  The path to the application.
    >
    > Beyond this requirement, all other configuration settings
    > are optional. The way you provide the path to your application is
    > with the `supervisor.conf` file.
    >
    > ``` {.sourceCode .console}
    > $ cat supervisor.conf 
    > [supervisord]
    > command = python -u /usr/local/bin/report_coffee.py
    > ```

2.  **A one-shot app**. This type of application is a command, or series
    of commands, that is run only once. A one-shot app is simply a
    command or series of commands in an `install.sh` script packaged in
    an application tarball. Below is an example of a one-shot app:

    > ``` {.sourceCode .console}
    > $ tar tf send_some_logs.v1.tar.gz 
    > send_some_logs.v1/
    > send_some_logs.v1/install.sh
    > $ tar -Oxf send_some_logs.v1.tar.gz send_some_logs.v1/install.sh
    > #!/bin/sh
    >
    > # Usage:
    > # Paste the following into the 'engine_fetch' dataport
    > #   {"install":[{"name":"send_some_logs.v1.tar.gz"}]}
    > # Or use exoline:
    > #   exo write <CIK> engine_fetch --value='{"install":[{"name":"send_some_logs.v1.tar.gz"}]}'
    >
    > CRASH_REPORT=`tail -n 50 /var/log/coffee_reporter.log`
    >
    > python << EOF
    > from exo.device import Device
    > from GatewayEngine import utils as gweu
    >
    > D = Device('GWE-crash-report', gweu.gwe_conf())
    > D.http_write('engine_report', """$CRASH_REPORT""")
    > EOF
    > $
    > ```
    >
    > Notice that one-shot apps do not have a `supervisor.conf` file
    > that configures commands and logfiles for supervisor. It is just
    > an `install.sh` script that runs some shell commands. The example
    > shown above uses the `Device` python class from the
    > `device-client` library and the `GatewayEngine` configuration file
    > to dump the last 50 lines of a log file into the
    > `engine_report` dataport.

3.  **A library**. Similar to a one-shot application, this type of
    application can hardly be said to be an application at all. A
    typical library install package looks the same as a normal Gateway
    Engine application tarball with the exception of not having a
    `supervisor.conf` file since it doesn't need to ever run. Sometimes
    it is important to be able to fix libraries such as protocol
    libraries, API libraries, etc. Below is what an update to a Modbus
    library might look like.

    > ``` {.sourceCode .console}
    > $ tar zxvf modbus_lib.v37.tar.gz
    > x install.sh
    > x modbus_lib/
    > $ cat install.sh
    > #!/bin/sh
    >
    > cd modbus_lib/
    > python setup.py install
    > $
    > ```
    >
    > Since the Gateway Engine installer supports running `setup.py`
    > installers as well as `install.sh` scripts, python libraries can
    > be installed without an `install.sh` script. Here is an example
    > below:
    >
    > ``` {.sourceCode .console}
    > $ tar zxvf modbus_lib.v38.tar.gz
    > x setup.py
    > x modbus_lib/
    > $
    > ```

Packaging the Custom Gateway Application
*******\************\********\**** Creating a Custom Gateway Application
requires packaging it in such a way that Gateway Engine can install it.
To do this, we mainly need to just put all of the Custom Gateway
Application assets into a tarball. Gateway Engine tarballs must conform
to a strict naming convention described below:

-   The tarball filename cannot contain any whitespace.
-   The tarball filename has four sections that are `.` separated.
-   The `.` character is a reserved Gateway Engine application character
    and must not be used for anything except the tarball name separator.
-   The first section is the filename off the application. In our
    example application the name of the application is
    `coffee_reporter`. This also determines the application's
    log filename.
-   The second section contains the application version and begins with
    the character `v`. The version can be anything except nothing. It
    can be a number or a string literal. Sometimes it is useful to use
    the first few characters of a git hash.
-   The third section is `tar`.
-   The fourth section is `gz`.

The filename of the example Custom Gateway Application tarball,
therefore, is `coffee_reporter.v1.tar.gz`.

Creating the install package for the `coffee_reporter` application can
be done like the example below:

> ``` {.sourceCode .console}
> $ tar zcvf coffee_reporter.v1.tar.gz *
> a supervisor.conf
> a install.sh
> a my_coffee_lib.py
> a report_coffee.py
> ```

Given that the `x` flag is set on `install.sh` and the other application
requirements are met, this is now a Custom Gateway Application that can
be installed locally with the
`gwe --install-apps coffee_reporter.v1.tar.gz` command or via the OTAU
feature.

Installing Custom Gateway Applications
--------------------------------------

There are 3 ways to install your Custom Gateway Application using
Gateway Engine:

1.  Use the OTAU feature of Gateway Engine.
2.  Manually invoke the installer with the `gwe --install-apps` command
    on the gateway.
3.  Copy the packaged Custom Gateway Application into the
    `apps_to_install/` directory of the Gateway Engine release package
    and so it can be distributed as a custom gateway solution to
    initialize gateway devices at the factory assembly line.

