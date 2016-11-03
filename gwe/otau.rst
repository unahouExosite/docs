.. _otau:

########################
Over the Air Updates
########################

Performing Over the Air Updates to gateways is the core function of Gateway Engine and, more specifically, the ``gwe`` process.

Over the Air Updating can be tricky. To help you understand how Gateway Engine's OTAU feature works, the diagram below was put together to show the sequence that results in a Gateway Engine Over the Air Update.

    .. uml::

        @startuml
        !include gwe-style.iuml

        skinparam defaultFontSize 24
        skinparam activityFontName FONT
        skinparam activityFontSize 24
        skinparam noteFontName FONT
        skinparam noteFontSize 24
        skinparam activityArrowColor black

        !define GWE_LANE |GATEWAYENGINE|Gateway|
        !define GWC_LANE |DEVICECLIENT|Exosite Gateway Client|
        !define ECA_LANE |PYTHON|Exosite Content Area|

        GWE_LANE
        :boot;
        :Supervisor start;
        :Gateway engine start;
        repeat
            :Send usage 
            and info
            reports;
            :Read
            "engine_fetch"
            alias in
            Exosite;
            
            GWC_LANE
            :"engine_fetch"
            alias
            contains JSON
            to install:
            app_update.v2.tar.gz;

            GWE_LANE
            if ("engine_fetch"\ncontains JSON\ninstall object) then (yes)

                :Download tarball
                described in JSON
                from Content Area;
                ECA_LANE
                :app_update.v2.tar.gz;

                GWE_LANE
                if (Run\ntarball\nchecks) then (Good)
                    :Decompress
                    tarball;
                    :Execute
                    "install.sh"
                    script.;
                else (Bad)
                    :Discard tarball;
                endif
            else (no)

            endif
        repeat while (  Sleep for 
        "update_interval"
        seconds...)


        @enduml


In words, this diagram states that Gateway Engine will check for the ``engine_fetch`` alias for specially formatted JSON objects that contain instructions for new Custom Gateway Applications or updates to existing ones to be downloaded and installed. If there's nothing to download and install it will sleep for the amount of seconds configured in the ``update_interval`` alias.

    .. important::

        The default value ``update_interval`` that ``GatewayEngine`` uses when it starts for the 1st time is ``14400`` seconds. This comes out to 12 hours (twice/day). If you want to shorten this, write the amount of seconds you want ``GatewayEngine`` to sleep before it checks in again in the ``update_interval`` alias. Once it reads this new value, it will "clear" the alias (i.e. write an empty string). 

        The ``update_interval`` can be changed before ``gwe`` ever starts with the following command:

        .. code-block:: bash

            gwe --set-update-interval <INTERVAL>

        If this command is run while ``gwe`` is running, then the process will need to be restarted in order for the change to be applied.

        .. code-block:: bash

            supervisorctl restart gwe

        During the development of you Custom Gateway Application, if you're not on a cellular network or otherwise aren't concerned with network bandwidth usage, use a really fast ``update_interval``. You can set the ``update_interval`` to as low as one second. Doing so will ensure that as soon as you have updates to deploy to the gateway, they will be installed immediately.

The JSON object must be formatted as like this:

    .. code-block:: json

        {"install": [{"name": "<APP_NAME>.v<VERSION>.tar.gz"}]}

In order for Gateway Engine to be able to download the tarball and install it, the tarball must be uploaded to the Gateway Engine Content Area of One Platform. For instructions on uploading your application tarball and sending the installation command to Gateway Engine, see the `Gateway Engine README <https://gateway-engine.exosite.io/gateway-engine/README.html#upload-the-app-tarball-to-your-murano-product-id-s-content-area>`_.
