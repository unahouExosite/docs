Getting Started
===============

This section is provided to help you quickly download Gateway Engine,
install it onto your gateway and start using it as quickly and easily as
possible. Once you've completed this section you will have a Gateway
Engine installed and running on a gateway.

Minimum Requirements
--------------------

Before proceeding to [Step One] (https://github.com/exosite/docs/blob/gwe/gwe/getting_started.rst.md#step-one), you should first verify that your
gateway has the minimum requirements for running Gateway Engine.

> -   Linux OS
> -   Python 2.7.9+
> -   Network interface (`eth0`, `wlan0`, `ppp0`, etc.)
> -   GNU shell
> -   128MB Flash
> -   64MB RAM

### Step One

Sign up for a [Murano account](https://exosite.com/murano/). Once your
account is set up, add a device to your Murano Product and name it
"Gateway Engine". Copy down the MAC address of your Gateway and use it
as the serial number for your new Murano Gateway Engine device. Once you
have a Gateway Engine device in your Murano Product, you must add
resources to it with one of two ways.

#### Manually

The table, below, shows the resources you must add, what to name them
and what format to choose for them.

| Alias         | Format        | Description   |
| ------------- | ------------- | ------------- |
| usage_report  | string        | Gateway Engine sends a report of all processes using its resources (`gmq`, `device-client`) to send data to Murano. This report contains information about how much network bandwidth is being consumed as well as other meta data about network requests.|
| engine_report | string | Gateway Engine reports information about what applications are installed and other meta data like uptime, exit codes, and versions.         |
| device_info | string | Gateway Engine reports filesystem and OS data like OS and kernel version as well as free memory and disk space usage.|
| engine_fetch | string | Gateway Engine regularly checks this dataport for formatted messages containing instructions on new apps and updates to install.        |
| fetch_status | string | Once an app is installed over-the-air or an update to an app is executed, Gateway Engine reports the STDOUT and STDERR from the app installer.        |
| update_interval | string | This value, in seconds, is the delay between each series of Gateway Engine reports and OTAU checkins.|

#### Use MrMurano

The [MrMurano tool](https://github.com/tadpol/MrMurano) is a
command-line tool you can configure and use with your Murano Solutions
and Products. Once you configure MrMurano, you can use the following
commands to create the required Gateway Engine resources to the Murano
device.

``` {.sourceCode .bash}
# command to create spec.yaml file
cat << EOF > spec.yaml
---
resources:
- alias: usage_report
  format: string
- alias: engine_report
  format: string
- alias: device_info
  format: string
- alias: engine_fetch
  format: string
- alias: fetch_status
  format: string
- alias: update_interval
  format: string 
EOF
# command to apply the spec.yaml file to the new Gateway Engine device in your Murano Product.
mr product spec --file spec.yaml
```

**NOTE:** When signing up for a new account, there will be emails you will need to
take action on in order to activate your account and login.

### Step Two

Download, install and configure Gateway Engine onto your gateway.

To download the latest version of the Public Release of Gateway Engine,
follow these steps:

1.  Navigate to the [Gateway Engine Release Packages](https://github.com/exosite/docs/blob/gwe/gwe/release_packages.rst.md#gateway-engine-release-packages) section and follow the instructions to
    download Gateway Engine.
2.  Run these commands to copy Gateway Engine to your gateway (the
    actual filename in the command may differ):

    ``` {.sourceCode .bash}
    ssh <USER>@<GATEWAY_IP> "mkdir /opt"
    scp GatewayEngine.v1-1-2.tar.gz <USER>@<GATEWAY_IP>:/opt 
    ```

    At this point, you have downloaded the latest release of Gateway Engine and copied it to your gateway.

3.  Run this command to untar the release package and install Gateway
    Engine onto your gateway:

    ``` {.sourceCode .bash}
    ssh <USER>@<GATEWAY_IP> "cd /opt
      tar zxvf GatewayEngine.v1-1-2.tar.gz
      cd gateway-engine
      ./install.sh"
    ```

    **NOTE:** In some Linux environments, you'll need to use Super-User permissions to run the installer. In this case, replace the `./install.sh` command to:

    ``` {.sourceCode .bash}
    sudo ./install.sh
    ```

4.  Once the installation completes, you'll need to configure Gateway
    Engine for your IoT solution and Exosite account. This will require
    one piece of information from your Murano account and you'll need to
    make a decision about what serial number to use for your gateway.

    1.  In your Murano account, navigate to your Product and click on
        the Info tab. Copy the Product ID and use it in the commands,
        below, in place of &lt;PRODUCT\_ID&gt;.
    2.  Determine the serial number of your gateway. Gateway Engine is
        programmed to retrieve the MAC address from the internet
        interface of your choosing (e.g. `eth0`, `wlan0`,
        `ppp0`, etc.) when the `--set-iface` command-line switch
        is used. Or you can just specify any serial number you want
        with the `--set-uuid` command line switch.
   
        Once you've gathered this information and determined what serial
        number to use for your gateway (interface MAC address or custom
        serial number), run the following command to configure Gateway
        Engine:

    ``` {.sourceCode .bash}
    ssh <USER>@<GATEWAY_IP> "gwe --set-product-id <PRODUCT_ID> --set-iface <THE_INTERFACE>""
    ```

    **Example:**

    ``` {.sourceCode .bash}
    ssh <USER>@<GATEWAY_IP> "gwe --set-product-id dubhxzv0r4e1m7vj --set-iface eth0"``
    ```
    
 Or if you want to just specify your own serial number:

    ``` {.sourceCode .bash}
    ssh <USER>@<GATEWAY_IP> "gwe --set-product-id <PRODUCT_ID> --set-uuid <THE_SERIAL_NUMBER>""
    ```

    **Example:**

    ``` {.sourceCode .bash}
    ssh <USER>@<GATEWAY_IP> "gwe --set-product-id dubhxzv0r4e1m7vj --set-uuid 12345"
    ```
    
To complete the installation you will need to reboot the gateway.
To reboot, you can toggle the power or use the following command:

    ``` {.sourceCode .bash}
    ssh <USER>@<GATEWAY_IP> "reboot"
    ```
    
**NOTE:** Gateway Engine uses `supervisord` to start itself on boot and once it starts, it will start Gateway Engine as well as all other installed Custom Gateway Applications.

### Step Four

Watch for new data in the Gateway Engine Device on your Product device.

Once the reboot has completed, you will notice that `supervisord` and
`gwe` processes are running in the output of the `ps -ef` command. Some
gateways have alot of processes and the `ps -ef` command can be too much
to read through. If this is the case, filter the output with `grep`
(e.g. `ps -ef | grep 'super\|gwe\|gmq'`). You can also use the
`supervisorctl status` command to view the status of the Gateway Engine
applications.

``` {.sourceCode .bash}
ssh <USER>@<GATEWAY_IP> "supervisorctl status"
gmq                           RUNNING    pid 621, 00:01:38
gwe                           RUNNING    pid 620, 00:01:38
```

A few seconds after rebooting the gateway you should see data appear in
the aliases of your GatewayEngine device.

### Summary

The steps in this section were designed to get you moving as quickly as
possible with Gateway Engine and Exosite. If you have questions,
concerns or suggestions on how to make this documentation better, please
[contact the author](gwesupport@exosite.com) with a detailed message.
