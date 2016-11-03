.. _advanced:

Advanced Client Model Topics
=============================
This section is intended to further detail aspects of Gateway Engine, how it is designed and how it can be a powerful developer and fleet management tool.

.. glossary::

    OOP
        Object Oriented Programming

    JSON
        Javascript Object Notation

Spec files and OOP
--------------------
Client models, spec files and One Platform clients draw some interesting parallels with OOP. In OOP we have the concepts of a ``class`` and an ``object``. The ``class`` is thought of as the blueprints, so to speak, for constructing the ``object``. For our purposes, we can think of the spec file as the ``class``, which is the client model or set of blueprints, and the One Platform client as the ``object`` of the **gateway_engine** ``class``.

From a ``class`` perspective and using UML to design our **gateway_engine** model, here's our base class from which to inherit:

.. uml::

    @startuml

    title Gateway Engine\nBase Class.
    class gateway_engine {
        dataport [integer] <b>update_interval</b>
        dataport [string]  <b>engine_fetch</b>
        dataport [string]  <b>engine_report</b>
        dataport [string]  <b>device_info</b>
        dataport [string]  <b>usage_report</b>
    }

    @enduml

The **coffee_reporter** UML diagram would look like this:

.. uml::

    @startuml

    title Subclassing <b>gateway_engine</b>
    class gateway_engine {
        dataport [integer] <b>update_interval</b>
        dataport [string]  <b>engine_fetch</b>
        dataport [string]  <b>engine_report</b>
        dataport [string]  <b>device_info</b>
        dataport [string]  <b>usage_report</b>
    }
    class coffee_reporter extends gateway_engine {
        dataport [string]  <b>coffee_dataport</b>
    }

    @enduml

To further carry out this analogy, instantiating an ``object`` of the **coffee_reporter** ``class`` in Exosite's One Platform would be called *creating a client* of the **coffee_reporter** client model. Each instance (client) needs a serial number and we typically use MAC addresses for gateway serial numbers. In this example the serial number is ``00:20:1F:2C:FF:51``:

.. uml::

    @startuml

    title Instantiating a <b>gateway_engine</b> object

    class gateway_engine << Class >> {
        dataport [integer] <b>update_interval</b>
        dataport [string]  <b>engine_fetch</b>
        dataport [string]  <b>engine_report</b>
        dataport [string]  <b>device_info</b>
        dataport [string]  <b>usage_report</b>
    }

    class coffee_reporter << Class >> extends gateway_engine {
        dataport [string]  <b>coffee_dataport</b>
    }

    class "Gateway\n00:20:1F:2C:FF:51" << (O,#FF7700) Object >> 
    "Gateway\n00:20:1F:2C:FF:51" -down-* coffee_reporter : instantiate

    @enduml


Extending the client model vs. Inheritance
````````````````````````````````````````````
When thinking about the spec file as the ``class`` and client as the ``object`` of that ``class``, we can start to think about **extending** the base ``GatewayEngine`` client model with the **coffee_reporter** client model. In this way it might be tempting to say the the **coffee_reporter** model "inherits" from the **gateway_engine** model, but let's stop there. Exosite's One Platform has some of its own concepts involving the term "inheritance" so let's stop the analogy right here.

JSON Schema
`````````````
If you read the :ref:`exo_spec` section of the :ref:`gwe` document, you might've noticed that the dataports in the **gateway_engine** client model were formatted as "string/json", yet they contained no JSON Schema. 

.. admonition:: What is a JSON Schema?

    JSON Schema, as defined by `json-schema.org <http://json-schema.org>`_, is 

        "a JSON media type for defining the structure of JSON data. JSON Schema provides a contract for what JSON data is required for a given application and how to interact with it."

    In other words, it is the structure of the data that is intended to exist in a dataport.

The **gateway_engine** client model defines a very strict JSON Schema that wasn't included in the spec files in the :ref:`exo_spec` section because it wasn't important to the current topic. But now let's take a look at the JSON schema of the ``engine_fetch`` dataport.

.. code-block:: json

    {
        "title": "Applications to install",
        "type": "array",
        "description": "Array of CSV delineated tarball names staged to content area for install.",
        "items": {
            "title": "install",
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        },
        "required": ["name"],
        "additionalProperties": false
    }

In plain english, this schema states that the content of any data within this dataport must be a JSON 'array' of JSON 'objects'. The 'title' of this object must be "install" and the values of the objects within the array must contain the title "name". Here's an example of an object that conforms to this schema:

.. code-block:: json

    {"install": [{"name": "coffee_reporter.v1.tar.gz"}]}

By writing JSON strings like this one into the ``engine_fetch`` dataport, the ``GatewayEngine`` software running on the given gateway will eventually parse it and try to download and install the ``coffee_reporter.v1.tar.gz`` application from the **coffee_reporter** Content Area.

.. tip::
    
    Some useful tools for developing valid JSON objects and schemas are:

    * `jsonschema.net <http://jsonschema.net/#/>`_
    * `jsonlint.com <http://jsonlint.com/>`_

Here's the **gateway_engine** spec file once again, but with the JSON Schemas included this time:

.. code-block:: yaml

    # spec_gateway_engine.yml
    dataports:

    -   alias: usage_report
        name: GatewayEngine Usage
        format: string
        description: 'Dataport for JSON formatted usage statements sent by gateway.'

    -   alias: engine_report
        name: Engine Report
        format: string/json
        description: 'Report of all running applications currently managed by Engine.'
        jsonschema: {
            "title": "Installed applications",
            "type": "array",
            "description": "Array of dicts.",
            "items": {
                "title": "apps",
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "vers": {
                        "type": "integer"
                    }
                },
                "required": [   "name",
                                "version"],
                "additionalProperties": false
            }
        }

    -   alias: engine_fetch
        name: Install Apps
        format: string/json
        description: 'Load new applications onto the 400AP running GatewayEngine from the content area by writing the content-area tarball name into this dataport.'
        jsonschema: {
            "title": "Applications to install",
            "type": "array",
            "description": "Array of CSV delineated tarball names staged to content area for install.",
            "items": {
                "title": "install",
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    }
                }
            },
            "required": ["name"],
            "additionalProperties": false
            }
        }
        
    -   alias: device_info
        name: Device Info
        format: string
        description: 'View version and other device properties.'

    -   alias: update_interval
        name: Update Interval
        format: string
        description: 'Time, in seconds, that GatewayEngine will report its usage_report and fetch its new update_interval.'


It is important to note that even though we have specified some of these dataports with "string/json" format and defined a JSON schema, the Exosite One Platform does no validation of the object written to the given dataports. So if you're application requires valid JSON data in dataports at all times, it is up to you (the developer) to validate the data and the format.

..
    TODO: Add downloadable spec file source. Add wording about the fact that 1P doesn't verify schema, but the spec file is the best place to define it for all other IoT components' benefit.


