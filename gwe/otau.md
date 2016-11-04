Over the Air Updates
====================

Performing Over the Air Updates to gateways is the core function of
Gateway Engine and, more specifically, the `gwe` process.

Over the Air Updating can be tricky. To help you understand how Gateway
Engine's OTAU feature works, the diagram below was put together to show
the sequence that results in a Gateway Engine Over the Air Update.

  ![Alt text](https://github.com/exosite/docs/gwe/gwe/over_the_air_updates_image.png)

In words, this diagram states that Gateway Engine will check for the
`engine_fetch` alias for specially formatted JSON objects that contain
instructions for new Custom Gateway Applications or updates to existing
ones to be downloaded and installed. If there's nothing to download and
install it will sleep for the amount of seconds configured in the
`update_interval` alias.

**NOTE:** The default value `update_interval` that `GatewayEngine` uses when it
starts for the 1st time is `14400` seconds. This comes out to 12 hours
(twice/day). If you want to shorten this, write the amount of seconds
you want `GatewayEngine` to sleep before it checks in again in the
`update_interval` alias. Once it reads this new value, it will "clear"
the alias (i.e. write an empty string).

The `update_interval` can be changed before `gwe` ever starts with the
following command:

```
gwe --set-update-interval <INTERVAL>
```

If this command is run while `gwe` is running, then the process will
need to be restarted in order for the change to be applied.

```
supervisorctl restart gwe
```

During the development of you Custom Gateway Application, if you're
not on a cellular network or otherwise aren't concerned with network
bandwidth usage, use a really fast `update_interval`. You can set the
`update_interval` to as low as one second. Doing so will ensure that
as soon as you have updates to deploy to the gateway, they will be
installed immediately.

The JSON object must be formatted like this:

```
{"install": [{"name": "<APP_NAME>.v<VERSION>.tar.gz"}]}
```

In order for Gateway Engine to be able to download the tarball and
install it, the tarball must be uploaded to the Gateway Engine Content
Area of One Platform. For instructions on uploading your application
tarball and sending the installation command to Gateway Engine, see the
[Gateway Engine README](/gwe/gateway-engine/gateway_engine_gwe/) page.
