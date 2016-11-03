Advanced Client Model Topics
============================

This section is intended to further detail aspects of Gateway Engine,
how it is designed and how it can be a powerful developer and fleet
management tool.

Spec files and OOP
------------------

Client models, spec files and One Platform clients draw some interesting
parallels with OOP. In OOP we have the concepts of a `class` and an
`object`. The `class` is thought of as the blueprints, so to speak, for
constructing the `object`. For our purposes, we can think of the spec
file as the `class`, which is the client model or set of blueprints, and
the One Platform client as the `object` of the **gateway\_engine**
`class`.

From a `class` perspective and using UML to design our
**gateway\_engine** model, here's our base class from which to inherit:

The **coffee\_reporter** UML diagram would look like this:

To further carry out this analogy, instantiating an `object` of the
**coffee\_reporter** `class` in Exosite's One Platform would be called
*creating a client* of the **coffee\_reporter** client model. Each
instance (client) needs a serial number and we typically use MAC
addresses for gateway serial numbers. In this example the serial number
is `00:20:1F:2C:FF:51`:

### Extending the client model vs. Inheritance

When thinking about the spec file as the `class` and client as the
`object` of that `class`, we can start to think about **extending** the
base `GatewayEngine` client model with the **coffee\_reporter** client
model. In this way it might be tempting to say the the
**coffee\_reporter** model "inherits" from the **gateway\_engine**
model, but let's stop there. Exosite's One Platform has some of its own
concepts involving the term "inheritance" so let's stop the analogy
right here.

### JSON Schema

If you read the exo\_spec section of the gwe document, you might've
noticed that the dataports in the **gateway\_engine** client model were
formatted as "string/json", yet they contained no JSON Schema.

<div class="admonition">

What is a JSON Schema?

JSON Schema, as defined by [json-schema.org](http://json-schema.org), is

> "a JSON media type for defining the structure of JSON data. JSON
> Schema provides a contract for what JSON data is required for a given
> application and how to interact with it."

In other words, it is the structure of the data that is intended to
exist in a dataport.

</div>

The **gateway\_engine** client model defines a very strict JSON Schema
that wasn't included in the spec files in the exo\_spec section because
it wasn't important to the current topic. But now let's take a look at
the JSON schema of the `engine_fetch` dataport.

``` {.sourceCode .json}
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
```

In plain english, this schema states that the content of any data within
this dataport must be a JSON 'array' of JSON 'objects'. The 'title' of
this object must be "install" and the values of the objects within the
array must contain the title "name". Here's an example of an object that
conforms to this schema:

``` {.sourceCode .json}
{"install": [{"name": "coffee_reporter.v1.tar.gz"}]}
```

By writing JSON strings like this one into the `engine_fetch` dataport,
the `GatewayEngine` software running on the given gateway will
eventually parse it and try to download and install the
`coffee_reporter.v1.tar.gz` application from the **coffee\_reporter**
Content Area.

<div class="admonition tip">

Some useful tools for developing valid JSON objects and schemas are:

-   [jsonschema.net](http://jsonschema.net/#/)
-   [jsonlint.com](http://jsonlint.com/)

</div>

Here's the **gateway\_engine** spec file once again, but with the JSON
Schemas included this time:

``` {.sourceCode .yaml}
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
```

It is important to note that even though we have specified some of these
dataports with "string/json" format and defined a JSON schema, the
Exosite One Platform does no validation of the object written to the
given dataports. So if you're application requires valid JSON data in
dataports at all times, it is up to you (the developer) to validate the
data and the format.
