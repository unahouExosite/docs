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

# Custom Gateway Applications

ExositeReady™ Gateway Engine (GWE) hosts Custom Gateway Applications (CGA), and the Gateway Message Queuing (GMQ) server waits for incoming requests from CGAs. Without a CGA to host, GWE cannot really do much. This section is dedicated to defining how CGAs fit into the GWE hosting framework. The illustration, below, shows the basic layout of a typical IoT gateway from the physical layer up to the cloud.

![communication_topology](/exositeready/gwe/communication_topology.png)

This illustration shows a custom application written in the context of and hosted by GWE. As shown, the custom application has flexible options as far as how it can communicate on the Internet and with Exosite. As a developer of a CGA, you may choose to use the GMQ for writing sensor data, Device Client (GDC) for reading configuration data, and some other tool like `curl` or another library for some other service (e.g., ntpdate, ping, a nodejs library, etc.).

The CGA is the customized logic the developer writes for a specific IoT solution. A CGA should be designed for installation via the GWE installer and OTAU feature.

## The Three Types of CGAs

In order to host applications, GWE combines [supervisor's](http://supervisord.org) process management functionality with its own set of installation, version tracking, and telemetrics.

Not every CGA needs to leverage all of these features. Sometimes you just need to have a single command executed on a gateway, or maybe there is an API library that requires an update. For applications like these, there is no use for process control, logfile rotation, or even supervisor configuration files. In cases like these, `supervisor.conf` can be omitted entirely from OTAU packages.

Broadly speaking, there are three types of CGAs:

* Long-Running
* One-Off
* Libraries

### Long-Running Applications

Gateway applications usually have some sort of `While-True` loop that essentially attempts to make the program run forever. In order to start and continuously manage a long-running application, a `supervisor.conf` file should be provided to configure `supervisord`. Though there are many configuration options available, GWE essentially only needs to know one thing to start/execute and continue running a given CGA: **the command to start/execute the application**.

Beyond this requirement, all other configuration settings are optional (some have defaults). The way you provide the path to your application is with the `supervisor.conf` file.

### example (*dev machine*)

```
$ cat supervisor.conf 
[supervisord]
command = python -u /usr/local/bin/example.sh
```

### One-Off

This type of application is a command, or series of commands, run only once. A one-off app is simply a command or series of commands in an `install.sh` script packaged in an application tarball. Below is an example of a one-off app:

### example (*dev machine*)

```
$ tar tvf send_some_logs.v1.tar.gz 
install.sh
$ tar -Oxf send_some_logs.v1.tar.gz install.sh
#!/bin/sh

GWE_LOG_TAIL=`tail -n 50 /var/log/my_gwe_hosted_app.log`

gdc write "$(gwe --gateway-cik)" fetch_status "${GWE_LOG_TAIL}"
$
```

Notice that one-off apps do not have a `supervisor.conf` file that configures commands and logfiles for supervisor, it is just an `install.sh` script that runs some shell commands. 

The example shown above uses the `gdc` command-line interface from the `device-client` library and the `GatewayEngine` cik to dump the last 50 lines of a log file into the `fetch_status` dataport.

### Libraries

Similar to a one-off application, this type of application can hardly be said to be an application at all. A typical library install package looks the same as a normal GWE application tarball with the exception of not having a `supervisor.conf` file since it does not need to ever run. Sometimes it is important to be able to fix libraries such as protocol libraries, API libraries, etc. Below is what an update to a Modbus library might look like.

### example (*dev machine*)

```
$ tar zxvf modbus_lib.v37.tar.gz
x install.sh
x modbus_lib/
$ cat install.sh
#!/bin/sh

cd modbus_lib/
python setup.py install
```

Since the Gateway Engine installer supports running `setup.py` installers as well as `install.sh` scripts, python libraries can be installed without an `install.sh` script. 

### example (*dev machine*)

```
$ tar zxvf modbus_lib.v38.tar.gz
x setup.py
x modbus_lib/
```

## Get the GWE Development Tools


Navigate to the [Release Packages](/exositeready/gwe/release_packages) section and download the latest copy of GWE to your development machine.
Navigate to the [Release Packages](http://docs.exosite.com/exositeready/gwe/release_packages/) section and download the latest copy of GWE to your development machine.

### Optional Setup

In some development environments, it is recommended that you create a virtual Python environment before installing GWE onto your development machine. The example below uses the popular development tool `virtualenvwrapper`.

### command (*dev machine*)

```
mkvirtualenv gwe-devtools --python=python2.7
```

### Install the Dev Tools from GWE Release

Unpack the GWE release to a place on your development machine where it can remain and be referenced by other projects and applications. The example, below, moves the downloaded release from `~/Downloads` to the sandbox directory `~/code` and unpacks it to `~/code/gateway-engine`.

### command (*dev machine*)

```
mkdir ~/code
mv path/to/GatewayEngine.v*.tar.gz ~/code
cd ~/code
tar zxvf GatewayEngine.v*.tar.gz
```

Below is a series of commands to install the development tools. 

### command (*dev machine*)

```
cd ~/code/gateway-engine
python setup.py gdc
python setup.py install
```
**NOTE**: Installing the Dev Tools is different than installing onto an actual gateway for IoT operations. The `gwe` callable contains some useful developer tools, but you do not need the `gwe` or `gmq` processes running. Below is a series of commands that will get `gdc` and `gwe` command-line tools installed.

## Initialize Your Application Repository

The first thing to do when creating a CGA is to create a new sandbox folder to store the application files and supporting scripts and documents.

### Project Directory

As with any software or firmware project, it's good to start with a dedicated project directory. Throughout the rest of this documentation the `<APP_NAME>` used in examples and commands will be `my_gwe_hosted_app`.

### command (*dev machine*)

```
mkdir ~/code/my_gwe_hosted_app
cd ~/code/my_gwe_hosted_app
```

### Create Buildfile

Executing the `gwe --create-buildfile` command will prompt you for:

 * A name for the new buildfile. This can be anything, but `gwe-buildfile.json` is used throughout this documentation.
 * The name you want to give the new app. This is used as `<APP_NAME>` in all following documtation.
 * The version of the new app. This is used as `<VERSION>` in all following documentation.

### command (*dev machine*)

```
cd ~/code/my_gwe_hosted_app
gwe --create-buildfile
```

After the buildfile is created, a summary of the buildfile contents are printed to the console. 

### example (*dev machine*)

```
$ cd ~/code/my_gwe_hosted_app
$ gwe --create-buildfile
Provide build file name (my_app.json): gwe-buildfile.json
Provide app name (my_app): my_gwe_hosted_app
Provide app version (1): 1
==================================================
==============  Build file created  ==============
==================================================

A bare-bones JSON build file has been created. It
supports the following parameters:

 "name"             -   This is the name Gateway
                        Engine will use as your
                        application's name.

 "version"          -   This is the version of
                        your application. Any
                        time you edit the code
                        or anything in your
                        application, you should
                        increment or otherwise
                        change the version.

 "includes"         -   This is a list of files
                        that you want to include
                        in your application 
                        tarball. Add files to 
                        this list to suit the
                        needs of your applicaiton.

 "excludes"         -   This is a list of files
                        that you don't want in
                        your application tarball.
                        This option is often used
                        when specifying "include"
                        lists with globs like "*".

 "pre_build_cmds"   -   This is a list of system
                        commands you want to run
                        before the tarball is 
                        created. Common uses for
                        this feature are to do
                        "wget" to fetch resources
                        on the internet that you
                        want included in your
                        application tarball.

 "post_build_cmds"  -   This is a list of system
                        commands you want run
                        after the tarball is 
                        created. This is handy 
                        for cleaning up build
                        artifacts after the 
                        build completes.

For more information on Gateway Engine
please visit:

    docs.exosite.com/exositeready/gwe

Build file location:

    /home/user/code/my_gwe_hosted_app/gwe-buildfile.json

==================================================
============  gwesupport@exosite.com  ============
==================================================


```

Gateway Engine uses the `"name"` JSON key for all `<APP_NAME>` values below. GWE uses this value for the CGA logfile, the `supervisor` process name and functions as the GWE version tracking key.

### example (*dev machine*)

```
$ cd ~/code/my_gwe_hosted_app
$ cat gwe-buildfile.json
{
  "excludes": [], 
  "name": "my_gwe_hosted_app", 
  "includes": [
    "install.sh"
  ], 
  "pre_build_cmds": [], 
  "post_build_cmds": [], 
  "version": "1"
}
```

### example (*gateway*)

```
$ supervisorctl status
gmq                                RUNNING      pid 1184, uptime 1:02:51
gwe                                RUNNING      pid 1184, uptime 1:02:51
my_gwe_hosted_app                  RUNNING      pid 1185, uptime 1:02:51
$ ls /var/log/my_gwe_hosted_app.log*
my_gwe_hosted_app.log    my_gwe_hosted_app.log.1    my_gwe_hosted_app.log.2
```

### Create `install.sh` Script

Every GWE-hosted application needs an installer. GWE uses the file `install.sh` for all CGA installs.

Below is an example for creating an `install.sh` file GWE can use to install application `example.sh` to `/usr/local/bin`. 

**Note**: Be sure to use a 'shebang' as the first line of the `install.sh` file and that it the correct file mode (*i.e. it has the `x` bit set*).

### command (*dev machine*)

```
cd ~/code/my_gwe_hosted_app
echo '#!/bin/sh' > install.sh
echo 'echo "Installing example.sh..."' >> install.sh
echo 'cp example.sh /usr/local/bin' >> install.sh
echo 'echo "Installation of example.sh complete.' >> install.sh
chmod +x install.sh
```

### Create the `supervisor.conf` File

This file is used by GWE during installation to determine if this is a long-running, hosted application or if it is just a script to run. By not including a `supervisor.conf` file, the GWE installer will have no way to configure `supervisord` to automatically start the CGA on boot, or to restart it if/when it crashes. 

**NOTE**: Sometimes there are cases in which you want this behavior. CGAs with no `supervisor.conf` configuration file are effectively **ONE-OFF** applications. Restated, these can still be considered applications, but they execute only once—when GWE runs the `install.sh` script. This can be a handy tool if you want to just send a command to a gateway like `reboot`.

For long-running, hosted CGAs in which a `supervisor.conf` file is provided, there are some defaults and constraints to understand before proceeding.

* The file must be an INI-style configuration file with a single `[supervisord]` section. 
* Any option specified in the `[supervisord]` section will override any default option GWE provides.
* During the installation of the CGA, Gateway Engine changes the `[supervisord]` section to `[program:<APP_NAME>]` where `<APP_NAME>` is determined by the CGA tarball name (i.e. `<APP_NAME>.v<VERSION>.tar.gz`). You specified this in the `--create-buildfile` step.

Below is an example of a `supervisor.conf` file that `supervisord` can use to start `/usr/local/bin/example.sh`, keep running, rotate the logs, and restart if it crashes.

### command (*dev machine*)

```
cd ~/code/my_gwe_hosted_app
echo '[supervisord]' > supervisor.conf
echo 'command = /bin/sh /usr/local/bin/example.sh' >> supervisor.conf
```

### example (*dev machine*)

```
$ cd ~/code/my_gwe_hosted_app
$ cat supervisor.conf
[supervisord]
command = /bin/sh /usr/local/bin/example.sh
```

#### A Note on the Default Supervisor Options

Below are the default options GWE will impose if the `supervisor.conf` file you provide does not contain them. If your `supervisor.conf` file contains any of these options, then the defaults will be overridden by them.

```
; This section is mandatory. If a supervisor.conf file doesn't
; have this section, it won't be recognized during installation.
[supervisord]

; This tells supervisord to redirect your app STDERR to STDOUT.
redirect_stderr = true

; This tells supervisord to keep the logfile size less than or equal to 200KB.
stdout_logfile_maxbytes = 200KB

; This tells supervisord to keep only 1 backup of the logfile.
stdout_logfile_backups = 1

; This is the command supervisord will use to run/execute your application. 
; The default command is "command". This will always fail and is just a placeholder 
; for the actual command needed to start your app (e.g. "command": /usr/local/bin/my_app).
command = command

; This is the logfile path prefix supervisord will redirect your STDOUT and STDERR to. 
; Gateway Engine will use the name of the tarball to fill in the rest of the logfile name
; if you don't specify your own. The default value, below, is just a prefix. 
stdout_logfile = /var/log
```

### Create the Application

Next, create a simple application that you can package up into an OTAU package and deploy to your gateway. A simple example is provided below.

### command (*dev machine*)

```
cd ~/code/my_gwe_hosted_app
cat > example.sh << EOF
#!/bin/sh

GW_CIK=\$(gwe --gateway-cik)

while true ; do
    gdc write \${GW_CIK} gateway_time \$(date +'%s')
    sleep 1
done
EOF
```

Since this application defines a new Murano Device resource (a.k.a. alias), this resource will need to be created with either MrMurano or the Murano web UI.

### Update the Buildfile

Add the new repository files to the buildfile so they are included in the OTAU package during the build step. An example of the edited `gwe-buildfile.json` file from a previous step:

### example (*dev machine*)

```
$ cd ~/code/my_gwe_hosted_app
$ cat gwe-buildfile.json
{
  "excludes": [], 
  "name": "my_gwe_hosted_app", 
  "includes": [
    "install.sh",
    "supervisor.conf",
    "example.sh"
  ], 
  "pre_build_cmds": [], 
  "post_build_cmds": [], 
  "version": "1"
}
```

### Check the Buildfile for Errors

Use the following command to check for errors and issues with the buildfile.

### example (*dev machine*)

```
$ cd ~/code/my_gwe_hosted_app
$ gwe --check-buildfile gwe-buildfile.json
[PASS]
```

## Build the Application

With an application to build and a buildfile, GWE can build an OTAU application with the following command:

### example (*dev machine*)

```
$ cd ~/code/my_gwe_hosted_app
$ gwe --build-app gwe-buildfile.json
/home/user/sandbox/my_gwe_hosted_app/my_gwe_hosted_app.v1.tar.gz
```

**NOTE**: If you are experiencing errors or problems with installs, you can add more debug output to the build command with the `-d DEBUG` CLI flag.

## Deploy the Application

The following MrMurano commands can be used to upload and deploy the new application to a gateway:

### example (*dev machine*)

```
$ mr content upload my_gwe_hosted_app.v1.tar.gz my_gwe_hosted_app.v1.tar.gz
$ mr product device write <SERIAL_NUMBER_OF_GATEWAY> engine_fetch '{"install": [{"name": "my_gwe_hosted_app.v1.tar.gz"}]}'
```

## Verify the Deployment

The STDOUT of the `install.sh` script is written to GWE's `fetch_status` dataport after it completes. Use the following MrMurano command to check on the status of the installation. If there were any errors during the deployment, they will show up here:

### command (*dev machine*)

```
mr product device read <SERIAL_NUMBER_OF_GATEWAY> fetch_status
```

# A Good Example

If you navigate to the [gmq-sine-demo](https://github.com/exosite/gmq-sine-demo "GMQ Sine Demo"), you can see an example of a simple application that GWE can host and install over the air.

# Summary

This section covered creating a new CGA and using the GWE developer tools to build and deploy it over the air. The next recommended section (link below) to study looks deeper at how OTAU works and how it enables developers. 

  * [Over the Air Updates](/exositeready/gwe/otau)
