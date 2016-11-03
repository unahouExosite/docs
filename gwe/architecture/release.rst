.. _tut:

###############################################
Jenkins Gateway Engine Release System (JGERS)
###############################################

Here's the sequence diagram for how the release system works.

.. uml::

    @startuml

    title Jenkins Gateway Engine Release System (JGERS)

    autonumber

    actor "GWE Developer" as GWEDev
    database "\nGWE\n\nGit Repository" as GWERepo
    control "\nJGERS Job\n\nGWE Master" as JGWEMstr
    database "\nLatest\nGWE\nBuild\nArtifacts" as GWEArt
    actor "Application Developer" as AppDev
    database "\nApplication\n\nGit Repository" as AppRepo
    control "\nJGERS Job\n\nApplication Master" as AppMstr
    database "\nLatest\nApplication\nBuild" as AppArt


    == Gateway\nEngine\nDevelopment ==

    note over GWEDev
        A Gateway Engine
        Developer commits
        features and fixes
        to the GWE code-base.
    end note

    ' GWE Sequences
    GWEDev -> GWERepo
    JGWEMstr -> GWERepo: Jenkins detects SCM change
    JGWEMstr -> GWEArt: Jenkins checks out GWE source\ncode, runs tests and\ncreates artifacts.

    == Custom\nApplication\nDevelopment ==

    note over AppDev
        An Application developer 
        wants to write an application
        on a gateway device that,
        for instance, communicates
        via Bluetooth to a bunch 
        of BLE sensor nodes.
    end note

    ' Application sequences
    AppDev -> AppRepo: Developer pushes features and/or\nfixes to her gateway application.
    AppMstr -> AppRepo: Jenkins detects SCM change
    AppMstr -> AppMstr: Jenkins checks out Application source\ncode, runs tests and performs other\nactions the Developer specifies
    AppMstr o<- GWEArt: Jenkins copies latest GWE Build\nto local Jenkins Workspace.

    == Packaging\n\nGateway Engine Installer\n\nand\n\nOTAU Content Area package ==

    AppMstr -> AppMstr: Jenkins runs 'packager.sh'\nfrom GWE Build.
    AppMstr -> AppMstr: The 'packager.sh' script uses the 'gwe.build'\nfile's 'gwe_build()' function from\nthe 'device-client' dependency\nto build the 'device-client' library\ninto the 'apps_to_install'\ndirectory. This is always done by default so\nevery installed application on the\ngateway has access to the 'Protocol Layer'.\n\nThis is a full-featured\nExosite API library.
    AppMstr -> AppMstr: The 'packager.sh' script uses 'gwe.build' file's\n'apps_to_install()' function from the Developer's\nApplication to build any and all application,\nplatform or hardware dependencies into\nthe gateway.\n\nEach dependency described in the 'apps_to_install()'\nfunction must have its own 'gwe.build'\nsource file for 'packager.sh' to build from.
    AppMstr -> AppMstr: The 'packager.sh' script uses 'gwe.build' file's\n'otau_tar_excludes()' function from the Developer's\nApplication to build a list of files\nthat the developer wants to be\nexcluded from all OTAU packages.\n\nThis mechanism is provided to keep OTAU packages\nsmall and only deliver what is truly\nneeded for OTA application updates.
    AppMstr ->AppMstr: The 'packager.sh' script creates a unique\nBuild ID from GWE and device-client git hashes.\n\nThis Build ID is used in every 'engine_report'.\n\nTo add another unique Build ID onto this\nuse the 'build_id()' function in 'gwe.build' to\necho your unique id.
    AppMstr -> AppMstr: The 'packager.sh' script uses 'gwe.build' file's\n'gateway-engine-configuration()' function\nfrom the Developer's Application to build\nGWE's 'Gateway.cfg' file.
    AppMstr -> AppMstr: The 'packager.sh' script uses 'gwe.build' file's\n'install_commands()' function\nfrom the Developer's Application to build the\n 'install_commands.sh' script that is run\nwhen Gateway Engine is installed on the Gateway.\n\nThis mechanism provides a way to run\ncustom commands at the time of installation.\n\nCommon use-cases include installing python\nmodules with pip and using apt-get\nfor other software installation.
    AppMstr -> AppArt: The 'packager.sh' script creates the\nbase-install package in the form of a tarball.\n\nThe naming convention is\n\n${BUILD_NUMBER}_${BUILD_ID}.tar.gz.\n\nThe filename of this build is stored in\nthe file named 'release_id.txt'.
    AppMstr -> AppArt: The 'packager.sh' script creates the\nOTAU-install package in the form of a tarball.\n\nThis is where the otau_tar_excludes() function\nfrom 'gwe.build' comes in handy.\n\nThe naming convention is\n\ngwe.v${BUILD_NUMBER}.tar.gz.\n\nThe filename of this build is stored in\nthe file named 'otau_id.txt'.

    == Sharing and Uploading\n\nGateway Engine Releases\n\nand\n\nOTAU packages ==

    control "\nJGERS Job\n\nGateway Engine\n\nAmazon Uploader" as GWEUploader
    database "\nAmazon\n\nS3 Client\n\nDownloads Area" as Amazon
    actor "Modem/Gateway Manufacturer" as Manufacturer
    control "\nJGERS Job\n\nGateway Engine\n\nExosite Content Uploader" as OTAUUploader
    database "\nGateway Engine\n\nClient Model\n\nContent Area" as ContentArea
    control "\nExoline, script, webapp, etc.\nthat sends the install command\nto any given gateway in the field for\ndownload and install." as Exoline
    entity "\nExosite GWE\nclient." as OnepClient
    entity "\nA Gateway\nin\nthe\nfield" as GW

    GWEUploader o<- AppArt: Optional JGERS Job to upload the\nlatest GWE Install Package to\nAmazon's S3 Client Downloads area.\n\nThis generates a hyperlink you can share\nwith the gateway manufacturer so\nthey can access the latest build.
    GWEUploader -> Amazon: Uploads Gateway Engine Installer to\nAmazon S3 Client Downloads Area.
    Manufacturer o<- Amazon: Manufacturer downloads Gateway Engine\nInstaller and ships modems to Exosite customer.
    OTAUUploader o<- AppArt: Optional JGERS Job to upload the\nlatest GWE Install Package to\nthe <VENDOR_gwe_v1> client model content Area.
    OTAUUploader -> ContentArea: Uploads OTAU package to client model content area.
    Exoline -> OnepClient: Send install command to\nExosite GWE client.
    GW o<- ContentArea: The gateway in the field downloads\nand installs the OTAU package.

    == The end. ==








    @enduml